import { module, test } from 'qunit';
import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | smoke', function(hooks) {
  setupApplicationTest(hooks);

  test('smoke-test', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');

    await fillIn('form .input-group input', 'water');
    await click('form .input-group button');

    assert.equal(currentURL(), '/items?q=water');
  });
});
