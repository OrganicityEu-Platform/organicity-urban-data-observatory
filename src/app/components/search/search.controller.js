(function() {
  'use strict';

  angular.module('app.components')
    .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'search', 'SearchResult', '$location', 'animation', 'SearchResultLocation', 'asset', 'entityUtils', '$http', '$q'];
    function SearchController($scope, search, SearchResult, $location, animation, SearchResultLocation, asset, entityUtils, $http, $q) {
      var vm = this;

      vm.searchTextChange = searchTextChange;
      vm.selectedItemChange = selectedItemChange;
      vm.querySearch = querySearch;

      vm.isIconWhite = true;

      $scope.$on('removeNav', function() {
        $scope.$apply(function() {
          vm.isIconWhite = false;
        });
      });

      $scope.$on('addNav', function() {
        $scope.$apply(function() {
          vm.isIconWhite = true;
        });
      });

      ///////////////////

      function searchTextChange() {
      }

      function selectedItemChange(result) {
          if(result.type !== 'location'){
            $location.path('/assets/' + result.id);
          } else {
            animation.goToLocation({lat: result.lat, lng: result.lng, type: result.type});
          }
      }

      function querySearch(query) {
        return $q.all([getMetadata(query), getPlacesGoogle(query)])
          .then(function(data) {

            if(data.length === 0) {
              //enable scrolling on body if there is no dropdown
              angular.element(document.body).css('overflow', 'auto');
              return data;
            }

            //disable scrolling on body if dropdown is present
            angular.element(document.body).css('overflow', 'hidden');

            return joinSearches(data);

          });
      }

     function getMetadata(keywords){
          keywords = keywords.replace(' ', '+');
          return asset.getMetadata(keywords);
      }

      function getPlacesGoogle(location){
        // Before, we sent the 'search string' to 2 different functions, which queried an API
        // Using Places API, the library itself wants to watch over the input.
        location = location.replace(/\s+/g, '+');
        console.log(location)

        var options = { };

        var input = document.getElementById('autocom'); // This is an extra input, which needs to be removed
        // Autocomplete wants the input element as the first argument.
        // in search/search.html, we need to add an ID to the md-autocomplete with 'md-input-it'
        // But it does not work!
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        console.log(autocomplete)
        console.log(autocomplete.getPlace())
      }

      function getPlacesMapzen(location){
          location = location.replace(' ', '+');
          return $http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCMUbKxhE3BWLRClSC6lxcWHMgXr7BB-J4&input='+ location);
      }

      function filterPlaces(places){
        if (!places ||  !places.data || places.data.features.length === 0){ return [];}
        places = places.data.features.slice(0, 3); //just first 5 results
        return _.map(places, getMapzenPlaceReadyForModel);
      }

      function filterEntities(assets){
        if (!assets || assets.length === 0){ return [];}
        return _.map(assets, getMetadataReadyForModel);
      }

      function getMapzenPlaceReadyForModel(place){
        var searchResult = {
          type: 'location',
          name: place.properties.label,
          longitude: place.geometry.coordinates[0],
          latitude: place.geometry.coordinates[1]
        };
        return new SearchResultLocation(searchResult);
      }

      function getMetadataReadyForModel(asset){
        return new SearchResult(asset);
      }

      function joinSearches(data){
        var e = filterEntities(data[0]);
        var p = filterPlaces(data[1]);
        return p.concat(e);
      }

    }
})();
