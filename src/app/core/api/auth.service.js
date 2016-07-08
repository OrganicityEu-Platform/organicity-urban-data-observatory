(function() {
  'use strict';

  angular.module('app.components')
    .factory('auth', auth);

    auth.$inject = ['$http', '$location', '$rootScope', '$state', '$timeout', '$window', 'accountsAPI', 'alert', 'AuthUser'];
    function auth($http, $location, $rootScope, $state, $timeout, $window, accountsAPI, alert, AuthUser) {

    	var user = {
        token: null,
        data: null
      };

      //wait until http interceptor is added to Restangular
      $timeout(function() {
    	  initialize();
      }, 100);

    	var service = {
        isAuth: isAuth,
        setCurrentUser: setCurrentUser,
        getCurrentUser: getCurrentUser,
        updateUser: updateUser,
        saveData: saveData,
        login: login,
        logout: logout,
        callback: callback,
        recoverPassword: recoverPassword,
        getResetPassword: getResetPassword,
        patchResetPassword: patchResetPassword,
        isAdmin: isAdmin
    	};
    	return service;

      //////////////////////////

      function initialize() {
        setCurrentUser('appLoad');
      }
      //run on app initialization so that we can keep auth across different sessions
      function setCurrentUser(time) {
        user.token = $window.localStorage.getItem('organicity.token') && JSON.parse( $window.localStorage.getItem('organicity.token') );
        user.data = $window.localStorage.getItem('organicity.data') && new AuthUser(JSON.parse( $window.localStorage.getItem('organicity.data') ));
        if(!user.token) {
          return;
        }
        var data = JSON.parse(getCurrentUserInfo());
        $window.localStorage.setItem('organicity.data', JSON.stringify(data) )
        var newUser = new AuthUser(data);
        //check sensitive information
        if(user.data && user.data.role !== newUser.role) {
          user.data = newUser;
          $location.path('/');
        }
        user.data = newUser;

        // used for app initialization
        if(time && time === 'appLoad') {
          //wait until navbar is loaded to emit event
          $timeout(function() {
            $rootScope.$broadcast('loggedIn', {time: 'appLoad'});
          }, 3000);
        } else {
          // used for login
          $state.reload();
          $timeout(function() {
            alert.success('Login was successful');
            $rootScope.$broadcast('loggedIn', {});
          }, 2000);
        }
        // return getCurrentUserInfo()
        //   .then(function(data) {
        //     $window.localStorage.setItem('organicity.data', JSON.stringify(data.plain()) );
        //
        //     var newUser = new AuthUser(data);
        //     //check sensitive information
        //     if(user.data && user.data.role !== newUser.role) {
        //       user.data = newUser;
        //       $location.path('/');
        //     }
        //     user.data = newUser;
        //
        //     // used for app initialization
        //     if(time && time === 'appLoad') {
        //       //wait until navbar is loaded to emit event
        //       $timeout(function() {
        //         $rootScope.$broadcast('loggedIn', {time: 'appLoad'});
        //       }, 3000);
        //     } else {
        //       // used for login
        //       $state.reload();
        //       $timeout(function() {
        //         alert.success('Login was successful');
        //         $rootScope.$broadcast('loggedIn', {});
        //       }, 2000);
        //     }
        //   });
      }

      function updateUser() {
        return getCurrentUserInfo()
          .then(function(data) {
            $window.localStorage.setItem('organicity.data', JSON.stringify(data.plain()) );
          });
      }

      function getCurrentUser() {
        return user;
      }

      function isAuth() {
        return !!$window.localStorage.getItem('organicity.token');
      }
      //save to localstorage and
      function saveData(token) {
        $window.localStorage.setItem('organicity.token', JSON.stringify(token) );
        setCurrentUser();
      }

      function login() {

        // Here it should go the logic for the login oauth flow
        // GET https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/auth/?response_type=token&client_id=udo-dev&redirect_uri=http://localhost:8080/resources/&scope=&state=
        // POST https://accounts.organicity.eu/realms/organicity/login-actions/authenticate?code=QZXmSAhIOKkMv1Wqw0qA5j__l-hIWCYdaO6niY5B9Bc.3dd256c6-1ad5-4f87-9ba1-cbdac04a9e2c&execution=7c8382a4-624c-4911-9135-242e1f2b0af1

        console.log('NEW LOGIN!')
        window.location.href = "https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/auth/?response_type=token&client_id=udo-dev&redirect_uri=http://localhost:8080/callback&scope=&state=";
      }

      function callback() {
        console.log("HALLO!! HALLO!!");
        var token = $location.$$hash.split('&')[1].slice(14);
        window.localStorage.setItem('organicity.token', JSON.stringify(token) );
        return window.localStorage.getItem('organicity.token');
        $location.path('/');
      }

      function logout() {
        $window.localStorage.removeItem('organicity.token');
        $window.localStorage.removeItem('organicity.data');
      }

      function getCurrentUserInfo() {
        // var token = $window.localStorage.getItem('organicity.token');
        // accountsAPI.setDefaultHeaders({ Authorization: 'Bearer ' + token });
        // return accountsAPI.all('').customGET('');
        return '{"id":5187,"uuid":"76c6af2d-59bd-4b27-8dfd-457e2c5ba47f","role":"citizen","username":"hiromipaw","avatar":"https://images.smartcitizen.me/s100/avatars/76c/1bfqkch.nopressure.png","url":"http://www.nopressure.co.uk","location":{"city":"Barcelona","country":null,"country_code":null},"joined_at":"2016-03-15T15:39:08Z","updated_at":"2016-05-31T09:05:06Z","email":"silvia@nopressure.co.uk","legacy_api_key":"9bdabd7cbe728b1e2bcf439500c98b797e0f12ba","devices":[{"id":3301,"uuid":"c8e3b870-703a-4c0d-afdd-db5c2ad61af7","mac_address":"00:06:66:2a:02:d1","name":"HiroTestBCN","description":"This is a test kit","location":{"city":"Barcelona","state":"Catalunya","address":"Via Laietana, 44, 08003 Barcelona, Barcelona, Spain","country":"Spain","state_code":"CT","postal_code":"08003","country_code":"ES"},"latitude":41.3862036,"longitude":2.175894,"kit_id":3,"state":"has_published","system_tags":["online","outdoor"],"last_reading_at":"2016-07-08T13:10:04Z","added_at":"2016-04-13T09:49:54Z","updated_at":"2016-06-17T06:39:55Z"}]}'
      }

      function recoverPassword(data) {
        return accountsAPI.all('password_resets').post(data);
      }

      function getResetPassword(code) {
        return accountsAPI.one('password_resets', code).get();
      }
      function patchResetPassword(code, data) {
        return accountsAPI.one('password_resets', code).patch(data);
      }
      function isAdmin(userData) {
        return userData.role === 'admin';
      }
    }
})();
