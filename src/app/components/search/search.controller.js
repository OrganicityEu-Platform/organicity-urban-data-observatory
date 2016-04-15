(function() {
  'use strict';

  angular.module('app.components')
    .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'search', 'SearchResult', '$location', 'animation', 'SearchResultLocation', 'device', 'kitUtils', '$http', '$q'];
    function SearchController($scope, search, SearchResult, $location, animation, SearchResultLocation, device, kitUtils, $http, $q) {
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
          if(result.type !== "location"){
            $location.path('/resources/' + result.id);
          } else {
            animation.goToLocation({lat: result.lat, lng: result.lng, type: result.type});
          }
      }

      // WARNING: All the code below is a temporary "quick code" for demo!


      function querySearch(query) {

        if(query.length < 3) {
          return [];
        }

        return $q.all([device.getAllDevices(), getPlacesMapzen(query)])
          .then(function(data) {

            if(data.length === 0) {
              //enable scrolling on body if there is no dropdown
              angular.element(document.body).css('overflow', 'auto');
              return data;
            }

            //disable scrolling on body if dropdown is present
            angular.element(document.body).css('overflow', 'hidden');

            return joinSearches(data, query); //tmp. limit 10 results

          });
      }

     function getMapboxPlaces(location){
          location = location.replace(" ", "+");
          return $http.get('https://api.mapbox.com/geocoding/v5/mapbox.places/'+ location + '.json?access_token=pk.eyJ1IjoidG9tYXNkaWV6IiwiYSI6ImNpaDN5aXlzZDAwdG9ybGx5ajB4bjBob2gifQ.tG2iuCSdCelgkoSy6pEvaA');
      }

      function getPlacesMapzen(location){
          location = location.replace(" ", "+");
          return $http.get('http://search.mapzen.com/v1/autocomplete?api_key=search-h8Qe8fY&text='+ location);
      }

      function filterPlaces(places){
        if (!places ||  !places.data || places.data.features.length === 0) return [];
        places = places.data.features.slice(0, 3); //just first 5 results
        return _.map(places, getMapzenPlaceReadyForModel);
      }

      function getMapboxPlaceReadyForModel(place){
        var searchResult = {}
        searchResult.type = "location";
        searchResult.name = place.place_name;
        searchResult.data = {
          location: {
            longitude: place.geometry.coordinates[0],
            latitude: place.geometry.coordinates[1]
          } 
        };
        return new SearchResultLocation(searchResult);
      }

      function getMapzenPlaceReadyForModel(place){
        var searchResult = {
          type: "location",
          name: place.properties.label,
          data: {
            location: {
              longitude: place.geometry.coordinates[0],
              latitude: place.geometry.coordinates[1]
            } 
        }
        }
        return new SearchResultLocation(searchResult);
      }

      function filterEntities(query, entities){
        return _.chain(entities).filter(function(item){ 

                item.searchMatches = [];

                var search = new RegExp(query, "gi")

                var matches = [];

                item.labels = kitUtils.parseLabels(item).join(" ");

                var keysToSearch = [
                {
                  category: "name",
                  match: item.labels
                },
                {
                  category: "name",
                  scope: item.data.attributes,
                  match: "name"
                },
                {
                  category: "name",
                  scope: item.data.attributes,
                  match: "unit"
                }];

                _.each(keysToSearch, function(keyToSearch){
                  if (keyToSearch.scope && _.isArray(keyToSearch.scope)) {
                     _.each(keyToSearch.scope, function(elementToSearch){
                        if(elementToSearch[keyToSearch.match]){
                          if(elementToSearch[keyToSearch.match].toLowerCase().indexOf(query.toLowerCase()) > -1) {
                            matches.push(elementToSearch);
                            item.searchMatches.push(keyToSearch.category);
                          } 
                        }
                     });
                  } else {
                    if(keyToSearch.match.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                      matches.push(keysToSearch);
                      item.searchMatches.push(keyToSearch.category);
                    } 
                  }
                });
                return (matches.length > 0) ? true : false;

              }).map(function(object) {
                  object.type = "name"; //tmp hack!
                  return new SearchResultLocation(object);
              }).sortBy(function(result){
                var d = new Date(result.lastUpdated);
                return -d.getTime();
              }).tap(function(data){
                if(data.length === 0) {
                  angular.element(document.body).css('overflow', 'auto');
                }
              }).slice(0, 10).value() //tmp. reduce to 10 results.
      }

      function joinSearches(data, query){
        var e = filterEntities(query, data[0]);
        var p = filterPlaces(data[1]);
        return p.concat(e);;
      }

    }
})();
