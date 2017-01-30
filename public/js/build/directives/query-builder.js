var queryBuilderTmpl = require('../partials/query-builder.html');

module.exports = [
  'oqBuiltDataService',
  'utilsService',
  '$q',
  'constants',
  'tip',
  function(oqBuiltDataService, Utils, $q, constants, TIP) {
    return {
      template: queryBuilderTmpl,
      restrict: 'A',
      scope: {
        query            : '=objectsQueryBuilder',
        cls              : '=cls',
        getQueryNow      : "=",
        getQueryCallback : "=",
        apiKey           : "=",
        accessToken      : "=",
        apiHost          : "=",
        prefix           : "="
      },

      link: function(scope, elem, attrs) {
        var makeQuery          = R.compose(initQuery, optimizeQuery, constructQuery);
        scope.schema         = _.cloneDeep(scope.cls.schema);
        scope.promiseArray     = [];
        scope.validateQueryNow = false;
        if (!scope.query.length) {
          scope.query = [_.cloneDeep(constants.queryBuilder.defaults.group)];
        }
        scope.$watch('query', function(newValue, oldValue) {
         /* console.log('query changed:')
          console.log(JSON.stringify(scope.query));
          console.log('---------------')*/
        }, true);

        scope.$watch('promiseArray', function(){
          //console.log("watch on promiseArray", scope.promiseArray)
        });


        function getQuery() {
          scope.validateQueryNow = true;

          return validateQuery()
            .then(function() {
              //console.log('Validate query: success ', scope.query[0])
              return makeQuery(_.cloneDeep(scope.query[0]));
            }, function(xhr) {
              //console.log('Validate query: failed')
              throw xhr;
            }).finally(function() {
              scope.validateQueryNow = false;
            });
        }

        scope.$watch('getQueryNow', function() {
          if (scope.getQueryNow) {
            var actualQuery = getQuery().then(function(res){
              //scope.promiseArray = [];
              return res;
            });
            scope.getQueryNow = true;
            //console.log("actualQuery", actualQuery);
            scope.getQueryCallback(actualQuery);
          }
        });

        scope.$on('$destroy', function handleDestroyEvent() {
          TIP.destroyAll($('.query-builder'))
        });

        function constructQuery(query) {
          var q = {};

          if (query._key === undefined) {
            if (_.isPlainObject(query) && _.isPlainObject(query.query)) {
              q = query;
              q['query'] = constructQuery(query.query)

              return q;
            } else {
              return query;
            }
          }

          q[query._key] = query._value instanceof Array ? _.map(query._value, constructQuery) : constructQuery(query._value);
          return q;
        }


        function optimizeQuery(query) {
          var q = {}
          q[_.keys(query)[0]] = [{}]

          var queryArray = q[_.keys(query)[0]];
          var firstObj   = queryArray[0];
          query[_.keys(query)[0]].forEach(function(el, index, array) {
            for (var key in el) {
              if (_.isArray(el[key])) {
                var o = {}
                o[key] = el[key];
                _.extend(firstObj, optimizeQuery(o));
              } else {
                if (_.keys(query)[0] == '$or') {
                  if (_.isEmpty(queryArray[0])) {
                    queryArray[0][key] = el[key];
                  } else {
                    queryArray.push(el);
                  }
                } else {
                  if (_.contains(_.keys(firstObj), key)) {
                    queryArray.push(el);
                  } else {
                    firstObj[key] = el[key];
                  }
                }
              }
            }
          })
          return q;
        }

        function initQuery(query) {
          var key = Object.keys(query)[0];

          if (key === '$and') {
            if (query[key].length > 1)
              return query;
            else
              return query[key][0];
          }

          return query
        }

        function validateQuery() {
          //console.log("scope.promiseArray", scope.promiseArray);
          return $q.all(scope.promiseArray.map(function(promiseObj) {
            return promiseObj.promise;
          }));
        }

        var headers = {};
        headers.api_key             = scope.apiKey;
        headers.access_token        = scope.accessToken;
        headers.apihost             = scope.apiHost;
        headers.prefix              = scope.prefix;
        headers['Fastly-Debug']     = 1;
        oqBuiltDataService.Header.set(headers);
      }
    }
  }
];