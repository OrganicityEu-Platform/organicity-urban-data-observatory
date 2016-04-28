(function() {
	'use strict';

	angular.module('app.components')
	  .factory('device', device);
    
    device.$inject = ['entitiesAPI', '$window', 'timeUtils', '$filter', '$q'];
	  function device(entitiesAPI, $window, timeUtils, $filter, $q) {
      var worldMarkers, entities, entitiesPrevious;

      initialize();

	  	var service = {
        getDevices: getDevices,
        getAllDevices: getAllDevices,
        setAllDevices : setAllDevices,
        getDevice: getDevice,
        createDevice: createDevice,
        updateDevice: updateDevice,
        getWorldMarkers: getWorldMarkers,
        setWorldMarkers: setWorldMarkers
	  	};

	  	return service;

	  	//////////////////////////

      function initialize() {
        if(areMarkersOld()) {
          console.log("Data expired: Refreshing markers");
          removeMarkers();
        }
      }
      
      function getDevices(location) {
      	var parameter = '';
      	parameter += location.lat + ',' + location.lng;
      	return entitiesAPI.all('entities').getList({near: parameter, 'per_page': '100'});
      }

      function setAllDevices(data) {        
        var obj = {
          timestamp: new Date(),
          data: data
        };
        removeEntitiesMarkers();
        $window.localStorage.setItem('organicity.entities', JSON.stringify(obj));
        entities = obj.data; 
      }

      function setPrevAllDevices() {
        entitiesPrevious = entities; 
      }

      function getPrevAllDevices() {
        var deferred = $q.defer();
        deferred.resolve(entitiesPrevious);
        return deferred.promise;
      }

      function getAllDevices() {
        if (!areEntitiesMarkersOld()) {
          console.log("Data is cached: Entities are less than 60sec old.");
          var deferred = $q.defer();
          deferred.resolve(entities || ($window.localStorage.getItem('organicity.entities') && JSON.parse($window.localStorage.getItem('organicity.entities') ).data));
          return deferred.promise;
        } else {
          console.log("Data expired: Refreshing entities");
          setPrevAllDevices();
          return entitiesAPI.all('entities').getList().then(function(data) {
            setAllDevices(data)
            return data;
          });
        }
      }

      function getDevice(id) {
        return getAllDevices().then(function(entities){
          return _.find(entities, function(entity) {
             return entity.id == id;
          }); 
        });
      }

      function createDevice(data) {
        return entitiesAPI.all('entities').post(data);
      }

      function updateDevice(id, data) {
        return entitiesAPI.one('entities', id).patch(data);
      }

      function getWorldMarkers() {
        console.log("Data is cached: Markers are less than 60sec old.");
        return worldMarkers || ($window.localStorage.getItem('organicity.markers') && JSON.parse($window.localStorage.getItem('organicity.markers') ).data);
      }

      function setWorldMarkers(data) {
        var obj = {
          timestamp: new Date(),
          data: data
        };

        $window.localStorage.setItem('organicity.markers', JSON.stringify(obj) );
        worldMarkers = obj.data; 
      }

      function getEntitiesTimeStamp() {
        return ($window.localStorage.getItem('organicity.entities') && JSON.parse($window.localStorage.getItem('organicity.entities') ).timestamp); 
      }

      function areEntitiesMarkersOld() {
        var markersDate = getEntitiesTimeStamp();  
        return !timeUtils.isWithin(60, 'seconds', markersDate);
      }

      function removeEntitiesMarkers() {
        $window.localStorage.removeItem('organicity.entities');
      }

      function getTimeStamp() {
        return ($window.localStorage.getItem('organicity.markers') && JSON.parse($window.localStorage.getItem('organicity.markers') ).timestamp); 
      }

      function areMarkersOld() {
        var markersDate = getTimeStamp();  
        return !timeUtils.isWithin(60, 'seconds', markersDate);
      }

      function removeMarkers() {
        $window.localStorage.removeItem('organicity.markers');
      }
	  }
})();
