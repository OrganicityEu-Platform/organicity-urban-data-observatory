(function() {
  'use strict';

  angular.module('app.components')
    .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['$scope', '$stateParams', '$location', 'utils', 'userData', 'entititesData', 'auth', 'userUtils', '$timeout', 'animation'];
    function UserProfileController($scope, $stateParams, $location, utils, userData, entititesData, auth, userUtils, $timeout, animation) {
      var vm = this;
      var user = userData;
      var entitites = entititesData;

      vm.status = undefined;
      vm.user = user;
      vm.entitites = entitites;
      vm.filteredentitites = [];
      vm.filterentitites = filterentitites;

      $scope.$on('loggedIn', function() {
        var userID = parseInt($stateParams.id);
        var authUser = auth.getCurrentUser().data;
        if( userUtils.isAuthUser(userID, authUser) ) {
          $location.path('/profile');
        }
      });

      initialize();

      //////////////////

      function initialize() {
        $timeout(function() {
          setSidebarMinHeight();
          animation.viewLoaded();
        }, 500);
      }

      function filterentitites(status) {
        if(status === 'all') {
          status = undefined;
        }
        vm.status = status;
      }

      function setSidebarMinHeight() {
        var height = document.body.clientHeight / 4 * 3;
        angular.element('.profile_content').css('min-height', height + 'px');
      }
    }
})();
