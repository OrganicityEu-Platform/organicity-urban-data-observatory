(function() {
  'use strict';

  angular.module('app.components')
    .factory('sensor', sensor);

    sensor.$inject = ['$http', 'assetsAPI', 'historicalAPI', 'utils', 'sensorUtils'];
    function sensor($http, assetsAPI, historicalAPI, utils, sensorUtils) {

      var service = {
        callAPI: callAPI,
        getSensorsDataNew: getSensorsDataNew
      };
      return service;

      ////////////////

      function callAPI() {
        return assetsAPI.all('attibutes').getList(); // Not implemented
      }

      function getSensorsDataNew(deviceID, sensorID, dateFrom, dateTo) {
        var ignoreData = [
          'urn_oc_attributeType_datasource',
          'geo_point',
          'urn_oc_attributeType_description',
          'urn_oc_attributeType_reputation',          
        ]
        if (ignoreData.indexOf(sensorID) > -1) {
          return;
        }
        else {
          
          // This is for tests purposes:

          dateFrom = utils.convertTime(dateFrom, false);  //API wants time with no seconds
          dateTo = utils.convertTime(dateTo, false);      //API wants time with no seconds
          sensorID = sensorID.replace(/_/g, ":");
          return $http({
            method: 'GET',
            params: {
                      'from': dateFrom,
                      'to': dateTo,
                      'attribute_id': sensorID,
                    },
            //url: 'http://dev.server.organicity.eu:12345/api/v1/entities/' + deviceID + '/readings'
            url: 'http://api.smartphone-experimentation.eu/v1/entities/' + deviceID + '/readings'
            
          }).then(function successCallback(data) {
              return data;
          }, function errorCallback(error) {
              return error;
          });
        }
      }
    }
})();
