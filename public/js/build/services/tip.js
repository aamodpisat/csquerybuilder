require('third-party-modules/qtip');

module.exports = [
	function() {

		this.destroyAll = function(container) {
			var container = container || $('body');
			container.find(".qtip").qtip("destroy");
			container.find("[data-hasqtip]").qtip("destroy");
		}

		this.repositionAll = function() {
			$(".qtip").qtip("reposition");
		}

		this.destroy = function(el) {
			el.qtip("destroy");
		}

		this.show = function(el, o) {
			var tooltip = el.qtip(_.extend({}, (o || {})));
			tooltip.qtip("show");
		}
	}
]