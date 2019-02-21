import Route from '@ember/routing/route';

export default Route.extend({
  // changes to these query parameter will cause this route to
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
