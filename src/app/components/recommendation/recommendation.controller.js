/*jshint sub:true*/
(function() {
  'use strict';

  angular.module('app.components')
    .controller('RecommendationController', RecommendationController);

  RecommendationController.$inject = ['$scope', 'recommender','auth','$http'];

  function RecommendationController($scope, recommender, auth, $http) {

    var vm = this;
    vm.recomendedAssets = [];

    var baseAssetUrl = "https://discovery.organicity.eu/v0/assets/"


    initialize();

    function initialize() {
      // Get the entity data from the parent controller

      var entity = $scope.$parent.vm.entity;

      //TODO: get accessKey from environment variable / config
      
      var user =auth.getCurrentUser();
      //var userId = user.id;
      //for Testing
      var userId = "u1";


      //TODO: handle error properly - placeholder and spinner
      //GET  ACCESSkEY
      
      var accessKey = "532xFqhj89sbCGhlEb8l1Ihmvrs-Y3gfOgR-UvjoRXKWbon5srEm1N2lbcqpXTae"

      recommender.push(entity.id, accessKey,userId).then(function(response) {
        console.log('interaction pushed to recommendation engine');
        
      }, function(err){
        console.log("interaction not pushed to recommendation engine");
        console.log(err);
      });

      $scope.isLoading = true;      
      recommender.get([entity.id], 4).then(function(response) {
        console.log("get recommendations done");
        var itemScores = response.itemScores;

        var assetInfoPromises = []

        //get asset URN
        assetInfoPromises = itemScores.map(function(obj){
          return $http.get(baseAssetUrl+obj.item);
        });



        Promise.all(assetInfoPromises).then(function(response){ 
          response.forEach(function(assetInfo){
            var asset = {
                    'id':assetInfo.id,
                    'name':assetInfo.data.context.name,
                    'service':assetInfo.data.context.service,
                    'position':assetInfo.data.context.position.city+", "+assetInfo.data.context.position.country,
                    'url':assetInfo.config.url
                  };

            vm.recomendedAssets.push(asset);
            
          });
          $scope.isLoading = false; 
        });

        //vm.recomendedAssets = ['Recommended assets 1', 'Recommended assets 2']
      },function(err){
        console.log("get recommendations error");
        console.log(err);
      });



    }


    function getAssetInformation(url){
      
    }
  }
})();
