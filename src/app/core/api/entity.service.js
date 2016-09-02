(function() {
	'use strict';

	angular.module('app.components')
	  .factory('entity', entity);

    entity.$inject = ['entitiesAPI', '$window', 'timeUtils', '$filter', '$q'];
	  function entity(entitiesAPI, $window, timeUtils, $filter, $q) {

      var worldMarkers, entities, entitiesPrevious;

      initialize();

	  	var service = {
        getAllEntities: getAllEntities,
        setAllEntities : setAllEntities,
        getEntity: getEntity,
        createEntity: createEntity,
        updateEntity: updateEntity,
        getWorldMarkers: getWorldMarkers,
        setWorldMarkers: setWorldMarkers,
        getGeoJSON: getGeoJSON
	  	};

	  	return service;

	  	//////////////////////////

      function initialize() {
        if(areMarkersOld()) {
          console.log("Data expired: Refreshing markers");
          removeMarkers();
        }
      }


      function setAllEntities(data) {
        var obj = {
          timestamp: new Date(),
          data: data
        };
        removeEntitiesMarkers();
        $window.localStorage.setItem('organicity.entities', JSON.stringify(obj));
        entities = obj.data;
      }

      function setPrevAllEntities() {
        entitiesPrevious = entities;
      }

      function getPrevAllEntities() {
        var deferred = $q.defer();
        deferred.resolve(entitiesPrevious);
        return deferred.promise;
      }

      function getAllEntities() {
        // if (!areEntitiesMarkersOld()) {
        //   console.log("Data is cached: Entities are less than 60sec old.");
        //   var deferred = $q.defer();
        //   deferred.resolve(entities || ($window.localStorage.getItem('organicity.entities') && JSON.parse($window.localStorage.getItem('organicity.entities') ).data));
        //   return deferred.promise;
        // } else {
          console.log("Data expired: Refreshing entities");
          // setPrevAllEntities();
          return entitiesAPI.all('assets/lightweight').getOne({'page': 'all', 'per': 'all'});
          //.then(function(data) {
            // setAllEntities(data);
            //return data;
          //});
        // }
      }

      function getGeoJSON() {
        // if (!areEntitiesMarkersOld()) {
        //   console.log("Data is cached: Entities are less than 60sec old.");
        //   var deferred = $q.defer();
        //   deferred.resolve(entities || ($window.localStorage.getItem('organicity.entities') && JSON.parse($window.localStorage.getItem('organicity.entities') ).data));
        //   return deferred.promise;
        // } else {
          console.log("Data expired: Refreshing entities");
          // setPrevAllEntities();
          return entitiesAPI.one('assets/geo').get({'page': 'all', 'per': 'all'});
          //.then(function(data) {
            // setAllEntities(data);
            //return data;
          //});
        // }
      }


      function getEntitiesMarkers(location) {
        var parameter = '';
        parameter += location.lat + ',' + location.lng;
        return entitiesAPI.all('assets').getList({'page': '1', 'per': '100'});
      }

      function getEntity(id) {
        return entitiesAPI.one('assets').getList({'urn': id});
      }

      function createEntity(data) {
        return entitiesAPI.all('assets').post(data);
      }

      function updateEntity(id, data) {
        return entitiesAPI.one('assets', id).patch(data);
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
