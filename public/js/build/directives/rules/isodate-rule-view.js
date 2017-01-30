var stringRuleTmpl = require('../../partials/rules/isodate-rule.html');
var moment= require('moment');
module.exports = [
  '$compile',
  'oqService',
  'utilsService',
  '$q',
  function($compile, qbService, Utils, $q) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        query: '=oqIsodateRuleView',
        validateQueryNow: "=",
        promiseArray: "="
      },

      link: function(scope, elem, attrs) {
        scope.enableTimeZone = true;
        scope.enableTime = true;
        var $template = angular.element(stringRuleTmpl);
        $compile($template)(scope);
        elem.append($template);

        //Default Validation Promise operation
        var deferred = $q.defer();
        var defaultPromiseObject = {
          promise: deferred.promise
        };
        scope.promiseArray.push(defaultPromiseObject);

        var defaultOperator = 'gt';
        var operatorSelect = elem.find('.js-operator-select');
        scope.pickerClass = 'qb-input opd-date-input';
        scope.timeZoneSelectClass = 'select2-sm opd-timezone-select';

        scope.operator = scope.query.fieldData.operator || '$' + defaultOperator;
        scope.operand = {};

        setDefaultOperand();

        operatorSelect.val(scope.operator).select2({
          containerCssClass: 'select2-sm',
          minimumResultsForSearch: -1
        })

        operatorSelect.off('change').on('change', function() {
          changeOperator(operatorSelect.select2('val'));
        })

        scope.$watch('operator', function(newVal, oldVal) {
          if (_.isEqual(newVal, oldVal))
            return;

          clearValues();
          checkOperator();
        })

        scope.$watch('operand', function(newVal, oldVal) {
          if (_.isEqual(newVal, oldVal))
            return;

          if (_.isEmpty(scope.operand))
            return;

          checkOperand();
        }, true)

        //Watch on validate Query
        scope.$watch('validateQueryNow', function() {
            if (scope.validateQueryNow) {
              validateRule();
            }
          })
          //Destroy promise object from array
        scope.$on('$destroy', function handleDestroyEvent() {
          scope.promiseArray.splice(scope.promiseArray.indexOf(defaultPromiseObject), 1);
        })

        function changeOperator(operator) {
          Utils.sa(scope, function() {
            qbService.destroyErrorTips(elem);

            scope.promiseArray.splice(scope.promiseArray.indexOf(defaultPromiseObject), 1);

            //Delete old promise and create for newly selected field
            deferred = $q.defer();
            defaultPromiseObject.promise = deferred.promise;
            scope.promiseArray.push(defaultPromiseObject);

            scope.operator = operator;
          });
        }

        function setDefaultOperand() {
          if (_.isEmpty(scope.query._value)) {
            var date = moment().format();
            scope.operand[defaultOperator] = date;
            scope.query._value['$' + defaultOperator] = date;
          } else {
            if (scope.query._value instanceof Object) {
              scope.operand[scope.operator.replace('$', '')] = scope.query._value[scope.operator];
            } else {
              scope.operand['equals'] = scope.query._value;
            }
          }
        }

        function clearValues() {
          scope.operand = {};
          scope.query._value = {};
        }

        function checkOperator() {
          var dateTime = _.isEmpty(scope.query._value) ? moment().format() : moment(scope.query._value).format();

          scope.query.fieldData.operator = scope.operator;
          switch (scope.operator) {
            case '$gt':
              scope.operand['gt'] = dateTime;
              break;

            case '$lt':
              scope.operand['lt'] = dateTime;
              break;

            case '$equals':
              scope.operand['equals'] = dateTime;
              break;
          }

        }

        function checkOperand() {
          switch (scope.operator) {
            case '$gt':
              scope.query._value['$gt'] = scope.operand['gt'];
              break;

            case '$lt':
              scope.query._value['$lt'] = scope.operand['lt'];
              break;

            case '$equals':
              scope.query._value = scope.operand['equals'];
              break;
          }
        }

        //Validate Rule
        function validateRule() {
          var errorEls = [];
          var ltisNotEmpty = !_.isEmpty(scope.query._value['$lt']);
          var gtisNotEmpty = !_.isEmpty(scope.query._value['$gt']);
          switch (scope.operator) {
            case '$gt':
              if (gtisNotEmpty) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.opd-date-wrap'));
              }
              break;

            case '$lt':
              if (ltisNotEmpty) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.opd-date-wrap'));
              }
              break;

            case '$equals':
              if (!_.isEmpty(scope.query._value)) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.opd-date-wrap'));
              }
              break;
          }

          // show error tooltips on elements.
          if (errorEls.length)
            qbService.showErrorTips(errorEls);

          deferred = $q.defer();
          defaultPromiseObject.promise = deferred.promise;
        }

      }
    }
  }
]