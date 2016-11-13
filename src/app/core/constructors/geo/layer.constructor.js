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

        function pointTolayer(obj) {
            var icon = L.divIcon(markerUtils.getIcon(markerUtils.parseLabels(obj.properties)));
            var c = obj.geometry.coordinates;
            var d = [];
            d[0] = c[1];
            d[1] = c[0];
            return L.marker(d, {
                icon: icon
            });
        }

        function iconCreateFunction(cluster) {
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
            var marker = new miniMarker(feature);
            layer.bindPopup(marker.popupHtml);
            layer.on({
                click: function() {
                    if(layer.feature.properties.id.indexOf('site') == -1) {
                        // This is an asset, zoom to it.
                        $state.transitionTo('layout.home.entity', { id: layer.feature.properties.id} ,
                        {
                          reload: false,
                          inherit: true,
                          notify: true
                        });
                    } else {
                        // This is cluster, zoom to it.
                        var center = {
                            lat: layer.feature.geometry.coordinates[1],
                            lng: layer.feature.geometry.coordinates[0],
                            zoom: 9
                        }
                        $rootScope.$broadcast('centerMap', {center: center});
                    }
                  }
            });
        }

        function camelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
                return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        }
    }]);
})();
