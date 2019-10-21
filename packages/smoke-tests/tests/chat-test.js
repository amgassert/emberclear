'use strict';

const { setUpWebDriver } = require('@faltest/lifecycle');
const assert = require('assert');

const { setupEndpoint } = require('../helpers/setup-endpoint');

const { users } = require('../fixtures/users');

const Login = require('../page-objects/login');
const AddFriend = require('../page-objects/add-friend');
const Chat = require('../page-objects/chat');

describe('chat', function() {
  setUpWebDriver.call(this);
  setupEndpoint.call(this);

  describe('New users can add each other and then communicate', function() {

  });

  describe('existing users can communicate', function() {
    beforeEach(async function() {
      this.loginPage1 = new Login(this.browsers[0]);
      this.loginPage2 = new Login(this.browsers[1]);
      this.addFriendPage1 = new AddFriend(this.host, this.browsers[0]);
      this.addFriendPage2 = new AddFriend(this.host, this.browsers[1]);
      this.chatPage1 = new Chat(this.browsers[0]);
      this.chatPage2 = new Chat(this.browsers[1]);

      await Promise.all([
        this.browsers[0].url(this.host),
        this.browsers[1].url(this.host),
      ]);
    });

    it('works', async function() {
      await Promise.all([
        this.loginPage1.logIn(users[0]),
        this.loginPage2.logIn(users[1]),
      ]);

      await Promise.all([
        this.addFriendPage1.addFriend(users[1]),
        this.addFriendPage2.addFriend(users[0]),
      ]);

      await Promise.all([
        this.chatPage1.sendMessage(users[0].message),
        this.chatPage2.sendMessage(users[1].message),
      ]);

      await Promise.all([
        this.chatPage1.waitForResponse(users[1]),
        this.chatPage2.waitForResponse(users[0]),
      ]);

      assert.ok(true);
    });
  });
});
