(function() {
  'use strict';

  angular.module('app.components')
    .factory('HistoricalAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('http://explorer-api.organicity.smartcitizen.me:8080/api/v1');
      });
    });
  
})();
