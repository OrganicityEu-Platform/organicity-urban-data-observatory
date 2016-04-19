'use strict';

describe('Controller: User Profile', function() {
  // var user;

  beforeEach(module('app.components'));

  var UserProfileController,
      scope,
      mockUserConstructor,
      mockUserInstance,
      stateParams,
      mockentititesData,
      mockAuthService;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    mockUserInstance = {
      username: 'ruben'
    };

    stateParams = {
      id: 4
    };

    mockentititesData = {
      
    };

    mockAuthService = {

    };
    
    UserProfileController = $controller('UserProfileController', {
      $scope: scope, User: mockUserConstructor, userData: mockUserInstance, $stateParams: stateParams,
       entititesData: mockentititesData, auth: mockAuthService
    });
    
    //spyOn(mockUserService, 'post').and.returnValue($q.when({}));
    //spyOn(mockAnimationService, 'blur'); 
  })); 
  describe('State', function() {
    it('should expose a user instance', function() {
      expect(UserProfileController.user).toBeDefined();
      expect(UserProfileController.user).toEqual(jasmine.any(Object));
      expect(Object.keys(UserProfileController.user)).toEqual(['username']);
    });
    it('should expose a entity instance', function() {
      expect(UserProfileController.entitites).toBeDefined();
    });
    it('should expose filterentitites function', function() {
      expect(UserProfileController.filterentitites).toEqual(jasmine.any(Function));
    });
    it('should expose entitites filtered', function() {
      
    });
    it('should expose the status of the filter with value undefined by default', function() {
      expect(UserProfileController.status).toBeUndefined();
    });
  }); 

  describe('Events', function() {
    it('should listen for the loggedIn event', function() {

    });

    it('should update the page according to the loggedIn event handler', function() {

    });
  })
});

