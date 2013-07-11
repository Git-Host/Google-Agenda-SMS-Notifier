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
	"./view.Component"
	
], function(
	$, _, Backbone,
	Component
	
) {
	
	var ComponentLayout = Component.extend({
		defaults: function() {
			return $.extend({}, Component.prototype.defaults.apply(this,arguments), {
				
				layout:			null
				
			});
		},
		
		/**
		 * Calculate new layout for the component.
		 * Layouting can arrange component's wrapper depending on container attributes
		 * or arrange component's items in a manner of ways.
		 */
		layout: function() {
			var self = this;
			
			$.when(self.apply("beforeLayout", arguments)).always(function() {
				
				$.when(self._layout()).always(function() {
					
					$.when(self.apply("afterLayout", arguments)).always(function() {
					
						self.resolve('layouted');
						
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
		this.on("afterrender", this.layout, this);
	};
	
	
	
	/**
	 * Layouting
	 */
	
	ComponentLayout.prototype._layout = function() {
		//console.log("_LAYOUT:" + this.options.layout);
	};
	
	
	
	
	
	
	
// ----------------------------------------------------------- //
// ---[[   C A L L B A C K S   P L A C E H O L D E R S   ]]--- //	
// ----------------------------------------------------------- //
	
	ComponentLayout.prototype.beforeLayout = function() {};
	
	ComponentLayout.prototype.afterLayout = function() {};
	
	
	
	
	return ComponentLayout;
	
});