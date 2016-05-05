(function() {
  'use strict';

  angular.module('app.components')
    .factory('entitiesAPI', function(Restangular) {
      return Restangular.withConfig(function(RestangularConfigurer) {
      		//RestangularConfigurer.setBaseUrl('http://127.0.0.1:3000'); //Dev cache
      		//RestangularConfigurer.setBaseUrl('http://ec2-54-68-181-32.us-west-2.compute.amazonaws.com:8090/v1');
      		RestangularConfigurer.setBaseUrl('https://organicityassetsdiscovery-fpgpcgrrbc.now.sh/'); //Temp 30sec cached for speed
        });
    });
  
})();
