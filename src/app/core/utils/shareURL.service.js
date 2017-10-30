(function() {
    'use strict';

    angular.module('app.components')
        .factory('socialSharing', socialSharing);

    socialSharing.$inject = ['$q', '$location', 'shortURL', 'Socialshare', 'clipboard', 'alert'];

    function socialSharing($q, $location, shortURL, Socialshare, clipboard, alert) {
        var service = {
            twitter: twitter,
            facebook: facebook,
            email: email,
            copyUrl: copyUrl
        };

        var assetShortURL;

        return service;

        function twitter() {
            share(shareTwitter);
        }

        function facebook() {
            share(shareFacebook);
        }

        function email() {
            share(shareEmail);
        }

        function copyUrl(url) {
            share(shareShortUrl);
        }

        function shareTwitter(url) {
            Socialshare.share({
                'provider': 'twitter',
                'attrs': {
                    'socialshareUrl': url,
                    'socialshareText': 'Check out this data!',
                    'socialshareHashtags': 'organicity'
                }
            });
        }

        function shareFacebook(url) {
            Socialshare.share({
                'provider': 'facebook',
                'attrs': {
                    'socialshareText': 'Check out this data! @Organicity',
                    'socialshareTitle': 'Check out this data! @Organicity',
                    'socialshareDescription': 'I just found this asset on the Organicity Observatory you might like!',
                    'socialshareUrl': url
                }
            });
        }

        function shareEmail(url) {
            Socialshare.share({
                'provider': 'email',
                'attrs': {
                    'socialshareBody': 'I just found this asset on the Organicity Observatory you might like: ' + url,
                    'socialshareSubject': 'Check out this data! #Organicity'
                }
            });
        }

        function shareShortUrl(url) {
            clipboard.copyText(url);
            alert.success('A short url was copied to your clipboard!');
        }

        function getURL() {
            if ($location.absUrl().indexOf('?') > 0) {
                return $location.absUrl().substring(0, $location.absUrl().indexOf('?'));
            } else {
                $location.absUrl();
            }
        }

        function share(fn) {
            if (assetShortURL){ return fn(assetShortURL); }
            shortURL.shorten(getURL()).then(function(res) {
                assetShortURL = res.data.id;
                fn(assetShortURL);
            }, function() {
                alert.error('Sorry, there was a problem generating the shared url');
            });
        }

    }
})();
