/*jshint sub:true*/
//jshint esnext: true
(function() {
  'use strict';

  angular.module('app.components')
    .controller('RecommendationController', RecommendationController);

  RecommendationController.$inject = ['$scope', 'recommender','auth','$http'];

  function RecommendationController($scope, recommender, auth, $http) {

    var vm = this;
    vm.recomendedAssets = [];

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

      $scope.isLoading = true;      
      recommender.get([entity.id], 4).then(function(response) {
        if(response){
          console.log('get recommendations done');
        }
        var itemScores = response.itemScores;

        var assetInfoPromises = [];

        //get asset URN
        assetInfoPromises = itemScores.map(function(obj){
          return $http.get(baseAssetUrl+obj.item);
        });
      
        Promise.all(assetInfoPromises).then(function(response){ 

        var placeholder = angular.element( document.querySelector( '#placeholder' ) );
        if(assetInfoPromises.length>0){
          placeholder.empty();
          console.log('founds assets');
        }else{
          placeholder.html('No recommendations found for this asset');
        }

          response.forEach(function(assetInfo){
            var asset = {
                    'id':assetInfo.id,
                    'name':assetInfo.data.context.name,
                    'service':assetInfo.data.context.service,
                    'position':assetInfo.data.context.position.city+', '+assetInfo.data.context.position.country,
                    'url':assetInfo.config.url
                  };

            vm.recomendedAssets.push(asset);
            
          });

          $scope.isLoading = false; 
        });

      },function(err){
        console.log('get recommendations error');
        console.log(err);
        $scope.isLoading = false;
      });



    }

  }
})();
