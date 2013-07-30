/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Default Layout Manager
 *
 */

define([
	"backbone",
	"./layout.Interface"
], function(
	Backbone,
	LayoutInterface
) {
	
	
	var DefaultLayout = LayoutInterface.extend({
		
		name: "default",
		
		initialize: function(Panel) {
			var self = this;
			this.Panel = Panel;
			
			//console.log("Initialize "+this.name+" layout on: " + Panel.cid);
			
			if (this.options.itemLayout != null) {
				_.extend(this.Panel.options.itemDefaults, {layout:this.options.itemLayout});
			};
			
			if (this.options.itemLayoutOverrides != null) {
				_.extend(this.Panel.options.itemOverrides, {layout:this.options.itemLayoutOverrides});
			};
			
			this.Panel.on("blocksize", function() {
				self.__sizeIsBlocked = true;
			});
			
			this.Panel.on("unblocksize", function() {
				self.__sizeIsBlocked = false;
			});
		},
		
		layout: function(Panel) {
			
			//console.log("Do " + this.name + " layout on " + Panel.cid);
			
			this.Panel = Panel;
			
			this._elSize();
			this._wrapperSize();
			this._toolbarsSize();
			this._bodyWrapperSize();
			this._bodySize();
			
			this._updateScroller();
		},
		
		finalize: function() {
			
			//console.log("Finalize " + this.name + " layout on " + this.Panel.cid);
			
			this._finalizeScroller();
		},
		
		
		/**
		 * Toolbars are not implementable by default layout!
		 */
		_toolbarsSize: function() {
			for (var i=0; i<this.Panel.toolbars.length; i++) {
				this.Panel.toolbars[i].remove();
			}
		},
		
	});	
	
		
	return DefaultLayout;
	
});