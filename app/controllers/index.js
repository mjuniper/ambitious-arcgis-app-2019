import Controller from '@ember/controller';

export default Controller.extend({

  actions: {
    doSearch (q) {
      this.transitionToRoute('items', {
        // for a new query string, sart on first page
        queryParams: { q , start: 1 }
      });
    }
  }

});
