(function() {
  'use strict';

  angular.module('app.components')
    .factory('HasSensorentity', ['entity', function(entity) {

      function HasSensorentity(object) {
        entity.call(this, object);

        this.data = object.data.attributes;
        this.longitude = object.data.location.longitude;
        this.latitude = object.data.location.latitude;
      }

      HasSensorentity.prototype = Object.create(entity.prototype);
      HasSensorentity.prototype.constructor = entity;

      HasSensorentity.prototype.sensorsHasData = function() {
        var parsedSensors = this.data.map(function(sensor) {
          return sensor.value;
        });

        return _.some(parsedSensors, function(sensorValue) {
          return !!sensorValue;
        });
      };

      return HasSensorentity;
    }]);
})();
