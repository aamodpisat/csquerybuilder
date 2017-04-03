'use strict';

// CSS GO HERE

require('./css/style.min.css');require('./css/bootstrap-datetimepicker.min.css');require('./css/bootstrap.min.css');require('./css/font-awesome.css');require('./css/jquery.qtip.css');require('./css/summernote.css');

// CSS END HERE

// Include Modules
require('./third-party-modules/select2');
require('./third-party-modules/qtip');
require('./third-party-modules/bootstrap');
require('./third-party-modules/angular-ui-bootstrap');
require('./third-party-modules/angular-modal-service');
require('moment');

// Directives
var queryBuilder      = require('./directives/query-builder');
var parentgroupview   = require('./directives/parent-group-view');
var groupview         = require('./directives/group-view');
var rowview           = require('./directives/row-view');

var stringRuleView    = require('./directives/rules/string-rule-view');
var isoDateRuleView   = require('./directives/rules/isodate-rule-view');
var numberRuleView    = require('./directives/rules/number-rule-view');
var booleanRuleView   = require('./directives/rules/boolean-rule-view');
var selectRuleView    = require('./directives/rules/select-rule-view');

// Services
var utils             = require('./services/query-builder.js');
var builtDataService  = require('./services/built-data-service'); 


module.exports = angular.module('objectsQueryBuilder', ['ui.bootstrap.tpls','ui.bootstrap.modal'])
  .directive('objectsQueryBuilder', queryBuilder)
  .directive('parentGroupView', parentgroupview)
  .directive('oqGroupView', groupview)
  .directive('oqRowView', rowview)
  .directive('oqStringRuleView', stringRuleView)
  .directive('oqIsodateRuleView', isoDateRuleView)
  .directive('oqNumberRuleView', numberRuleView)
  .directive('oqBooleanRuleView', booleanRuleView)
  .directive('oqSelectRuleView', selectRuleView)
  // DIRECTIVE GO HERE

  .directive('bootstrapDatePicker', require('./directives/bootstrap-date-picker'))

  // DIRECTIVE END HERE
  .service('oqService', utils)
  .service('oqBuiltDataService', builtDataService)
  // SERVICES GO HERE

  .service('utilsService',require('./services/utils')).constant('constants',require('./services/constants')()).service('tip',require('./services/tip')).service('modalService',require('./services/modal')).service('alertService',require('./services/alert'))

  // SERVICES END HERE