(function() {
  'use strict';

  angular.module('app.components')
    .factory('accountsAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('https://organicity.eu/oauth/authorize/'); // This is just an example
      });
    });
  
})();
