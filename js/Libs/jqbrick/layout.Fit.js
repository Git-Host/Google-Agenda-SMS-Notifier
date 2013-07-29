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
	
	var FitLayout = BlockLayout.extend({
		
		_elSize: function() {
			
			var $parent = this.Panel.$el.parent();
			if (!$parent.length) return;
			
			this.beforeWidth 	= this.width;
			this.beforeHeight 	= this.height;
			
			this.width 			= this.__outerWidthValue($parent.width(), this.Panel.$el);
			this.height 		= this.__outerHeightValue($parent.height(), this.Panel.$el);
			
			
			this.Panel.$el.css({
				width: 	this.width,
				height: this.height
			});
				
		}
		
	});
	
	
	return FitLayout;
	
});