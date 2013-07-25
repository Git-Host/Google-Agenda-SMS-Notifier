/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Default Layout Manager
 *
 */

define(["backbone"], function(Backbone) {
	
	var DefaultLayout = function() {};
	
	DefaultLayout.prototype.name = "default";
	
	DefaultLayout.prototype.initialize = function(View) {
		console.log("Init Default Layout");
		
	};
	
	DefaultLayout.prototype.render = function(View) {
		this._outerSize(View);
		this._innerSize(View);
	};
	
	
	/**
	 * It is responsible of handlign "view.$el" dimensions.
	 * specialized layouts should override this method to calculate dimensions
	 * by custom rules.
	 *
	 * Here is implemented 
	 *
	 * SUBCLASS IMPLEMENTATION EXAMPLE:
	 * CustomLayout.prototype._outerSize = function() {
	 *   if (DefaultLayout.prototype._outerSize.apply(this, arguments) == true) return;
	 *   ... custom outer size logic ...
	 * }
	 */
	DefaultLayout.prototype._outerSize = function(View) {
		if (View.forceOuterDimensions != null) {
			
			View.forceDimensions = $.extend({}, {
				width: View.width,
				height: View.height
			}, View.forceDimensions);
			
			View.$el.css({
				width: View.forceDimensions.width,
				height: View.forceDimensions.height
			});
			View.forceDimensions.width = null;
			return true;
		}
	};
	
	
	/**
	 * It is responsible of handlign "view.$body" dimensions
	 */
	DefaultLayout.prototype._innerSize = function(View) {};
	
	
	
	
	/**
	 * Add extend() capabilities to layout object
	 */
	DefaultLayout.extend = Backbone.View.extend;
		
	return DefaultLayout;
	
});