(function() {
  'use strict';

  angular.module('app.components')
    .controller('AnnotationController', AnnotationController);

  AnnotationController.$inject = ['$scope', '$mdDialog','annotation'];
  function AnnotationController($scope, $mdDialog, annotation) {

    var vm = this;

    initialize();

    function initialize() {
      // Get the entity data from the parent controller

      var entity = $scope.$parent.vm.entity;

      var entityProcessed = getAssetAnnotation(entity);

      function getAssetAnnotation(entity){
        annotation.getAssetAnnotations(entity.id).then(
          function (response) {

            vm.annotation = {};
            var tags = [];
            var filters = [];

            angular.forEach(response, function(value, key){

              var splitName = value["tagUrn"].split(":")
              annotation.getTag(value["tagUrn"]).then(function(result) {
                var tag = {
                  "name": splitName.slice(4).join(" "),
                  "tooltip":  result.name
                }
                tags.push(tag)

              })

              filters = filterUsers(value["user"]);
            });

            vm.annotation.tags = tags;

            vm.annotation.filters = filters;


          })

        return entityProcessed;
      }


    }

    function filterUsers(username) {
      var users = [];
      var distinctUser = {};
      if(username == "jamaica" ){
        distinctUser = {
          "id": 0,
          "name" : "Automated"
        };
      }else{
        distinctUser =  {
          "id": 1,
          "name" : "Experimenters"
        };
      }
      if (users.indexOf(distinctUser) == -1) {
        users.push(distinctUser);
      }

      return users;
    }
    /* vm.annotation = {
     tags: [{
     name: "Rainy",
     tooltip: "Hello2"
     },
     {
     name: "Calm",
     tooltip: "Hello3"
     },
     {
     name: "Detail",
     tooltip: "Hello3"
     },
     {
     name: "Tomorrow",
     tooltip: "Hello3"
     },
     {
     name: "Again",
     tooltip: "Hello3"
     },
     {
     name: "None",
     tooltip: "Hello3"
     }],
     filters: [{
     id: 20,
     name: "Experimenters"
     },
     {
     id: 22,
     name: "Automated"
     }]
     }
     */

  }
})();
