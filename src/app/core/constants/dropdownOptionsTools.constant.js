(function() {
  'use strict';

  /**
   * Dropdown options for tools button
   * @constant
   * @type {Array}
   */

  angular.module('app.components')
    .constant('DROPDOWN_OPTIONS_TOOLS', [
      {text: 'Experimenters Portal', href: 'https://communities.organicity.eu/'},
      {text: 'Facility Manager', href: 'https://facilitymanager.organicity.eu/'},
      {text: 'Community Management', href: 'https://communities.organicity.eu/'},
      {text: 'Scenarios Tool', href: 'https://scenarios.organicity.eu/'},
      {text: 'Tinkerspace Tool', href: 'http://www.tinkerspace.se/'},
      {text: 'Smartphone Tool', href: 'https://set.organicity.eu/'},
      {text: 'OppNet Tool', href: 'http://organicity.eu/tools/opportunistic-connectivity-services/'},
      {text: 'Sensinact Tool', href: 'https://organicityeu.github.io/tools/sensinact/index.html'},
      {text: 'TSmarT Tool', href: 'https://organicityeu.github.io/tools/tsmart/tsmart/'},
      {text: 'DUL Radio Tool', href: 'http://organicity.eu/tools/dul-radio/'},
      {text: 'Web Sockets Tool', href: 'https://github.com/alexandrainst/processing_websockets'},
    ]);
})();

