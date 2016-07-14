(function() {
  'use strict';

  angular.module('app.components')
    .factory('entitiesAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
      		RestangularConfigurer.setBaseUrl('http://discovery.organicity.eu/v0');
        });
    });

})();
