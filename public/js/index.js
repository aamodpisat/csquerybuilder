var angular  = require('angular');
var uiRouter = require('angular-ui-router');
var objectsQueryBuilder = require("./build/query-builder.js");
angular
    .module('querybuilder', [uiRouter, objectsQueryBuilder.name])
	.controller('QueryBuilderController', QueryBuilderController);

QueryBuilderController.$inject =['$scope', '$http'];
function QueryBuilderController($scope, $http) {
    $scope.currentClass = {};
    $scope.intermediateQuery = [];
    $scope.host = "api.contentstack.io";
    $scope.prefix= "v3";
    $scope.apiKey = "";
    $scope.accessToken = "";
    $scope.cntTypes = false;
    $scope.loader = false;
    var contentTypeUrl = "", headers= "";

    // to get list of content types for a particular Stack;
    $scope.getData = function(host , apiKey, accessToken) {
        $scope.host = host; $scope.apiKey = apiKey;  $scope.accessToken= accessToken;
        headers = {
            headers: {
                'api_key': apiKey,
                'access_token': accessToken,
                'Content-Type': 'application/json'
            }
        };
        $scope.apiHost= "https://" + $scope.host + "/";

        if(apiKey && accessToken) {
            $scope.loader = true;
            var stackUrl = $scope.apiHost + $scope.prefix + '/stacks';

            $http
                .get(stackUrl, headers)
                .then(function success(objects) {
                    $scope.stack = (objects.data.stack) ? objects.data.stack.name : '';
                }, function err() {
                });

            var environmentUrl = $scope.apiHost + $scope.prefix + '/environments';
            $http
                .get(environmentUrl, headers)
                .then(function success(objects){
                    if(objects.data.environments && objects.data.environments.length) {
                        objects.data.environments.push({'uid': "", 'name': 'None'});
                        $scope.environments = objects.data.environments;
                    } else {
                        $scope.environments = ' No environments found';
                    }


                }, function err() {
                });
            contentTypeUrl = $scope.apiHost + $scope.prefix + '/content_types/';

            $http
              .get(contentTypeUrl, headers)
              .then(function success(objects){
                    $scope.loader = false;
                    $scope.cntTypes = true;
                    $scope.contentTypes = (objects.data && objects.data.content_types.length) ? objects.data.content_types : alert('Sorry, No Content Types found');
              }, function err() {
                    $scope.loader = false;
                alert("Sorry, Please check your Stack's API Key and Access token");
              });
        }
        else {
            alert('Please enter Built.io Contentstack Stack API Key and Access Token');
        }
    };

    $scope.getFields = function (contentTypeObject) {
        $scope.show = false;
        $scope.fields = contentTypeObject;
        setTimeout(function(){
            var myElement= document.getElementById('showQuery');
            angular.element(myElement).triggerHandler('click');
        }, 100)

    };

    $scope.showQueryBuilder= function() {
        $scope.show = true;
    };

    $scope.getQuery = function(){
        $scope.getQueryNow = true;
    };

    $scope.getQueryCallback = function(query) {
        var envElement= document.getElementById('env');
        var env = angular.element(envElement).val(),
            envQuery = (env != (undefined  && ' ?' && 'None' ))  ? 'environment=' + env + '&': '';
        query.then(function(res){
            $scope.loader = true;
            var query = $scope.query = res,
                queryUrl = contentTypeUrl +  $scope.fields.uid + '/entries?'+ envQuery + 'query=' + JSON.stringify(query);
            $scope.showRequest = true;
            $http
                .get(queryUrl, headers)
                .then(function success(entries, status, config){
                    $scope.headers = headers.headers;
                    $scope.reqUrl = queryUrl;
                    $scope.loader = false;
                    $scope.resHeaders = {
                        "content-type": "application/json",
                        "connection": "keep-alive"
                    };
                    $scope.result = (entries && entries.data.entries && entries.data.entries.length ) ? entries.data.entries : {'message': 'No entries found'};
                }, function err() {
                    alert("Error in making an API call");
                });
        });
        $scope.getQueryNow = false;
    };

}