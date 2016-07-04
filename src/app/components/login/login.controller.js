(function() {
  'use strict';

  angular.module('app.components')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$mdDialog', 'auth'];
  function LoginController($scope, $mdDialog, auth) {

    $scope.showLogin = showLogin;

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
