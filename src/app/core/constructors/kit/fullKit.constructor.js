(function() {
  'use strict';

  angular.module('app.components')
    .factory('FullKit', ['Kit', 'Sensor', 'kitUtils', function(Kit, Sensor, kitUtils) {

      /**
       * Full Kit constructor.
       * @constructor
       * @extends Kit
       * @param {Object} object - Object with all the data about the kit from the API
       * @property {string} version - Kit version. Ex: 1.0
       * @property {string} time - Last time kit sent data in UTC format
       * @property {string} timeParsed - Last time kit sent data in readable format
       * @property {string} timeAgo - Last time kit sent data in 'ago' format. Ex: 'a few seconds ago'
       * @property {string} class - CSS class for kit
       * @property {string} description - Kit description
       * @property {Object} owner - Kit owner data
       * @property {Array} data - Kit sensor's data
       * @property {number} latitude - Kit latitude
       * @property {number} longitude - Kit longitude
       * @property {string} macAddress - Kit mac address
       * @property {number} elevation
       */
      function FullKit(object) {

        Kit.call(this, object);

        this.version = "Organicity";
        this.time = kitUtils.parseTime(object);
        this.timeParsed = !this.time ? 'No time' : moment(this.time).format('MMMM DD, YYYY - HH:mm');
        this.timeAgo = !this.time ? 'No time' : moment(this.time).fromNow();
        this.class = kitUtils.classify(kitUtils.parseType(object)); 
        this.description = "";
        this.owner = kitUtils.parseOwner(object);
        this.data = object.data.atttributes;
        this.latitude = object.data.location.latitude;
        this.longitude = object.data.location.longitude;

      }

      FullKit.prototype = Object.create(Kit.prototype);
      FullKit.prototype.constructor = FullKit;

      FullKit.prototype.getSensors = function() {
        var sensors = _(this.data)
            .chain()
            .map(function(sensor) {
              return new Sensor(sensor); 
            })
            .value();
            return sensors;
      };
      return FullKit;
    }]); 
})();
