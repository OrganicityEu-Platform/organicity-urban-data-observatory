(function() {
  'use strict';

  angular.module('app.components')
    .factory('minMarker', ['markerUtils', function (markerUtils) {

      /**
       * Marker constructor
       * @constructor
       * @param {Object} deviceData - Object with data about marker from API
       * @property {number} lat - Latitude
       * @property {number} lng - Longitude
       * @property {string} message - Message inside marker popup
       * @property {Object} icon - Object with classname, size and type of marker icon
       * @property {string} layer - Map layer that icons belongs to
       * @property {boolean} focus - Whether marker popup is opened
       * @property {Object} myData - Marker id and labels 
       */

      function minMarker(lightEntity) {

        this.lat = lightEntity.position.latitude;
        this.lng = lightEntity.position.longitude;
        this.icon = '';
        this.layer = 'realworld'; 
        this.focus = false;
        this.myData = {
          id: markerUtils.parseId(lightEntity),         
          labels: ''//markerUtils.parseLabels(lightEntity)
        };
      }
      return minMarker;


      function createTagsTemplate(tagsArr) {
        return _.reduce(tagsArr, function(acc, label) {
          return acc.concat('<span>' + label + '</span>');
        }, '');
      }

    }]);
})();
