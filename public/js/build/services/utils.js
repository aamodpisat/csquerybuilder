'use strict';

var traverse = require('traverse');

module.exports = [
	'constants',
	'alertService',
	function(constants, Alert) {
		var self = this;
		
		this.onWatchClass = {
			status : false,
			attempts: 0
		};
		/**
		 * Parses server error and returns html string.
		 * @param  {object} data   - Error object
		 * @param  {object} schema - Pass the class schema to interpolate path with the value
		 *                         	 in the schema given by the server in the error.
		 * @return {string}
		 */
		this.parseError = function(data, schema) {
			var errorString = "";
			if (data && data.errors && data.errors instanceof Object) {
				for (var prop in data.errors) {
					if (prop == "errors") {
						errorString += "<span class='e-value'>" + data.errors[prop].toString() + "</span><br />"
					} else {
						if (schema && prop.match(/schema./) !== null) {
							var str = this.getPath({
								schema: schema
							}, prop);
							if (str) {
								data.errors[str] = data.errors[prop];
								delete data.errors[prop];
								prop = str;
							}
						}
						var eKey = prop==='auth' ? '' : prop;
						errorString += "<span class='e-key'>" + eKey + " </span>" + "<span class='e-value'>" + data.errors[prop].toString() + "</span><br />"
						/*var errString = ""
						for(var key in data.errors[prop]){
							errString = key+": "+data.errors[prop][key] + ". "
						}
						errorString += "<span class='e-value'>" + errString + "</span><br />"*/
					}
				}
			}

			return "<div class='parsed-error'>" + errorString + "</div>";
		}
		

		/**
		 * Converts the numbers into percentage for platform users
		 * @param  {platformUsers}   - The users on android,ios,or others
		 * @param  {overallUsers}    - Total users in the app
		 * @return {Rounded percentage value of users in any platform}
		 */
		
		this.getPlatformPercentage = function(platformUsers,overallUsers) {
      return (platformUsers*100 / overallUsers || 0).toFixed(2);

      // parseFloat(Math.round(num1 * 100) /  255).toFixed(2);
      	/*parseFloat(Math.round(platformUsers/overallUsers*100 || 0)).toFixed(2);*/
      	/*Math.round(platformUsers/overallUsers*100 || 0).toFixed(2);*/
    }


		/**
		 * Scrolls the window or selector to the given position
		 * @param  {number} position  - The scroll position.
		 * @param  {jQuery object} - The jQuery selector
		 * @return {undefined}
		 */
		this.scrollTo = function(position, selector) {
			if (!selector)
				var selector = $('html, body');

			_.defer(function() {
				selector.animate({
					scrollTop: position || 0 + "px"
				}, 100);
			});
		}

		/**
		 * Returns a random number. Pass a pool of used random numbers to avoid duplicacy of numbers.
		 * @param  {Array} pool - Random number pool.
		 * @return {number}
		 */
		this.getRand = function(pool) {
			var num = Math.ceil(Math.random() * 1000000000);
			if (!pool)
				return num;

			if (pool.indexOf(num) !== -1)
				return getRand()

			pool.push(num);
			return num;
		}

		/**
		 * Applies scope to all inner scopes.
		 * @param  {object}   scope [description]
		 * @param  {Function} fn    [description]
		 * @return {[type]}         [description]
		 */
		this.sa = function(scope, fn) {
			if (fn)
				(scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
			else {
				(scope.$$phase || scope.$root.$$phase) ? '' : scope.$apply();
			}
		}

		/**
		 * returns OS name depending upon the OS.
		 * @return {String} OS name
		 */
		this.getOS = function() {
			var p = navigator.platform.toUpperCase();
			if (p.indexOf('MAC') !== -1) {
				return 'mac';
			} else if (p.indexOf('WIN') !== -1) {
				return 'windows';
			} else if (p.indexOf('LINUX') !== -1) {
				return 'linux';
			} else {
				return 'other';
			}
		}

		/**
		 * Get Menus according to roles.
		 *
		 */
		this.getMenu = function(currentApp, currentUser) {
			var menu = JSON.parse(currentApp.application_variables.menu);
			var roleNames = currentUser.roles.map(function(role) {
				return role.name;
			});
			roleNames.push('default');
			var setMenu = menu.filter(function(obj) {
				var rights = _.flatten(roleNames.map(function(item) {
					return obj.data.roles[item].can;
				}))
				return rights.indexOf('access') >= 0;
			})
			console.log("setMenu", setMenu);
			return setMenu;
		}

		/**
		 * Creates UID from given string.
		 * @param  {string} str - The string to be converted to an UID.
		 * @return {string}
		 */
		this.createUID = function(str) {
			if (_.isEmpty(str))
				return
			str = str.replace(constants.regex.alphaNumericOnly, '_');
			str = str.replace(constants.regex.underscores, '_');
			return str.toLowerCase();
		}

		this.getFileInfo = function(asset) {
			var fileName = asset.filename || asset.name;
			var fileSize = asset.file_size || asset.size;
			var index = fileName.lastIndexOf(".") + 1;
			return self.bytesToSize(fileSize);
			//return self.bytesToSize(fileSize) + " " + fileName.substring(index, fileName.length) + " File";
		}

		/**
		 * Returns humanized file size string.
		 * @param  {number} bytes file size in bytes
		 * @return {string}
		 */
		this.bytesToSize = function(bytes) {
			if (isNaN(bytes))
			return bytes;
		
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
		}

		/**
		 * Returns boolean if the file is an image by checking its extension.
		 * @param  {string}  name - file name with extension
		 * @return {Boolean}
		 */
		this.isImage = function(name) {
			name = name.toLowerCase();
			var ext = name.substr((name.lastIndexOf('.') + 1));
			switch (ext) {
				case 'jpg':
				case 'png':
				case 'gif':
				case 'jpeg':
				case 'bmp':
					return true;
					break;
				default:
					return false;
			}
		}

		/** 
		 * Gets the value at any depth in a nested object based on the path described by the keys given. Keys may be given as an array or as a dot-separated string.
		 * @param  {Object} obj - Object to be traversed.
		 * @param  {string, array} ks  - String or an Array of nested keys.
		 * @return {Object || undefined}
		 */
		this.getPath = function(obj, ks) {
			if (typeof ks == "string") ks = ks.split(".");

			// If we have reached an undefined property
			// then stop executing and return undefined
			if (obj === undefined) return void 0;

			// If the path array has no more elements, we've reached
			// the intended property and return its value
			if (ks.length === 0) return obj;

			// If we still have elements in the path array and the current
			// value is null, stop executing and return undefined
			if (obj === null) return void 0;

			return this.getPath(obj[_.first(ks)], _.rest(ks));
		}

		// Set Cookie  
		this.setCookie = function(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
			var expires = "expires=" + d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		}

		// Get Cookie  
		this.getCookie = function(cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1);
				if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
			}
			return "";
		}

		// Delete Cookie
		this.deleteCookie = function(name) {
			document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
		}

		/**
		 * @name  queryDecoder
		 * @param query [url parameter query]
		 * @desc  returns an object considering query paramters
		 **/
		this.queryDecoder = function(query) {
			var splittedHash = query.split("?");
			var params = new Object();
			var queryString = splittedHash[1];
			var regex = /([^&=]+)=([^&]*)/g;
			var m;
			while (m = regex.exec(queryString)) {
				params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
			}
			return params;
		}

		this.calcPercent = function(n, t) {
			var p = parseFloat(((n / t) * 100).toFixed(1));
			if (_.isNaN(p)) {
				return 0;
			} else {
				return p > 100 ? 100 : p;
			}
		}

		this.humanizeNumber = function(value) {
			var suffixes = ["", "K", "M", "B", "T"];
			var suffixNum = Math.floor(("" + value).length / 3);
			var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(2));
			if (shortValue % 1 != 0) var shortNum = shortValue.toFixed(1);
			return shortValue + suffixes[suffixNum];
		}

		this.joinStr = function(key, joinStr, seperator) {
			seperator = seperator || '.';
			if (_.isEmpty(key))
				seperator = '';

			return key += seperator + joinStr;
		}

		this.getTimeZoneOffset = function() {
			return constants.timezones.map(function(zone) {
				return zone.id.replace(":", "");
			})
		}

		this.showAccountMessage = function(msg) {
			var tempStr = "";
			for (var i = 0, len = msg.length; i < len; i++) {
				tempStr += "<p>" + msg[i] + "</p>";
			}
			return tempStr;
		}

		this.setInfoMessage = function(msg, type) {
			Alert.notify({
				title: _.capitalize(type),
				content: this.showAccountMessage(msg),
				type: type,
				hide: false,
				timeout: null
			})
		}

		this.capitalize = function(str){
			return str.charAt(0).toUpperCase() + this.slice(1);
		}

		this.truncateText = function(text, maxLength) {
			return text.length > maxLength ? $.trim(text.substr(0, maxLength)) + '...' : text;
		}

		this.isTenantSet = function(app) {
			return (app.discrete_variables && app.discrete_variables.tenant && app.discrete_variables.tenant != 'built_default_tenant')
		}

		/**
		 * Initializes tooltip
		 * @return {undefined}
		 */
		this.tip = function(o) {
			setTimeout(function() {
				$('[rel=tooltip]').tooltip(o);
			}, 1000);
		}


		this.getClassSearch = function(builtApi, query) {
			return _.throttle(function() {
				var params = {
					options: {
						query: {
							query: JSON.stringify({
								'$or': [{
									uid: {
										'$regex': query,
										'$options': 'i'
									}
								}, {
									title: {
										'$regex': query,
										'$options': 'i'
									}
								}]
							}),
							limit: constants.queryLimit
						}
					}
				}

				return builtApi.Classes.getAll(params)
					.then(function(klasses) {
						klasses = klasses.classes;
						return {
							results: klasses.map(function(klass) {
								klass['id'] = klass.uid;
								klass['text'] = klass.title;
								return klass;
							})
						}
					});
			}, 10);
		}

		this.removeKey = function(obj, key) {
			return traverse(obj).forEach(function(x) {
				if (this.key == key)
					this.delete();
			});
		}

		self.removeArrayKey = function(obj, key) {
			var newObject = {data :""};
			newObject.data = obj;
			console.log("newObject", newObject);
			var newObject =  traverse(newObject).forEach(function(x) {
				console.log(this);
				if (this.key == key){
					this.remove();
				}
				//console.log("x", x, this);
				
			});
		}

		this.roundOff = function(num) {
			return Math.round(num * 100);
		}

		this.supportformData = function(){
			return (!!(window && window.FormData));
		}

		this.compactObj = function(o) {
			return _.omit(o, function(v){
				if(_.isNumber(v))
					return false;

				return _.isEmpty(v);

			})
		}

		this.currentDate =  function(date, format) {
	  	return moment(date).format(format);
		}
	}
];