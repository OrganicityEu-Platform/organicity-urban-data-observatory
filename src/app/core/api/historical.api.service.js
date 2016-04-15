(function() {
  'use strict';

  angular.module('app.components')
    .factory('HistoricalAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('http://ec2-54-68-181-32.us-west-2.compute.amazonaws.com:12345/api/v1');
      });
    });
  
})();
