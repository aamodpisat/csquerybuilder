'use strict';
var moment= require('moment');
require('third-party-modules/bootstrap-datetimepicker');
var datepickerTemplate = require('../partials/bootstrap-datepicker.html');
module.exports = [
  '$compile',
  'utilsService',
  function(compile, Utils) {
    return {
      template: datepickerTemplate,
      restrict: 'A',
      replace: true,
      scope: {
        getTime: '=',
        dateTime: '=',
        enableTime:'=',
        pickerClass: '=pickerClass',
        enableTimeZone:'=',
        timeZoneSelectClass: '=timeZoneSelectClass',
        noWrap:'@'
      },
      link: function(scope, elem, attrs) {
        
        scope.timeZone        = getTimeZones();
        scope.dateTime        = scope.dateTime ? scope.dateTime : moment().format();
        scope.enableTimeZone  = (!_.isUndefined(scope.enableTimeZone)) ? scope.enableTimeZone : true;
        scope.enableTime      = (!_.isUndefined(scope.enableTime)) ? scope.enableTime : true;

        if(scope.enableTimeZone){
          scope.zone = scope.dateTime.substring(setDateIndex(scope.dateTime), scope.dateTime.length).replace(':', '');
          scope.zone = scope.zone.length === 0 ? getlocalTimeZone() : scope.zone;
        }else{
          scope.dateTime  = scope.dateTime.substring(0, setDateIndex(scope.dateTime))+'z';
        }

        var dateTimeSelector = elem.find('.js-datetimepicker');
        var timeZoneSelector = elem.find('.js-timezone-select');
        scope.showDate       = scope.dateTime ? getMomentDateTime(scope.dateTime) : '';
        scope.defaultDate    = new Date(scope.dateTime) || "";
        
        //dont change the sequence of datepicker configuration
        var datePickerOptions = {
            defaultDate : scope.defaultDate,
            format: scope.enableTime ? 'MMM Do YYYY, h:mm:ss a' : 'MMM Do YYYY',
            icons: {
              time: "fa fa-clock-o",
              date: "fa fa-calendar",
              up: "fa fa-arrow-up",
              down: "fa fa-arrow-down",
              previous: "fa fa-chevron-left",
              next: "fa fa-chevron-right"
            },
        };
        
        if(!scope.noWrap){
          datePickerOptions.widgetParent = $("#js-datepicker-wrap");
        }
        //Date picker Initialization
        dateTimeSelector.datetimepicker(datePickerOptions);

        dateTimeSelector.off('dp.change').on("dp.change", function(e) {
          scope.$apply(function() {
            scope.showDate = getMomentDateTime(e.date);
            setScope();
          })
        });

        //console.log("Default time zone: ", scope.zone);
        timeZoneSelector.select2({
          containerCssClass: scope.timeZoneSelectClass,
          minimumResultsForSearch: -1
        });

        setTimeout(function(){
          timeZoneSelector.select2('val', scope.zone)
        }, 0);

        timeZoneSelector.off('change').on('change', function() {
          timeZoneChanged(timeZoneSelector.select2('val'));
        })

        function timeZoneChanged(zone) {
          Utils.sa(scope, function() {
            scope.zone = zone;
            setScope();
          });
        }


        elem.find('.timeSelecter')
          .on('change', function() {
            setScope();
          })

        scope.checkDate = function(e) {
          if (_.isEmpty($(e.currentTarget).val())) {
            scope.dateTime = "";
          }
        }

        function setScope() {
          var setDateTime = dateTimeSelector.val().trim();
          if (setDateTime.length > 0) {
            setDateTime = getISODateTime(dateTimeSelector.data("DateTimePicker").date());
            setDateTime = setDateTime.substring(0, setDateIndex(setDateTime));
            console.log("scope.enableTimeZone",scope.enableTimeZone)
            if(scope.enableTimeZone)
              scope.dateTime = setDateTime + scope.zone;
            else
              scope.dateTime = setDateTime+'z';
          }
        }

        scope.$watch('dateTime', function(){
          if(scope.getTime) {
            scope.getTime(scope.dateTime);
          }
        })


        function getDateIndex(isoDate) {
          if (isoDate.lastIndexOf('.') !== -1)
            return isoDate.lastIndexOf('.');
          else if (isoDate.lastIndexOf('+') !== -1)
            return isoDate.lastIndexOf('+');
          else if (isoDate.lastIndexOf('-') !== -1)
            return isoDate.lastIndexOf('-');
        }

        function setDateIndex(isoDate){
          var dateIndex = getDateIndex(isoDate);
          if(dateIndex > 15)
            return dateIndex;
          else
            isoDate.length;
        }

        function getMomentDateTime(date) {
          return moment(date).format('MMM Do YYYY, h:mm:ss a');
        }

        function getISODateTime(date) {
          return new Date(date).toISOString();
        }

        function getlocalTimeZone() {
          var date = moment().format();
          return date.substring(setDateIndex(date), date.length).split(':').join('');
        }

        function getTimeZones() {

          return [
            '-1200', '-1100',
            '-1000', '-0930',
            '-0900', '-0800',
            '-0700', '-0600',
            '-0500', '-0430',
            '-0400', '-0330',
            '-0300', '-0200',
            '-0100', '+0000',
            '+0100', '+0200',
            '+0300', '+0330',
            '+0400', '+0430',
            '+0500', '+0530',
            '+0545', '+0600',
            '+0630', '+0700',
            '+0800', '+0845',
            '+0900', '+0930',
            '+1000', '+1030',
            '+1100', '+1130',
            '+1200', '+1245',
            '+1300', '+1400'
          ];
        }


      }
    }
  }
]