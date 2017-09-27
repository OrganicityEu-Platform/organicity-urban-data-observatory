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

      //TODO: get the user from auth.
      //TODO: get accessKey from environment variable / config
      console.log('Here is the VM')
      console.log(auth.getCurrentUser());


      //GET PROPER USERID AND ACCESSkEY
      var userId = "u1"
      var accessKey = "532xFqhj89sbCGhlEb8l1Ihmvrs-Y3gfOgR-UvjoRXKWbon5srEm1N2lbcqpXTae"

      //TODO: connect with the proper service functions
      recommender.push(entity.id, accessKey,userId).then(function(response) {
        console.log('interaction pushed to recommendation engine');
        
      }, function(err){
        console.log("interaction not pushed to recommendation engine");
        console.log(err);
      });

      

      recommender.get([entity.id], 4).then(function(response) {
        console.log("get recommendations done");
        var itemScores = response.itemScores;

        var assetInfoPromises = []


        assetInfoPromises = itemScores.map(function(obj){
          return $http.get(baseAssetUrl+obj.item);
        });

        Promise.all(assetInfoPromises).then(response => { 
          console.log(response);
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
