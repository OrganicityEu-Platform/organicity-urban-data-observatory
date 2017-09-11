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

    function pushRecommender(asset, accessKey) {
      var params = {
        'accessKey': accessKey
      };

      var data = {
        'event': '$set',
        'entityType': 'item',
        'entityId': asset
      };

      console.log(params);
      console.log(data);
      return recommenderAPI.all('events/events.json').post(data, params);
    }

    function getRecommender(asset, accessKey) {
      var params = {
        'assetUrn': asset,
        'accessKey': accessKey
      };
      return recommenderAPI.all('events/events.json').get('', params);
    }

  }
})();
