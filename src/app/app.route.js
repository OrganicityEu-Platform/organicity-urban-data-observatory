(function() {
    'use strict';
    angular.module('app').config(config);
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
                controller: function($state) {
                    $state.go('layout.home');
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
                url: '/resources',
                abstract: false,
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
                    entitiesLayers: function($state, entity) {
                      /*
                        // Temp Fixtures for dev 
                        var FIXTURE_A = '{"type": "FeatureCollection", "properties": {"name": "IOT 1"} ,"features": [{"type":"Feature","id":"JPN","properties":{"name":"Japan"},"geometry":{"type":"MultiPolygon","coordinates":[[[[134.638428,34.149234],[134.766379,33.806335],[134.203416,33.201178],[133.79295,33.521985],[133.280268,33.28957],[133.014858,32.704567],[132.363115,32.989382],[132.371176,33.463642],[132.924373,34.060299],[133.492968,33.944621],[133.904106,34.364931],[134.638428,34.149234]]],[[[140.976388,37.142074],[140.59977,36.343983],[140.774074,35.842877],[140.253279,35.138114],[138.975528,34.6676],[137.217599,34.606286],[135.792983,33.464805],[135.120983,33.849071],[135.079435,34.596545],[133.340316,34.375938],[132.156771,33.904933],[130.986145,33.885761],[132.000036,33.149992],[131.33279,31.450355],[130.686318,31.029579],[130.20242,31.418238],[130.447676,32.319475],[129.814692,32.61031],[129.408463,33.296056],[130.353935,33.604151],[130.878451,34.232743],[131.884229,34.749714],[132.617673,35.433393],[134.608301,35.731618],[135.677538,35.527134],[136.723831,37.304984],[137.390612,36.827391],[138.857602,37.827485],[139.426405,38.215962],[140.05479,39.438807],[139.883379,40.563312],[140.305783,41.195005],[141.368973,41.37856],[141.914263,39.991616],[141.884601,39.180865],[140.959489,38.174001],[140.976388,37.142074]]],[[[143.910162,44.1741],[144.613427,43.960883],[145.320825,44.384733],[145.543137,43.262088],[144.059662,42.988358],[143.18385,41.995215],[141.611491,42.678791],[141.067286,41.584594],[139.955106,41.569556],[139.817544,42.563759],[140.312087,43.333273],[141.380549,43.388825],[141.671952,44.772125],[141.967645,45.551483],[143.14287,44.510358],[143.910162,44.1741]]]]}},{"type": "Feature", "id": "urn:oc:entity:santander:environmental:fixed:737", "geometry": {"type": "Point", "coordinates": [43.45487, -3.81289] } },{"type": "Feature", "id": "urn:oc:entity:santander:environmental:fixed:837", "geometry": {"type": "Point", "coordinates": [134.638428,35.149234] } }, {"type": "Feature", "id": "urn:oc:entity:santander:environmental:fixed:45", "geometry": {"type": "Point", "coordinates": [134.638428,35.249234]} }] }' // vm.geojson = {
                        var FIXTURE_B = '{"type": "FeatureCollection", "properties": {"name": "IOT 2"}, "features": [{"type": "Feature", "id": "urn:oc:entity:santander:environmental:fixed:737", "geometry": {"type": "Point", "coordinates": [43.45487, -3.81289] } },{"type": "Feature", "id": "urn:oc:entity:santander:environmental:fixed:837", "geometry": {"type": "Point", "coordinates": [42.45487, -3.81289] } }, {"type": "Feature", "id": "urn:oc:entity:santander:environmental:fixed:45", "geometry": {"type": "MultiPolygon", "coordinates": [[[[134.638428, 34.149234] ] ] ] } }] }' // vm.geojson = {
                        var FIXTURE_C = '{"type": "FeaturesCollection", "properties": {"name": "IOT 3"}, "features": [{"type": "Feature", "geometry": {"type": "Point", "coordinates": [-3.82426, 43.45347] }, "properties": {"id": "urn:oc:entity:santander:environmental:fixed:724", "site": {"id": "santander", "name": "Santander", "position": [-3.81289, 43.45487] } } }, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-3.79718214, 43.463585234] }, "properties": {"id": "urn:oc:entity:santander:parking:np3700", "site": {"id": "santander", "name": "Santander", "position": [-3.81289, 43.45487] } } }, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [21.7463555, 38.2587374] }, "properties": {"id": "urn:oc:entity:patras:dev:fixed:1", "site": {"id": "patras", "name": "Patras", "position": [21.733333, 38.25] } } }] }';
                      
                        var data = [JSON.parse(FIXTURE_C)];
                      */  
                        return entity.getGeoJSON().then(function(data) {
                            return data;
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
                    entityData: function($stateParams, entity, fullEntity) {
                        var entityID = $stateParams.id;
                        if (!entityID) {
                            return undefined;
                        }
                        return entity.getDevice(entityID).then(function(deviceData) {
                            return new fullEntity(deviceData);
                        });
                    },
                    mainSensors: function(entityData) {
                        if (!entityData) {
                            return undefined;
                        }
                        return entityData.getSensors();
                    },
                    compareSensors: function(entityData) {
                        if (!entityData) {
                            return undefined;
                        }
                        return entityData.getSensors();
                    },
                    ownerEntitites: function(entityData, PreviewEntity, $q, entity) {
                        console.log("ownerEntitites");
                        if (!entityData) {
                            return undefined;
                        }
                        var entityIDs = entityData.owner.entitites;
                        return $q.all(entityIDs.map(function(id) {
                            return device.getEntity(id).then(function(data) {
                                return new PreviewEntity(data);
                            });
                        }));
                    },
                    belongsToUser: function($window, $stateParams, auth, AuthUser, entityUtils, userUtils) {
                        return false;
                        // if(!auth.isAuth() || !$stateParams.id) {
                        //   return false;
                        // }
                        // var entityID = parseInt($stateParams.id);
                        // var userData = ( auth.getCurrentUser().data ) || ($window.localStorage.getItem('organicity.data') && new AuthUser( JSON.parse( $window.localStorage.getItem('organicity.data') )));
                        // var belongsToUser = entityUtils.belongsToUser(userData.entitites, entityID);
                        // var isAdmin = userUtils.isAdmin(userData);
                        // return isAdmin || belongsToUser;
                    }
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
                        if (!auth.isAuth()) {
                            return;
                        }
                        var userID = parseInt($stateParams.id);
                        var authUserID = auth.getCurrentUser().data && auth.getCurrentUser().data.id;
                        if (userID === authUserID) {
                            $location.path('/profile');
                        }
                    },
                    userData: function($stateParams, $state, NonAuthUser, user) {
                        var id = $stateParams.id;
                        return user.getUser(id).then(function(user) {
                            return new NonAuthUser(user);
                        });
                    },
                    entititesData: function($q, device, PreviewEntity, userData) {
                        var entityIDs = _.pluck(userData.entitites, 'id');
                        if (!entityIDs.length) {
                            return [];
                        }
                        return $q.all(entityIDs.map(function(id) {
                            return device.getDevice(id).then(function(data) {
                                return new PreviewEntity(data);
                            });
                        }));
                    },
                    isAdmin: function($window, $location, $stateParams, auth, AuthUser) {
                        var userRole = (auth.getCurrentUser().data && auth.getCurrentUser().data.role) || ($window.localStorage.getItem('organicity.data') && new AuthUser(JSON.parse($window.localStorage.getItem('organicity.data'))).role);
                        if (userRole === 'admin') {
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
                        var userData = (auth.getCurrentUser().data) || ($window.localStorage.getItem('organicity.data') && new AuthUser(JSON.parse($window.localStorage.getItem('organicity.data'))));
                        if (!userData) {
                            return;
                        }
                        return userData;
                    },
                    entititesData: function($q, device, PreviewEntity, userData) {
                        var entityIDs = _.pluck(userData.entitites, 'id');
                        if (!entityIDs.length) {
                            return [];
                        }
                        return $q.all(entityIDs.map(function(id) {
                            return device.getDevice(id).then(function(data) {
                                return new PreviewEntity(data);
                            });
                        }));
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
                        var userRole = (auth.getCurrentUser().data && auth.getCurrentUser().data.role) || ($window.localStorage.getItem('organicity.data') && new AuthUser(JSON.parse($window.localStorage.getItem('organicity.data'))).role);
                        if (userRole !== 'admin') {
                            $location.path('/');
                        } else {
                            return true;
                        }
                    },
                    userData: function($stateParams, user, auth, AuthUser) {
                        var userID = $stateParams.id;
                        return user.getUser(userID).then(function(user) {
                            return new AuthUser(user);
                        });
                    },
                    entititesData: function($q, device, PreviewEntity, userData) {
                        var entityIDs = _.pluck(userData.entitites, 'id');
                        if (!entityIDs.length) {
                            return [];
                        }
                        return $q.all(entityIDs.map(function(id) {
                            return device.getDevice(id).then(function(data) {
                                return new PreviewEntity(data);
                            });
                        }));
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
                        if (auth.isAuth()) {
                            return $location.path('/');
                        }
                        $location.path('/resources');
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
                        if (auth.isAuth()) {
                            return $location.path('/');
                        }
                        $location.path('/entitites/667');
                        $location.search('signup', 'true');
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
        $urlRouterProvider.otherwise('/resources');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix('!');
        /* Remove angular leaflet logs */
        $logProvider.debugEnabled(false);
    }
})();