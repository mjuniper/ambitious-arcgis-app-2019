# Building an Application

## Scaffold the application

### Prerequisites

- node and npm - already installed
- ember-cli - already installed (if not, `npm install -g ember-cli`)
- Git - already installed on mac, windows users can download https://git-scm.com/download/win

### Ember new
- open a terminal to the root folder where you keep your projects and enter:
```shell
ember new ambitious-arcgis-app
cd ambitious-arcgis-app
```

### Run the app
- in your terminal, enter
```shell
ember serve
```

- you may see a circular dependency error in the terminal, if so:
```shell
ctrl-c
npm uninstall ember-data --save-dev
ember serve
```


- open a browser to http://localhost:4200/

### Add some markup and CSS
- open app/styles/app.css and add

```css
/* bootstrap styles */
@import "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";

body {
  padding-top: 3.5rem;
}
```

- open app/templates/application.hbs replace its contents with:

```hbs
<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
  <a class="navbar-brand" href="#">Ambitious ArcGIS App</a>
</nav>

<div class="container mt-5">
  {{outlet}}
</div>
```

#### Notes:
- application route/template
- handlebars/templating
- nested routes and {{outlet}}
- compiled css, js

## Scaffold some routes

### Add items route
- `ember generate route items`
- open app/routes/items.js and replace its contents with:

```js
import Route from '@ember/routing/route';

export default Route.extend({
  // changes to these query parameters will cause this route to
  // update the model by calling the "model()" hook again
  queryParams: {
    q: { refreshModel: true }
  },

  // the model hook is used to fetch any data based on route parameters
  model (/* params */) {
    // TODO: search for items using the search term and item type
    return {
      total: 0,
      results: []
    };
  }
});
```

- open app/templates/items.hbs and replace its contents with:

```hbs
<h2>Your search for "{{q}}" yielded {{model.total}} items</h2>
```

- visit http://localhost:4200/items?q=test

#### Notes:
- generators
- route lifecycle hooks: model
- data binding
- ember object, get, set, extend, CPs - [ember twiddle](https://ember-twiddle.com/38e642b4a4f9b5ea748965f0bd9152ab?numColumns=2&openFiles=routes.application.js%2Ccontrollers.application.js)

### Add index route
- `ember generate route index`
- Download https://livingatlas.arcgis.com/assets/img/background-banners/Banner9.jpg and save at /public/assets/images/Banner9.jpg
- open app/styles/app.css and add:

```css
/* index */
.jumbotron {
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(./images/Banner9.jpg) center top/cover no-repeat;
}
```

- open app/templates/index.hbs and replace its contents with:

```hbs
<div class="jumbotron">
  <h1 class="display-3 text-light text-center mb-5">Ambitious ArcGIS App</h1>
  <form {{action "doSearch" on="submit"}}>
    <div class="input-group input-group-lg">
      {{input class="form-control" placeholder="search for items" value=q}}
      <div class="input-group-append">
        <button class="btn btn-secondary" type="submit">Search</button>
      </div>
    </div>
  </form>
</div>
```

- open app/templates/application.hbs and add the following before the closing `nav` tag.

```hbs
<div class="collapse navbar-collapse">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item">
      {{#link-to "index" class="nav-link"}}Home{{/link-to}}
    </li>
    <li class="nav-item">
      {{#link-to "items" class="nav-link"}}Items{{/link-to}}
    </li>
  </ul>
</div>
```

### Add index controller
- `ember g controller index`
- open app/controllers/index.js and add the following to the controller definition:

```js
actions: {
  doSearch () {
    this.transitionToRoute('items', {
      queryParams: { this.q }
    });
  }
}
```

- click on the home link and enter search terms

#### Notes:
- helpers - link-to & input
- actions
- ember inspector


## Add an acceptance test

- `ember g acceptance-test smoke`
- open tests/acceptance/smoke-test.js and replace its contents with:

```js
import { module, test } from 'qunit';
import { visit, click, fillIn, currentURL } from '@ember/test-helpers';
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

```

- `ember test -s`
- verify that all tests pass

#### Notes:
- testing
