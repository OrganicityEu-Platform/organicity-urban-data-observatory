/*jshint sub:true*/
(function () {
  'use strict';

  angular.module('app.components')
    .controller('AnnotationController', AnnotationController);

  AnnotationController.$inject = ['$scope', '$mdDialog', 'annotation'];
  function AnnotationController($scope, $mdDialog, annotation) {

    var vm = this;

    initialize();


    vm.addAnnotation = function (urn) {
      //TODO: should add here an user identifier for posting the annotation
      $("#thank_user_for_annotations").addClass("fa fa-circle-o-notch fa-spin");
      annotation.postAnnotation($scope.$parent.vm.entity.id, urn).then(function (e) {
        $("#ask_user_for_annotation").hide();
        $("#thank_user_for_annotations").removeClass("fa fa-circle-o-notch fa-spin");
        $("#thank_user_for_annotations").text("Thanks!");
      });

    };
    vm.addReputation = function (rate) {
      var assetUrn = $scope.$parent.vm.entity.id;
      //TODO: should add here an user identifier for posting the annotation
      $("#rep-thanks").addClass("fa fa-circle-o-notch fa-spin");
      annotation.postAssetRate(assetUrn, rate, (new Date).getTime()).then(function (e) {
        $(".rep-star").hide();
        $("#rep-thanks").removeClass("fa fa-circle-o-notch fa-spin");
        $("#rep-thanks").text("Thanks!");
      });
    };

    function initialize() {
      // Get the entity data from the parent controller

      var entity = $scope.$parent.vm.entity;
      vm.annotation = {};

      displayAssetAnnotations(entity);

      function displayAssetAnnotations(entity) {
        annotation.getAssetAnnotations(entity.id).then(
          function (response) {

            var tags = [];
            var uniqueTags = [];
            var filters = [];


            angular.forEach(response, function (value, key) {
              var tagUrn = value["tagUrn"];
              if (uniqueTags.indexOf(tagUrn) !== -1)return;
              uniqueTags.push(tagUrn);
              var splitName = tagUrn.split(":");
              annotation.getTag(tagUrn).then(function (result) {
                var tag = {
                  "name": splitName.slice(4).join(" "),
                  "tooltip": result.name
                };
                tags.push(tag);
              });
              filters = filterUsers(value["user"]);
            });

            vm.annotation.tags = tags;
            vm.annotation.filters = filters;
          });

        annotation.getAnnotationStatistics(entity.id).then(function (result) {
          vm.annotation.statistics = result;

          var statistics = vm.annotation.statistics;
          var w1 = (statistics.assetRate / 5);
          var w2 = (statistics.totalRates / statistics.globalTotalRates);
          var w3 = (statistics.annotationsCount / statistics.globalAnnotationsCount);
          var w4 = ( (statistics.lastAnnotation - statistics.globalFirstAnnotation) / (statistics.globalLastAnnotation - statistics.globalFirstAnnotation));
          var reputation = 5 * (0.7 * w1 + 0.1 * w2 + 0.1 * w3 + 0.1 * w4);
          console.log(reputation);
          vm.annotation.stars = reputation.toFixed(2);
          $scope.$parent.vm.stars = Math.round(reputation);
        });
        annotation.getProposedTagDomain(entity.id).then(function (result) {
          vm.annotation.proposed = result;
        });
      }
    }

    function filterUsers(username) {
      var users = [];
      var distinctUser = {};
      if (username === 'jamaica') {
        distinctUser = {
          "id": 0,
          "name": "Automated"
        };
      } else {
        distinctUser = {
          "id": 1,
          "name": "Experimenters"
        };
      }
      if (users.indexOf(distinctUser) === -1) {
        users.push(distinctUser);
      }

      return users;
    }
  }
})();
