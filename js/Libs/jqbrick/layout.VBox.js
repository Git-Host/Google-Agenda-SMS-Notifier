/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * VBoxLayout
 * Element is able to occupy all parent's available space.
 * 
 *
 */

define(["backbone", "./layout.Fit"], function(Backbone, FitLayout) {
	
	var VBoxLayout = FitLayout.extend();
	
	VBoxLayout.prototype.name = "vbox";
	
	VBoxLayout.prototype.initialize = function(View) {
		View.options.itemDefaults.layout = "block";
	};
	
	VBoxLayout.prototype.render = function(View) {
		FitLayout.prototype.render.apply(this, arguments);
		this._resizeItems(View);
	};
		
	
	VBoxLayout.prototype._resizeItems = function(View) {
		
		_.each(View.getActiveItems(), function(item) {
			item.forceOuterDimensions = {height: 100};
		});
		
	}
	
	return VBoxLayout;
	
});