/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Default Layout Manager
 *
 */

define(["backbone", "./layout.Default"], function(Backbone, DefaultLayout) {
	
	var FitLayout = DefaultLayout.extend();
	
	FitLayout.prototype.name = "fit";
	
	FitLayout.prototype.initialize = function(View) {
		console.log("Init Fit Layout");
		View.options.itemDefaults.layout = "default";
	};
	
	FitLayout.prototype.render = function(View) {
		DefaultLayout.prototype.render.apply(this, arguments);
		this._scrollable(View);
	};
	
	FitLayout.prototype._outerSize = function(View) {
		if (DefaultLayout.prototype._outerSize.apply(this, arguments) == true) return true;
		
		View.width 	= View.$container.innerWidth(true);
		View.height = View.$container.innerHeight();
		
		var rules = {
			width: View.width,
			height: View.height
		};
		
		View.$el.css(rules);
	};
	
	
	FitLayout.prototype._innerSize = function(View) {
		
		var rules = {
			width: View.$el.innerWidth(true)
		};
		
		if (View.options.scrollable) {
			//rules.minHeight = View.$el.innerHeight() - parseInt(View.$body.css("borderTopWidth")) - parseInt(View.$body.css("borderBottomWidth"));
			rules.height = 800;
			
		} else {
			rules.height = View.$el.innerHeight() - parseInt(View.$body.css("borderTopWidth")) - parseInt(View.$body.css("borderBottomWidth"));
		}
		
		console.log(rules);
		
		View.$body.css(rules);
		
	}
	
	
	FitLayout.prototype._scrollable = function(View) {
		
		var rules = {};
		
		if (View.options.scrollable) {
			if (window.iScroll) {
				
				View.$el.css({
					overflow: "hidden",
					position: "relative"
				});
				
				var scroll = View.$el.data('iScroll');
				if (!scroll) {
					scroll = new iScroll(View.el);
					View.$el.data('iScroll', scroll);
				} else {
					scroll.refresh();
				}
				
			} else {
				rules.overflow = "auto";
				rules["-webkit-overflow-scrolling"] = "touch";	
			}
		} else {
			rules.overflow = "hidden";
		};
		
		View.$el.css(rules);
		
	};
	
	return FitLayout;
	
});