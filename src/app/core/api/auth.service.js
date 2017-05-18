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
        //console.log(enrichedData);

        // Users need this enriched data when they are created:
        var newUser = new AuthUser(enrichedData);
        //console.log(newUser);

        //TODO: Is this useless? What does the .path('/') do?
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
      }

      // TODO: do we need this? - Called from myProfileController
      // Why can we updateUser? This will only get saved in localstorage, not on accounts.organ
      function updateUser() {
        console.log('updateUser ...');
        return getCurrentUserInfo()
          .then(function(data) {
            console.log('data :');
            console.log(data);
            //$window.localStorage.setItem('organicity.data', JSON.stringify(data.plain()) );
          });
      }

      // TODO: Called by app.route.js, app.config.js, userProfile.contoller, layout.contoller
      // function gets called 4 times on app start!
      function getCurrentUser() {
        // console.log('returns user: ');
        // console.log(user);
        return user;
      }

      function isAuth() {
        return $auth.isAuthenticated;
      }
      // TODO: Only called once in loginDialog.controller
      function saveData(token) {
        $auth.setToken(token);
        setCurrentUser();
      }

      function login() {

        // Here it should go the logic for the login oauth flow
        // GET https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/auth/?response_type=token&client_id=udo-dev&redirect_uri=http://localhost:8080/resources/&scope=&state=
        // POST https://accounts.organicity.eu/realms/organicity/login-actions/authenticate?code=QZXmSAhIOKkMv1Wqw0qA5j__l-hIWCYdaO6niY5B9Bc.3dd256c6-1ad5-4f87-9ba1-cbdac04a9e2c&execution=7c8382a4-624c-4911-9135-242e1f2b0af1

        console.log('login() ======= ');

        // TODO: should we clean out tokens before we login?
        // Should we also log out?
        $auth.removeToken();

        $auth.authenticate('organicity')
          .then(function() {
            // Save token to localStorage, encoded!
            $auth.setToken($auth.getToken());

            setCurrentUser();
          })
          .catch(function(error) {
            console.log(error);
          });

        // TODO: the login function NEED to return anything?
        // 2 unused function depended on that.
      }

      function callback() {
        //TODO: called from app.route.js:369
        // All it does is save the token
        console.log('callback()');
        //console.log($location.$$hash);
        //var token = $location.$$hash.split('&')[1].slice(13);
        //window.localStorage.setItem('organicity.token', JSON.stringify(token) );
        //var jwtDecoded = jwtHelper.decodeToken(token);
        //window.localStorage.setItem('organicity.data', userData(jwtDecoded) );

        return $location.path('/resources');
      }

      function logout() {
        // $auth.logout calls $auth.removeToken
        $auth.logout();

        // TODO: Should we also unlink app? See app.route.js, unlinkUrl
        // $auth.unlink('organicity');

        // Notice the redirect_uri
        //$window.location.href = 'https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/logout?redirect_uri=https://observatory.organicity.eu';
      }

      // TODO: do we need this? - Used by updateUser
      function getCurrentUserInfo() {
        console.log('getCurrentUserInfo...');
        var token = $auth.getToken();
        var jwtDecoded = jwtHelper.decodeToken(token);
        if (jwtHelper.isTokenExpired(token)) {
          console.log('EXPIRED, need to login and return token');
          // Expects login() to also return the token, which it does not anymore!
          return login();
        } else {
          console.log('Token not expired, returning token');
          return userData(jwtDecoded);
        }
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
