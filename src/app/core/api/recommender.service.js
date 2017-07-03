(function () {
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

    function pushRecommender(asset, user) {
      var recommender = {
        'assetUrn': asset,
        'user': user
      };
      return recommenderAPI.all('recommender/').post(recommender);
    }

    function getRecommender(asset, user) { //todo async call
      var params = {
        'assetUrn': asset,
        'user': user
      };
      return recommenderAPI.all('annotations/').get('', params);
    }

  }
})();
