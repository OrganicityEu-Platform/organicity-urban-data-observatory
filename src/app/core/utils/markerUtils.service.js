(function() {
  'use strict';

  angular.module('app.components')
    .factory('markerUtils', markerUtils);

    markerUtils.$inject = ['entity', 'entityUtils', 'COUNTRY_CODES', 'MARKER_ICONS'];
    function markerUtils(entity, entityUtils, COUNTRY_CODES, MARKER_ICONS) {
      var service = {
        parseName: parseName,
        parseType: parseType,
        parseEntityType: parseEntityType,
        parseLocation: parseLocation,
        parseLabels: parseLabels,
        parseUserTags: parseUserTags,
        parseCoordinates: parseCoordinates,
        parseId: parseId,
        getIcon: getIcon,
        parseTime: parseTime,
        getMarkerIcon: getMarkerIcon,
        isOnline: isOnline,
        makeCase: makeCase
      };
      _.defaults(service, entityUtils);
      return service;

      ///////////////

      function parseType(object) {
        var entityType; 
        entityType = 'Organicity'; //tmp
        return entityType; 
      }

      function parseEntityType(object) {
        var entityType = object.name.split(":");
        return makeTitle(entityType[entityType.length-1]);
      }

      function parseLocation(object) {
        return 'Unknown';
        var location = '';
        var locationSource = {};

        if(object.context.position.city && object.context.position.country) {
            locationSource = object.data.location;
        } else if (object.provider && object.context.position.city && object.context.position.country){
            locationSource = object.context.position;
            locationSource.justOwnerLocation = true;
        }  
          
        /*jshint camelcase: false */
        var city = locationSource.city;
        var country_code = locationSource.country_code;
        var country = COUNTRY_CODES[country_code];


        if(!!city) {
          location += city;
        }
        if(!!country) {
          location += ', ' + country;
        }

        if(locationSource.justOwnerLocation) location += ' (provider location)';

        return location;
      }

      function isOnline(object) {
        var time = object['last_updated_at'];
        var timeDifference =  (new Date() - new Date(time))/1000;
        if(!time || timeDifference > 7*24*60*60) { //a week
          return false;
        } else {
          return true;
        }
      }

      function parseLabels(object) {
        var system_tags = [];

        if(!object.name) {
          object.name = object.id || "no:name"; //tmp.
        }

        system_tags.push((this.isOnline(object)) ? "online" : "offline");

        var entityName = object.id.split(":");

        var source = entityName[3];
        var origin = entityName[4];

        if(source) system_tags.push(source);
        if(origin) system_tags.push(origin);

        /*jshint camelcase: false */
        return system_tags;
      }

      function parseUserTags(object) {
        var user_tags = [];

        if(!object.type) {
          return user_tags;
        }

        var entityType = object.type.split(":");

        if(entityType) user_tags.push(entityType[entityType.length-1]);

        /*jshint camelcase: false */
        return user_tags;
      }

      function parseCoordinates(object) {
        return object.position;
      }

      function parseId(object) {
        return object.id.replace(/-/g, '_'); // Angular ids doesn't support hyphens.
      }

      function getIcon(labels) {
        var icon;

        if(hasLabel(labels, 'offline')) {
          icon = MARKER_ICONS.markerEntitiesOffline;
        } else {
          icon = MARKER_ICONS.markerEntitiesOnline;
        }  
        return icon;
      }

      function hasLabel(labels, targetLabel) {
        return _.some(labels, function(label) {
          return label === targetLabel;
        });
      }

      function parseName(object) {
        if(!object.uuid) {
          object.uuid = object.name; //tmp.
        }

        if(!object.name) {
          return "Unknown";
        }

        var entityName = object.name.split(":");

        entityName = entityName.slice(4, entityName.length);
        entityName = _.map(entityName, makeCase);

        object.name = entityName.join(" ");

        return object.name.length <= 41 ? object.name : object.name.slice(0, 35).concat(' ... ');
      }

      function parseTime(object) {
        var time = object['last_reading_at'];
        if(!time) {
          return 'No time';
        }
        return moment(time).fromNow();
      }

      function getMarkerIcon(marker, state) {
        var markerType = marker.icon.className;

        if(state === 'active') {
          marker.icon = MARKER_ICONS[markerType + 'Active'];
          marker.focus = true;
        } else if(state === 'inactive') {
          var targetClass = markerType.split(' ')[0];
          marker.icon = MARKER_ICONS[targetClass];
        }
        return marker;
      }

      function makeCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }

      function makeTitle(str){
        return str.replace(/([A-Z])/, ' $1') .replace(/^./, function(str){ return str.toUpperCase(); }) }
    }
})();
