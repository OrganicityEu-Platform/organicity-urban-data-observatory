(function() {
  'use strict';

  angular.module('app.components')
    .factory('markerUtils', markerUtils);

    markerUtils.$inject = ['asset', 'entityUtils', 'COUNTRY_CODES', 'MARKER_ICONS', '$state'];
    function markerUtils(asset, entityUtils, COUNTRY_CODES, MARKER_ICONS, $state) {
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
        if (!object.name) {
          entityType = '';
        }
        else if (object.name.includes('Cluster')) {
          entityType = object.name; //tmp
        }
        else if (object.properties && object.properties.type) {
          var typeString = object.properties.type.split(':');
          entityType = typeString[typeString.length-1]
        }
        else if (object.type) {
          var typeString = object.type.split(':');
          entityType = typeString[typeString.length-1]
        }
        return entityType;
      }

      function parseEntityType(object) {
        var entityType;
        if (object.name.includes('Cluster')) {
          entityType = object.name; //tmp
        }
        else if (object.type) {
          entityType = object.type.split(':');
        }
        else if (object.properties) {
          entityType = object.properties.type.split(':');
        }
        else {
          entityType = object.name.split(':');
        }
        return makeTitle(entityType[entityType.length-1]);
      }

      function parseLocation(object) {
        if(!object.site || object.split == null) return;

        var location = '';
        // var locationSource = {};

        // if(object.context) {
        //   if (object.provider && object.context.position.city && object.context.position.country){
        //     locationSource = object.context.position;
        //     locationSource.justOwnerLocation = true;
        //   } else if (object.context.position.city && object.context.position.country) {
        //     locationSource = object.data.location;
        //   }
        // }
        var city = '';
        var countryCode = '';
        var country = '';

        console.log(object.site);

        // if (locationSource) {
          /*jshint camelcase: false */
          city = makeTitle(object.site);
          // countryCode = locationSource.country_code;
          // country = COUNTRY_CODES[countryCode];
        // }

        if(!!city) {
          location += city;
        }
        if(!!country) {
          location += ', ' + country;
        }

        // if (locationSource.justOwnerLocation) {
        //   location += ' (provider location)';
        // }

        return location;
      }

      function isOnline(object) {
        var time = Date.now;
        if (object.last_updated_at) {
          time = Date.parse(object.last_updated_at);
        }
        else {
          time = Date.parse(object.last_update_at);
        }
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
          console.log(object);
          object.id = 'sites/' + object.city.toLowerCase(); //tmp.
        }
        if (object.name.includes('Cluster')) {
          entityName = 'Device cluster';
        } else {
          systemTags.push((this.isOnline(object)) ? 'online' : 'offline');

          entityName = object.id.split(':');

          var entityName = entityName.splice(3, entityName.length-1); // Remove urn header
          var entityName = entityName.splice(0, entityName.length-1); // Remove urn entity name

          systemTags = systemTags.concat(entityName);

        }
        /*jshint camelcase: false */
        return systemTags;
      }

      function parseUserTags(object) {
        var userTags = [];

        /*
        if(!object.type) {
          return userTags;
        }

        var entityType = object.type.split(':');

        if(entityType) {
          userTags.push(entityType[entityType.length-1]);
        }
        */

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
      
      /*
      function parseName(object) {
        var entityName = 'Unknown';
        if(!object.name) {
          return 'Unknown';
        }
        else if (object.name.includes('Cluster')) {
          entityName = object.count + ' devices in ' + object.city;
        }
        else if (object.context && object.context.name) {
          var entityNameString = object.context.name.split(':');
          entityName = entityNameString[entityNameString.length-1]
        }
        else {
          var entityNameString = object.name.split(':');
          entityName = entityNameString[entityNameString.length-1]
        }
        return entityName;
      }
      */

      function parseName(object) {
        if(!object.id) {
          return;
        }

        var entityName = object.id.split(":");

        entityName = entityName.slice(4, entityName.length);
        entityName = _.map(entityName, makeCase);

        object.name = entityName.join(" ");

        return object.name.length <= 41 ? object.name : object.name.slice(0, 35).concat(' ... ');
      }


      function parseTime(object) {
        var time = 'Unknown';

        if (object.context) {
          time = object.context.last_reading_at;
        }
        else if (object.last_updated_at) {
          time = Date.parse(object.last_updated_at)
        }
        else if (object.name && object.name.includes('Cluster')) {
          time = new Date(Date.now());
        }
        else {
          time = Date.parse(object.last_update_at);
        }

        if(!time) {
          return 'No time';
        }

        return 'Last updated ' + moment(time).fromNow();
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
