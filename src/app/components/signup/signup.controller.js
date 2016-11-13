(function() {
  'use strict';

  angular.module('app.components')
    .controller('SignupController', SignupController);
    
    SignupController.$inject = ['$scope', '$mdDialog', 'auth'];
    function SignupController($scope, $mdDialog, auth) {
      var vm = this;

      vm.showSignup = showLogin;

      $scope.$on('showLogin', function() {
        showLogin();
      });

      ////////////////

      function showLogin() {
        auth.login();
      }

      function getToken() {
        auth.getToken();
      }
    }
})();
