/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Default Layout Manager
 *
 */

define(["backbone"], function(Backbone) {
	
	
	
	/**
	 * Layout Interface Object
	 * this is a follow up object ready to extend to implement different layouts for Panels
	 */
	
	var LayoutInterface = function() {};
	LayoutInterface.extend = Backbone.View.extend;
	_.extend(LayoutInterface.prototype, {
		name: 			'layout',
		
		/**
		 * It is called during Panel initialization process
		 */
		initialize: 	function(Panel) {},
		
		/**
		 * Run main layouting rules on given Panel
		 */
		layout: 		function(Panel) {},
		
		/**
		 * It is called after triggering layoutupdate on Panel's Items.
		 */
		finalize: 		function(Panel) {},
		
		
		_outerSize: 		function(Panel) {},
		_innerSize: 		function(Panel) {},
		_vBorders:			function(Panel) {},	// return top+bottom borders width
		_hBorders:			function(Panel) {},	// return left+right borders width
		_vInnerBorders:		function(Panel) {},	// return top+bottom borders width of View.$body
		_hInnerBorders:		function(Panel) {},	// return left+right borders width of View.$body
		
		
	});
	
	
	
	var DefaultLayout = LayoutInterface.extend({
		name: "default",
		
		layout: function(Panel) {
			console.log("DefaultLayout on " + Panel.cid);
		}
	});
	
	
	/*
	DefaultLayout.prototype.name = "default";
	
	DefaultLayout.prototype.initialize = function(View) {
		console.log("Init Default Layout");
		
	};
	
	DefaultLayout.prototype.render = function(View) {
		this._outerSize(View);
		this._innerSize(View);
	};
	*/
	
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
	 /*
	DefaultLayout.prototype._outerSize = function(View) {
		this._forcedOuterSize(View);
	};
	
	DefaultLayout.prototype._forcedOuterSize = function(View) {
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
		} else {
			return false;
		}
	};
	*/
	
	/**
	 * It is responsible of handlign "view.$body" dimensions
	 */
	 /*
	DefaultLayout.prototype._innerSize = function(View) {};
	*/
	
	
	
		
	return DefaultLayout;
	
});