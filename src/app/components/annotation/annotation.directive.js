(function() {
  'use strict';

    angular.module('app.components')
      .directive('annotation', annotation);

    function annotation() {
      return {
        scope: {
          show: '='
        },
        restrict: 'A',
        controller: 'AnnotationController',
        controllerAs: 'vm',
        templateUrl: 'app/components/annotation/annotation.html'
      };
    }
})();
