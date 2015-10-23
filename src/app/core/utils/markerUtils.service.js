(function() {
  'use strict';

  angular.module('app.components')
    .factory('markerUtils', markerUtils);

    markerUtils.$inject = ['device', 'kitUtils', 'COUNTRY_CODES', 'MARKER_ICONS'];
    function markerUtils(device, kitUtils, COUNTRY_CODES, MARKER_ICONS) {
      var service = {
        parseName: parseName,
        parseType: parseType,
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
      _.defaults(service, kitUtils);
      return service;

      ///////////////

      function parseType(object) {
        var kitType; 
        kitType = 'Organicity'; //tmp
        return kitType; 
      }

      function parseLocation(object) {
        var location = '';
        var locationSource = {};

        if(object.data.location.city && object.data.location.country) {
            locationSource = object.data.location;
        } else if (object.owner.location.city && object.owner.location.country){
            locationSource = object.owner.location;
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
        var time = object['last_reading_at'];
        var timeDifference =  (new Date() - new Date(time))/1000;
        if(!time || timeDifference > 15*60) {
          return false;
        } else {
          return true;
        }
      }

      function parseLabels(object) {
        var system_tags = [];

        system_tags.push((this.isOnline(object)) ? "online" : "offline");

        var entityName = object.uuid.split(":");
        var source = entityName[3];
        var origin = entityName[4];

        if(source) system_tags.push(source);
        if(origin) system_tags.push(origin);

        /*jshint camelcase: false */
        return system_tags;
      }

      function parseUserTags(object) {
        var user_tags = ["organicity"]; //temp
        return user_tags;
      }

      function parseCoordinates(object) {
        var location = {};
        if(object.data.location.latitude && object.data.location.longitude && object.data.location.latitude != 0 && object.data.location.longitude != 0) {
            location.lat = object.data.location.latitude;
            location.lng = object.data.location.longitude;
        } else {
            location.lat = 50.8500;
            location.lng = 4.3500;
        }
        return location;
      }

      function parseId(object) {
        return object.id;
      }

      function getIcon(labels) {
        var icon;

        if(hasLabel(labels, 'offline')) {
          icon = MARKER_ICONS.markerOrganicityOffline;
        } else {
          icon = MARKER_ICONS.markerOrganicityOnline;
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
          object.name;
        }
        var startsIn = 4;
        var entityName = object.uuid.split(":");
        var name = entityName[startsIn];

        for (var i = startsIn+1; i < entityName.length; i++) {
          name += " " + entityName[i];
        };

        object.name = this.makeCase(name);

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
    }
})();
