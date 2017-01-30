'use strict';

var rowViewTmpl = require('../partials/row-view.html');

module.exports = [
  '$compile',
  'modalService',
  'oqService',
  'utilsService',
  '$q',
  'tip',
  'constants',
  '$timeout',
  function($compile, modalService, qbService, Utils, $q, TIP, constants, $timeout) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        query: '=oqRowView',
        schema: '=schema',
        queryArray: '=queryArray',
        queryIndex: "=queryIndex",
        validateQueryNow: "=",
        promiseArray: "="
      },

      link: function(scope, elem, attrs) {
        // console.log("queryObject",scope.query,'schema',scope.schema,'queryIndex',scope.queryIndex,'queryArray',scope.queryArray,'validateQueryNow',scope.validateQueryNow,'promiseArray',scope.promiseArray);
        //console.log("currrent query--> ", scope.currentQuery);
        // scope.$watch('query', function(){
           //console.log("watching current query", scope.query);
        //   console.log("watching current query", scope.currentQuery);
        //   //console.log("scope.currentDataType", scope.currentDataType);
        // }, true);

        var deferred = $q.defer();
        var defaultPromiseObject = {
          promise: deferred.promise
        };
        scope.promiseArray.push(defaultPromiseObject);

        // Manually compile template because 2 directives are used in the same template.
        var $template = angular.element(rowViewTmpl);
        $compile($template)(scope);
        elem.append($template);

        var columnSelect = $(elem).find('.js-column-select').eq(0);
        scope.currentDataType = null;

        scope.currentQuery = Utils.getPath(scope.query, scope.query.fieldData['currentQueryPath']);
        if (_.isUndefined(scope.currentQuery)) {
          scope.currentQuery = scope.query;
        }

        initialFieldCheck();

        //Watch on validate Query
        scope.$watch('validateQueryNow', function() {
          if (scope.validateQueryNow) {
            validateRow();
          }
        })

        // Destroy promise object from array
        scope.$on('$destroy', function handleDestroyEvent() {
          scope.promiseArray.splice(scope.promiseArray.indexOf(defaultPromiseObject), 1);
        })

        function validateRow() {
          var fieldData = columnSelect.select2('data');
          var errorEls = [];
          if (_.isEmpty(fieldData)) {
            deferred.reject();
            errorEls.push(elem.find('.js-column-select-wrap'));
          } else {
            deferred.resolve();
          }

          // show error tooltips on elements.
          if (errorEls.length)
            qbService.showErrorTips(errorEls);

          // deferred = $q.defer();
          // defaultPromiseObject.promise = deferred.promise;
        }

        scope.removeRow = function() {
          // Destroy all tooltips
          TIP.destroyAll($('.query-builder'));
          if (scope.queryArray.length === 1) {
            scope.query = _.cloneDeep(constants.queryBuilder.defaults.row);
            scope.queryArray.splice(scope.queryIndex, 1, scope.query);
          } else {
            scope.queryArray.splice(scope.queryIndex, 1);
          }
        }

        function resetDatatype() {
          scope.currentDataType = "null";
        }

        /**
         * 1.Initialize select2 for field
         * 2.Set key value for already present data
         */
        function initRow() {
          initializeColumnSelect();
          if (!_.isEmpty(scope.query._key))
            setColumnSelectValue(scope.query._key);
        }

        function initializeColumnSelect() {
          columnSelect.select2({
            placeholder: "Select field",
            data: qbService.formatClassFields(scope.schema, true),
            containerCssClass: 'select2-sm'
          })

          columnSelect.off('select2-open').on('select2-open', function() {
            qbService.destroyTip(elem.find('.js-column-select-wrap'));
          });

          columnSelect.off('change').on('change', function() {

            Utils.sa(scope, function() {
              //destroy tooltip on change class field
              qbService.destroyErrorTips(elem)

              //Delete old promise and create for newly selected field
              scope.promiseArray.splice(scope.promiseArray.indexOf(defaultPromiseObject), 1);

              deferred = $q.defer();
              defaultPromiseObject.promise = deferred.promise;
              scope.promiseArray.push(defaultPromiseObject);
              
              resetDatatype();
              $timeout(function(){
                scope.query.fieldData.currentField = columnSelect.select2('data')
                scope.query._key = scope.query.fieldData.currentField.uid;
                scope.query._value = {};
                delete scope.query.fieldData.operator;
                checkSelectedField();
              }, 0);
            })
          });
        }



        function initialFieldCheck() {
          if (!_.isEmpty(scope.query._key)) {
            if (!qbService.isGroup(scope.query.fieldData.currentField) && !qbService.isReference(scope.query.fieldData.currentField)) {
              initRow();
            }
            // Render rule view
            scope.currentDataType = scope.query.fieldData.currentField.data_type;
          } else {
            initRow();
          }
        }

        function checkSelectedField() {
          if (qbService.isGroup(scope.query.fieldData.currentField) || qbService.isReference(scope.query.fieldData.currentField)) {
            initFieldSelectModal();
          } else {
            // Render rule view
            scope.currentDataType = scope.query.fieldData.currentField.data_type;
          }
        }

        function setColumnSelectValue(value) {
          columnSelect.select2('data', {
            id: value,
            text: value
          });
        }

        function renderNestedField() {
          scope.isNestedField = true;
        }

        function clearNestedField() {
          scope.isNestedField = false;
          scope.nestedField = void 0;
        }

        function initFieldSelectModal() {
          scope.query.fieldData['name'] = scope.query.fieldData.currentField.display_name;
          modalService.openModal({
                data: {
                  query: scope.query,
                  currentQuery: scope.currentQuery
                }
              }, qbService.fieldSelectModalTmpl,
              qbService.fieldSelectModalCtrl)
            .then(function(res) {
              // Render rule view
              resetDatatype();
              scope.currentDataType = scope.query.fieldData.currentField.data_type;
              Utils.sa(scope, function(){
                scope.currentQuery = res.currentData.currentQuery;
              });
            }, function() {
              resetDatatype();
              var query = _.cloneDeep(constants.queryBuilder.defaults.row);
              scope.query._key = '';
              scope.query._value = '';
              scope.query.fieldData = query.fieldData;
              scope.currentQuery = scope.query;
              columnSelect.select2('val', "");
            });
        }
      }
    }
  }
]