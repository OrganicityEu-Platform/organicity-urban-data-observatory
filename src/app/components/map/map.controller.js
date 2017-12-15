(function() {
  'use strict';
  angular.module('app.components').controller('MapController', MapController);
  MapController.$inject = ['$scope', '$state', '$timeout', '$location', 'entitiesLayers', 'Overlays', 'asset', '$mdDialog', 'leafletData', 'mapUtils', 'markerUtils', 'alert', 'animation', 'leafletMapEvents'];

  function MapController($scope, $state, $timeout, $location, entitiesLayers, Overlays, asset, $mdDialog, leafletData, mapUtils, markerUtils, alert, animation, leafletMapEvents) {
    var vm = this;
    var updateType;
    var mapMoved = false;
    var mapClicked = false;

    vm.tiles = mapUtils.getBaseLayers().oc.url;

    vm.controls = {};

    vm.activeEntity = {}

    vm.entityLoading = true;

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
        enable: ['dragend', 'zoomend', 'moveend', 'popupopen', 'popupclose', 'mousedown', 'dblclick', 'click', 'touchstart', 'mouseup', 'load', 'viewreset'],
        logic: 'emit'
      }
    };

    animation.viewLoaded();

    $scope.$on('goToLocation', function(event, data) {
      goToLocation(event, data);
    });

    // $scope.$on('centerUrlHash', function(event, centerHash) {
    //     $location.search({ map: centerHash });
    // });

    $scope.$on('leafletDirectiveMap.organicityMap.moveend', function(event){
      movementEnded()
    });

    $scope.$on('entityLoaded', function(event, data) {
      vm.activeEntity = data;
      updateCenter();
      updateMarkers();
    });

    function movementEnded() {
      if(vm.entityLoading){
        updatePopups();
      } else {
        updateMarkers();
      }
    }

    function updateCenter(){
      vm.center = {
        lat: parseFloat(vm.activeEntity.lat),
        lng: parseFloat(vm.activeEntity.lng),
        zoom: 20
      };
    }

    function updatePopups(){
      // Tmp. Safety timeout
      $timeout(function() {

        leafletData.getLayers('organicityMap').then(function(layers) {
          activateMarkerPopup(vm.activeEntity, layers);
        });

        $scope.changeLocation = function(centerHash) {
          $location.search({ map: centerHash });
        };

        $scope.$on('centerMap', function(event, data) {
          vm.center = data.center;
        });

        vm.entityLoading = false;

      }, 2000);
    }

    function activateMarkerPopup(data, layers) {
        var overlays = layers.overlays;
        for (var overlay in overlays) {
          var currentMarker = _.find(overlays[overlay].getLayers(), function(marker) {
            if (data.id === marker.feature.properties.id) {
              marker.focus = true;
              marker.openPopup();
              return marker;
            }
          });
        }
    }

    function updateMarkers() {
      if (vm.center.zoom >= 8) {
        updateAreaMarkers();
      } else {
        updateClusters();
      }

      if (vm.controls.minimap) {
        vm.controls.minimap.toggleDisplay = (vm.center.zoom >= 8) ? true : false;
      }

    }

    function updateAreaMarkers() {

      vm.entityLoading = true;

      vm.center.radius = (vm.bounds) ? getDistanceInKm(vm.center, vm.bounds.southWest) : 0.5;

      var params = {
        lat: vm.center.lat,
        long: vm.center.lng,
        radius: vm.center.radius,
        km: 'true',
        per: 500
      };

      asset.getGeoJSON(params).then(function(data) {
        asset.setAllEntities(data);
        vm.layers = {
          baselayers: mapUtils.getBaseLayers(),
          // This is tmp.
          overlays: new Overlays(JSON.parse(JSON.stringify(data)), 'Asset Types')
        };
        vm.entityLoading = false;
      }, function(error) {
        vm.entityLoading = false;
        alert.error("Sorry, there was an error while updating the map. Please, reload the website.");
      });
    }

    function updateClusters() {
      // This is tmp.
      vm.entityLoading = true;
      var clusters = asset.getAllClusters();
      if (clusters) {
        vm.layers = {
          baselayers: mapUtils.getBaseLayers(),
          overlays: new Overlays(clusters, 'Asset Types')
        };
        vm.entityLoading = false;
      } else {
        asset.getClusterGeoJSON().then(function(data) {
          asset.setAllClusters(data);
          vm.layers = {
            baselayers: mapUtils.getBaseLayers(),
            overlays: new Overlays(data, 'Asset Types')
          };
          vm.entityLoading = false;
        }, function(error) {
          vm.entityLoading = false;
          alert.error("Sorry, there was an error while updating the map. Please, reload the website.");
        });
      }

    }

    function goToLocation(event, data){
      vm.center.lat = data.lat;
      vm.center.lng = data.lng;
      vm.center.zoom = getZoomLevel(data);
    }

    function getZoomLevel(data) {
      var LAYER_ZOOMS = [{name:'venue', zoom:18}, {name:'address', zoom:18}, {name:'neighbourhood', zoom:13}, {name:'locality', zoom:13}, {name:'localadmin', zoom:10}, {name:'county', zoom:10}, {name:'region', zoom:8}, {name:'country', zoom:7}, {name:'coarse', zoom:7}];
      if (!data.layer) {
        return 10;
      }
      return _.find(LAYER_ZOOMS, function(layer) {
        return layer.name === data.layer;
      }).zoom;
    }

    function getDistanceInKm(pointA, pointB) {
      var R = 6378.1; // Radius of the earth in km
      var dLat = deg2rad(pointB.lat - pointA.lat); // deg2rad below
      var dLng = deg2rad(pointB.lng - pointA.lng);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(pointA.lat)) * Math.cos(deg2rad(pointB.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

  }
})();
