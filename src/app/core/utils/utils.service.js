(function() {
  'use strict';

  angular.module('app.components')
    .factory('utils', utils);

    utils.$inject = ['device', 'Previewentity', '$q'];
    function utils(device, Previewentity, $q) {
      var service = {
        parseentity: parseentity,
        parseentityTime: parseentityTime,
        parseSensorTime: parseSensorTime,
        convertTime: convertTime,
        getOwnerentitites: getOwnerentitites
      };
      return service;

      ///////////////////////////

      function parseentity(object) {
        var parsedentity = {
          entityName: object.device.name,
          entityType: parseentityType(object),  
          entityLastTime: moment(parseentityTime(object)).fromNow(), 
          entityLocation: parseentityLocation(object), 
          entityLabels: parseentityLabels(object),
          entityClass: classify(parseentityType(object))      
        };
        return parsedentity;
      }

      function parseentityLocation(object) {
        var location = '';
        
        var city = object.data.location.city;
        var country = object.data.location.country;

        if(!!city) {
          location += city;
        }
        if(!!country) {
          location += ', ' + country;
        }

        return location;
      }

      function parseentityLabels(object) {
        return {
          status: object.status,
          exposure: object.data.location.exposure
        };
      }

      function parseentityType(object) {
        var entityType; 

        entityType = 'Unknown entity';
        
        return entityType; 
      }

      function classify(entityType) {
        if(!entityType) {
          return '';
        }
        return entityType.toLowerCase().split(' ').join('_');
      }

      function parseentityTime(object) {
        /*jshint camelcase: false */
        return object.updated_at;
      }

      function parseSensorTime(sensor) {
        /*jshint camelcase: false */
        return moment(sensor.recorded_at).format('');
      }

      function convertTime(time, withSeconds) {
        if(withSeconds) {
          return moment(time).format('YYYY-MM-DDThh:mm:ss') + 'Z';
        } else {
          return moment(time).format('YYYY-MM-DDThh:mm') + 'Z';
        }
      }

      function getOwnerentitites(ids) {
        var deferred = $q.defer();
        var entititesResolved = 0;
        var entitites = [];

        ids.forEach(function(id, index) {
          device.getDevice(id)
            .then(function(data) {
              entitites[index] = new Previewentity(data);
              entititesResolved++;

              if(ids.length === entititesResolved) {
                deferred.resolve(entitites);
              }
            });
        });
        return deferred.promise;
      }
    }
})();
