/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * BlockLayout
 * Element occupy exaclty given space or entire H availabel space
 * 
 * SCROLLABLE:
 * The element should become scrollable.
 * it depends on iScroll plugin availability to apply smooth scroll or simply
 * use "-webkit-overflow-scrolling" CSS spec (on iPhone/iPad)
 *
 */

define(["backbone", "./layout.Default"], function(Backbone, DefaultLayout) {
	
	var BlockLayout = DefaultLayout.extend();
	
	BlockLayout.prototype.name = "block";
	
	BlockLayout.prototype.initialize = function(View) {
		View.options.itemDefaults.layout = "block";
	};
	
	BlockLayout.prototype.render = function(View) {
		DefaultLayout.prototype.render.apply(this, arguments);
		this._scrollable(View);
	};
	
	BlockLayout.prototype._outerSize = function(View) {
	
		View.$el.css("display", "block");
		
		// check for forced dimensions setted up by parent component
		if (this._forcedOuterSize(View)) return true;
		
		var rules = {};
		
		if (View.options.width != null) {
			View.width 		= View.options.width;
			rules.width 	= View.width;
		}
		if (View.options.height != null) {
			View.height 	= View.options.height;
			rules.height 	= View.height;
		}
		
		View.$el.css(rules);
	};
	
	
	BlockLayout.prototype._scrollable = function(View) {
		
		var rules = {};
		
		if (View.options.scrollable) {
			if (window.iScroll) {
				
				View.$el.css({
					display:	"block",
					overflow: 	"hidden",
					position: 	"relative"
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
	
	return BlockLayout;
	
});