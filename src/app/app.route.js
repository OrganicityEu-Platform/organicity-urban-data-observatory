(function() {
  'use strict';

  angular.module('app')
    .config(config);

    /*
      Check app.config.js to know how states are protected
    */

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider'];
    function config($stateProvider, $urlRouterProvider, $locationProvider, $logProvider) {
      $stateProvider
        /*
         -- Landing state --
         Grabs your location and redirects you to the closest marker with data
        */
        .state('landing', {
          url: '/',
          controller: function($state){
            $state.go('layout.home.entity');
          }
        })
        /*
        -- Layout state --
        Top-level state used for inserting the layout(navbar and footer)
        */
        .state('layout', {
          url: '',
          abstract: true,
          templateUrl: 'app/components/layout/layout.html',
          controller: 'LayoutController',
          controllerAs: 'vm'
        })
        /*
        -- Static page template --
        Template for creating other static pages.
        */
        .state('layout.static', {
          url: '/static',
          templateUrl: 'app/components/static/static.html',
          controller: 'StaticController',
          controllerAs: 'vm'
        })

        /*
        -- Home state --
        Nested inside the layout state
        It contains the map and all the data related to it
        Abstract state, it only activates when there's a child state activated
        */
        .state('layout.home', {
          url: '/assets',
          views: {
            '': {
              templateUrl: 'app/components/home/template.html'
            },

            'map@layout.home': {
              templateUrl: 'app/components/map/map.html',
              controller: 'MapController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            entitiesLayers: function($state, asset) {
              return asset.getClusterGeoJSON().then(function(data) {
                return JSON.parse(data);
              }, function(error){
                console.log(error);
              });
            }
          }
        })
        /*
        -- Show site state --
        Nested inside layout and home state
        It's the state that displays all the data related to a site below the map
        */
        .state('layout.home.site', {
          url: '/sites/:site',
          views: {
            '': {
              templateUrl: 'app/components/home/template.html'
            },

            'map@layout.home': {
              templateUrl: 'app/components/map/map.html',
              controller: 'MapController',
              controllerAs: 'vm'
            }
          },
          resolve: {
            entitiesLayers: function($stateParams, asset) {
                var site = $stateParams.site;
                console.log(asset);
                return asset.getGeoJSONSite(site).then(function(data) {
                  console.log(data);
                  return JSON.parse(data);
                }, function(error){
                  console.log(error);
                });
            }
          }
        })
        /*
        -- Show entity state --
        Nested inside layout and home state
        It's the state that displays all the data related to a entity below the map
        */
        .state('layout.home.entity', {
          url: '/:id',
          views: {
            'container@layout.home': {
              templateUrl: 'app/components/entity/showEntity/showEntity.html',
              controller: 'entityController',
              controllerAs: 'vm'
            }
          },

          resolve: {
            entityData: function($stateParams, asset, FullEntity, HasSensorEntity) {
              var entityID = $stateParams.id;

              if(!entityID) {
                return undefined;
              }

              return asset.getAsset(entityID).then(function(entityData) {
                return new FullEntity(entityData);
              });
            },
            mainSensors: function(entityData) {
              if(!entityData) {
                return undefined;
              }
              return entityData.getSensors();
            },
            compareSensors: function(entityData) {
              if(!entityData) {
                return undefined;
              }
              return entityData.getSensors();
            },
            // ownerentitites: function(entityData, previewEntity, $q, entity) {
            //   // if(!entityData) {
            //   //   return undefined;
            //   // }
            //   // var entityIDs = entityData.owner.entitites;
            //   //
            //   // return $q.all(
            //   //   entityIDs.map(function(id) {
            //   //     return device.getDevice(id)
            //   //       .then(function(data) {
            //   //         return new previewEntity(data);
            //   //       });
            //   //   })
            //   // );
            //
            // },
            // belongsToUser: function($window, $stateParams, auth, AuthUser, assetUtils, userUtils) {
            //   return false;
            //   // if(!auth.isAuth() || !$stateParams.id) {
            //   //   return false;
            //   // }
            //   // var entityID = parseInt($stateParams.id);
            //   // var userData = ( auth.getCurrentUser().data ) || ($window.localStorage.getItem('organicity.data') && new AuthUser( JSON.parse( $window.localStorage.getItem('organicity.data') )));
            //   // var belongsToUser = assetUtils.belongsToUser(userData.entitites, entityID);
            //   // var isAdmin = userUtils.isAdmin(userData);
            //
            //   // return isAdmin || belongsToUser;
            // }
          }
        })
        /*
        -- User Profile state --
        Nested inside layout state
        Public profile of a given user
        Redirects to My Profile/My Profile Admin if the user is the one authenticated or if the authenticated user is an admin
        */
        .state('layout.userProfile', {
          url: '/users/:id',
          templateUrl: 'app/components/userProfile/userProfile.html',
          controller: 'UserProfileController',
          controllerAs: 'vm',
          resolve: {
            isCurrentUser: function($stateParams, $location, auth) {
              if(!auth.isAuth()) {
                return;
              }
              var userID = parseInt($stateParams.id);
              var authUserID = auth.getCurrentUser().data && auth.getCurrentUser().data.id;
              if(userID === authUserID) {
                $location.path('/profile');
              }
            },
            userData: function($stateParams, $state, NonAuthUser, user) {
              var id = $stateParams.id;

              return user.getUser(id)
                .then(function(user) {
                  return new NonAuthUser(user);
                });
            },
            entititesData: function($q, device, Previewentity, userData) {
              var entityIDs = _.pluck(userData.entitites, 'id');

              if(!entityIDs.length) {
                return [];
              }

              return $q.all(
                entityIDs.map(function(id) {
                  return device.getDevice(id)
                    .then(function(data) {
                      return new Previewentity(data);
                    });
                })
              );
            },
            isAdmin: function($window, $location, $stateParams, auth, AuthUser) {
              var userRole = (auth.getCurrentUser().data && auth.getCurrentUser().data.role) || ($window.localStorage.getItem('organicity.data') && new AuthUser(JSON.parse( $window.localStorage.getItem('organicity.data') )).role);
              if(userRole === 'admin') {
                var userID = $stateParams.id;
                $location.path('/profile/' + userID);
              } else {
                return false;
              }
            }
          }
        })
        /*
        -- My Profile state --
        Private profile of the authenticated user at the moment
        */
        .state('layout.myProfile', {
          url: '/profile',
          authenticate: true,
          templateUrl: 'app/components/myProfile/myProfile.html',
          controller: 'MyProfileController',
          controllerAs: 'vm',
          resolve: {
            userData: function($location, $window, user, auth, AuthUser) {
              var userData = (auth.getCurrentUser().data) || ( $window.localStorage.getItem('organicity.data') && new AuthUser(JSON.parse( $window.localStorage.getItem('organicity.data') )));
              if(!userData) {
                return;
              }
              return userData;
            },
            entititesData: function($q, device, Previewentity, userData) {
              var entityIDs = _.pluck(userData.entitites, 'id');
              if(!entityIDs.length) {
                return [];
              }

              return $q.all(
                entityIDs.map(function(id) {
                  return device.getDevice(id)
                    .then(function(data) {
                      return new Previewentity(data);
                    });
                })
              );
            }
          }
        })
        /*
        -- My Profile Admin --
        State to let admins see private profiles of users with full data
        */
        .state('layout.myProfileAdmin', {
          url: '/profile/:id',
          authenticate: true,
          templateUrl: 'app/components/myProfile/myProfile.html',
          controller: 'MyProfileController',
          controllerAs: 'vm',
          resolve: {
            isAdmin: function($window, auth, $location, AuthUser) {
              var userRole = (auth.getCurrentUser().data && auth.getCurrentUser().data.role) || ( $window.localStorage.getItem('organicity.data') && new AuthUser(JSON.parse( $window.localStorage.getItem('organicity.data') )).role );
              if(userRole !== 'admin') {
                $location.path('/');
              } else {
                return true;
              }
            },
            userData: function($stateParams, user, auth, AuthUser) {
              var userID = $stateParams.id;
              return user.getUser(userID)
                .then(function(user) {
                  return new AuthUser(user);
                });
            },
            entititesData: function($q, device, Previewentity, userData) {
              var entityIDs = _.pluck(userData.entitites, 'id');
              if(!entityIDs.length) {
                return [];
              }

              return $q.all(
                entityIDs.map(function(id) {
                  return device.getDevice(id)
                    .then(function(data) {
                      return new Previewentity(data);
                    });
                })
              );
            }
          }
        })
        /*
        -- Login --
        It redirects to a certain entity state and opens the login dialog automatically
        */
        .state('layout.login', {
          url: '/login',
          authenticate: false,
          resolve: {
            buttonToClick: function($location, auth) {
              if(auth.isAuth()) {
                return $location.path('/');
              }
              $location.path('/assets');
              $location.search('login', 'true');
            }
          }
        })
        /*
        -- Signup --
        It redirects to a certain entity state and opens the signup dialog automatically
        */
        .state('layout.signup', {
          url: '/signup',
          authenticate: false,
          resolve: {
            buttonToClick: function($location, auth) {
              if(auth.isAuth()) {
                return $location.path('/');
              }
              $location.path('/entitites/667');
              $location.search('signup', 'true');
            }
          }
        })
        /*
        -- Callback --
        It saves token from accounts organicity
        */
        .state('callback', {
          url: '/callback',
          authenticate: false,
          resolve: {
            callback: function($location, $state, auth, $rootScope) {
              auth.callback();
            }
          }
        })
        /*
        -- Logout --
        It removes all the user data from localstorage and redirects to landing state
        */
        .state('logout', {
          url: '/logout',
          authenticate: true,
          resolve: {
            logout: function($location, $state, auth, $rootScope) {
              auth.logout();
              $location.path('/');
              $rootScope.$broadcast('loggedOut');
            }
          }
        })
        /*
        -- Password Recovery --
        Form to input your email address to receive an email to reset your password
        */
        .state('passwordRecovery', {
          url: '/password_reset',
          authenticate: false,
          templateUrl: 'app/components/passwordRecovery/passwordRecovery.html',
          controller: 'PasswordRecoveryController',
          controllerAs: 'vm'
        })
        /*
        -- Password Reset --
        This link will be given by the email you received after giving your email in the previous state
        Here, you can input your new password
        */
        .state('passwordReset', {
          url: '/password_reset/:code',
          authenticate: false,
          templateUrl: 'app/components/passwordReset/passwordReset.html',
          controller: 'PasswordResetController',
          controllerAs: 'vm'
        });

      /* Default state */
      $urlRouterProvider.otherwise('/assets');

      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      }).hashPrefix('!');

      /* Remove angular leaflet logs */
      $logProvider.debugEnabled(false);
    }
})();
