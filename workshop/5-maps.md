# Maps

## Adding a basic map using ember-esri-loader

- stop app (`ctrl+C`)

- `ember install ember-esri-loader`

- in app/styes/app.css add the following to the end of the file:

```css
/* map */
.extents-map {
 height: 300px;
}
.extents-map.esri-view {
 margin-bottom: 20px;
}
```

- `ember g util map`
- `ember g component extents-map`
- remove the map component's template & test:
  - `rm app/templates/components/extents-map.hbs`
  - `rm tests/integration/components/extents-map-test.js`
- `ember s`
- replace contents of app/utils/map.js with

```js
import esriLoader from 'esri-loader';

// create a new map view at an element
export function newMap(element, mapOptions) {
  // lazy load the map modules and CSS
  return esriLoader.loadModules(
    ['esri/Map', 'esri/views/MapView'],
    // NOTE: keep this current w/ the latest version of the JSAPI
    { css: 'https://js.arcgis.com/4.10/esri/css/main.css' }
  )
  .then(([Map, MapView]) => {
    if (!element) {
      // component or app was likely destroyed
      return;
    }
    // Create the Map
    const map = new Map(mapOptions);
    // show the map at the element
    let view = new MapView({
      map,
      container: element,
      zoom: 2
    });
    // prevent zooming with the mouse-wheel
    view.when(() => {
      view.on("mouse-wheel", function(evt){
        evt.stopPropagation();
      });
    });
    // return closure scoped functions for working with the map
    return {
      destroy: function () {
        if (view) {
          view.container = null;
          view = null;
        }
      }
    };
  });
}
```

- replace contents of tests/unit/utils/map-test.js

```js
import { newMap } from 'ambitious-arcgis-app-2019/utils/map';
import { module, test } from 'qunit';

module('Unit | Utility | map', function(/* hooks */) {

  test('newMap', function(assert) {
    // TODO: write a meaningful test of newMap()
    let result = typeof newMap === 'function';
    assert.ok(result);
  });
});
```

- replace contents of app/components/extents-map.js with:

```js
import Component from '@ember/component';
import { newMap } from '../utils/map';

export default Component.extend({
  classNames: ['extents-map'],

  // wait until after the component is added to the DOM before creating the map
  didInsertElement () {
    this._super(...arguments);
    // create a map at this element's DOM node
    newMap(this.elementId, { basemap: 'gray' })
    .then(mapFunctions => {
      // hold onto a reference to the object with the map functions
      this._map = mapFunctions;
    });
  },

  // destroy the map before this component is removed from the DOM
  willDestroyElement () {
    this._super(...arguments);
    if (this._map) {
      this._map.destroy();
      delete this._map;
    }
  }
});
```

- in app/templates/items.hbs add `{{extents-map}}` above the table

- go to the items route,

Notice that:
- you should see a map
