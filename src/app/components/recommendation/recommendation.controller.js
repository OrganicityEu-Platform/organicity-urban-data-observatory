/*jshint sub:true*/
//jshint esnext: true
(function() {
  'use strict';

  angular.module('app.components')
    .controller('RecommendationController', RecommendationController);

  RecommendationController.$inject = ['$scope', 'recommender','auth', 'asset', 'FullEntity'];

  function RecommendationController($scope, recommender, auth, asset, FullEntity) {

    var vm = this;
    vm.recomendedAssets = [];
    vm.isLoading = true;

    initialize();

    function initialize() {
      // Get the entity data from the parent controller

      var entity = $scope.$parent.vm.entity;
      var user = auth.getCurrentUser();

      var userId = null;

      if(user !== null && user.data !== null){
        userId = user.data.id;
      }

      var accessKey = '532xFqhj89sbCGhlEb8l1Ihmvrs-Y3gfOgR-UvjoRXKWbon5srEm1N2lbcqpXTae';

      recommender.push(entity.id, accessKey,userId).then(function(response) {
        if(response){
          console.log('interaction pushed to recommendation engine');
        }

      }, function(err){
        console.log(err, 'interaction not pushed to recommendation engine');
      });

      recommender.get([entity.id], 2).then(function(response) {

        var itemScores = response.itemScores;
        var assetInfoPromises = [];
        //get asset URN
        assetInfoPromises = itemScores.map(function(obj){
          return asset.getAsset(obj.item);
        });

        Promise.all(assetInfoPromises).then(function(response){

          response.forEach(function(assetInfo){
            vm.recomendedAssets.push(new FullEntity(assetInfo));
          });

          vm.isLoading = false;

        },function(err){
          console.log('get recommended assets error');
          console.error(err);
      });

      },function(err){
        console.log('get recommendations error');
        console.error(err);
        vm.isLoading = false;
      });



    }

  }
})();
