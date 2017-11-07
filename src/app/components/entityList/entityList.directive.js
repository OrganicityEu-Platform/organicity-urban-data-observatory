(function(){
  'use strict';
  angular.module('app.components')
    .directive('entityList',entityList);

  function entityList(){
    return{
      restrict:'E',
      scope:{
        entities:'=entities',
        actions: '=actions'
      },
      controllerAs:'vm',
      templateUrl:'app/components/entityList/entityList.html'
    };
  }
})();