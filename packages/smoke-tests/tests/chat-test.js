'use strict';

const { setUpWebDriver } = require('@faltest/lifecycle');
const assert = require('assert');

const { setupEndpoint } = require('../helpers/setup-endpoint');
const { pagesFor } = require('../helpers/pages-for');

const { users } = require('../fixtures/users');

const Home = require('../page-objects/home');
const Login = require('../page-objects/login');
const AddFriend = require('../page-objects/add-friend');
const Chat = require('../page-objects/chat');
const Setup = require('../page-objects/setup');

describe('chat', function() {
  setUpWebDriver.call(this);
  setupEndpoint.call(this);

  describe('New users can add each other and then communicate', function() {
    let home1, home2, setup1, setup2, addFriend1, addFriend2, chat1, chat2;

    beforeEach(async function() {
      [home1, home2] = pagesFor.call(this, Home);
      [setup1, setup2] = pagesFor.call(this, Setup);
      [addFriend1, addFriend2] = pagesFor.call(this, AddFriend);
      [chat1, chat2] = pagesFor.call(this, Chat);

      await Promise.all([home1.visit(), home2.visit()]);
    });

    it('fresh users can begin communicating with each other', async function() {
      await Promise.all([home1.beginButton.click(), home2.begunButton.click()]);

      await Promise.all([
        setup1.onboardSelf('Person A'),
        setup2.onboardSelf('Person B'),
      ]);

      await addFriend1.addFriendButton.click();

      let inviteUrl = this.addFriend1.inviteUrl;

      await addFriend2.addFriend(inviteUrl);

      await Promise.all([home1.sidebar.open(), home2.sidebar.open()]);

      let contacts = home1.sidebar.contacts;
      console.log(contacts);

      // TODO:
      // open A's sidebar
      // assert that B is there
      // assert that A is in B's sidebar
      //

      // messages are the same as below
      await Promise.all([
        chat1.sendMessage('To Person B, from Person A'),
        chat2.sendMessage('To Person A, from Person B'),
      ]);

      // TODO: assert that the massages were received

      assert.ok(true);
    });
  });

  describe('existing users can communicate', function() {
    let home1, home2, login1, login2, addFriend1, addFriend2, chat1, chat2;

    beforeEach(async function() {
      [home1, home2] = pagesFor.call(this, Home);
      [login1, login2] = pagesFor.call(this, Login);
      [addFriend1, addFriend2] = pagesFor.call(this, AddFriend);
      [chat1, chat2] = pagesFor.call(this, Chat);

      await Promise.all([home1.visit(), home2.visit()]);
    });

    it('users receive each others messages', async function() {
      await Promise.all([login1.logIn(users[0]), login2.logIn(users[1])]);

      await Promise.all([
        addFriend1.addFriend(users[1].publicKey),
        addFriend2.addFriend(users[0].publicKey),
      ]);

      await Promise.all([
        chat1.sendMessage(users[0].message),
        chat2.sendMessage(users[1].message),
      ]);

      await Promise.all([
        chat1.waitForResponse(users[1]),
        chat2.waitForResponse(users[0]),
      ]);

      assert.ok(true);
    });
  });
});
