(function() { 
  'use strict';

  angular.module('app.components')
    .factory('search', search);
    
    search.$inject = ['$http', 'entitiesAPI'];
    function search($http, entitiesAPI) {
      var service = {
        globalSearch: globalSearch
      };

      return service;

      /////////////////////////

      function globalSearch(query) {
    	  return entitiesAPI.all('search').getList({q: query});
      }
    }
})();
