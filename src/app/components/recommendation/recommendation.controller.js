/*jshint sub:true*/
//jshint esnext: true
(function() {
  'use strict';

  angular.module('app.components')
    .controller('RecommendationController', RecommendationController);

  RecommendationController.$inject = ['$scope', 'recommender','auth','$http', 'FullEntity'];

  function RecommendationController($scope, recommender, auth, $http, FullEntity) {

    var vm = this;
    vm.recomendedAssets = [];
    vm.isLoading = true;

    var baseAssetUrl = 'https://discovery.organicity.eu/v0/assets/';

    initialize();

    function initialize() {
      // Get the entity data from the parent controller

      var entity = $scope.$parent.vm.entity;
      var user =auth.getCurrentUser();

      var userId = null;
      if(user!==null && user.data!==null){
        userId = user.data.id;
      }
      
      var accessKey = '532xFqhj89sbCGhlEb8l1Ihmvrs-Y3gfOgR-UvjoRXKWbon5srEm1N2lbcqpXTae';

      recommender.push(entity.id, accessKey,userId).then(function(response) {
        if(response){
          console.log('interaction pushed to recommendation engine');
        }
        
      }, function(err){
        console.log('interaction not pushed to recommendation engine');
        console.log(err);
      });

      recommender.get([entity.id], 4).then(function(response) {

        var itemScores = response.itemScores;

        var assetInfoPromises = [];

        //get asset URN
        assetInfoPromises = itemScores.map(function(obj){
          return $http.get(baseAssetUrl+obj.item);
        });
      
        Promise.all(assetInfoPromises).then(function(response){ 

          response.forEach(function(assetInfo){

            vm.recomendedAssets.push(new FullEntity(assetInfo.data));
            
          });

          vm.isLoading = false;
        });

      },function(err){
        console.log('get recommendations error');
        console.log(err);
        vm.isLoading = false;
      });



    }

  }
})();
