(function() {
  'use strict';

  angular.module('app.components')
    .factory('accountsAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/token'); // This is just an example
      });
    });

})();
