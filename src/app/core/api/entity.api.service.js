(function () {
  'use strict';

  angular.module('app.components')
    .factory('entitiesAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
      		//RestangularConfigurer.setBaseUrl('http://127.0.0.1:3000'); //Dev cache
      		RestangularConfigurer.setBaseUrl('http://api.discovery.organicity.eu/v0/');
      		//RestangularConfigurer.setBaseUrl('https://organicityassetsdiscovery-fpgpcgrrbc.now.sh/'); //Temp 30sec cached for speed
        });
    });

})();
