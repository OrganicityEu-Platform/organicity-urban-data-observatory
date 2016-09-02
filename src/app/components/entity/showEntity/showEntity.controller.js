(function () {
  'use strict';

  angular.module('app.components')
    .controller('entityController', entityController);

    entityController.$inject = ['$state','$scope', '$stateParams', 'entityData',
      'ownerEntitites', 'utils', 'sensor', 'fullEntity', '$mdDialog', 'belongsToUser',
      'timeUtils', 'animation', '$location', 'auth', 'entityUtils', 'userUtils',
      '$timeout', 'mainSensors', 'compareSensors', 'alert', '$q', 'entity',
      'HasSensorEntity', 'geolocation'];
    function entityController($state, $scope, $stateParams, entityData,
      ownerEntitites, utils, sensor, fullEntity, $mdDialog, belongsToUser,
      timeUtils, animation, $location, auth, entityUtils, userUtils,
      $timeout, mainSensors, compareSensors, alert, $q, entity,
      HasSensorEntity, geolocation) {

      var vm = this;
      var sensorsData = [];

      var mainSensorID, compareSensorID;
      var picker = initializePicker();

      if(entityData){
        animation.entityLoaded({lat: entityData.latitude ,lng: entityData.longitude, id: parseInt($stateParams.id) });
      }

    vm.hasHistorical = false;

    vm.entity = entityData;
    vm.ownerEntitites = ownerEntitites;
    vm.entityBelongsToUser = belongsToUser;
    vm.removeUser = removeUser;

    vm.battery = undefined;
    vm.sensors = mainSensors ? mainSensors : undefined;
    vm.sensorsToCompare = compareSensors;

    vm.slide = slide;

    vm.selectedSensor = (vm.sensors && vm.sensors.length > 0) ? vm.sensors[0].uuid : undefined;
    vm.selectedSensorData = {};

    vm.selectedSensorToCompare = undefined;
    vm.selectedSensorToCompareData = {};

    vm.showSensorOnChart = showSensorOnChart;
    vm.moveChart = moveChart;
    vm.loadingChart = true;

    vm.geolocate = geolocate;


    vm.reputation=undefined; //todo load reputation asset attribute to vm object
    vm.like = undefined;
    vm.reliability = undefined;
    vm.availability = undefined;
    vm.usability = undefined;

    function watchReliability() {
      $scope.$watch('vm.reliability', function (newVal, oldVal) {
        if (oldVal == newVal) return;
        if (newVal == undefined) return;
        var annotationObject = {
          annotationId: null,
          application: 'urn:oc:application:reputation',
          assetUrn: vm.entity.uuid,
          datetime: null,
          numericValue: vm.reliability,
          tagUrn: 'urn:oc:tag:Reliability:Score',
          textValue: 'No Text Value',
          user: 'UserA'
        }
        annotation.pushAnnotation(vm.entity.uuid, annotationObject).then(
          function (response) {
            console.log("annotation completed");
          },
          function (response) {
            console.log("failed");
          });
      });
    }

    function getReliability() {
      annotation.getAnnotation(vm.entity.uuid, 'UserA', 'urn:oc:application:reputation', 'urn:oc:tag:Reliability:Score').then( //todo fix user
        function (response) {
          console.log(response);
          if (response.numericValue != undefined) {
            vm.reliability = response.numericValue;
          }
          watchReliability();
        },
        function (response) {
          console.log(response);
          watchReliability()
        });
    }

    function watchAvailability() {
      $scope.$watch('vm.availability', function (newVal, oldVal) {
        if (oldVal == newVal) return;
        if (newVal == undefined) return;
        var annotationObject = {
          annotationId: null,
          application: 'urn:oc:application:reputation',
          assetUrn: vm.entity.uuid,
          datetime: null,
          numericValue: vm.availability,
          tagUrn: 'urn:oc:tag:Availability:Score',
          textValue: 'No Text Value',
          user: 'UserA'
        }
        annotation.pushAnnotation(vm.entity.uuid, annotationObject).then(
          function (response) {
            console.log("annotation completed");
          },
          function (response) {
            console.log("failed");
          });
      });
    }

    function getAvailability() {
      annotation.getAnnotation(vm.entity.uuid, 'UserA', 'urn:oc:application:reputation', 'urn:oc:tag:Availability:Score').then( //todo fix user
        function (response) {
          console.log(response);
          if (response.numericValue != undefined) {
            vm.availability = response.numericValue;
          }
          watchAvailability();
        },
        function (response) {
          console.log(response);
          watchAvailability()
        });
    }

    function watchUsability() {
      $scope.$watch('vm.usability', function (newVal, oldVal) {
        if (oldVal == newVal) return;
        if (newVal == undefined) return;
        var annotationObject = {
          annotationId: null,
          application: 'urn:oc:application:reputation',
          assetUrn: vm.entity.uuid,
          datetime: null,
          numericValue: vm.usability,
          tagUrn: 'urn:oc:tag:Usability:Score',
          textValue: 'No Text Value',
          user: 'UserA'
        }
        annotation.pushAnnotation(vm.entity.uuid, annotationObject).then(
          function () {
            console.log("annotation completed");
          },
          function () {
            console.log("failed");
          });
      });
    }

      initialize();

      ///////////////

      function initialize() {
        debugger;
        $timeout(function() {
          colorSensorMainIcon();
          colorArrows();
          colorClock();
          // events below can probably be refactored to use $viewContentLoaded https://github.com/angular-ui/ui-router/wiki#user-content-view-load-events
          animation.viewLoaded();
          animation.mapStateLoaded();
        }, 1000);

        if(vm.entity){
          if(vm.entity.state.name === 'never published' || vm.entity.state.name === 'not configured') {
            if(vm.entityBelongsToUser) {
              alert.info.noData.owner($stateParams.id);
            } else {
              alert.info.noData.visitor();
            }
            $timeout(function() {
              animation.entityWithoutData({belongsToUser: vm.entityBelongsToUser});
            }, 1000);
          } else if(!timeUtils.isWithin(1, 'months', vm.entity.time)) {
            alert.info.longTime();
          }else{
            if(geolocation.isHTML5GeolocationGranted()){
              geolocate();
            }
          }
          watchUsability();
        },
        function (response) {
          console.log(response);
          watchUsability()
        });
    }

    function watchLike() {
      $scope.$watch('vm.like', function (newVal, oldVal) {
        if (oldVal == newVal) return;
        if (newVal == undefined) return;
        var tag = 'urn:oc:tag:DirectFeedback:Like';
        if (newVal == 'false') {
          tag = 'urn:oc:tag:DirectFeedback:Dislike';
        }
        var annotationObject = {
          annotationId: null,
          application: 'urn:oc:application:reputation',
          assetUrn: vm.entity.uuid,
          datetime: null,
          numericValue: undefined,
          tagUrn: tag,
          textValue: 'No Text Value',
          user: 'UserA'
        }
        annotation.pushAnnotation(vm.entity.uuid, annotationObject).then(
          function (response) {
            console.log("annotation completed");
          },
          function (response) {
            console.log("failed" + response);
          });
      });
    }

    function getLike() {
      annotation.getAnnotationForApplication(vm.entity.uuid, 'UserA', 'urn:oc:application:reputation', 'urn:oc:tagDomain:DirectFeedback').then( //todo fix user
        function (response) {
          console.log(response);
          if (response.tagUrn != undefined) {
            if (response.tagUrn == 'urn:oc:tag:DirectFeedback:Dislike')
              vm.like = 'false';
            else
              vm.like = 'true';
          }
          watchLike();
        },
        function (response) {
          console.log(response);
          vm.like = undefined;
          watchLike();
        });
    }

    function updateReputation(){
      if (vm.sensors) {
        for (var sensor in vm.sensors) {
          if (vm.sensors[sensor].uuid == 'urn_oc_attributeType_reputation') {
              vm.reputation=vm.sensors[sensor].value;
          }
        }
      }
    }

    // event listener on change of value of main sensor selector
    $scope.$watch('vm.selectedSensor', function (newVal, oldVal) {
      vm.selectedSensorToCompare = undefined;
      vm.selectedSensorToCompareData = {};
      vm.chartDataCompare = [];
      compareSensorID = undefined;
      if (vm.sensors) {
        vm.sensors.forEach(function (sensor) {
          if (sensor.uuid === newVal) {
            _.extend(vm.selectedSensorData, sensor);
          }
        });
      }
      vm.sensorsToCompare = getSensorsToCompare();
      $timeout(function () {
        colorSensorMainIcon();
        colorSensorCompareName();
        setSensor({type: 'main', value: newVal});
        changeChart([mainSensorID]);
      }, 100);

    });

    // event listener on change of value of compare sensor selector
    $scope.$watch('vm.selectedSensorToCompare', function (newVal, oldVal) {
      vm.sensorsToCompare.forEach(function (sensor) {
        if (sensor.uuid === newVal) {
          _.extend(vm.selectedSensorToCompareData, sensor);
        }
      });

      $timeout(function () {
        colorSensorCompareName();
        setSensor({type: 'compare', value: newVal});

        if (oldVal === undefined && newVal === undefined) {
          return;
        }
        changeChart([compareSensorID]);
      }, 100);

    });

    $scope.$on('hideChartSpinner', function () {
      vm.loadingChart = false;
    });

    initialize();

    ///////////////

    function initialize() {
      $timeout(function () {
        colorSensorMainIcon();
        colorArrows();
        colorClock();
        // events below can probably be refactored to use $viewContentLoaded https://github.com/angular-ui/ui-router/wiki#user-content-view-load-events
        animation.viewLoaded();
        animation.mapStateLoaded();
      }, 1000);

      if (vm.entity) {
        getReliability();
        getAvailability();
        getUsability();
        getLike();
        updateReputation();

        if (vm.entity.state.name === 'never published' || vm.entity.state.name === 'not configured') {
          if (vm.entityBelongsToUser) {
            alert.info.noData.owner($stateParams.id);
          } else {
            alert.info.noData.visitor();
          }
          $timeout(function () {
            animation.entityWithoutData({belongsToUser: vm.entityBelongsToUser});
          }, 1000);
        } else if (!timeUtils.isWithin(1, 'months', vm.entity.time)) {
          alert.info.longTime();
        } else {
          if (geolocation.isHTML5GeolocationGranted()) {
            geolocate();
          }
        }

        options.from = options && options.from || picker.getValuePickerFrom();
        options.to = options && options.to || picker.getValuePickerTo();

        //show spinner
        vm.loadingChart = true;
        //grab chart data and save it

        // it can be either 2 sensors or 1 sensor, so we use $q.all to wait for all
        $q.all(
          _.map(sensorsID, function(sensorID) {
            var id = vm.entity.uuid;//$stateParams.id
            return getChartData(id, sensorID, options.from, options.to)
              .then(function(data) {
                return data;
              });
          })
        ).then(function() {
          // after all sensors resolve, prepare data and attach it to scope
          // the variable on the scope will pass the data to the chart directive
          vm.chartDataMain = prepareChartData([mainSensorID, compareSensorID]);
        });
      }
      // calls api to get sensor data and saves it to sensorsData array
      function getChartData(entityID, sensorID, dateFrom, dateTo, options) {
        return sensor.getSensorsDataNew(entityID, sensorID, dateFrom, dateTo)
          .then(function(data) {
            sensorsData[sensorID] = data.readings;
            return data;
          }, function(data) {
            sensorsData[sensorID] = [];
            return data;
          });
      }
    }

    function removeUser() {
    }

    function showSensorOnChart(sensorID) {
      vm.selectedSensor = sensorID;
    }

    function slide(direction) {
      var slideContainer = angular.element('.sensors_container');
      var scrollPosition = slideContainer.scrollLeft();
      var slideStep = 20;

      if (direction === 'left') {
        slideContainer.scrollLeft(scrollPosition + slideStep);
      } else if (direction === 'right') {
        slideContainer.scrollLeft(scrollPosition - slideStep);
      }
    }

    function getSensorsToCompare() {
      return vm.sensors ? vm.sensors.filter(function (sensor) {
        return sensor.uuid !== vm.selectedSensor;
      }) : [];
    }

    function changeChart(sensorsID, options) {
      if (!sensorsID[0]) {
        return;
      }

      if (!options) {
        options = {};
      }
      options.from = options && options.from || picker.getValuePickerFrom();
      options.to = options && options.to || picker.getValuePickerTo();

      //show spinner
      vm.loadingChart = true;
      //grab chart data and save it

      // it can be either 2 sensors or 1 sensor, so we use $q.all to wait for all
      $q.all(
        _.map(sensorsID, function (sensorID) {
          var id = vm.entity.uuid;//$stateParams.id
          return getChartData(id, sensorID, options.from, options.to)
            .then(function (data) {
              return data;
            });
        })
      ).then(function () {
        // after all sensors resolve, prepare data and attach it to scope
        // the variable on the scope will pass the data to the chart directive
        vm.chartDataMain = prepareChartData([mainSensorID, compareSensorID]);
      });
    }

    // calls api to get sensor data and saves it to sensorsData array
    function getChartData(deviceID, sensorID, dateFrom, dateTo, options) {
      return sensor.getSensorsDataNew(deviceID, sensorID, dateFrom, dateTo)
        .then(function (data) {
          sensorsData[sensorID] = data.readings;
          return data;
        }, function (data) {
          sensorsData[sensorID] = [];
          return data;
        });
    }

    function prepareChartData(sensorsID) {
      var compareSensor;
      var parsedDataMain = parseSensorData(sensorsData, sensorsID[0]);

      if (parsedDataMain.length === 0) { //tmp. quick fix
        vm.hasHistorical = false;
      } else {
        vm.hasHistorical = true;
      }

      var mainSensor = {
        data: parsedDataMain,
        color: vm.selectedSensorData.color,
        unit: vm.selectedSensorData.unit
      };
      if (sensorsID[1] && sensorsID[1] !== -1) {
        var parsedDataCompare = parseSensorData(sensorsData, sensorsID[1]);
        compareSensor = {
          data: parsedDataCompare,
          color: vm.selectedSensorToCompareData.color,
          unit: vm.selectedSensorToCompareData.unit
        };
      }
      var newChartData = [mainSensor, compareSensor];
      return newChartData;
    }

    function parseSensorData(data, sensorID) {
      if (data[sensorID].length === 0) {
        return [];
      }
      return data[sensorID].map(function (dataPoint) {
        var time = moment(new Date(dataPoint.datetime)).format('YYYY-MM-DD[T]HH:mm:ss[Z]'); //tmp. ensure validation
        var value = Number(dataPoint.value);
        var count = value === null ? 0 : value;

        return {
          time: time,
          count: count,
          value: value
        };
      });
    }

    function setSensor(options) {
      var sensorID = options.value;
      if (sensorID === undefined) {
        return;
      }
      if (options.type === 'main') {
        mainSensorID = sensorID;
      } else if (options.type === 'compare') {
        compareSensorID = sensorID;
      }
    }

    function colorSensorMainIcon() {
      var svgContainer = angular.element('.sensor_icon_selected');
      var parent = svgContainer.find('.container_parent');
      parent.css('fill', vm.selectedSensorData.color);
    }

    function colorSensorCompareName() {
      var name = angular.element('.sensor_compare').find('md-select-label').find('span');
      name.css('color', vm.selectedSensorToCompareData.color || 'white');
      var icon = angular.element('.sensor_compare').find('md-select-label').find('.md-select-icon');
      icon.css('color', 'white');
    }

    function colorArrows() {
      var svgContainer;

      svgContainer = angular.element('.chart_move_left').find('svg');
      svgContainer.find('.fill_container').css('fill', '#03252D');

      svgContainer = angular.element('.chart_move_right').find('svg');
      svgContainer.find('.fill_container').css('fill', '#4E656B');
    }

    function colorClock() {
      var svgContainer = angular.element('.entity_time_icon');
      svgContainer.find('.stroke_container').css({'stroke-width': '0.5px', 'stroke': '#A4B0B3'});
      svgContainer.find('.fill_container').css('fill', '#A4B0B3');
    }

    function getSecondsFromDate(date) {
      return (new Date(date)).getTime();
    }

    function getCurrentRange() {
      return getSecondsFromDate(picker.getValuePickerTo()) - getSecondsFromDate(picker.getValuePickerFrom());
    }

    function moveChart(direction) {
      var valueTo, valueFrom;
      //grab current date range
      var currentRange = getCurrentRange();

      if (direction === 'left') {
        //set both from and to pickers to prev range
        valueTo = picker.getValuePickerFrom();
        valueFrom = getSecondsFromDate(picker.getValuePickerFrom()) - currentRange;
        picker.setValuePickers([valueFrom, valueTo]);
      } else if (direction === 'right') {
        var today = timeUtils.getToday();
        var currentValueTo = picker.getValuePickerTo();
        if (timeUtils.isSameDay(today, currentValueTo)) {
          return;
        }

        //set both from and to pickers  to next range
        valueFrom = picker.getValuePickerTo();
        valueTo = getSecondsFromDate(picker.getValuePickerTo()) + currentRange;
        picker.setValuePickers([valueFrom, valueTo]);
      }
    }

    //hide everything but the functions to interact with the pickers
    function initializePicker() {
      var updateType = 'single'; //set update type to single by default

      /*jshint camelcase: false*/
      var from_$input = angular.element('#picker_from').pickadate({
        onOpen: function () {
          ga('send', 'event', 'entity Chart', 'click', 'Date Picker');
        },
        onClose: function () {
          angular.element(document.activeElement).blur();
        },
        container: 'body',
        klass: {
          holder: 'picker__holder picker_container'
        }
      });
      var from_picker = from_$input.pickadate('picker');

      var to_$input = angular.element('#picker_to').pickadate({
        onOpen: function () {
          ga('send', 'event', 'entity Chart', 'click', 'Date Picker');
        },
        onClose: function () {
          angular.element(document.activeElement).blur();
        },
        container: 'body',
        klass: {
          holder: 'picker__holder picker_container'
        }
      });
      var to_picker = to_$input.pickadate('picker');

      if (from_picker.get('value')) {
        to_picker.set('min', from_picker.get('select'));
      }
      if (to_picker.get('value')) {
        from_picker.set('max', to_picker.get('select'));
      }

      from_picker.on('set', function (event) {
        if (event.select) {
          if (to_picker.get('value') && updateType === 'single') {
            var sensors = [mainSensorID, compareSensorID];
            sensors = sensors.filter(function (sensor) {
              return sensor;
            });
            changeChart(sensors, {
              from: from_picker.get('value'),
              to: to_picker.get('value')
            });
          }
          to_picker.set('min', from_picker.get('select'));
        } else if ('clear' in event) {
          to_picker.set('min', false);
        }
      });

      to_picker.on('set', function (event) {
        if (event.select) {
          if (from_picker.get('value')) {
            var sensors = [mainSensorID, compareSensorID];
            sensors = sensors.filter(function (sensor) {
              return sensor;
            });
            changeChart(sensors, {
              from: from_picker.get('value'),
              to: to_picker.get('value')
            });
          }
          from_picker.set('max', to_picker.get('select'));
        } else if ('clear' in event) {
          from_picker.set('max', false);
        }
      });

      //set to-picker max to today
      to_picker.set('max', new Date());

      function getToday() {
        return getSecondsFromDate(new Date());
      }

      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
            if(!position){
              alert.error('Please, allow Organicity to geolocate your' +
                'position so we can find a entity near you.');
              return;
            }

            geolocation.grantHTML5Geolocation();

            var location = {
              lat:position.coords.latitude,
              lng:position.coords.longitude
            };
            entity.getEntities(location)
              .then(function(data){
                data = data.plain();

                _(data)
                  .chain()
                  .map(function(entity) {
                    return new HasSensorEntity(entity);
                  })
                  .filter(function(entity) {
                    return !!entity.longitude && !!entity.latitude;
                  })
                  .find(function(entity) {
                    return _.contains(entity.labels, 'online');
                  })
                  .tap(function(closestentity) {
                    if(closestentity) {
                      $state.go('layout.home.entity', {id: closestentity.id});
                    } else {
                      $state.go('layout.home.entity', {id: data[0].id});
                    }
                  })
                  .value();
              });
          });
        }
        //set to-picker to today
        to_picker.set('select', getToday());
      }

      // api to interact with the picker from outside
      return {
        getValuePickerFrom: function () {
          return from_picker.get('value');
        },
        setValuePickerFrom: function (newValue) {
          updateType = 'single';
          from_picker.set('select', newValue);
        },
        getValuePickerTo: function () {
          return to_picker.get('value');
        },
        setValuePickerTo: function (newValue) {
          updateType = 'single';
          to_picker.set('select', newValue);
        },
        setValuePickers: function (newValues) {
          var from = newValues[0];
          var to = newValues[1];

          updateType = 'pair';
          from_picker.set('select', from);
          to_picker.set('select', to);
        }
      };
    }

    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          if (!position) {
            alert.error('Please, allow Organicity to geolocate your' +
              'position so we can find a entity near you.');
            return;
          }

          geolocation.grantHTML5Geolocation();

          var location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          device.getDevices(location)
            .then(function (data) {
              data = data.plain();

              _(data)
                .chain()
                .map(function (device) {
                  return new HasSensorEntity(device);
                })
                .filter(function (entity) {
                  return !!entity.longitude && !!entity.latitude;
                })
                .find(function (entity) {
                  return _.contains(entity.labels, 'online');
                })
                .tap(function (closestentity) {
                  if (closestentity) {
                    $state.go('layout.home.entity', {id: closestentity.id});
                  } else {
                    $state.go('layout.home.entity', {id: data[0].id});
                  }
                })
                .value();
            });
        });
      }
    }


  }
})();
