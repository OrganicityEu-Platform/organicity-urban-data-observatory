(function() {
  'use strict';

  angular.module('app.components')
    .factory('mapUtils', mapUtils);

    mapUtils.$inject = [];
    function mapUtils() {
      var service = {
        getDefaultFilters: getDefaultFilters,
        setDefaultFilters: setDefaultFilters,
        canFilterBeRemoved: canFilterBeRemoved
      };
      return service;

      //////////////

      function getDefaultFilters(filterData, defaultFilters) {
        var obj = {};
        if(!filterData.online && !filterData.offline) {
          obj[defaultFilters.status] = true;            
        } 
        return obj;
      }

      function setDefaultFilters(filterData, defaultFilters) {
        var obj = {};
        if(!filterData.online || !filterData.offline) {
          obj.status = filterData.online ? 'online' : 'offline';
        }
        return obj;
      }

      function canFilterBeRemoved(filterData, filterName) {
        if(filterName === 'online' || filterName === 'offline') {
          return filterData.online && filterData.offline;
        }
      }
    }
})();
