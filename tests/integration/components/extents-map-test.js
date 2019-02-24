import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import * as mapUtils from 'ambitious-arcgis-app-2019/utils/map';
import config from 'ambitious-arcgis-app-2019/config/environment';

// mock item search response
function mockItems () {
  return [
    {
      title: 'Item 1',
      snippet: 'Item 1 snippet',
      extent: [[-75.5596, 38.9285], [-73.9024, 41.3576]]
    },
    {
      title: 'Item 2',
      snippet: 'Item 2 snippet',
      extent: [[-74, 39], [-73, 40]]
    },
    {
      title: 'Item 3',
      snippet: 'Item 3 snippet',
      extent: [[-53.2316, -79.8433], [180, 79.8433]]
    }
  ];
}

module('Integration | Component | extents-map', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // spy on the refreshItems() function returned by newMap()
    const refreshItems = this.spy();
    // stub the newMap() function so that a map is not constructed
    const stub = this.stub(mapUtils, 'newMap').resolves({
      refreshItems,
      // NOTE: we don't spy on destroy() b/c it is called after the test completes
      destroy: () => {}
    });
    // render the component with no items
    this.set('items', undefined);
    await render(hbs`{{extents-map items=items}}`);
    // update the items
    this.set('items', mockItems());
    // assertions
    assert.ok(stub.calledOnce, 'newMap was called only once');
    const args = stub.getCall(0).args;
    const elementIdRegEx = /^ember(\d+)$/; // ex: ember123
    assert.ok(elementIdRegEx.test(args[0]), 'element id was passed');
    assert.equal(args[1], config.APP.map.options, 'config options were passed');
    assert.ok(refreshItems.calledTwice, 'refreshItems called twice');
    const { symbol, popupTemplate } = config.APP.map.itemExtents;
    assert.deepEqual(refreshItems.firstCall.args, [undefined, symbol, popupTemplate], 'refreshItems called with no graphics initially');
    assert.deepEqual(refreshItems.secondCall.args, [this.get('items'), symbol, popupTemplate], 'passed items on second call');
  });
});
