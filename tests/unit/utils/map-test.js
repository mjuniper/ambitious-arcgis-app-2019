import { loadMap, itemToGraphicJson } from 'ambitious-arcgis-app-2019/utils/map';
import { module, test } from 'qunit';

module('Unit | Utility | map', function(/* hooks */) {

  test('loadMap', function(assert) {
    // TODO: write a meaningful test of loadMap()
    let result = typeof loadMap === 'function';
    assert.ok(result);
  });

  test('itemToGraphicJson', function(assert) {
    const item = {
      extent: [[-53.2316, -79.8433], [180, 79.8433]],
      title: 'Test Item',
      snippet: 'this is a test item'
    };
    let result = itemToGraphicJson(item);
    assert.deepEqual(result.geometry, {
      type: 'extent',
      xmin: -53.2316,
      ymin: -79.8433,
      xmax: 180,
      ymax: 79.8433,
      spatialReference:{
        wkid:4326
      }
    });
    assert.deepEqual(result.attributes, item);
  });

  test('itemToGraphicJson with no extent', function(assert) {
    const item = {
      title: 'Item with no extent',
      snippet: 'sometimes items do not have extents'
    };
    let result = itemToGraphicJson(item);
    assert.equal(result.geometry, null);
    assert.deepEqual(result.attributes, item);
  });
});
