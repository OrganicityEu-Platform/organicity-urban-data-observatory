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

//    leafletData.getMap('organicityMap').then(function() {
//      vm.controls.minimap = {
//        type: 'minimap',
//        layer: mapUtils.getBaseLayers().oc,
//        toggleDisplay: true,
//        minimized: true,
//        zoomLevelOffset: -4
//      };
//    });

    $scope.$on('goToLocation', function(event, data) {
      goToLocation(event, data);
    });

    $scope.$on('centerUrlHash', function(event, centerHash) {
        $location.search({ map: centerHash });
    });

    $scope.changeLocation = function(centerHash) {
        $location.search({ map: centerHash });
    };

    $scope.$watch('vm.center.zoom', function() {
      updateMarkers();
    });

    $scope.$watch('vm.bounds', function() {
      updateMarkers();
    });

    $scope.$on('centerMap', function(event, data) {
      vm.center = data.center;
    });

    $scope.$on('entityLoaded', function(event, data) {

      vm.entityLoading = false;
      vm.center = {
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        zoom: 20
      };

      updateMarkers();

      $timeout(function(currentMarker) {
        leafletData.getLayers('organicityMap')
          .then(function(layers) {
            var overlays = layers.overlays;
            for (var o in overlays) {
              var currentMarker = _.find(overlays[o].getLayers(), function(marker) {
                if (data.id === marker.feature.properties.id) {
                  console.log(marker);
                  marker.focus = true;
                  marker.openPopup();
                  return marker;
                }
              });
            }
            entityLoaded = true;
          }, function(error) {
            console.log(error);
          });
      }, 250);
    });


    function updateMarkers() {
      if (vm.center.zoom >= 8) {
        safeFunction(updateAreaMarkers, 'lastMarkersUpdate', 1500);
      } else {
        safeFunction(updateClusters, 'lastClustersUpdate', 1500);
      }

      if (vm.controls.minimap) {
        vm.controls.minimap.toggleDisplay = (vm.center.zoom >= 8) ? true : false;
      }

    }

    function safeFunction(fn, time, interval) {
      if (!vm[time] || new Date().getTime() - vm[time] > interval) {
        fn();
        vm[time] = new Date().getTime();
      } 
    }

    function updateAreaMarkers() {
      vm.center.radius = (vm.bounds) ? getDistanceInKm(vm.center, vm.bounds.southWest) : 10;

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
          overlays: new Overlays(JSON.parse(JSON.stringify(data)), 'Asset Types')
        };
      }, function(error) {
        console.log(error);
      });
    }

    function updateClusters() {
      // This is tmp.
      var clusters = asset.getAllClusters();
      if (clusters) {
//        console.warn(clusters);
        vm.layers = {
          baselayers: mapUtils.getBaseLayers(),
          overlays: new Overlays(clusters, 'Asset Types')
        };
      } else {
        asset.getClusterGeoJSON().then(function(data) {
          console.warn(data);
          asset.setAllClusters(data);
          vm.layers = {
            baselayers: mapUtils.getBaseLayers(),
            overlays: new Overlays(data, 'Asset Types')
          };
        }, function(error) {
          console.log(error);
        });
      }

    }

    function goToLocation(event, data){
      vm.center.lat = data.lat;
      vm.center.lng = data.lng;
      vm.center.zoom = getZoomLevel(data);
    }

    function getZoomLevel(data) {
      console.log(data);
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
