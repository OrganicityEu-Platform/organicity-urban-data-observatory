(function() {
    'use strict';

    angular.module('app.components')
        .factory('shortURL', shortURL);

    shortURL.$inject = ['$q', '$http'];

    function shortURL($q, $http) {
        var service = {
            shorten: shorten
        };

        return service;

        function shorten(url) {
            return $http({
                method: 'POST',
                url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyByZVuhVhlFuajzDlaO11fl2Ua-GB9fRTE',
                data: {
                    longUrl: url.toString()
                }
            })
        }

    }
})();