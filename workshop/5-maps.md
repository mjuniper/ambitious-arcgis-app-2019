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

### Enable WebGL in tests

If you run the tests from the command line `ember t` you will see an error with the message `WebGL is required but not supported.` This is because our smoke test actually renders a map now, and the JSAPI requires WebGL, and by default Ember disables WebGL when running tests.

- in `testem.js` comment out this line: `'--disable-gpu',`
- re-run `ember t`

Notice that:
- tests should pass

## Showing item extents on the map

### Logic
Once the map has loaded, and whenever map component's items are updated:
- clear map graphics
- loop through items, and for each
 - create a `new Graphic()` from the item
 - add the graphic to the map

2 sets of async state: Application (Ember) and map:
- each has own lifecyle (event)
- up to developer to keep 2 sets of state in sync.

Converting item to a [Graphic](https://developers.arcgis.com/javascript/latest/sample-code/intro-graphics/index.html):
- get `geometry` by converting item `extent` from coordinate array to extent JSON
- get `attributes` from item `title` and `snippet`
- get `infoTemplate` and `symbol` from config

### Add configuration parameters
Before we add the code to show graphics, let's put default parameters into the application config.
- stop app if running (`ctrl+C`)
- in config/environment.js add this to `APP`:

```js
map: {
  options: {
    basemap: 'gray'
  },
  itemExtents: {
    symbol: {
      color: [51, 122, 183, 0.125],
      outline: {
        color: [51, 122, 183, 1],
        width: 1,
        type: 'simple-line',
        style: 'solid'
      },
      type: 'simple-fill',
      style: 'solid'
    },
    popupTemplate: {
      title: '{title}',
      content: '{snippet}'
    }
  }
}
```

### Add a utility function to convert an item to graphic JSON

- run tests w/ `ember test -s`
- type 'unit' into the `Filter` textbox and click `Go`
- in tests/unit/utils/map.js:
 - add `, itemToGraphicJson` to the map util `import` statement
 - add the following tests:

```js
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
```

- you should see failing tests
- add the following to the bottom of app/utils/map.js:

```js
export function itemToGraphicJson (item, symbol, popupTemplate) {
  const geometry = coordsToExtent(item.extent);
  return { geometry, symbol, attributes: item, popupTemplate };
}

// expect [[-53.2316, -79.8433], [180, 79.8433]] or []
function coordsToExtent (coords) {
  if (coords && coords.length === 2) {
    return {
      type: 'extent',
      xmin: coords[0][0],
      ymin: coords[0][1],
      xmax: coords[1][0],
      ymax: coords[1][1],
      spatialReference:{
        wkid:4326
      }
    };
  }
}
```

- all tests should pass now
- stop tests by typing `q`
