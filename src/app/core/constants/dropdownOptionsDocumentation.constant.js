(function() {
  'use strict';

  /**
   * Dropdown options for support button
   * @constant
   * @type {Array}
   */

  angular.module('app.components')
    .constant('DROPDOWN_OPTIONS_DOCUMENTATION', [
      {text: 'About', href: 'http://organicity.eu/'},
      {text: 'Tech Docs', href: 'https://organicityeu.github.io/'},
      {text: 'Github', href: 'https://organicityeu.github.io/'},
    ]);
})();

