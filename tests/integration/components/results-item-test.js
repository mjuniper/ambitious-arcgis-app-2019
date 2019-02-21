import { module, test } from 'qunit';
import EmberObject from '@ember/object';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | results-item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const model = EmberObject.create({
      title: 'This is the title',
      type: 'Web Map',
      owner: 'username'
    });
    this.set('model', model);

    await render(hbs`{{results-item model=model}}`);

    assert.equal(this.element.querySelectorAll('tr td').length, 3, 'renders a tr with 3 tds');
    assert.equal(this.element.querySelector('tr td:first-child').innerText, 'This is the title', 'renders the title');
    assert.equal(this.element.querySelector('tr td:nth-child(2)').innerText, 'Web Map', 'renders the type');
    assert.equal(this.element.querySelector('tr td:nth-child(3)').innerText, 'username', 'renders the owner');
  });
});
