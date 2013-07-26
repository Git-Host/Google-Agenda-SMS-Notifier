/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * FitLayout
 * Element is able to occupy all parent's available space.
 * 
 *
 */

define(["backbone", "./layout.Block"], function(Backbone, BlockLayout) {
	
	var FitLayout = BlockLayout.extend();
	
	FitLayout.prototype.name = "fit";
	
	FitLayout.prototype.initialize = function(View) {
		View.options.itemDefaults.layout = "block";
	};
	
	
	FitLayout.prototype._outerSize = function(View) {
		
		// check for forced dimensions setted up by parent component
		if (this._forcedOuterSize(View)) return true;
		
		View.width 	= View.$container.innerWidth(true);
		View.height = View.$container.innerHeight();
		
		var rules = {
			display:	"block",
			width: 		View.width,
			height: 	View.height
		};
		
		View.$el.css(rules);
	};
	
	
	FitLayout.prototype._innerSize = function(View) {
		
		var rules = {
			width: View.$el.innerWidth(true)
		};
		
		if (View.options.scrollable) {
			rules.minHeight = View.$el.innerHeight() - parseInt(View.$body.css("borderTopWidth")) - parseInt(View.$body.css("borderBottomWidth"));
			
		} else {
			rules.height = View.$el.innerHeight() - parseInt(View.$body.css("borderTopWidth")) - parseInt(View.$body.css("borderBottomWidth"));
		}
		
		View.$body.css(rules);
		
	}
	
	return FitLayout;
	
});