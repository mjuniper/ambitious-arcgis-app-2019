import { newMap } from 'ambitious-arcgis-app-2019/utils/map';
import { module, test } from 'qunit';

module('Unit | Utility | map', function(/* hooks */) {

  test('newMap', function(assert) {
    // TODO: write a meaningful test of newMap()
    let result = typeof newMap === 'function';
    assert.ok(result);
  });
});
