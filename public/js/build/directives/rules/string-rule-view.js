var stringRuleTmpl = require('../../partials/rules/string-rule.html');

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
        query: '=currentQuery',
        validateQueryNow: "=",
        promiseArray: "="
      },

      link: function(scope, elem, attrs) {
        scope.hide= false;
        if(scope.query.reference) {
          scope.hide= true;
        }
        var $template = angular.element(stringRuleTmpl);
        $compile($template)(scope);
        elem.append($template);

        var operatorSelect = elem.find('.js-operator-select');

        //Default Validation Promise operation
        var deferred = $q.defer();
        var defaultPromiseObject = {
          promise: deferred.promise
        };
        scope.promiseArray.push(defaultPromiseObject);

        //Default rule data
        var defaultOperator = 'in';
        scope.operator = scope.query.fieldData.operator || '$' + defaultOperator;
        scope.operand = {};

        setOperandOnLoad();

        //New rule data for every operator on change
        scope.$watch('operator', function(newVal, oldVal) {
          if (_.isEqual(newVal, oldVal))
            return;

          clearValues();
          checkOperator();
        }, true);


        scope.$watch('operand', function(newVal, oldVal) {
          if (_.isEqual(newVal, oldVal))
            return;

          if (_.isEmpty(scope.operand))
            return;


          //console.log("newVal", newVal);
          checkOperand();
          scope.query._diff = newVal;
        }, true)


        operatorSelect.val(scope.operator).select2({
          containerCssClass: 'select2-sm',
          minimumResultsForSearch: -1
        });

        operatorSelect.off('change').on('change', function() {
          changeOperator($(this).select2('val'));
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

        //check valid regex options
        function checkValidRegexOptions() {
          scope.query._value['$options'] = scope.query._value['$options'] ? scope.query._value['$options'].trim() : "";
          return ['i', 'g', 'gi', ""].indexOf(scope.query._value['$options']) != -1;
        }

        function checkValidRegexForNot(){
            scope.query._value['$options'] = scope.query._value['$options'] ? scope.query._value['$options'].trim() : "";
          return ['i', 'g', 'gi', ""].indexOf(scope.query._value['$options']) != -1;

        }
        //Not need to set default operator as there is no operator for contains only set on load if value is not empty
        function setOperandOnLoad() {
          if (!_.isEmpty(scope.query._value)) {
            if (scope.query._value instanceof Object) {
              if (scope.operator === '$in' || scope.operator === "$not") {
                scope.operand['regex'] = filterRegex(scope.query._value['$regex']);
                scope.operand['options'] = scope.query._value['$options'];
              } else {
                scope.operand[scope.operator.replace('$', '')] = scope.query._value[scope.operator];
              }
            } else {
              scope.operand['equals'] = scope.query._value;
            }
          }
        }

        function filterRegex(data){
          return _.trim(data, '^((?!).)*$');
        }

        function changeOperator(operator) {
          Utils.sa(scope, function() {

            //destroy tooltip on change class field
            qbService.destroyErrorTips(elem);

            //Delete old promise and create for newly selected field
            scope.promiseArray.splice(scope.promiseArray.indexOf(defaultPromiseObject), 1);
            deferred = $q.defer();
            defaultPromiseObject.promise = deferred.promise;
            scope.promiseArray.push(defaultPromiseObject);
            // if (operator !== "$exists" && operator !== "$notExists") {
            //   deferred.resolve();
            // }
            scope.operator = operator;
          });
        }

        function clearValues() {
          scope.operand = {};
          scope.query._value = {};
        }

        function checkOperator() {
          scope.query.fieldData.operator = scope.operator;
          switch (scope.operator) {
            case '$in':
              scope.operand['regex'] = '';
              scope.operand['options'] = '';
              break;

            case '$not':
              scope.operand['regex'] = '';
              scope.operand['options'] = '';
              break;

            case '$exists':
              scope.operand['exists'] = true;
              break;

            case '$notExists':
              scope.operand['exists'] = false;
              break;

            case '$ne':
              scope.operand['ne'] = '';
              break;

            case '$equals':
              scope.operand['equals'] = '';
              break;
          }

        }

        function validateRule() {
          var errorEls = [];

          switch (scope.operator) {
            case '$in':
              var validRegexOption = checkValidRegexOptions();
              var regexNotEmpty = !_.isEmpty(scope.query._value['$regex']);

              if (regexNotEmpty && validRegexOption) {
                deferred.resolve();
              } else {
                deferred.reject();
                if (!validRegexOption)
                  errorEls.push(elem.find('.js-string-options'));

                if (!regexNotEmpty)
                  errorEls.push(elem.find('.js-string-regex'));
              }
              break;

            case '$not':
              var validRegexOption = checkValidRegexForNot();
              var regexNotEmpty = !_.isEmpty(elem.find('.js-string-not-regex').val());

              if (regexNotEmpty && validRegexOption) {
                deferred.resolve();
              } else {
                deferred.reject();
                if (!validRegexOption)
                  errorEls.push(elem.find('.js-string-not-options'));

                if (!regexNotEmpty)
                  errorEls.push(elem.find('.js-string-not-regex'));
              }
              break;

            case '$ne':
              if (!_.isEmpty(scope.query._value['$ne'])) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.js-string-ne'));
              }
              break;
            case '$equals':
              if (!_.isEmpty(scope.query._value)) {
                deferred.resolve();
              } else {
                deferred.reject();
                errorEls.push(elem.find('.js-string-equals'));
              }
              case '$exists':
              case '$notExists':
                deferred.resolve();
              break;
          }

          // show error tooltips on elements.
          if (errorEls.length)
            qbService.showErrorTips(errorEls);


          // Assign new promise to the promise object as the previous promise has been resolved.
          deferred = $q.defer();
          defaultPromiseObject.promise = deferred.promise;
        }

        function checkOperand() {
          switch (scope.operator) {
            case '$in':
              scope.query._value['$regex'] = scope.operand['regex'];
              scope.query._value['$options'] = scope.operand['options'];
              break;

            case '$not':
              scope.query._value['$regex'] = "^((?!"+scope.operand['regex']+").)*$";
              scope.query._value['$options'] = scope.operand['options'];
              break;

            case '$exists':
              scope.query._value['$exists'] = scope.operand['exists'];
              break;

            case '$notExists':
              scope.query._value['$exists'] = scope.operand['exists'];
              break;

            case '$ne':
              scope.query._value['$ne'] = scope.operand['ne'];
              break;

            case '$equals':
              scope.query._value = scope.operand['equals'];
              break;
          }

          //console.log("after apply", scope.query);
        }


        scope.$watch("query", function(){
          //scope.query.fieldData = scope.query;
          scope.query.fieldData.operator = scope.operator;
        }, true);
      }
    }
  }
]