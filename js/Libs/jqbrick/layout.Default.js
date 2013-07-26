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
	
	var LayoutInterface = function(options) {
		
		this.options = $.extend({}, this.defaults, {
			itemsDefaultLayout:		null,	// extends View.itemDefaults.layout
			itemsOverrideLayout:	null,	// extends View.itemOverrides.layout			
		}, options || {});
		
		if (this.options.name) {
			this.name = this.options.name;
		}
		
	};
	LayoutInterface.extend = Backbone.View.extend;
	_.extend(LayoutInterface.prototype, {
		
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
		
		
		_outerSize: 			function(Panel) {},
		_innerSize: 			function(Panel) {},
		
		
		
		
		/**
		 * [boolean] detect if outer size dimension are blocked from
		 * some outside logic (es container's layout)
		 */
		__isForcedSized: function() {
			return false
		},
		
		
		
		
		/** 
		 * Outer Borders Utilities
		 */
		 
		__borderTopWidth: function() {
			return parseInt(this.Panel.$el.css("borderTopWidth"));
		},
		
		__borderBottomWidth: function() {
			return parseInt(this.Panel.$el.css("borderBottomWidth"));
		},
		
		__borderLeftWidth: function() {
			return parseInt(this.Panel.$el.css("borderLeftWidth"));
		},
		
		__borderRightWidth: function() {
			return parseInt(this.Panel.$el.css("borderRightWidth"));
		},
		
		__vBordersWidth: function() {
			return this.__borderTopWidth() + this.__borderBottomWidth();
		},
		
		__hBordersWidth: function() {
			return this.__borderLeftWidth() + this.__borderRightWidth();
		},
		
		
		
		
		/** 
		 * Inner Borders Utilities
		 */
		 
		__innerBorderTopWidth: function() {
			return parseInt(this.Panel.$body.css("borderTopWidth"));
		},
		
		__innerBorderBottomWidth: function() {
			return parseInt(this.Panel.$body.css("borderBottomWidth"));
		},
		
		__innerBorderLeftWidth: function() {
			return parseInt(this.Panel.$body.css("borderLeftWidth"));
		},
		
		__innerBorderRightWidth: function() {
			return parseInt(this.Panel.$body.css("borderRightWidth"));
		},
		
		__innerVBordersWidth: function() {
			return this.__innerBorderTopWidth() + this.__innerBorderBottomWidth();
		},
		
		__innerHBordersWidth: function() {
			return this.__innerBorderLeftWidth() + this.__innerBorderRightWidth();
		},
		
		
		__hSpace: function() {
			return this.Panel.$el.innerWidth() - this.__hBordersWidth();
		},
		
		__vSpace: function() {
			return this.Panel.$el.innerHeight() - this.__vBordersWidth();
		}
		
		
	});
	
	
	
	var DefaultLayout = LayoutInterface.extend({
		
		name: "default",
		
		initialize: function(Panel) {
			
			this.Panel = Panel;
			
			if (this.options.itemsDefaultLayout != null) {
				_.extend(this.Panel.options.itemDefaults, {layout:this.options.itemsDefaultLayout});
			}
			if (this.options.itemsOverrideLayout != null) {
				_.extend(this.Panel.options.itemOverrides, {layout:this.options.itemsOverrideLayout});
			}
		},
		
		layout: function(Panel) {
			
			this.Panel = Panel;
			
			console.log("DefaultLayout on " + Panel.cid);
		}
		
	});	
	
		
	return DefaultLayout;
	
});