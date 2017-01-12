(function() {
  'use strict';

  angular.module('app.components')
    .controller('AnnotationController', AnnotationController);

  AnnotationController.$inject = ['$scope', '$mdDialog'];
  function AnnotationController($scope, $mdDialog) {
    var vm = this;

    vm.annotation = {
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


  }
})();
