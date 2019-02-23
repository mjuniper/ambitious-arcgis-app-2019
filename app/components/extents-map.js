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
