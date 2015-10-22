(function() {
  'use strict';

  /**
   * Marker icons
   * @constant
   * @type {Object}
   */

  angular.module('app.components')
    .constant('MARKER_ICONS', {
      defaultIcon: {},
      markerSmartCitizenNormal: {
        type: 'div',
        className: 'markerSmartCitizenNormal',
        iconSize: [24, 24]
      },
      markerSmartCitizenOnline: {
        type: 'div',
        className: 'markerSmartCitizenOnline',
        iconSize: [24, 24]
      },
      markerSmartCitizenOnlineActive: {
        type: 'div',
        className: 'markerSmartCitizenOnline marker_blink',
        iconSize: [24, 24]
      },
      markerSmartCitizenOffline: {
        type: 'div',
        className: 'markerSmartCitizenOffline',
        iconSize: [24, 24]
      },
      markerSmartCitizenOfflineActive: {
        type: 'div',
        className: 'markerSmartCitizenOffline marker_blink',
        iconSize: [24, 24]
      },
      markerOrganicityNormal: {
        type: 'div',
        className: 'markerOrganicityNormal',
        iconSize: [24, 24]
      },
      markerOrganicityOnline: {
        type: 'div',
        className: 'markerOrganicityOnline',
        iconSize: [24, 24]
      },
      markerOrganicityOnlineActive: {
        type: 'div',
        className: 'markerOrganicityOnline marker_blink',
        iconSize: [24, 24]
      },
      markerOrganicityOffline: {
        type: 'div',
        className: 'markerOrganicityOffline',
        iconSize: [24, 24]
      },
      markerOrganicityOfflineActive: {
        type: 'div',
        className: 'markerOrganicityOffline marker_blink',
        iconSize: [24, 24]
      }
    });
})();
