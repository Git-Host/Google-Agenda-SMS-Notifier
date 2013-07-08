/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 *
 *
 */

define([
	"jquery", "underscore", "backbone"
	
], function(
	$, _, Backbone
	
) {
	
	var View = Backbone.View.extend({
		defaults: function() {
			return {
				html:	'',
				style:	'',
				layout: 'block'
			}
		},
		
		initialize: function(options) {
			
			// fetch default options coming from structure or method output
			var defaults = this.defaults;
			if (_.isFunction(this.defaults)) defaults = this.defaults();
			
			// extend options for this instance
			this.options = $.extend({}, defaults||{}, options||{});
			
			this.$content = this.$el;
			
			console.log(this.options);
			
		},
		render: function() {
			
			
			if (this.options.css) {
				this.$content.css(this.options.css);
			}
			
			if (this.options.style) {
				this.$content.attr('style', this.options.style);
			}
			
			if (this.options.html.length) {
				this.$content.append(this.options.html);
			}
			
			return this;
		}
	});
	
	
	View.prototype.appendTo = function($target) {
		if ($target instanceof Backbone.View) {
			this.$el.appendTo($target.el);
		} else {
			this.$el.appendTo($target);
		}
		return this;
	};
	
	View.prototype.renderTo = function($target) {
		this.render();
		this.appendTo($target);
		return this;
	};
	
	
	return View;
	
});