(function() {
    'use strict';
    angular.module('app.components').controller('MapController', MapController);
    MapController.$inject = ['$scope', '$state', '$timeout', '$location', 'entitiesLayers', 'Overlays', 'asset', '$mdDialog', 'leafletData', 'mapUtils', 'markerUtils', 'alert', 'animation'];

    function MapController($scope, $state, $timeout, $location, entitiesLayers, Overlays, asset, $mdDialog, leafletData, mapUtils, markerUtils, alert, animation) {

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
                logic: 'emit'
            }
        };

        animation.viewLoaded();

        leafletData.getMap().then(function() {
           vm.controls.minimap = {
               type: 'minimap',
               layer: mapUtils.getBaseLayers().oc,
               toggleDisplay: true,
               minimized: true,
               zoomLevelOffset: -4
           };
       });

       vm.z = { lat: vm.center.lat, long: vm.center.lng, radius: '10' };;

       $scope.$watch('vm.center.zoom', function(zoom) {
           updateMarkers(); 
           if (vm.controls.minimap) {
              vm.controls.minimap.toggleDisplay = (zoom >= 8) ? true : false;
           }
       });

       $scope.$watch('vm.bounds', function() {
          updateMarkers();
       });

      function updateMarkers(){
        // if (vm.center.zoom >= 8 && !isDataWithin()) {
        if (vm.center.zoom >= 8) {
         var radius = getDistanceFromLatLonInKm(vm.center.lat, vm.center.lng, vm.bounds.northEast.lat, vm.bounds.northEast.lng);
          
        console.log(radius);

         var params = { lat: vm.center.lat, long: vm.center.lng, radius: radius};
 
         asset.getGeoJSON(params).then(function(data) {
            asset.setAllEntities(data);
            vm.layers.overlays = new Overlays(data, 'Asset Types');
            vm.z = params;
         }, function(error){
           console.log(error);
         });
       }
      } 

      function isDataWithin(){
        var e = isRadiousInsideBoundingBox(vm.z.lat, vm.z.long, vm.z.radius, vm.bounds.northEast.lat, vm.bounds.northEast.lng, vm.bounds.southWest.lat, vm.bounds.northEast.lng); 
        console.log(e);
        return e;
       }
    
       // This might go to new service //

      function isRadiousInsideBoundingBox( cLat,  cLon,  cRadius,  rlat1,  rlon1,  rlat2,  rlon2,  rlat3,  rlon3,  rlat4,  rlon4) {
          var d1 = getDistanceFromLatLonInKm(cLat, cLon, rlat1, rlon1);
          var d2 = getDistanceFromLatLonInKm(cLat, cLon, rlat2, rlon2);
          var d3 = getDistanceFromLatLonInKm(cLat, cLon, rlat3, rlon3);
          var d4 = getDistanceFromLatLonInKm(cLat, cLon, rlat4, rlon4);

          if (d1 <= cRadius || d2 <= cRadius || d3 <= cRadius || d4 <= cRadius) {
              return true;
          }

          var width = getDistanceFromLatLonInKm(rlat1, rlon1, rlat2, rlon2);
          var height = getDistanceFromLatLonInKm(rlat1, rlon1, rlat4, rlon4);

          if (d1 >= cRadius && d2 >= cRadius && d3 >= cRadius && d4 >= cRadius && width >= d1 && width >= d2 && width >= d3 && width >= d4 && height >= d1 && height >= d2 && height >= d3 && height >= d4) {
              return false;
          }

          return false;
      }

      function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
      }

      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }

       // $scope.$on("centerUrlHash", function(event, centerHash) {
       //     $location.search({ c: centerHash });
       // });

       // $scope.changeLocation = function(centerHash) {
       //     $location.search({ c: centerHash });
       // };

 
    }
})();
