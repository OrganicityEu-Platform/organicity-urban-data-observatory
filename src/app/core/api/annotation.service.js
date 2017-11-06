(function () {
  'use strict';

  angular.module('app.components')
    .factory('annotation', annotation);

  annotation.$inject = ['annotationAPI', '$window', 'timeUtils', '$filter', '$q'];
  function annotation(annotationAPI, $window, timeUtils, $filter, $q) {

    initialize();

    var service = { //todo define here the methods pushing annotation
      postAnnotation: postAnnotation,
      postAssetRate: postAssetRate,
      getProposedTagDomain: getProposedTagDomain,
      getAnnotationStatistics: getAnnotationStatistics,
      pushAnnotation: pushAnnotation,
      getAnnotation: getAnnotation, // Check this method related to reputation and the new getAssetAnnotations
      getAnnotationForApplication: getAnnotationForApplication,
      getAssetAnnotations: getAssetAnnotations,
      getTag: getTag
    };

    return service;

    //////////////////////////

    function initialize() {

    }

    function pushAnnotation(asset, annotation) { //todo async call
      return annotationAPI.all('annotations/' + asset).post(annotation);
    }

    function postAssetRate(asset, rate, user) {
      var annotation = {
        'assetUrn': asset,
        'numericValue': parseInt(rate),
        'textValue': '',
        'application': 'oc-reputation',
        'tagUrn': 'urn:oc:tag:Reliability:Score',
        'user': 'anon-'+user
      };
      return annotationAPI.all('annotations/' + asset).post(annotation);
    }

    function postAnnotation(asset, urn) {
      var annotation = {
        'assetUrn': asset,
        'numericValue': 0,
        'textValue': '',
        'application': 'oc-reputation',
        'tagUrn': urn,
        'user': ''
      };
      console.log(annotation);
      return annotationAPI.all('annotations/' + asset).post(annotation);
    }

    function getAnnotation(asset, user, application, tagUrn) { //todo async call
      var params = {
        'assetUrn': asset,
        'user': user,
        'applicationUrn': application,
        'tagUrn': tagUrn
      };
      return annotationAPI.all('annotations/').get('', params);
    }

    function getAnnotationStatistics(asset) {
      var params = {};
      return annotationAPI.all('annotations/' + asset + '/statistics').get('', params);
    }

    function getProposedTagDomain(asset) {
      var params = {};
      return annotationAPI.all('tagDomains/urn:oc:tagDomain:IndoorHumidityLevels').get('', params);
    }

    function getAnnotationForApplication(asset, user, application, tagDomainUrn) { //todo async call
      var params = {
        'assetUrn': asset,
        'user': user,
        'applicationUrn': application
      };
      return annotationAPI.all('annotations/' + tagDomainUrn).get('', params);
    }

    function getAssetAnnotations(asset) {
      return annotationAPI.all('annotations/' + asset + '/all').get('');
    }

    function getTag(tagUrn) {
      return annotationAPI.all('tags/' + tagUrn).get('');
    }
  }
})();
