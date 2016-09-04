(function() {
    'use strict';
    angular.module('app.components').controller('MapController', MapController);
    MapController.$inject = ['$scope', '$state', '$timeout', '$location', 'entitiesLayers', 'Overlays', 'entity', '$mdDialog', 'leafletData', 'mapUtils', 'markerUtils', 'alert', 'animation'];

    function MapController($scope, $state, $timeout, $location, entitiesLayers, Overlays, entity, $mdDialog, leafletData, mapUtils, markerUtils, alert, animation) {

        var vm = this;

        vm.tiles = mapUtils.getBaseLayers().oc.url;

        vm.controls = {};

        vm.layers = {
            baselayers: mapUtils.getBaseLayers(),
            overlays: new Overlays(entitiesLayers, 'Asset Types')
        };

        vm.center = {
            lat: 48,
            lng: 18.5,
            zoom: 4
        };

        vm.defaults = {
            dragging: true,
            touchZoom: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            layers: {
                visible: true,
                position: 'topleft',
                collapsed: false
            }
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

        leafletData.getMap().then(function() {
           vm.controls.minimap = {
               type: 'minimap',
               layer: mapUtils.getBaseLayers().oc,
               toggleDisplay: true,
               minimized: true,
               zoomLevelOffset: -4
           };
       });

       $scope.$watch('vm.center.zoom', function(zoom) {
           console.log(zoom);
           if (zoom >=8) {
             var params = { lat: vm.center.lat, long: vm.center.lng }
             entity.getGeoJSON(params).then(function(data) {
               console.log(data)
               return JSON.parse(data);
             }, function(error){
               console.log(error);
               // return [JSON.parse(FIXTURE_C)];
             });
           }
           if (vm.controls.minimap) {
              vm.controls.minimap.toggleDisplay = (zoom > 10) ? true : false;
              console.log(vm.controls.minimap.toggleDisplay);
           }
       });

        /* Just an idea
        http://blog.thematicmapping.org/2012/10/how-to-control-your-leaflet-map-with.html
        $scope.$on('centerUrlHash', function(event, centerHash) {
            console.log(centerHash);
            $location.search({ c: centerHash });
        });


        */
    }
})();
