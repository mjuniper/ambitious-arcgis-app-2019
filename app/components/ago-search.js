import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({

  classNames: ['ago-search'],

  // use a copy so that we don't immediately update bound URL parameters
  searchCopy: computed.reads('q'),

  // allow the consuming template to set the input size ('lg' or 'sm')
  sizeClass: computed('size', function () {
    const size = this.get('size');
    if (size) {
      return `input-group-${size}`;
    } else {
      return '';
    }
  })

});
