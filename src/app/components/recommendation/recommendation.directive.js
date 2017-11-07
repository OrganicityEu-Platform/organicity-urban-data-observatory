(function() {
  'use strict';

  angular.module('app.components')
    .directive('recommendation', recommendation);

  function recommendation() {
    return {
      scope: {
        show: '='
      },
      restrict: 'A',
      controller: 'RecommendationController',
      controllerAs: 'vm',
      templateUrl: 'app/components/recommendation/recommendation.html'
    };
  }
})();
