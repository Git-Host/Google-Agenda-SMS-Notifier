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
	
	var LayoutInterface = function(options) {};
	
	LayoutInterface.extend = Backbone.View.extend;
	
	_.extend(LayoutInterface.prototype, {
	
		View: null,
		
		initialize: function(View) {},
		
		render: function() {},
		
		renderContent: function() {},
		
		update: function() {},
		
		destroy: function() {}
		
	});
	
	return LayoutInterface;
	
});