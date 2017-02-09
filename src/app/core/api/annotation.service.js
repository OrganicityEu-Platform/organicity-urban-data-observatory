(function () {
  'use strict';

  angular.module('app.components')
    .factory('annotation', annotation);

  annotation.$inject = ['annotationAPI', '$window', 'timeUtils', '$filter', '$q'];
  function annotation(annotationAPI, $window, timeUtils, $filter, $q) {

    initialize();

    var service = { //todo define here the methods pushing annotation
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

    function getAnnotation(asset, user, application, tagUrn) { //todo async call
      var params = {
        "assetUrn": asset,
        "user": user,
        "applicationUrn": application,
        "tagUrn": tagUrn
      }
      return annotationAPI.all('annotations/').get("", params);
    }

    function getAnnotationForApplication(asset, user, application, tagDomainUrn) { //todo async call
      var params = {
        "assetUrn": asset,
        "user": user,
        "applicationUrn": application
      }
      return annotationAPI.all('annotations/' + tagDomainUrn).get("", params);
    }

    function getAssetAnnotations(asset) {
      return annotationAPI.all('annotations/' + asset + '/all').get("");
    }

    function getTag(tagUrn) {
      return annotationAPI.all('tags/' + tagUrn).get("");
    }
  }
})();
