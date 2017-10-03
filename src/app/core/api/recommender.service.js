(function() {
  'use strict';

  angular.module('app.components')
    .factory('recommender', recommender);

  recommender.$inject = ['recommenderAPI', '$window', 'timeUtils', '$filter', '$q'];

  function recommender(recommenderAPI, $window, timeUtils, $filter, $q) {

    initialize();

    var service = {
      push: pushRecommender,
      get: getRecommender
    };

    return service;

    //////////////////////////

    function initialize() {

    }

    function pushRecommender(asset, accessKey, userId) {
      if(userId===null){
        return Promise.reject("No user id");
      }
      var params = {
        'accessKey': accessKey
      };

      var data = {
        'event': 'view',
        'entityType': 'user',
        'entityId': userId,
        'targetEntityType':'item',
        'targetEntityId':asset
      };

      return recommenderAPI.all('events/events.json').post(data, params);
    }

    function getRecommender(asset, number) {
      var data = {
        'items': asset,
        //'accessKey': accessKey
        'num':number
      };
      return recommenderAPI.all('queries/queries.json').post(data);
    }

  }
})();
