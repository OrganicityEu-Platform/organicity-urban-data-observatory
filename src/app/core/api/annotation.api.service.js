(function () {
  'use strict';

  angular.module('app.components')
    .factory('annotationAPI', function (Restangular) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('https://annotations.organicity.eu/');
      });
    });

})();
