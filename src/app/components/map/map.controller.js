(function() {
    'use strict';
    angular.module('app.components').controller('MapController', MapController);
    MapController.$inject = ['$scope', '$state', '$timeout', 'entitiesLayers', 'Overlays', 'entity', '$mdDialog', 'leafletData', 'mapUtils', 'markerUtils', 'alert', 'animation'];

    function MapController($scope, $state, $timeout, entitiesLayers, Overlays, entity, $mdDialog, leafletData, mapUtils, markerUtils, alert, animation) {

        var vm = this;

        vm.tiles = mapUtils.getBaseLayers().oc.url;
        
        vm.layers = {
            baselayers: mapUtils.getBaseLayers(),
            overlays: new Overlays(entitiesLayers)
        };

        vm.center = {
            lat: 48,
            lng: 18.5,
            zoom: 3
        };

        vm.defaults = {
            dragging: true,
            touchZoom: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true
        };

        vm.events = {
            map: {
                enable: ['dragend', 'zoomend', 'moveend', 'popupopen', 'popupclose', 'mousedown', 'dblclick', 'click', 'touchstart', 'mouseup'],
                logic: 'broadcast'
            }
        };

        animation.viewLoaded();

        $scope.$on('leafletDirectiveMarker.click', function(event, data) {
            console.log(data);
        });
    }
})();