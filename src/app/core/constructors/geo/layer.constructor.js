(function() {
    'use strict';
    angular.module('app.components').factory('Layer', ['miniMarker', 'markerUtils', '$state', '$rootScope', function(miniMarker, markerUtils, $state, $rootScope) {
        /**
         * Layer constructor
         * @constructor
         * @param {Object} FeatureCollection - geoJSON Object with entities layer
         */
        function Layer(FeatureCollection, group) {
            this.name = markerUtils.parseEntityType(FeatureCollection.properties);
            this.type = 'geoJSONShape';
            this.visible = true;
            this.data = FeatureCollection;
            this.alldata = FeatureCollection;
            this.layerOptions = {
                cluster: true,
                showCoverageOnHover: false,
                iconCreateFunction: iconCreateFunction,
                onEachFeature: onEachFeature,
                pointToLayer: pointTolayer,
            };
            this.disablePoints = disablePoints;
            this.doRefresh = false;
            if (group) {
              this.group = group;
            }
        }

        return Layer;

        function disablePoints(myScope) {
             this.data =  _.filter(this.data.features, function(feature){ return feature.geometry.type !== 'Point';});
             this.doRefresh = true;
             myScope.$apply();
        }

        function pointTolayer(point) {
            var c = point.geometry.coordinates;
            var d = [];
            d[0] = c[1];
            d[1] = c[0];
            return L.marker(d, {
                icon: makeIcon(point)
            });
        }

        function makeIcon(feature) {
            if (isCluster(feature)) {  
                return L.divIcon({html: '<div><span>' + feature.properties.count + '</span></div>', className: 'marker-cluster  marker-cluster-large', iconSize: new L.Point(40, 40) });
            } else {
                return L.divIcon(markerUtils.getIcon(markerUtils.parseLabels(feature.properties)));
            }
        }
        
        function iconCreateFunction(cluster) { // This is just for the auto-markers
            var childCount = cluster.getChildCount();
            var a = cluster.getAllChildMarkers();
            var c = ' marker-cluster-';
            if (childCount < 5) {
                c += 'small';
            } else if (childCount < 40) {
                c += 'medium';
            } else {
                c += 'large';
            }
            return new L.DivIcon({
                html: '<div><span>' + childCount + '</span></div>',
                className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40)
            });
        }

        function onEachFeature(feature, layer) {
            if (isCluster(feature)) {  
                layer.icon = 'tag';       
                layer.on({
                    click: function() {
                        // This is cluster, zoom to it.
                        var center = {
                            lat: layer.feature.geometry.coordinates[1],
                            lng: layer.feature.geometry.coordinates[0],
                            zoom: 11
                        };
                        $rootScope.$broadcast('centerMap', {center: center});
                    }
                });
            } else {
                var marker = new miniMarker(feature);
                layer.bindPopup(marker.popupHtml);  
                layer.on({
                    click: function() {
                        // This is an asset, zoom to it.
                        $state.transitionTo('layout.home.entity', { id: layer.feature.properties.id} ,
                        { 
                          reload: false,
                          inherit: true,
                          notify: true
                        });  
                    }
                });
            }
        }

        function isCluster(feature) {
            return (feature.properties.id.indexOf('site') === -1) ? false : true;
        }

    }]);
})();
