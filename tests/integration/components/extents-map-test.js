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
    // stub the loadMap() function and have it return a mock view
    // to ensure the ArcGIS API is not loaded and a map is not rendered
    const mockView = {};
    const loadMapStub = this.stub(mapUtils, 'loadMap').resolves(mockView);
    const showItemsStub = this.stub(mapUtils, 'showItemsOnMap');
    // render the component with no items
    this.set('items', undefined);
    await render(hbs`{{extents-map items=items}}`);
    // then update the items
    this.set('items', mockItems());
    // assertions
    assert.ok(loadMapStub.calledOnce, 'loadMap was called only once');
    const args = loadMapStub.getCall(0).args;
    const elementIdRegEx = /^ember(\d+)$/; // ex: ember123
    assert.ok(elementIdRegEx.test(args[0]), 'element id was passed');
    assert.equal(args[1], config.APP.map.options, 'config options were passed');
    assert.ok(showItemsStub.calledTwice, 'showItemsOnMap called exactly twice');
    const { symbol, popupTemplate } = config.APP.map.itemExtents;
    assert.deepEqual(showItemsStub.firstCall.args, [mockView, undefined, symbol, popupTemplate], 'showItemsOnMap called with no items initially');
    assert.deepEqual(showItemsStub.secondCall.args, [mockView, this.items, symbol, popupTemplate], 'passed items on second call');
  });
});
