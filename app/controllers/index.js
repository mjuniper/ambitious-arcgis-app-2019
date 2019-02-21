import Controller from '@ember/controller';

export default Controller.extend({

  actions: {
    doSearch () {
      const q = this.get('q');
      this.transitionToRoute('items', {
        queryParams: { q }
      });
    }
  }

});
