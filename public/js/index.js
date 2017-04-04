var angular  = require('angular');
var uiRouter = require('angular-ui-router');
var objectsQueryBuilder = require("./build/query-builder.js");

angular
    .module('querybuilder', [uiRouter, objectsQueryBuilder.name])
    .controller('LoginController', LoginController)
	.controller('QueryBuilderController', QueryBuilderController)
    .service('ContentstackService', ContentstackService);


LoginController.$inject = ['$scope', '$http', 'ContentstackService'];
QueryBuilderController.$inject =['$scope', '$http', 'ContentstackService'];

function ContentstackService() {
    return {
        'setHeaders': function (value) {
            localStorage.setItem("headers", JSON.stringify((value) ? value: {}))
        },
        'getHeaders': function () {
            return JSON.parse(localStorage.getItem("headers"));
        },
        'setStackName': function (name) {
            localStorage.setItem("stackName", name)
        },
        'getStackName': function () {
            return localStorage.getItem("stackName");
        },
        'setLocales': function (data) {
            localStorage.setItem("locales", JSON.stringify((data) ? data: []))
        },
        'getLocales': function () {
            return JSON.parse(localStorage.getItem("locales"));
        },
        'setEnvironment': function (data) {
            localStorage.setItem("environments", JSON.stringify((data) ? data: []))
        },
        'getEnvironments': function () {
            return JSON.parse(localStorage.getItem("environments"));
        },
        'setContentTypes': function (data) {
            localStorage.setItem("contentTypes", JSON.stringify((data) ? data: []))
        },
        'getContentTypes': function () {
            return JSON.parse(localStorage.getItem("contentTypes"));
        }
    }
}

function LoginController($scope, $http, ContentstackService) {
    $scope.host = "api.contentstack.io";
    $scope.prefix= "v3";
    $scope.apiKey = "bltade32e7a0dc1a8b0";
    $scope.accessToken = "bltec8188d1452e3743";
    $scope.loader = false;
    var headers= "";

    $scope.getData = function(host , apiKey, accessToken) {
        $scope.host = host;
        $scope.apiKey = apiKey;
        $scope.accessToken= accessToken;
        if(apiKey && accessToken) {
            headers = {
                headers: {
                    'api_key': apiKey,
                    'access_token': accessToken,
                    'Content-Type': 'application/json'
                }
            };
            ContentstackService.setHeaders(headers);
            $scope.apiHost= "https://" + $scope.host + "/";
            $scope.loader = true;
            var stackUrl = $scope.apiHost + $scope.prefix + '/stacks/',
                contentTypesUrl = $scope.apiHost + $scope.prefix + '/content_types/',
                envUrl = $scope.apiHost + $scope.prefix + '/environments/',
                localeUrl = $scope.apiHost + $scope.prefix + '/locales/';

            $http
                .get(stackUrl, headers)
                .then(function success(stack) {
                    if(stack && stack.data) {
                        ContentstackService.setStackName(stack.data.stack.name);
                    }
                    $http
                        .get(contentTypesUrl, headers)
                        .then(function success(obj) {
                            if(obj && obj.data && obj.data.content_types && obj.data.content_types.length) {
                                ContentstackService.setContentTypes(obj.data.content_types);
                            }
                            $http
                                .get(envUrl, headers)
                                .then(function success(data) {
                                    if(data && data.data && data.data.environments && data.data.environments.length) {
                                        ContentstackService.setEnvironment(data.data.environments);

                                    }
                                    $http
                                        .get(localeUrl, headers)
                                        .then(function success(data){
                                            if(data && data.data && data.data.locales && data.data.locales.length) {
                                                ContentstackService.setLocales(data.data.locales);
                                            }
                                            window.location.href = 'query-builder.html';
                                        }, function error(err4) {
                                            alert('err ::', err4);
                                        });
                                }, function error(err3) {
                                    alert('err ::', err3);
                                });
                        }, function error(err1) {
                            alert('err ::', err1);
                        });
                }, function err(err2) {
                    alert("Error ::", err2);
                });

        }
        else {
            alert('Please enter Built.io Contentstack Stack API Key and Access Token');
        }
    };
}

function QueryBuilderController($scope, $http, ContentstackService) {
    $scope.currentClass = {};
    $scope.intermediateQuery = [];
    $scope.prefix= "v3";
    $scope.apiHost= 'api.contentstack.io';
    $scope.loader = false;
    var contentTypeUrl = 'https://' + $scope.apiHost + '/' + $scope.prefix +'/content_types/',
        headers= "";

    $scope.stack = ContentstackService.getStackName();
    $scope.contentTypes = ContentstackService.getContentTypes();
    $scope.environments = ContentstackService.getEnvironments();
    $scope.locales = ContentstackService.getLocales();
    headers = ContentstackService.getHeaders();
    $scope.apiKey = headers.headers.api_key;
    $scope.accessToken = headers.headers.access_token;

    // Display the fields of Content Type with query Builder
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
        var env = angular.element(envElement).val();
        var localeElement= document.getElementById('locale');
        var locale = angular.element(localeElement).val(),
            envQuery = (env != (undefined  && ' ?' && 'None' ))  ? 'environment=' + env + '&': '',
            localeQuery = (locale != (undefined  && ' ?' && 'None' ))  ? 'locale=' + locale + '&': '';
        query.then(function(res){
            $scope.loader = true;
            var query = $scope.query = res,
                queryUrl = contentTypeUrl +  $scope.fields.uid + '/entries?'+ envQuery + localeQuery +'query=' + JSON.stringify(query);
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