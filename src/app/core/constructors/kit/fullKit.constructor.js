(function() {
  'use strict';

  angular.module('app.components')
    .factory('Fullentity', ['entity', 'Sensor', 'entityUtils', function(entity, Sensor, entityUtils) {

      /**
       * Full entity constructor.
       * @constructor
       * @extends entity
       * @param {Object} object - Object with all the data about the entity from the API
       * @property {string} version - entity version. Ex: 1.0
       * @property {string} time - Last time entity sent data in UTC format
       * @property {string} timeParsed - Last time entity sent data in readable format
       * @property {string} timeAgo - Last time entity sent data in 'ago' format. Ex: 'a few seconds ago'
       * @property {string} class - CSS class for entity
       * @property {string} description - entity description
       * @property {Object} owner - entity owner data
       * @property {Array} data - entity sensor's data
       * @property {number} latitude - entity latitude
       * @property {number} longitude - entity longitude
       * @property {string} macAddress - entity mac address
       * @property {number} elevation
       */
      function Fullentity(object) {

        entity.call(this, object);

        this.version = "Organicity";
        this.time = entityUtils.parseTime(object);
        this.timeParsed = !this.time ? 'No time' : moment(this.time).format('MMMM DD, YYYY - HH:mm');
        this.timeAgo = !this.time ? 'No time' : moment(this.time).fromNow();
        this.class = entityUtils.classify(entityUtils.parseType(object)); 
        this.description = "";
        this.owner = entityUtils.parseOwner(object);
        this.data = object.data.attributes;
        this.latitude = object.data.location.latitude;
        this.longitude = object.data.location.longitude;

      }

      Fullentity.prototype = Object.create(entity.prototype);
      Fullentity.prototype.constructor = Fullentity;

      Fullentity.prototype.getSensors = function() {
        var sensors = _(this.data)
            .chain()
            .map(function(sensor, i) {
              return new Sensor(sensor, i); 
            })
            .value();
            return sensors;
      };
      return Fullentity;
    }]); 
})();
