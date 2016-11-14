(function() {
    'use strict';
    angular.module('app.components').controller('MapController', MapController);
    MapController.$inject = ['$scope', '$state', '$timeout', '$location', 'entitiesLayers', 'Overlays', 'asset', '$mdDialog', 'leafletData', 'mapUtils', 'markerUtils', 'alert', 'animation'];

    function MapController($scope, $state, $timeout, $location, entitiesLayers, Overlays, asset, $mdDialog, leafletData, mapUtils, markerUtils, alert, animation) {
        var vm = this;
        var updateType;
        var mapMoved = false;
        var entityLoaded = false;
        var mapClicked = false;

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
                logic: 'emit'
            }
        };

        animation.viewLoaded();

      $scope.$on('click', function(event, data) {
          console.log(data);
          // var id = data.leafletEvent.target.options.myData.id;
          //
          // vm.entityLoading = true;
          // vm.center.lat = data.leafletEvent.latlng.lat;
          // vm.center.lng = data.leafletEvent.latlng.lng;
          //
          // if(id === parseInt($state.params.id)) {
          //   $timeout(function() {
          //     vm.entityLoading = false;
          //   }, 0);
          //   return;
          // }
          //
          // focusedMarkerID = data.leafletEvent.target.options.myData.id;
          //
          // updateType = 'map';
          // id = data.leafletEvent.target.options.myData.id;
          // var availability = data.leafletEvent.target.options.myData.labels[0];
          // console.log(data);
          // ga('send', 'event', 'entity Marker', 'click', availability);
          //
          // $state.go('layout.home.entity', {id: id});

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
           watchZoom(zoom);
       });

       $scope.$on('centerMap', function(event, data) {
          vm.center = data.center;
       });

       $scope.$on('entityLoaded', function(event, data) {
         console.log(data);
         vm.entityLoading = false;
         vm.center = {
             lat: parseFloat(data.lat),
             lng: parseFloat(data.lng),
             zoom: 20
         };
         watchZoom(vm.center.zoom);

         $timeout(function(currentMarker) {
           leafletData.getLayers('organicityMap')
             .then(function(layers) {
               var overlays = layers.overlays;
               for (var o in overlays) {
                 var currentMarker = _.find(overlays[o].getLayers(), function(marker) {
                   if(data.id === marker.feature.properties.id) {
                     console.log(marker)
                     marker.focus = true;
                     marker.openPopup();
                     return marker;
                   }
                 });
               }
             entityLoaded = true;
             }, function(error){
               console.log(error);
             });
         }, 3000);
       });

       function watchZoom(zoom){
         if (zoom >=8) {
           var params = { lat: vm.center.lat, long: vm.center.lng, radius: '10'};
           asset.getGeoJSON(params).then(function(data) {
             asset.setAllEntities(data);
             vm.layers = {
                 baselayers: mapUtils.getBaseLayers(),
                 overlays: new Overlays(JSON.parse(JSON.stringify(data)), 'Asset Types')
             };
           }, function(error){
             console.log(error);
           });
         } else {
            // This is tmp.
            asset.getClusterGeoJSON().then(function(data) {
                asset.setAllEntities(data);
                vm.layers = {
                   baselayers: mapUtils.getBaseLayers(),
                   overlays: new Overlays(entitiesLayers, 'Asset Types')
                };
            }, function(error){
              console.log(error);
            });
          }
         if (vm.controls.minimap) {
            vm.controls.minimap.toggleDisplay = (zoom >= 8) ? true : false;
         }
       }
    }
})();
