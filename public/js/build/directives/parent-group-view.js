'use strict';


var parentGroupViewTmpl = require('../partials/parent-group-view.html');

module.exports = [
  '$compile',
  'utilsService',
  'tip',
  'constants',
  function($compile,Utils,TIP,constants) {
  	return {
    	replace: false,
    	restrict: 'A',
    	scope: {
    	  parentQueryObject: '=parentGroupView',
        schema: '=schema',
        queryIndex: "=queryIndex",
        queryArray: "=queryArray",
        validateQueryNow: "=",
        promiseArray: "="
    	},

    	link:function(scope,elem,attrs) {
        scope.$watch(
          function () {
            var parentGroup  = $('.parent-group');
            var lastChild    = $('div.group-body');
            if(lastChild.length > 0) {
              parentGroup.removeClass('no-after');
            } else {
              parentGroup.addClass('no-after');
            }
          }
        );
        var $template = angular.element(parentGroupViewTmpl);
    		$compile($template)(scope);
    		elem.append($template);

    		var groups = ['$or', '$and'];
    		var groupConditionSelect = elem.find('.js-group-condition-select');

    		//Initialize Select2
    		groupConditionSelect.select2({
    			containerCssClass: 'select2-sm',
    			minimumResultsForSearch: -1
    		});
    	
    		//Select 2 on-change
    		groupConditionSelect.off('change').on('change',function() {
  				changeGroupCondition(groupConditionSelect.select2('val'));
    		});

    		//change group condition
    		function changeGroupCondition(condition) {
    			Utils.sa(scope,function() {
    				scope.parentQueryObject._key = condition;
    			});
    		}

    		scope.isGroup = function(query) {
            var r = $.inArray(query._key, groups) != -1 ? true : false
            return r;
        };

        scope.addGroup = function() {
          destroyTips();
          scope.parentQueryObject['_value'].push(_.cloneDeep(constants.queryBuilder.defaults.group));
        }

        scope.addRow = function() {
          destroyTips();
          scope.parentQueryObject['_value'].push(_.cloneDeep(constants.queryBuilder.defaults.row));
        }

        function destroyTips() {
          // Destroy all tooltips
          TIP.destroyAll($('.query-builder'));
        }        

    	}
		
	 }
  }
]  