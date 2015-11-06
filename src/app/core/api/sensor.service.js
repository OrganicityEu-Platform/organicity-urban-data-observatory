(function() {
  'use strict';

  angular.module('app.components')
    .factory('sensor', sensor);

    sensor.$inject = ['Restangular', 'HistoricalAPI', 'utils', 'sensorUtils'];
    function sensor(Restangular, HistoricalAPI, utils, sensorUtils) {
      // var sensorTypes;
      // callAPI().then(function(data) { //temp. disable for test
        setTypes([]);
      // });

      var service = {
        callAPI: callAPI,
        setTypes: setTypes,
        getTypes: getTypes,
        getSensorsDataNew: getSensorsDataNew
      };
      return service;

      ////////////////

      function callAPI() {
        return Restangular.all('sensors').getList();
      }

      function setTypes(sensorTypes) {
        sensorTypes = sensorTypes;
      }

      function getTypes() {
        return sensorTypes;
      }

      function getSensorsDataNew(deviceID, sensorID, dateFrom, dateTo) {
        var rollup = sensorUtils.getRollup(dateFrom, dateTo);
        dateFrom = utils.convertTime(dateFrom, false);  //API wants time with no seconds
        dateTo = utils.convertTime(dateTo, false);      //API wants time with no seconds
        sensorID = sensorID.replace(/_/g, ":");

        return HistoricalAPI.one('entities', deviceID).customGET('readings', {'from': dateFrom, 'to': dateTo, 'rollup': rollup, 'attribute_id': sensorID, 'all_intervals': true, 'function': 'avg'});
      }
    }
})();
