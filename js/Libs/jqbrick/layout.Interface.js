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
			itemLayout:				null,	// extends View.itemDefaults.layout
			itemLayoutOverrides:	null,	// extends View.itemOverrides.layout			
		}, options || {});
		
		if (this.options.name) {
			this.name = this.options.name;
		}
		
	};
	LayoutInterface.extend = Backbone.View.extend;
	_.extend(LayoutInterface.prototype, {
		
		/**
		 * It is called during Panel initialization process when
		 * Panel DOM is initialized but before items initialization.
		 *
		 */
		initialize: 		function(Panel) {},
		
		/**
		 * Run main layouting rules on given Panel
		 */
		layout: 			function(Panel) {},
		
		/**
		 * It is called after triggering layoutupdate on Panel's Items.
		 */
		finalize: 			function(Panel) {},
		
		/**
		 * Panel's DOM nodes sizing utilities
		 */
		_elSize: 			function() {},
		_wrapperSize:		function() {},
		_toolbarsSize:		function() {},
		_bodyWrapperSize:	function() {},
		_bodySize: 			function() {},
		_updateScroller:	function() {},
		_finalizeScroller:	function() {},
		
		
		
		
		
		
		
		
		
		/** 
		 * Outer Borders Utilities
		 */
		__borderTopWidth: function($node) {
			if (!$node || !$node.length) return 0;
			return parseInt($node.css("borderTopWidth"));
		},
		
		__borderBottomWidth: function($node) {
			if (!$node || !$node.length) return 0;
			return parseInt($node.css("borderBottomWidth"));
		},
		
		__borderLeftWidth: function($node) {
			if (!$node || !$node.length) return 0;
			return parseInt($node.css("borderLeftWidth"));
		},
		
		__borderRightWidth: function($node) {
			if (!$node || !$node.length) return 0;
			return parseInt($node.css("borderRightWidth"));
		},
		
		__vBordersWidth: function($node) {
			return this.__borderTopWidth($node) + this.__borderBottomWidth($node);
		},
		
		__hBordersWidth: function($node) {
			return this.__borderLeftWidth($node) + this.__borderRightWidth($node);
		},
		
		
		
		/**
		 * Get desired outer width/height for a box end return appropriate
		 * CSS value considering borders, paddings, etc in different browsers
		 *
		 * you can call with only a $DOM node to obtain a value to match
		 * node's internal space
		 */
		__outerWidthValue: function(val, $el) {
			if (val && val.length) {
				$el = val;
				val = $el.width(true);
			}
			if (!$el || !$el.length) {
				return val;
			};
			return val - this.__hBordersWidth($el);
		},
		__outerHeightValue: function(val, $el) {
			if (val && val.length) {
				$el = val;
				val = $el.height();
			}
			if (!$el || !$el.length) {
				return val;
			};
			return val - this.__vBordersWidth($el);
		}
		
		
	});
	
	
	
	
	
	return LayoutInterface;
	
});