import Component from '@ember/component';
import { loadMap, showItemsOnMap } from '../utils/map';
import config from '../config/environment';

export default Component.extend({
  classNames: ['extents-map'],

  // show items on the map w/ the symbol and popupTemplate from the config
  showItems () {
    const { symbol, popupTemplate } = config.APP.map.itemExtents;
    showItemsOnMap(this._view, this.items, symbol, popupTemplate);
  },

  // wait until after the component is added to the DOM before creating the map
  didInsertElement () {
    this._super(...arguments);
    // create a map at this element's DOM node
    loadMap(this.elementId, config.APP.map.options)
    .then(view => {
      // hold onto a reference to the map view
      this._view = view;
      this.showItems();
    });
  },

  // whenever items change, update the map
  didUpdateAttrs () {
    if (this._view) {
      this.showItems();
    }
  },

  // destroy the map before this component is removed from the DOM
  willDestroyElement () {
    if (this._view) {
      this._view.container = null;
      delete this._view;
    }
    this._super(...arguments);
  }
});
