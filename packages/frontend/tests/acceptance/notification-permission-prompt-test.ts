import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

import {
  clearLocalStorage,
  setupRelayConnectionMocks,
  setupCurrentUser,
  refresh,
  getService,
} from 'emberclear/tests/helpers';
import { stubConnection } from 'emberclear/tests/helpers/setup-relay-connection-mocks';

import { page as app } from 'emberclear/tests/helpers/pages/app';

const { notificationPrompt: prompt } = app;

module('Acceptance | Notification Permission Prompt', function(hooks) {
  setupApplicationTest(hooks);
  setupRelayConnectionMocks(hooks);
  clearLocalStorage(hooks);
  setupCurrentUser(hooks);

  module('permission has not yet been asked for', function(hooks) {
    hooks.beforeEach(async function() {
      getService<any>('window').Notification = { permission: 'default' };

      await visit('/chat/privately-with/me');
    });

    test('the prompt is shown', function(assert) {
      assert.equal(prompt.isVisible, true);
    });

    test('never ask again is clicked', async function(assert) {
      assert.expect(2);

      await prompt.askNever();

      assert.equal(prompt.isVisible, false, 'prompt hides initially');

      await refresh(() => stubConnection());

      assert.equal(prompt.isVisible, false, 'still is not shown even after refresh');
    });

    module('ask later is clicked', function(hooks) {
      hooks.beforeEach(async function() {
        await prompt.askLater();
      });

      test('the prompt is not shown', function(assert) {
        assert.equal(prompt.isVisible, false);
      });

      module('on refresh', function(hooks) {
        hooks.beforeEach(async function() {
          await refresh(() => {
            stubConnection();
            // stub doesn't hold between refreshes
            getService<any>('window').Notification = { permission: 'default' };
          });
        });

        test('the prompt is shown', function(assert) {
          assert.equal(prompt.isVisible, true);
        });
      });
    });

    module('enabled is clicked', function() {});
  });
});
