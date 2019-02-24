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
Once the map has loaded, and whenever the search results are updated:
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
We'll use test driven development for this function:

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

### Return a function to refresh map graphics
We'll need the `Graphic` class to add graphics to the map, so we load `esri/Graphic` in `newMap()` and return a function to refresh map graphics.

- in app/utils/map.js:
  - add `, 'esri/Graphic'` to the end of the array of module names passed to `loadModules()`
  - add `, Graphic` to the end of the array of classes passed to the `.then()` callback
  - add the following to the returned functions above `destroy()`:

```js
refreshGraphics: function (jsonGraphics) {
  if (!view || !view.ready) {
    return;
  }
  // convert JSON to graphics
  const graphics = jsonGraphics.map(json => {
    return new Graphic(json);
  });
  // clear any existing graphics and add new ones (if any)
  view.graphics.removeAll();
  view.graphics.addMany(graphics);
},
```

- start the app (`ember serve`)

Notice that:
- the app still works (we didn't break anything)

### Show graphics on the map
Now we need to

- in app/templates/items.hbs, pass search results to the map component:

```hbs
{{extents-map items=model.results}}
```

- in app/components/extents-map.js
  - add `, itemToGraphicJson` to the map util `import` statement
  - get defaults from config by adding this `import` statement:

```js
import config from '../config/environment';
```

  - add the following method above `didInsertElement()`:

```js
showItemsOnMap () {
  if (!this._map) {
    return;
  }
  const { symbol, popupTemplate } = config.APP.map.itemExtents;
  const items = this.get('items');
  const jsonGraphics = items && items.map(item => itemToGraphicJson(item, symbol, popupTemplate));
  this._map.refreshGraphics(jsonGraphics);
},
```

    - in `didInsertElement()`
      - replace `{ basemap: 'gray' }` with `config.APP.map.options`
      - add `this.showItemsOnMap();` right after `this._map = mapFunctions;`

  - visit the items route

Notice that:
- the extents appear on the map
- you can click on one and see the popup
- but they don't update when you change the query, or page, so

back in app/components/extents-map.js add this method after `didInsertElement()`:

```js
// whenever items change, update the map
didUpdateAttrs () {
  this.showItemsOnMap();
},
```

- try searching, paging, navigating back to home and searching from there

Notice that:
- the extents on the map change when you change query/page

## Bonus - map component test

### Stub the `newMap()` function

We don't want to load the JSAPI or render a map when testing, so we'll use stubs and spies to test the map component.

- stop app (`ctrl+C`)
- `ember install ember-sinon-qunit`
- `ember g component-test extents-map`
- in tests/integration/components/extents-map-test.js:
 - replace `import { module, test } from 'qunit';` with:

```js
import { module } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
```

- add the following `import` statements:

```js
import * as mapUtils from 'ambitious-arcgis-app-2019/utils/map';
import config from 'ambitious-arcgis-app-2019/config/environment';
```

- replace the 'it renders' test with:

```js
test('it renders', async function(assert) {
  // spy on the refreshGraphics() function returned by newMap()
  const refreshGraphics = this.spy();
  // stub the newMap() function so that a map is not constructed
  const stub = this.stub(mapUtils, 'newMap').resolves({
    refreshGraphics: refreshGraphics,
    // NOTE: we don't spy on destroy() b/c it is called after the test completes
    destroy: () => {},
  });
  // render the component with no items
  this.set('items', undefined);
  await render(hbs`{{extents-map items=items}}`);
  // assertions
  assert.ok(stub.calledOnce, 'newMap was called only once');
  const args = stub.getCall(0).args;
  const elementIdRegEx = /^ember(\d+)$/; // ex: ember123
  assert.ok(elementIdRegEx.test(args[0]), 'element id was passed');
  assert.equal(args[1], config.APP.map.options, 'config options were passed');
  assert.ok(refreshGraphics.calledOnceWithExactly, 'refreshGraphics called once with no graphics');
});
```

- run `ember t -s`
- type 'extents-map' into the `Filter` textbox and click `Go`
- open chrome devtools, inspect network requests

Notice that:
- all tests pass
- no network requests are made for JSAPI

### Test with items

Back in in tests/integration/components/extents-map-test.js:
- add the following below the `import` statements:

```js
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
```
- add the following between `render()` and the assertions:

```js
// update the items
this.set('items', mockItems());
```

- replace the last assertion with:

```js
assert.ok(refreshGraphics.calledTwice, 'refreshGraphics called twice');
assert.deepEqual(refreshGraphics.firstCall.args, [undefined], 'refreshGraphics called with no graphics initially');
const graphics = refreshGraphics.secondCall.args[0];
assert.equal(graphics.length, this.get('items').length, 'same number of graphics as items');
```
