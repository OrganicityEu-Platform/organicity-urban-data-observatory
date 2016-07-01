(function() {
    'use strict';
    angular.module('app.components').factory('Layer', ['markerUtils', function(markerUtils) {
        /**
         * Layer constructor
         * @constructor
         * @param {Object} FeatureCollection - geoJSON Object with entities layer
         */
        function Layer(FeatureCollection) {
            this.name = FeatureCollection.properties.name;
            this.type = 'geoJSONShape';
            this.visible = true;
            this.data = FeatureCollection;
            this.layerOptions = {
                cluster: true,
                showCoverageOnHover: false,
                iconCreateFunction: iconCreateFunction,
                onEachFeature: onEachFeature,
                pointToLayer: pointTolayer,
            }
        }

        return Layer;

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
            console.log(a);
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
            // Here the marker constructor
            var name = feature.properties.id; //feature.properties.id
            var popup = '<div class="popup"><div class="popup_top"><p class="popup_name">' + name + '</p><p class="popup_type">' + '</p><p class="popup_time"><md-icon class="popup_icon" md-svg-src="./assets/images/update_icon.svg"></md-icon>' + '</p></div><div class="popup_bottom"><p class="popup_location"><md-icon class="popup_icon" md-svg-src="./assets/images/location_icon_dark.svg"></md-icon>' + '</p><div class="popup_labels">' + '</div></div></div>';
            layer.bindPopup(popup);
            layer.on({
                click: whenClicked
            });
        }

        function whenClicked(e) {
            console.log("whenClicked");
            console.log(e);
        }

        function camelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
                return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        }
    }]);
})();