require('third-party-modules/smartadmin/notification');
require('third-party-modules/pnotify');

var notifyOptions = {
	title: "",
	text: "",
	styling: 'fontawesome',
	width: '420px',
	delay: 6000,
	mouse_reset: false
}

var confirmDefaultOptions = {
	title: '',
	content: '',
	classes: 'fa-exclamation-triangle txt-color-redLight',
	buttons: '[No][Yes]'
}

var type = {
	success: {
		icon: 'fa fa-check',
		color: '#739E73'
	},
	info: {
		icon: 'fa fa-bell swing animated',
		color: '#3276B1'
	},
	warning: {
		icon: 'fa fa-exclamation-triangle swing animated',
		color: '#739E73'
	},
	error: {
		icon: 'fa fa-warning shake animated',
		color: '#C46A69'
	}
}


module.exports = ['$q',
	function($q) {

		this.notify = function(o) {
			var options      = _.extend({}, notifyOptions, o, type[o.type]);
			options.text     = options.content;
			options.addclass = window.innerWidth < 450 ? 'ui-pnotify-mini' : '';
			new PNotify(options);
		}

		this.confirm = function(o) {
			var p = $q.defer();
			var classes = o.classes || confirmDefaultOptions.classes;
			o.title = '<i class="fa ' + classes + ' mr5"></i> ' + o.title;
			var confirmOptions = _.extend({}, confirmDefaultOptions, o);

			console.log("confirmOptions", confirmOptions);
			$.SmartMessageBox(confirmOptions, function(b) {
				if (b === "Yes") {
					p.resolve();
				}
				if (b === "Continue") {
					p.resolve();
				}
				if (b === "No") {
					p.reject();
				}
			});
			return p.promise;
		}
	}
]