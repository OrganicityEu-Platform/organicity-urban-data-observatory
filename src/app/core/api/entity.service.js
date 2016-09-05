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
				getClusterGeoJSON: getClusterGeoJSON,
        getGeoJSON: getGeoJSON
	  	};

	  	return service;

	  	//////////////////////////

      function initialize() {
        if(areMarkersOld()) {
          console.log('Data expired: Refreshing markers');
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
        //   console.log('Data is cached: Entities are less than 60sec old.');
        //   var deferred = $q.defer();
        //   deferred.resolve(entities || ($window.localStorage.getItem('organicity.entities') && JSON.parse($window.localStorage.getItem('organicity.entities') ).data));
        //   return deferred.promise;
        // } else {
          console.log('Data expired: Refreshing entities');
          // setPrevAllEntities();
          return entitiesAPI.all('assets/lightweight').getOne({'page': 'all', 'per': 'all'});
          //.then(function(data) {
            // setAllEntities(data);
            //return data;
          //});
        // }
      }

			function getGeoJSON(params) {
				var endpoint = 'assets/geo/search';
				return  entitiesAPI.one(endpoint).get(params);

			}

      function getClusterGeoJSON() {
          console.log('Get ClusterGeoJSON');

					var devices = [];

					var locations = [
						['43.45487000', '-3.81289000', 'Santander'],  			// Santander
						['51.50722200', '-0.12750000', 'London'],						// London
						['56.15720000', '10.21070000', 'Aarhus'], 						// Aarhus
						['38.25000000', '21.73333300', 'Patras'], 						// Patras
					];

					for(var i = 0; i < 4; i++) {
						var endpoint = 'assets/geo/zoom/1';
						var params = {lat: locations[i][0],  long: locations[i][1]};

				    var devs = entitiesAPI.one(endpoint).get(params);
						devices.push(devs);
					}

					var data = $q.all(devices).then(function(devices) {
						return '{ "type": "FeatureCollection", "properties": { "name": "urn:oc:entitytype:clusters" }, "features": [' + getGeoDevices(devices) + ']}';
					});
					return data;
      }

			function getGeoDevices(devices) {
				return devices.map(getGeoData);
			}

			function getGeoData(elem) {
				return '{ "type": "' + elem.type + '", "geometry":' + JSON.stringify(elem.geometry) + ', "properties":' + JSON.stringify(elem.properties) + '}';
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
        console.log('Data is cached: Markers are less than 60sec old.');
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
