(function() {
  'use strict';

  angular.module('app.components')
    .factory('historicalAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('http://london.site.organicity.eu:8081/api/v1/');
      });
    });

})();
