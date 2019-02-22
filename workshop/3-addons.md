# Addons

Previously we added the Bootstrap CSS, which works for the page layout and styles, but the components are not interactive. For example, open chrome developer tools (cmd+opt+i) and toggle the device toolbar (cmd+shift+M) to view what the app looks like on a mobile device.

Notice that:
- the nav menu items are hidden
- we can't get back to the home page

We'll need to add bootstrap's button to toggle the collapsible nav bar.

The easiest way is to use http://www.ember-bootstrap.com/, which is an ember implementation of most Bootstrap components.

## Add ember-bootstrap
- stop app (`ctrl+C`)
- `ember install ember-bootstrap`
- in app/styles/app.css, delete these lines:
```css
/* bootstrap styles */
@import "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";
```
- start app (`ember serve`)

Notice that:
- app looks the same
- no longer making a network request for bootstrap.min.css from CDN
- bootstrap styles have been imported into vendor.css
- the navbar toggle on mobile still doesn't work

## Use ember-bootstrap components
- in app/templates/application.hbs replace the `<nav>` with:

```hbs
{{#bs-navbar class="navbar-expand-md navbar-dark fixed-top bg-dark" as |navbar|}}
  <div class="navbar-header">
    {{navbar.toggle}}
    <a class="navbar-brand" href="#">Ambitious ArcGIS App</a>
  </div>
  {{#navbar.content}}
    {{#navbar.nav as |nav|}}
      {{#nav.item}}
        {{#nav.link-to "index"}}Home{{/nav.link-to}}
      {{/nav.item}}
      {{#nav.item}}
        {{#nav.link-to "items"}}Items{{/nav.link-to}}
      {{/nav.item}}
    {{/navbar.nav}}
  {{/navbar.content}}
{{/bs-navbar}}
```

Notice that:
- you can now use the navbar toggle on mobile
