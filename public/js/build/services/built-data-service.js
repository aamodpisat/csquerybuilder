'use strict';
module.exports = [
  '$q',
  '$http',
  function($q, $http) {
    var self      = this;
    var headers   = {};
    var host      = "";
    var prefix    = "";
      self.Header = {
        set : function(args){
          if(!_.isEmpty(args.api_key)){
            host    = 'https://' + args.apihost;
            headers = args; 
            prefix  = args.prefix;
          }
        },
        get : function(){
          return headers;
        }
      };
    self.Classes = {
        typePrefix : "/content_types/",
        getOne : function(args){
          return $http.get(host+ '/' +prefix + this.typePrefix + args.options.content_type_uid, {
            headers: headers
          }).then()
        } 
      };

      function wrapper(wrap){
        if (typeof(wrap) != "undefined") {
          return function(res) {
            return res.data[wrap];
          }
        } else {
          return function(res) {
            return res.data;
          }
        }
      }
  }
]