'use strict';

describe('Controller: User Profile', function() {

  beforeEach(module('app.components'));

  var MyProfileController,
      scope,
      mockUserData,
      mockentititesData,
      mockAlertService,
      deferred;

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    deferred = $q;

    mockUserData = {
      username: 'Ruben'
    };

    mockentititesData = [
      {name: 'entity 1', id: 1},
      {name: 'entity 2', id: 2}
    ];

    mockAlertService = {
      success: function(){},
      error: function(){}
    };

    
    // spyOn(mockUserService, 'updateUser').and.returnValue(deferred.promise);
    //spyOn(mockAnimationService, 'blur'); 

    MyProfileController = $controller('MyProfileController', {
      $scope: scope, userData: mockUserData, entititesData: mockentititesData, alert: mockAlertService
    });    
  }));

    describe('State', function() {
      it('should expose user instance', function() {
        expect(MyProfileController.user).toBeDefined();
        expect(MyProfileController.user).toEqual(jasmine.any(Object));
        expect(Object.keys(MyProfileController.user)).toEqual(['username']);
      });
      it('should expose entity instances of the user', function() {
        expect(MyProfileController.entitites).toBeDefined();
        expect(Array.isArray(MyProfileController.entitites)).toBe(true);
        expect(_.pluck(MyProfileController.entitites, 'id')).toEqual([1,2]);
      });
      it('should expose filterentitites function', function() {
        expect(MyProfileController.filterentitites).toBeDefined();
      });
      xit('should expose updateUser function', function() {

      });
      xit('should expose removeUser function', function() {

      });
    }); 

    describe('Synchronous calls', function() {

    });

    describe('Asynchronous calls', function() {

    });
});


