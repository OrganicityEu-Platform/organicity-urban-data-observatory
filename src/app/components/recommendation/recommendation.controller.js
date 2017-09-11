/*jshint sub:true*/
(function() {
  'use strict';

  angular.module('app.components')
    .controller('RecommendationController', RecommendationController);

  RecommendationController.$inject = ['$scope', 'recommender'];

  function RecommendationController($scope, recommender) {

    var vm = this;
    vm.recomendedAssets = [];

    initialize();

    function initialize() {
      // Get the entity data from the parent controller

      var entity = $scope.$parent.vm.entity;

      //TODO: get the user from auth.
      //TODO: get accessKey from environment variable / config
      console.log('Here is the VM')
      console.log(vm);
      console.log($scope);
      console.log(recommender);
      var userId = ""
      var accessKey = "532xFqhj89sbCGhlEb8l1Ihmvrs-Y3gfOgR-UvjoRXKWbon5srEm1N2lbcqpXTae"

      //TODO: connect with the proper service functions
      recommender.push(entity.id, accessKey).then(function(response) {
        console.log('PUSH DONE')
        console.log(response)
      });

      recommender.get(entity.id, accessKey).then(function(response) {
        vm.recomendedAssets = ['Recommended assets 1', 'Recommended assets 2']
      });
    }
  }
})();
