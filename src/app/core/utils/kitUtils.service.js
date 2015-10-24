(function() {
  'use strict';

  angular.module('app.components')
    .factory('kitUtils', kitUtils);

    kitUtils.$inject = ['COUNTRY_CODES', 'device'];
    function kitUtils(COUNTRY_CODES, device) {
      var service = {
        parseName: parseName,
        parseLocation: parseLocation,
        parseLabels: parseLabels,
        parseUserTags: parseUserTags,
        parseType: parseType,
        classify: classify,
        parseTime: parseTime,
        parseVersion: parseVersion,
        parseOwner: parseOwner,
        parseState: parseState,
        parseAvatar: parseAvatar,
        belongsToUser: belongsToUser,
        parseSensorTime: parseSensorTime,
        isOnline: isOnline,
        makeCase: makeCase,
        parseStateName: parseStateName
      };

      return service;


      ///////////////

      function parseName(object) {
        if(!object.name) {
          return;
        }
        var startsIn = 4;
        var entityName = object.name.split(":");
        var name = entityName[startsIn];

        for (var i = startsIn+1; i < entityName.length; i++) {
          name += " " + entityName[i];
        };

        object.name = this.makeCase(name);

        return object.name.length <= 41 ? object.name : object.name.slice(0, 35).concat(' ... ');
      }

      function parseLocation(object) {
        var location = '';
        var locationSource = {};

        if(object.data && object.data.location && object.data.location.city && object.data.location.country) {
            locationSource = object.data.location;
        } else if (object.provider && object.provider.location && object.provider.location.city && object.provider.location.country){
            locationSource = object.provider.location;
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

      function parseLabels(object) {
        var system_tags = [];

        if(!object.uuid) {
          object.uuid = object.name || "no:name"; //tmp.
        }

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

      function parseType(object) {
        var kitType;

        // var kitName = !object.kit ? 'No kit property': object.kit.name;

        // if((new RegExp('sck', 'i')).test(kitName)) { 
        //   kitType = 'SmartCitizen Kit';
        // } else {
          kitType = 'Organicity';
        // }
        return kitType; 
      }

      function classify(kitType) {
        if(!kitType) {
          return '';
        }
        return kitType.toLowerCase().split(' ').join('_');
      }

      function parseTime(object) {
        /*jshint camelcase: false */
        return object.last_reading_at;
      }

      function parseVersion(object) {
        if(!object.kit) {
          return;
        }
        return object.kit.name.match(/[0-9]+.?[0-9]*/)[0];
      }

      function parseOwner(object) {
        if (!object.provider) return;
        return {
          id: object.provider.id,
          username: object.provider.username,
          /*jshint camelcase: false */
          kits: object.provider.device_ids,
          city: object.provider.location.city,
          country: COUNTRY_CODES[object.provider.location.country_code],
          url: object.provider.url,
          avatar: object.provider.avatar
        };
      }

      function parseState(object) {
        var name = this.parseStateName(object); 
        var className = classify(name); 
        return {
          name: name,
          className: className
        };
      }

      function parseStateName(object) {
        if (!object.state) {
          object.state = (object.data.atttributes.length > 0) ? "has_published" : "never_published";
        }
        return object.state.replace('_', ' ');
      }

      function parseAvatar() {
        return './assets/images/organicity-avatar.jpg';
      }

      function parseSensorTime(sensor) {
        /*jshint camelcase: false */
        return moment(sensor.recorded_at).format('');
      }

      function belongsToUser(kitsArray, kitID) {
        
        return kitsArray;
        // return _.some(kitsArray, function(kit) {
        //   return kit.id === kitID;
        // });
      }

      function isOnline(object) {
        var time = this.parseTime(object);
        var timeDifference =  (new Date() - new Date(time))/1000;
        if(!time || timeDifference > 15*60) {
          return false;
        } else {
          return true;
        }
      }
      
      function makeCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
    }
})();
