import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ago-search', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // fail if onSearch callback was not called
    assert.expect(3);

    // Set any properties with this.set('myProperty', 'value');
    this.set('q', 'some initial search text');

    // test double for the action
    this.set('doSearch', q => {
      assert.equal(q, 'test', 'updated value was passed up');
    });

    // render component to the page
    await render(hbs`{{ago-search q=q onSearch=(action doSearch)}}`);

    // inital dom state
    assert.equal(this.element.querySelector('input').value.trim(), this.get('q'), 'initial value is set');
    assert.equal(this.element.querySelectorAll('.input-group-lg').length, 0, 'no size by default');

    // change the value and click the search button
    // NOTE: this will trigger onSearch action and above assertion
    await fillIn('input', 'test');
    await click('button');
  });

  test('can set size', async function (assert) {
    // test double for the action
    this.set('doSearch', () => {});
    // render component to the page
    await render(hbs`{{ago-search onSearch=(action doSearch) size="lg"}}`);
    assert.equal(this.element.querySelectorAll('.input-group-lg').length, 1, 'set proper size');
  });
});
