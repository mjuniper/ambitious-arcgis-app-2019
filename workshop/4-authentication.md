# Authentication

We already installed `torii-provider-arcgis`, but now we will actually configure it.

## Register your app with ArcGIS.com

Sign in at `developers.arcgis.com` and click the "+" dropdown and then "New Application".

Give your app a name, tags and a description and click the "Register" button.

The app item will be created in your ArcGIS Org, and the browser will now show information - including the `Client Id`. Copy that, but leave the browser tab open.

We also need to add a "Redirect URI". Click on the Authentication Tab, then scroll down, and paste `http://localhost:4200` into the Redirect URI box and click `Add`.

In your editor, open `/config/environment.js` and go into the `torii` section and add your client id.

```
torii: {
  sessionServiceName: 'session',
  providers: {
   'arcgis-oauth-bearer': {
      apiKey: 'PASTE-YOUR-CLIENT-ID-HERE',
      portalUrl: 'https://www.arcgis.com'
    }
  }
}
```

Now, move to the Authentication tab, and scroll to the bottom. Add `http://localhost` as a redirect uri.

## Adding Sign-In to Our app

First, let's add the markup to `/app/templates/application.hbs` just before `{{/bs-navbar}}`

```hbs
{{#navbar.nav class="ml-auto" as |nav|}}
  {{#if session.isAuthenticated}}
    {{#nav.item}}<a href="#" {{action "signout"}}>Sign Out</a>{{/nav.item}}
  {{else}}
    {{#nav.item}}<a class="nav-link active" href="#" {{action "signin"}}>Sign In</a>{{/nav.item}}
  {{/if}}
{{/navbar.nav}}
```

Now we need to add the `signin` and `signout` actions to the application route.

Add before the Route definition
```
import { debug } from '@ember/debug';
```

```
// routes/application.js
...
  actions: {
    signin () {
      debug(' do sign in');
    },
    signout () {
      debug(' do sign out');
    }
  }
...
```

Now let's run ember and see how things work. `ember s`, open `http://localhost:4200` in your browser, and open dev tools.

You should see your "Sign In" link in the nav bar. Clicking on it, should add messages to the console.

## Hooking up Sign In
The `torii-provider-arcgis` hides pretty much all the details, but we do need to drop some code into the `signin` action...

```
// app/routes/application.js
...
actions: {
  signin () {
    this.get('session').open('arcgis-oauth-bearer')
      .then((authorization) => {
        debug('AUTH SUCCESS: ', authorization);
        //transition to some secured route or... whatever is needed
        this.transitionTo('index');
      })
      .catch((err)=>{
        debug('AUTH ERROR: ', err);
      });
  },
  signout () {
    debug(' do sign out');
  }
}
...
```

Now, clicking the "Sign In" link should open a pop-up window. Sign In with valid credentials, and you should see the "Sign Out" link appear, and some debug messages in the console...

```
DEBUG: session.open is returning with data...
vendor.js:16263 DEBUG: torii:adapter:arcgis-oauth-bearer:open got response from portal/self & assigning to session
vendor.js:16263 DEBUG: AUTH SUCCESS:
```

## Hooking up Sign Out
Signing out for apps not on `*arcgis.com` is very straight forward - we just ask torii to close the session.

```
// routes/application.js
...
actions: {
  signin () {
    this.get('session').open('arcgis-oauth-bearer')
      .then((authorization) => {
        debug('AUTH SUCCESS: ', authorization);
        this.transitionTo('index');
      })
      .catch((err)=>{
        debug('AUTH ERROR: ', err);
      });
  },
  signout () {
    this.get('session').close();
  }
}
...
```

## Making it Better...

At this point we have basic authentication working and our session has all our ArcGIS Online information and we can call the API etc.

But... the user experience is weak. So let's show the current user in the header and move Sign Out into a dropdown.

Open up `/app/templates/application.hbs` and replace the code between `{{#if session.isAuthenticated}}` and `{{else}}` as shown below.

```
{{#if session.isAuthenticated}}
  {{#nav.dropdown as |dd|}}
    {{#dd.toggle class="ml-auto"}}{{session.currentUser.fullName}}  <span class="caret"></span>{{/dd.toggle}}
    {{#dd.menu as |ddm|}}
      {{#ddm.item}}<a class="dropdown-item" href="#" {{action 'signout'}}>Sign Out</a>{{/ddm.item}}
    {{/dd.menu}}
  {{/nav.dropdown}}
{{else}}
```

The `session` service is injected into all templates, so we can directly use that in the template `{{session.currentUser.fullName}}` shows... yep, the user's full name.

## Persisting Session
At this point you've likely gotten sick of having to sign in every time the app refreshes, so let's fix that.

By default, `torii` stores the credentials in `localStorage`, let's look at that. In devtools, on the "Application" tab, click on Local Storage on the left, and click on `http://localhost:4200`. If you are signed in, you will see a key called `torii-provider-arcgis`, with a json object as the value.

So - that is persisted. What we need to do is have Ember read that during it's boot cycle.

The first hook we have in the application life-cycle is the `beforeModel()` hook on the application route. So let's open up `/app/routes/application.js` and add that hook...

```
beforeModel () {
  debug('ApplicationRoute:beforeModel');
  // ...
},
```

Press save, and the app will re-load and we will see that message in the console.

Since `beforeModel` is a really useful place to run initialization, we don't dump a lot of code directly in this hook. Instead, we will call a helper function.

```
beforeModel () {
  //set up the interationalization
  this.get('intl').setLocale('en-us');
  // automatically re-hydrate a session
  return this._initSession();
},

_initSession () {
  return this.get('session').fetch()
    .then(() => {
      debug('User has been automatically logged in... ');
    })
    .catch((/*err*/) => {
      // we want to catch this, otherwise Ember will redirect to an error route!
      debug('No cookie was found, user is anonymous... ');
    });
},
```

#### Before Model and Promise Rejection
The call to `session.fetch()` returns a promise, which makes sense because it's an async call. The promise will resolve with the authorization payload, or reject because the user is not signed in. Normally, we can force Ember to redirect to an `error` route by rejecting a promise in the `beforeModel` hook. But in this case, we don't want to do that - thus we have a `.catch()`.

# Wrap Up
At this point you should have an app that allows a user to sign in with ArcGIS.com credentials, shows their name in the UI, and allows them to sign out. If the close the browser or refresh the page while signed in, the app will load their saved token information from localStorage and automatically sign them in.
