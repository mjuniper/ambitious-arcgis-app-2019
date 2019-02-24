import Component from '@ember/component';
import { newMap } from '../utils/map';
import config from '../config/environment';

export default Component.extend({
  classNames: ['extents-map'],

  showItemsOnMap () {
    if (!this._map) {
      return;
    }
    const { symbol, popupTemplate } = config.APP.map.itemExtents;
    const items = this.get('items');
    this._map.refreshItems(items, symbol, popupTemplate);
  },

  // wait until after the component is added to the DOM before creating the map
  didInsertElement () {
    this._super(...arguments);
    // create a map at this element's DOM node
    newMap(this.elementId, config.APP.map.options)
    .then(mapFunctions => {
      // hold onto a reference to the object with the map functions
      this._map = mapFunctions;
      this.showItemsOnMap();
    });
  },

  // whenever items change, update the map
  didUpdateAttrs () {
    this.showItemsOnMap();
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
