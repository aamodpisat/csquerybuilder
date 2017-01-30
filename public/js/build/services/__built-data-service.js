'use strict';
module.exports = [
  '$q',
  '$http',
  'builtApi',
  function($q, $http, builtApi) {
    var self      = this;
    var headers   = {};
    var host      = "";
    var prefix    = "";
      self.Header = {
        set : function(args){
          if(!_.isEmpty(args.api_key)){
            host    = args.apihost;
            headers = args; 
            prefix  = args.prefix;
          }
        },
        get : function(){
          return headers;
        }
      };
      
      self.Classes = {
        getOne : function(args){
          return builtApi.Classes.getOne(args)
        } 
      };
  }
];