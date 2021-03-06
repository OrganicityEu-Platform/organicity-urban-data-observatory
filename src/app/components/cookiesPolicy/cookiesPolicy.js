(function(){
'use strict';

angular.module('app.components')
  .directive('cookiesPolicy', cookiesPolicy);


cookiesPolicy.$inject = ['$cookies', '$document'];

function cookiesPolicy($cookies, $document) {
  return {
    template:
      '<div class="cookies-policy-container" ng-hide="consent()">' +
      'This site uses cookies to offer you a better experience.  ' +
      ' <a href="" ng-click="consent(true)">Accept</a> or' +
      ' <a ui-sref="layout.policy">Learn More.</a> ' +
      '</div>',
    controller: function($scope) {
      var _consent = $cookies.consent;
      $scope.consent = function(consent) {
        if (consent === undefined) {
          return _consent;
        } else if (consent) {
          var d = new Date();
          d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
          var expires = 'expires=' + d.toUTCString();
          document.cookie = 'consent=true; ' + expires;
          _consent = true;
        }
      };
    }
  };
}


})();
