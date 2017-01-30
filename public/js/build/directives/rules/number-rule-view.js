var numberRuleTmpl = require('../../partials/rules/number-rule.html');

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
        query: '=oqNumberRuleView',
        validateQueryNow: "=",
        promiseArray: "="
      },

      link: function(scope, elem, attrs) {
        //Default Validation Promise operation
        var deferred = $q.defer();
        var defaultPromiseObject = {
          promise: deferred.promise
        };
        scope.promiseArray.push(defaultPromiseObject);

        var $template = angular.element(numberRuleTmpl);
        $compile($template)(scope);
        elem.append($template);

        var operatorSelect = elem.find('.js-operator-select');

        // Default rule data
        var defaultOperator = 'btw';
        scope.operator = scope.query.fieldData.operator || '$' + defaultOperator;
        scope.operand = {};

        setDefaultOperand();

        operatorSelect.val(scope.operator).select2({
          containerCssClass: 'select2-sm',
          minimumResultsForSearch: -1
        })

        operatorSelect.on('change', function() {
          changeOperator(operatorSelect.select2('val'));
        })

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

        function validateRule() {
          var errorEls = [];
          var ltisNumber = _.isNumber(scope.query._value['$lt']);
          var gtisNumber = _.isNumber(scope.query._value['$gt']);
          switch (scope.operator) {
            case '$btw':

              if (ltisNumber && gtisNumber) {
                deferred.resolve();
              } else {
                deferred.reject();

                if (!gtisNumber)
                  errorEls.push(elem.find('.js-number-btw-gt'));

                if (!ltisNumber)
                  errorEls.push(elem.find('.js-number-btw-lt'));
              }
              break;
            case '$lt':
              if (ltisNumber) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.js-number-lt'));
              }
              break;

            case '$gt':

              if (gtisNumber) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.js-number-gt'));
              }
              break;

            case '$equals':
              //console.log("!isNaN(scope.query._value)",scope.query._value, _.isNumber(scope.query._value));
              if (_.isNumber(scope.query._value)) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.js-number-equals'));
              }
              break;

            case '$ne':
              console.log("!isNaN(scope.query._value)",scope.query._value, _.isNumber(scope.query._value['$ne']));
              if (_.isNumber(scope.query._value['$ne'])) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.js-number-ne'));
              }
              break;

          }
          // show error tooltips on elements.
          if (errorEls.length)
            qbService.showErrorTips(errorEls);


          // Assign new promise to the promise object as the previous promise has been resolved.
          deferred = $q.defer();
          defaultPromiseObject.promise = deferred.promise;

        }

        function setDefaultOperand() {
          if (_.isEmpty(scope.query._value)) {
            scope.operand[defaultOperator] = '';
            scope.query._value['$lt'] = '';
            scope.query._value['$gt'] = '';
          } else {
            if (scope.query._value instanceof Object) {
              if (scope.operator === '$btw') {
                scope.operand['lt'] = scope.query._value['$lt'];
                scope.operand['gt'] = scope.query._value['$gt'];
              } else {
                scope.operand[scope.operator.replace('$', '')] = scope.query._value[scope.operator];
              }
            } else {
              scope.operand['equals'] = scope.query._value;
            }
          }
        }

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

        function clearValues() {
          scope.operand = {};
          scope.query._value = {};
        }

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

        function checkOperator() {
          scope.query.fieldData.operator = scope.operator;
          switch (scope.operator) {
            case '$btw':
              scope.operand['lt'] = '';
              scope.operand['gt'] = '';
              break;

            case '$lt':
              scope.operand['lt'] = '';
              break;

            case '$gt':
              scope.operand['gt'] = '';
              break;

            case '$equals':
              scope.operand['equals'] = '';
              break;

            case '$ne':
              scope.operand['ne'] = '';
              break;
          }
        }

        function checkOperand() {
          switch (scope.operator) {
            case '$btw':
              var lt = parseInt(scope.operand['lt']);
              var gt = parseInt(scope.operand['gt']);
              scope.query._value['$lt'] =  _.isNaN(lt) ? '' : lt;
              scope.query._value['$gt'] =  _.isNaN(gt) ? '' : gt;
              break;

            case '$lt':
              var lt = parseInt(scope.operand['lt']);
              scope.query._value['$lt']  = _.isNaN(lt) ? '' : lt;               
              break;

            case '$gt':
              var gt = parseInt(scope.operand['gt']);
              scope.query._value['$gt']  = _.isNaN(gt) ? '' : gt;             
              break;

            case '$equals':
              var eq = parseInt(scope.operand['equals']);
              scope.query._value  = _.isNaN(eq) ? '' : eq; 
              break;

            case '$ne':
              var ne = parseInt(scope.operand['ne']);
              scope.query._value['$ne']  = _.isNaN(ne) ? '' : ne; 
              break;
          }
          console.log(scope.query._value);
        }
      }
    }
  }
]