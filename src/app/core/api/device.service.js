(function() {
	'use strict';

	angular.module('app.components')
	  .factory('device', device);
    
    device.$inject = ['Restangular', '$window', 'timeUtils'];
	  function device(Restangular, $window, timeUtils) {
      var genericKitData, worldMarkers;

      initialize();

      // callGenericKitData()
      //   .then(function(data) {
          genericKitData = [];
          // genericKitData = _.indexBy(data, 'id'); //temp. disable for test
        // });

	  	var service = {
        getDevices: getDevices,
        getAllDevices: getAllDevices,
        getDevice: getDevice,
        createDevice: createDevice,
        updateDevice: updateDevice,
        getGenericKitData: getGenericKitData,
        getWorldMarkers: getWorldMarkers,
        setWorldMarkers: setWorldMarkers
	  	};

	  	return service;

	  	//////////////////////////

      function initialize() {
        if(areMarkersOld()) {
          console.log("Markers expired");
          removeMarkers();
        }
      }
      
      function getDevices(location) {
      	var parameter = '';
      	parameter += location.lat + ',' + location.lng;
      	return Restangular.all('entities').getList({near: parameter, 'per_page': '100'});
      }

      function getAllDevices() {
        return Restangular.all('entities').getList(); 
      }

      function getDevice(id) {
        return Restangular.all('entities').getList().then(function(response){

        self.resources = response;
        self.resources.resourceState.resourceTypes = $filter('castToArray')(response.resourceState.resourceTypes);

        return self.resources;
        });

        //return Restangular.one('entities', id).get();
      }

      function createDevice(data) {
        return Restangular.all('entities').post(data);
      }

      function updateDevice(id, data) {
        return Restangular.one('entities', id).patch(data);
      }

      function callGenericKitData() {
        return Restangular.all('kits').getList();
      }

      function getGenericKitData() {
        return genericKitData;
      }

      function getWorldMarkers() {
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

      function getTimeStamp() {
        return ($window.localStorage.getItem('organicity.markers') && JSON.parse($window.localStorage.getItem('organicity.markers') ).timestamp); 
      }

      function areMarkersOld() {
        var markersDate = getTimeStamp();  
        return !timeUtils.isWithin(10, 'seconds', markersDate);
      }

      function removeMarkers() {
        $window.localStorage.removeItem('organicity.markers');
      }
	  }
})();
