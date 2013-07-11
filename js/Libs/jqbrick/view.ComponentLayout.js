/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 * Backbone.View
 *  |
 *   -- jQbrick.View
 *    |
 *     -- jQbrick.Component
 *      |
 *       -- jQbrick.ComponentLayout
 *
 * Subclass of "Component" to add some layouting behaviors to a view.
 *
 *
 *
 *
 *
 * 
 *
 */

define([
	"jquery", "underscore", "backbone",
	"./view.Component",
	"./mixin.Layout"
	
], function(
	$, _, Backbone,
	Component,
	LayoutMixin
	
) {
	
	var ComponentLayout = Component.extend({
		defaults: function() {
			return $.extend({}, Component.prototype.defaults.apply(this,arguments), {
				layout:	null,
				xtype: "componentlayout",
			});
		},
		
		/**
		 * Calculate new layout for the component.
		 * Layouting can arrange component's wrapper depending on container attributes
		 * or arrange component's items in a manner of ways.
		 */
		layout: function(options) {
			var self = this;
			var options = $.extend({}, {
				recursive: false
			}, options||{});
			
			console.log("LAYOUT: " + this.id);
			
			
			$.when(self.apply("beforeLayout", arguments)).always(function() {
				
				$.when(self._layout()).always(function() {
					
					$.when(self.apply("afterLayout", arguments)).always(function() {
					
						self.resolve('layouted');
						
						// apply recursion to sub items
						if (options.recursive) {
							for (var i=0; i<self.items.length; i++) {
								if (self.items[i].active) {
									self.items[i].item.trigger("dolayout", options);
								}
							}
						}
						
					});
				});
			});	
			
			return this;
		}
	});
	
	
	
	
	
	/**
	 * Setup
	 */
	ComponentLayout.prototype._setup = function() {
		Component.prototype._setup.apply(this, arguments);
		this._setupComponentLayout();
	};
	
	ComponentLayout.prototype._setupComponentLayout = function() {
		this.Deferred('layouted');
	};
	
	
	
	
	
	
	/**
	 * Initialization
	 */
	ComponentLayout.prototype._initialize = function() {
		Component.prototype._initialize.apply(this, arguments);
		this._initializeComponentLayout();
	};
	
	ComponentLayout.prototype._initializeComponentLayout = function() {
		//this.on("afterrender dolayout", this.layout, this);
		this.on("dolayout", this.layout, this);
	};
	
	
	
	
	
	/**
	 * Layouting Logic
	 * try to understand options and to run required layout logic.
	 * main layout logics are wrapped into the "mixin.Layout" package!
	 * 
	 * Specific layouting methods should return a DeferredObject!
	 * this works perfect with the high level "layout" method who
	 * trigger events and callbacks!
	 */
	
	ComponentLayout.prototype._layout = function(layout) {
		layout = layout || this.options.layout;
		
		// Apply default values to layout configurations
		layout = $.extend({}, {
			type: 'none'
		}, _.isString(layout)?{type:layout}:layout);
		
		// try to run required layout logic
		var _method = layout.type + "Layout";
		if (this[_method] && _.isFunction(this[_method])) {
			return this[_method].apply(this, null, layout);
		}
		
		return false;
	};
	
	
	/**
	 * Apply LayoutMixin methods to the class
	 */
	_.extend(ComponentLayout.prototype, LayoutMixin.prototype);
	
	
	
	
	
	
// ----------------------------------------------------------- //
// ---[[   C A L L B A C K S   P L A C E H O L D E R S   ]]--- //	
// ----------------------------------------------------------- //
	
	ComponentLayout.prototype.beforeLayout = function() {};
	
	ComponentLayout.prototype.afterLayout = function() {};
	
	
	
	
	return ComponentLayout;
	
});