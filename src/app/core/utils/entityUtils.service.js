(function() {
    'use strict';

    angular.module('app.components')
        .factory('entityUtils', entityUtils);

    entityUtils.$inject = ['asset', 'COUNTRY_CODES', 'Restangular'];

    function entityUtils(asset, COUNTRY_CODES, Restangular) {
        var service = {
            parseName: parseName,
            parseLocation: parseLocation,
            parseLabels: parseLabels,
            parseUserTags: parseUserTags,
            parseType: parseType,
            classify: classify,
            parseTime: parseTime,
            parseVersion: parseVersion,
            parseOwner: parseOwner,
            parseState: parseState,
            parseAvatar: parseAvatar,
            belongsToUser: belongsToUser,
            parseSensorTime: parseSensorTime,
            isOnline: isOnline,
            makeCase: makeCase,
            parseStateName: parseStateName,
            parseTypeURN: parseTypeURN,
            parseDescription: parseDescription,
            parseADSurl: parseADSurl,
            parseJSON: parseJSON
        };

        return service;


        ///////////////
        function parseName(object) {
            if (!object.id) {
                return;
            }

            var entityName = object.id.split(':');

            entityName = entityName.slice(4, entityName.length);
            entityName = _.map(entityName, unfoldCase);

            object.name = entityName.join(' ');

            return object.name;
        }

        function parseLocation(object) {
            var location = '';
            var locationSource = {};

            if (object.context && object.context.position && object.context.position.city && object.context.position.country) {
                locationSource = object.context.position;
            }

            /*jshint camelcase: false */
            var city = locationSource.city;
            var country_code = locationSource.country_code;
            var country = locationSource.country;


            if (!!city) {
                location += city;
            }
            if (!!country) {
                location += ', ' + country;
            }

            if (locationSource.justOwnerLocation){ location += ' (provider location)'; }

            return location;
        }

        function parseLabels(object) {
            var systemTags = [];
            var entityName;

            if (!object.name) {
                object.name = object.id || 'no:name'; //tmp.
            }

            systemTags.push((this.isOnline(object)) ? 'online' : 'offline');

            var entityTypeComp = parseTypeComponents(object);

            systemTags = systemTags.concat(entityTypeComp);

            entityName = object.id.split(':');

            var entityName = entityName.splice(3, entityName.length - 1); // Remove urn header
            var entityName = entityName.splice(0, entityName.length - 1); // Remove urn entity name

            systemTags = systemTags.concat(entityName);

            systemTags = _.uniq(_.map(systemTags, lowerCase));
            /*jshint camelcase: false */
            return systemTags;
        }

        function parseUserTags(object) {
            var user_tags = ['organicity']; //temp
            return user_tags;
        }

        function parseType(object) {
            var entityTypeComp = parseTypeComponents(object);
            if (entityTypeComp) {
                return _.map(entityTypeComp, unfoldCase).join(' ');
            } else {
                return 'Asset';
            }
        }

        function parseTypeURN(object) {
            if (object.type) {
                return object.type;
            } else {
                return 'Asset';
            }
        }

        function parseTypeComponents(object) {
            if (object.type) {
                var entityTypeComp = object.type.split(':');
                if (entityTypeComp && entityTypeComp.length <= 0){ return false; }
                entityTypeComp = _.reject(entityTypeComp, function(a) {
                    return ['oc', 'urn', 'entitytype'].indexOf(a.toLowerCase()) >= 0;
                });
                return entityTypeComp;
            } else {
                return false;
            }
        }

        function classify(entityType) {
            if (!entityType) {
                return '';
            }
            return entityType.toLowerCase().split(' ').join('_');
        }

        function parseTime(object) {
            /*jshint camelcase: false */
            return new Date(object.context.last_updated_at);
        }

        function parseVersion(object) {
            if (!object.entity) {
                return;
            }
            return object.entity.name.match(/[0-9]+.?[0-9]*/)[0];
        }

        function parseDescription(object) {
            if (_.contains(object.data.attributes.types, 'description') && object.data.attributes.data.description.value) {
                return object.data.attributes.data.description.value;
            } else {
                if (isExperimenter(object)) {
                    return 'This asset is provided by an Organicity Experiment.';
                } else {
                    return 'This ' + unfoldCase(object.context.service) +
                        ' asset is provided by the ' + object.context.position.city +
                        ' site through its ' + object.context.provider + '.';
                }
            }

        }

        function parseOwner(object) {
            if (isExperimenter(object)) {

                var owner = {
                    id: object.context.experimenter,
                    username: 'Experimenter ' + object.context.experimenter,
                    avatar: './mediassets/images/avatar.svg'
                };

                if (parseOrigin(object)) {
                    owner.description = parseOrigin(object);
                } else {
                    owner.description = '';
                }

                return owner;

            } else {

                var owner = {
                    id: object.related.site.id,
                    username: object.related.site.name + ' Site',
                    city: object.context.position.city,
                    country: object.context.position.country,
                    avatar: './mediassets/images/avatar.svg'
                };

                if (parseOrigin(object)) {
                    owner.description = parseOrigin(object);
                } else {
                    owner.description = object.related.site.description;
                }

                return owner;
            }
        }

        function parseOrigin(object) {
            if (_.contains(object.data.attributes.types, 'origin')) {
                if (object.data.attributes.data.origin.value) {
                    return object.data.attributes.data.origin.value;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        function isExperimenter(object) {
            return object.context.experimenter ? true : false;
        }

        function parseState(object) {
            var name = this.parseStateName(object);
            var className = classify(name);
            return {
                name: name,
                className: className
            };
        }

        function parseStateName(object) {
            if (!object.state) {
                object.state = (object.data.attributes.length > 0) ? 'has_published' : 'never_published';
            }
            return object.state.replace('_', ' ');
        }

        function parseADSurl(object) {
            return 'https://discovery.organicity.eu/v0/assets/' + object.uuid;
        }

        function parseJSON(object) {
            return Restangular.stripRestangular(object);
        }

        function parseAvatar() {
            return './mediassets/images/avatar.svg';
        }

        function parseSensorTime(sensor) {
            /*jshint camelcase: false */
            return moment(sensor.recorded_at).format('');
        }

        function belongsToUser(entititesArray, entityID) {

            return entititesArray;
            // return _.some(entititesArray, function(entity) {
            //   return entity.id === entityID;
            // });
        }

        function isOnline(object) {
            var time = this.parseTime(object);
            var timeDifference = (new Date() - new Date(time)) / 1000;
            if (!time || timeDifference > 7 * 24 * 60 * 60) { //a week
                return false;
            } else {
                return true;
            }
        }

        function unfoldCase(str) {
            return str.replace(/([A-Z][a-z])/g, ' $1').replace(/^./, function(str) {
                return str.toUpperCase();
            });
        }

        function lowerCase(str) {
            return str.toLowerCase();
        }

        function makeCase(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    }
})();
