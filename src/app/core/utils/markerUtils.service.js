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
        parseLocation: parseLocation, // Different object with O W N name
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
        if (object.name === 'cluster') {
          entityType = object.name; //tmp
        }
        else {
          entityType = object.type;
        }
        return entityType;
      }

      function parseEntityType(object) {
        var entityType = object.name.split(':');
        return makeTitle(entityType[entityType.length-1]);
      }

      function parseLocation(object) {

        var location = '';
        var locationSource = {};

        if(object.context) {
          if (object.context.position.city && object.context.position.country) {
            locationSource = object.data.location;
          }
        } else if (object.provider && object.context.position.city && object.context.position.country){
            locationSource = object.context.position;
            locationSource.justOwnerLocation = true;
        }
        var city = '';
        var countryCode = '';
        var country = '';

        if (locationSource) {
          /*jshint camelcase: false */
          city = locationSource.city;
          countryCode = locationSource.country_code;
          country = COUNTRY_CODES[countryCode];
        }

        if(!!city) {
          location += city;
        }
        if(!!country) {
          location += ', ' + country;
        }

        if (locationSource.justOwnerLocation) {
          location += ' (provider location)';
        }

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
        var systemTags = [];
        var entityName;

        if(!object.name) {
          object.name = object.id || 'no:name'; //tmp.
        }

        if(!object.id) {
          object.id = 'cluster:id'; //tmp.
        }
        if (object.name === 'cluster') {
          entityName = 'Device cluster';
        } else {
          systemTags.push((this.isOnline(object)) ? 'online' : 'offline');

          entityName = object.id.split(':');

          var source = entityName[3];
          var origin = entityName[4];

          if(source) {
            systemTags.push(source);
          }
          if(origin) {
            systemTags.push(origin);
          }
        }
        /*jshint camelcase: false */
        return systemTags;
      }

      function parseUserTags(object) {
        var userTags = [];

        if(!object.type) {
          return userTags;
        }

        var entityType = object.type.split(':');

        if(entityType) {
          userTags.push(entityType[entityType.length-1]);
        }

        /*jshint camelcase: false */
        return userTags;
      }

      function checkLocation(object) {
        if (object.context && object.context.position !== null && object.context.position.latitude && object.context.position.longitude && object.context.position.latitude !== 0 && object.context.position.longitude !== 0) {
          return true;
        }

        else {
          return false;
        }
      }

      function parseCoordinates(object) {
        if (object.position) {
          return object.position;
        } else if (object.geometry.coordinates) {
          return object.geometry.coordinates;
        }
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
        var entityName = 'Unknown';
        if(!object.name) {
          return 'Unknown';
        }
        if (object.name === 'cluster') {
          entityName = object.count + ' devices';
        }
        else {
          entityName = object.name;
        }

        if (object['context']) {
          entityName = object['context']['name'].split(':');

        }

        return entityName;
      }

      function parseTime(object) {
        var time = 'Unknown';

        if (object['context']) {
          time = object['context']['last_reading_at'];
        }

        if (object.name === 'cluster') {
          time = new Date(Date.now());
        }

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
        return str.replace(/([A-Z])/, ' $1') .replace(/^./, function(str){ return str.toUpperCase(); }); }
    }
})();
