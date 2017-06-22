(function() {
  'use strict';

  /**
   * Dropdown options for support button
   * @constant
   * @type {Array}
   */

  angular.module('app.components')
    .constant('DROPDOWN_OPTIONS_SUPPORT', [
      {text: 'Q&A', href: 'http://dev.qa.organicity.eu/index.php'},
      {text: 'Zoho', href: 'https://support.zoho.com/portal/organicity/home'},
    ]);
})();

