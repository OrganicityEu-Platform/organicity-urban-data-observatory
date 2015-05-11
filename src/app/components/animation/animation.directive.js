(function() {
  'use strict';


    angular.module('app.components')
      .directive('moveDown', moveDown)
      .directive('stick', stick)
      .directive('blur', blur)
      .directive('focus', focus);


    function moveDown() {
      
      function link(scope, element) {
        scope.$watch('moveDown', function(isTrue) {
          if(isTrue) {
            element.addClass('move_down');
          } else {
            element.removeClass('move_down');
          }
        });
      }

      return {
        link: link,
        scope: false,
        restrict: 'A'
      };
    }

    stick.$inject = ['$window'];
    function stick($window) {

      function link(scope, element) {
        var elementPosition = element[0].offsetTop;
        //var elementHeight = element[0].offsetHeight;
        
        var navbarHeight = 64;

        angular.element($window).on('scroll', function() {
          var windowPosition = document.body.scrollTop;
          if(windowPosition + navbarHeight >= elementPosition) {
            element.addClass('stickMenu');
            scope.$apply(function() {
              scope.moveDown = true;
            });
          } else {
            element.removeClass('stickMenu');
            scope.$apply(function() {
              scope.moveDown = false;
            });
          }
        });
      }

      return {
        link: link,
        scope: false,
        restrict: 'A'
      };
    }

    function blur() {
      
      function link(scope, element) {

        scope.$on('blur', function() {
          element.addClass('blur');
        });

        scope.$on('unblur', function() {
          element.removeClass('blur');
        });
      }

      return {
        link: link,
        scope: false,
        restrict: 'A'
      };
    }

    focus.$inject = ['animation'];
    function focus(animation) {
      function link(scope, element) {
        element.on('focusin', function() {
          animation.removeNav();
        });

        element.on('focusout', function() {
          animation.addNav();
        });
      }

      return {
        link: link
      };
    }

})();