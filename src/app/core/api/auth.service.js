(function() {
  'use strict';

  angular.module('app.components')
    .factory('auth', auth);

    auth.$inject = ['$http', '$location', '$rootScope', '$state', '$timeout', '$window', 'accountsAPI', 'alert', 'AuthUser', 'jwtHelper', '$auth'];
    function auth($http, $location, $rootScope, $state, $timeout, $window, accountsAPI, alert, AuthUser, jwtHelper, $auth) {

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
        login: login,
        logout: logout,
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
        // 1. Return if not authenticated
        // 2. Create (decoded) 'data' var from token in storage
        // 3. Create 'newUser' with enriched data
        // 4. Broadcast


        // If we are authenticated, we should have token (but it could be an invalid JWT!)
        console.log('isAuthenticated?: ' + $auth.isAuthenticated());
        if(!$auth.isAuthenticated()) {
          return;
        }

        // Decoded token saved in 'data' var.
        var data = $auth.getPayload();

        // Restangular needs this token (app.config.js)
        user.token = $auth.getToken();

        // 'data' needs to be enriched  with 'location.city|country', which is done in 'userData()'
        var enrichedData = JSON.parse(userData(data));

        // Users need this enriched data when they are created:
        var newUser = new AuthUser(enrichedData);

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
      }

      // TODO: Called by app.route.js, app.config.js, userProfile.contoller, layout.contoller
      // function gets called 4 times on app start!
      function getCurrentUser() {
        // console.log(user);
        return user;
      }

      function isAuth() {
        return $auth.isAuthenticated();
      }

      function login() {

        // Here it should go the logic for the login oauth flow
        // GET https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/auth/?response_type=token&client_id=udo-dev&redirect_uri=http://localhost:8080/resources/&scope=&state=
        // POST https://accounts.organicity.eu/realms/organicity/login-actions/authenticate?code=QZXmSAhIOKkMv1Wqw0qA5j__l-hIWCYdaO6niY5B9Bc.3dd256c6-1ad5-4f87-9ba1-cbdac04a9e2c&execution=7c8382a4-624c-4911-9135-242e1f2b0af1

        console.log('login() ======= ');

        $auth.removeToken();

        $auth.authenticate('organicity')
          .then(function() {
            // NOTE: (Also saves token to localStorage, encoded)

            setCurrentUser();
          })
          .catch(function(error) {
            console.log(error);
          });
      }

      function logout() {
        // $auth.logout calls $auth.removeToken
        $auth.logout();

        // TODO: Should we also unlink app? See app.route.js, unlinkUrl

        /*
        $auth.unlink('organicity')
          .then(function(response){
            console.log(response);
          })
          .catch(function(response){
            console.log(response);
          });
        */


        // Notice the redirect_uri
        //$window.location.href = 'https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/logout?redirect_uri=https://observatory.organicity.eu';
      }

      function userData(jwtDecoded) {
        return JSON.stringify({ id: jwtDecoded.sub,
                                uuid: jwtDecoded.sub,
                                role: '',
                                name: jwtDecoded.name,
                                username: jwtDecoded.preferred_username,
                                avatar: './mediassets/images/avatar.svg',
                                url: '',
                                location: { city: 'null', country: 'null', country_code: 'null'},
                                email: jwtDecoded.email,
                              });
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
