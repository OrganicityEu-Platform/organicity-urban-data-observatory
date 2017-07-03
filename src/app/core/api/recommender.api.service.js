(function () {
  'use strict';

  angular.module('app.components')
    .factory('recommenderAPI', function (Restangular) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('https://recommendation.organicity.eu');
      });
    });

})();
