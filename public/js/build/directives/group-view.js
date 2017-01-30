'use strict';

var groupViewTmpl = require('../partials/group-view.html');

module.exports = [
  '$compile',
  'utilsService',
  'tip',
  'constants',
  function($compile, Utils, TIP, constants) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        queryObject: '=oqGroupView',
        schema: '=schema',
        queryIndex: "=queryIndex",
        queryArray: "=queryArray",
        validateQueryNow: "=",
        promiseArray: "="
      },

      link: function(scope, elem, attrs) {
        // console.log("queryObject",scope.queryObject);

        var $template = angular.element(groupViewTmpl);
        $compile($template)(scope);
        var test = elem.append($template);
        // console.log("template",$template,test);


        var groups = ['$or', '$and'];
        var groupConditionSelect = elem.find('.js-group-condition-select');


        //Initialize Select2
        groupConditionSelect.val(scope.queryObject._key).select2({
          containerCssClass: 'select2-sm',
          minimumResultsForSearch: -1
        });

        //Select 2 on-change
        groupConditionSelect.off('change').on('change', function() {
          changeGroupCondition(groupConditionSelect.select2('val'));
        });

        //Change group condition
        function changeGroupCondition(condition) {
          Utils.sa(scope, function() {
            scope.queryObject._key = condition;
          });
        }

        scope.isGroup = function(query) {
          var r = $.inArray(query._key, groups) != -1 ? true : false
          return r;
        };

        scope.addGroup = function() {
          destroyTips();
          scope.queryObject['_value'].push(_.cloneDeep(constants.queryBuilder.defaults.group));
        }

        scope.deleteGroup = function() {
          destroyTips();
          scope.queryArray.splice(scope.queryIndex, 1);          
        }

        scope.addRow = function() {
          destroyTips();
          scope.queryObject['_value'].push(_.cloneDeep(constants.queryBuilder.defaults.row));
        }

        function destroyTips() {
          // Destroy all tooltips
          TIP.destroyAll($('.query-builder'));
        }
      }
    }
  }
]