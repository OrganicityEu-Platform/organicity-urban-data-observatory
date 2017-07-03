/*jshint sub:true*/
(function () {
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
      var user = ""
      

      //TODO: connect with the proper service functions

      // recommender.push(entity.id, user).then(function (response) {

      // });

      // recommender.get(entity.id, user).then(function (response) {
      //   vm.recomendedAssets = ['Recommended assets 1', 'Recommended assets 2']
      // });
       
      
    }

  }
})();
