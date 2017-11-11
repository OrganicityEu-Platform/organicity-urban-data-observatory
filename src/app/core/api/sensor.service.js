(function() {
  'use strict';

  angular.module('app.components')
    .factory('sensor', sensor);

    sensor.$inject = ['$http', 'assetsAPI', 'historicalAPI', 'utils', 'sensorUtils'];
    function sensor($http, assetsAPI, historicalAPI, utils, sensorUtils) {

      var service = {
        callAPI: callAPI,
        getSensorsData: getSensorsData
      };
      return service;

      ////////////////

      function callAPI() {
        return assetsAPI.all('attibutes').getList(); // Not implemented
      }

      function getSensorsData(dataSourceURL, deviceID, sensorID, dateFrom, dateTo) {

        // Example url:
        // http://data.organicity.eu/urn:oc:entity:santander:irrigation:fixed:3248/atmosphericPressure/readings

        dateFrom = utils.convertTime(dateFrom, false);  //API wants time with no seconds
        dateTo = utils.convertTime(dateTo, false);      //API wants time with no seconds

        var requestURL = dataSourceURL + deviceID + '/' + sensorID + '/readings';

        requestURL = requestURL.replace(/^http:\/\//i, 'https://'); //Tmp  for old assets

        var request = {
          method: 'GET',
          params: {
                    'from': dateFrom,
                    'to': dateTo
                  },
          url: requestURL
        };

        return $http(request).then(function successCallback(data) {
            return data;
        }, function errorCallback(error) {
            return error;
        });
      }

    }
})();
