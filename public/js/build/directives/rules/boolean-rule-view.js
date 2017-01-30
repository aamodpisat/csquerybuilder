'use strict';

var numberRuleTmpl = require('../../partials/rules/boolean-rule.html');

module.exports = [
  '$compile',
  'oqService',
  'utilsService',
  function($compile, qbService, Utils) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        query: '=oqBooleanRuleView'
      },
      link: function(scope, elem, attrs) {
        var $template = angular.element(numberRuleTmpl);
        $compile($template)(scope);
        elem.append($template);

        var operatorSelect = elem.find('.js-operand-select');

        if (_.isUndefined(scope.query.fieldData.operator)) {
          scope.operator = 'true';
        } else {
          scope.operator = scope.query.fieldData.operator.toString();
        }

        operatorSelect.select2({
          containerCssClass: 'select2-sm',
          minimumResultsForSearch: -1
        });

        //Default select2 value
        operatorSelect.select2('val', scope.operator);
        operatorSelect.off('change').on('change', function() {
          changeOperator(operatorSelect.select2('val'));
        })

        function changeOperator(operator) {
          scope.query.fieldData.operator = operator;
          Utils.sa(scope, function() {
            scope.operator = operator;
          });
        }

        scope.$watch('operator', function() {
          console.log("scope.operator",typeof scope.operator)
          scope.query._value = JSON.parse(scope.operator);
        })

      }
    }
  }
]