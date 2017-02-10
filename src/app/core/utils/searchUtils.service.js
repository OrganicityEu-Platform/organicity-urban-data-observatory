(function() {
  'use strict';

  angular.module('app.components')
    .factory('searchUtils', searchUtils);


    searchUtils.$inject = [];
    function searchUtils() {
      var service = {
        parseLocation: parseLocation,
        parseName: parseName,
        parseIcon: parseIcon,
        parseIconType: parseIconType,
        parseType: parseType,
        parseTime: parseTime
      };
      return service;

      /////////////////

      function parseType(object) {  
        if (object.type) return object.type;      
        //return object.searchMatches[0]; // tmp. single Type
      }

      function parseName(object) {
          // This is tmp
          if (object.type == "location") return object.name;          

          var entityName = object.id.split(":");

          entityName = entityName.slice(4, entityName.length);
          entityName = _.map(entityName, unfoldCase);

          object.name = entityName.join(" ");

          return object.name;
      }

      function parseLocation(object) {
          // This is tmp
          if (object.type == "location") return "";

          var location = '';
          var locationSource = {};

          if (object.context && object.context.position && object.context.position.city && object.context.position.country) {
              locationSource = object.context.position;
          }

          /*jshint camelcase: false */
          var city = locationSource.city;
          var country_code = locationSource.country_code;


          if (!!city) {
              location += city;
          }
          if (!!country_code) {
              location += ', ' + country_code;
          }

          // This is tmp
          if (isExperimenter(object)) location = 'Experiment'

          return location;
      }

       function isExperimenter(object) {
            return object.context.experimenter ? true : false;
        }

      function parseIcon(object, type) {
        switch(type) {
          case 'location':
            return 'mediassets/images/location_icon_normal.svg';
          default:
            return 'mediassets/images/entity.svg';
        }
      }

      function parseIconType(type) {
        switch(type) {
          case 'Device':
            return 'div';
          default:
            return 'img';
        }
      }

      function parseTime(object) {
          /*jshint camelcase: false */
          return new Date(object.context.last_updated_at);
      }

      function unfoldCase(str) {
          return str.replace(/([A-Z][a-z])/g, ' $1').replace(/^./, function(str) {
              return str.toUpperCase();
          })
      }

    }
})();
