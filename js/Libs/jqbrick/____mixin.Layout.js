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
	
	
	var Mixin = function() {};

	
	Mixin.prototype.fitLayout = function(options) {
		this.__fit();
	};
	
	
	
	
	
	
	
	
	
	/**
	 * Fit $el dimension to a given target
	 */
	Mixin.prototype.__fit = function($target, options) {
		
		$target = $target || this.$el.parent();
		if (!$target.length) return false;
		
		var options = $.extend({}, {
			animate: 	0,
			easing:		null
		}, options||{});
		
		var props = {
			display: 'block',
			width:		$target.innerWidth(),
			height:		$target.innerHeight()
		};
		
		var _dfd = $.Deferred();
		if (options.animate > 0) {
			this.$el.stop().animate(props, options.animate, options.easing, _dfd.resolve);
			
		} else {
			this.$el.css(props);
			_dfd.resolve();
		}
		
		return _dfd.promise();
	};
	
	
	
	return Mixin;
	
});