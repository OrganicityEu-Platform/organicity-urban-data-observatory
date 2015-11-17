(function() {
  'use strict';

  angular.module('app.components')
    .controller('SearchController', SearchController);

    SearchController.$inject = ['$scope', 'search', 'SearchResult', '$location', 'animation', 'SearchResultLocation', 'device', 'kitUtils'];
    function SearchController($scope, search, SearchResult, $location, animation, SearchResultLocation, device, kitUtils) {
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

      function querySearch(query) {

        if(query.length < 3) {
          return [];
        }

        // ga('send', 'event', 'Search Input', 'search', query);

        return device.getAllDevices()
          .then(function(data) {

            if(data.length === 0) {
              //enable scrolling on body if there is no dropdown
              angular.element(document.body).css('overflow', 'auto');
              return data;
            }

            //disable scrolling on body if dropdown is present
            angular.element(document.body).css('overflow', 'hidden');

            return _.chain(data).filter(function(item){ 

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
                  category: "location",
                  match: item.provider.location.city
                },
                {
                  category: "location",
                  match: item.provider.location.country
                }
                ];

                _.each(keysToSearch, function(keyToSearch){
                  if (keyToSearch.scope && _.isArray(keyToSearch.scope)) {
                     _.each(keyToSearch.scope, function(elementToSearch){
                        if(elementToSearch[keyToSearch.match]){
                          var keyMatches = elementToSearch[keyToSearch.match].match(query);
                          if(keyMatches && keyMatches.length > 0) {
                            matches.push(keyMatches);
                            item.searchMatches.push(keyToSearch.category);
                          } 
                        }
                     });
                  } else {
                    var keyMatches = keyToSearch.match.match(query);
                    if(keyMatches && keyMatches.length > 0) {
                      matches.push(keyMatches);
                      item.searchMatches.push(keyToSearch.category);
                    } 
                  }
                });
                if (matches.length > 0) console.log(matches); //debug
                return (matches.length > 0) ? true : false ;

              }).map(function(object) {
                  return new SearchResultLocation(object);
              }).sortBy(function(result){
                var d = new Date(result.lastUpdated);
                return -d.getTime();
              }).tap(function(data){
                if(data.length === 0) {
                  angular.element(document.body).css('overflow', 'auto');
                }
              }).slice(0, 15).value(); //tmp. limit 10 results


          });
      }
    }
})();
