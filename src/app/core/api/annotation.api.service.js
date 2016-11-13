(function () {
  'use strict';

  angular.module('app.components')
    .factory('annotationAPI', function (Restangular) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('http://dev.server.organicity.eu:8084/'); 
      });
    });

})();
