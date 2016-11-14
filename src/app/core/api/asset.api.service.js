(function () {
  'use strict';

  angular.module('app.components')
    .factory('assetsAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
      		RestangularConfigurer.setBaseUrl('https://discovery.organicity.eu/v0'); //http://discovery.organicity.eu/v0
        });
    });

})();
