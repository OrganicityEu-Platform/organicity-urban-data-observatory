(function(){
  'use strict';

  angular.module('app.components')
    .directive('urn', urn);

  function urn(){
    return {
      scope: {
        urn: '=urn'
      },
      restrict: 'A',
      controller: 'UrnController',
      controllerAs: 'vm',
      templateUrl: 'app/components/urn/urn.html'
    };
  }
})();
