/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 * 
 */

define([
	"jquery", "underscore", "backbone",
	"./view.Component",
	"./layout.Default"
	
], function(
	$, _, Backbone,
	Component,
	DefaultLayout
	
) {
	var Panel = Component.extend({
		
		defaults: function() {
			return $.extend({}, Component.prototype.defaults.apply(this,arguments), {
				
				xtype: "box",
				
				// active properties to configure box layout
				layout: 	null,
				width: 		null,
				height: 	null,
				fullsize: 	null,
				scrollable:	false
								
			});
		},
		
		layout: function(options) {
			var self = this;
			
			// reset rendered DeferredObject to fit this rendering process
			this.layoutComplete = $.Deferred();
			
			$.when(self.apply("beforeLayout", arguments, {trigger:true})).then(function() {
				
				$.when(self._layout()).then(function() {
					
					$.when(self.apply("afterLayout", arguments, {trigger:true})).then(function() {
					
							$.when(self._finalizeLayout()).then(function() {
								
								self.layoutComplete.resolve();
								self.apply("layoutComplete", arguments, {trigger:true});
								self.resolve('layouted');
									
							},self.layoutComplete.reject);
					}, self.layoutComplete.reject);
				}, self.layoutComplete.reject);
			}, self.layoutComplete.reject);
			
			// allow last given param to be a direct callback to be
			if (arguments.length && _.isFunction(arguments[arguments.length-1])) {
				$.when(self.layoutComplete).then(_.bind(arguments[arguments.length-1], self));
			}
			
			// allow to get a render deferred promise
			if (options === true && arguments.length == 1) {
				return this.layoutComplete.promise();
			} else {
				return this;
			}
		}
		
	});
	
	
	
	
	
	/**
	 * Setup Process
	 * - add "layouted" checkpoint
	 */
	Panel.prototype._setup = function() {
		Component.prototype._setup.apply(this, arguments);
		this._setupBox.apply(this, arguments);
	};
	
	Panel.prototype._setupBox = function() {
		this.Deferred('layouted');
		
		// it is the object responsible of layouting
		// it is a dependecy injection pattern to allow layouts grow in time
		this.layoutObj = null;
		
		// box real time dimensions
		// here are stored last dimensions setted up by layout manager
		this.width = null;
		this.height = null;
		
		// this property should contain forced dimmensions to be
		// applied to $el by layoutManagaer.
		//
		// if this property is not null layoutManager is asked to apply
		// those dimensions instead of calculate by itself rules.
		//
		// Example: this.forceOuterDimensions = {width:22,height:22};
		this.forceOuterDimensions = null;
		
		// bind event to update layout dinamically
		this.on("layoutchange", this.layout, this);
		
	}
	
	
	
	
	
	
	
	
	/**
	 * Initialization Process.
	 * identify and initializa a layout manager to be applied to the Box instance
	 */
	 
	Panel.prototype._initialize = function() {
		Component.prototype._initialize.apply(this, arguments);
		return this._initializePanel.apply(this, arguments);
	};
	
	/**
	 * It is responsible in finding the correct layout manager 
	 * to be initializated for the box
	 */
	Panel.prototype._initializePanel = function() {
		
		// get the layout manager object from string
		if (_.isString(this.options.layout)) {
			this.layoutObj = new (this.LayoutManager.get(this.options.layout));
		
		// get the layout manager from a given manager object constructor
		} else if (_.isFunction(this.options.layout)) {
			this.layoutObj = new (this.options.layout);
			this.options.layout = "custom";
		
		// fallback to the default layout manager
		} else {
			this.layoutObj = new DefaultLayout;
			this.options.layout = "default";
		}
		
		// run layout initialization cycle!
		return this._initializeLayout();
	}
	
	
	/**
	 * Layout Initialization Cycle
	 * triggers many events tied to layout initialization:
	 *
	 * - beforeInitializeLayout
	 * - beforeInitialize{LayoutName}Layout
	 * - afterInitialize{LayoutName}Layout
	 * - afterInitializeLayout
	 *
	 * this way it is really possible to inject various kind of initialization logic
	 * from outside this source code!!!
	 */
	Panel.prototype._initializeLayout = function() {
		var self 	= this;
		var _dfd 	= $.Deferred();
		var cbname 	= "Initialize" + this.utils.ucFirst(this.options.layout) + "Layout";
		
		$.when(self.apply("beforeInitializeLayout", arguments, {trigger:true})).then(function() {
			
			$.when(self.apply("before" + cbname, arguments, {trigger:true})).then(function() {
				
				$.when(self.layoutObj.initialize(self)).then(function() {
				
					$.when(self.apply("after" + cbname, arguments, {trigger:true})).then(function() {
						
						$.when(self.apply("afterInitializeLayout", arguments, {trigger:true})).then(
							_dfd.resolve,
							_dfd.reject
						);
					},_dfd.reject);	
				},_dfd.reject);
			},_dfd.reject);
		},_dfd.reject);
		
		return _dfd.promise();
	};
	
	
	
	
	
	
	
	/**
	 * Apply the layout manager rules to the element and propagate to sub items.
	 */
	
	Panel.prototype._layout = function() {
		var self 	= this;
		var _dfd 	= $.Deferred();
		var cbname 	= this.utils.ucFirst(this.options.layout) + "Layout";
		
		$.when(self.apply("before" + cbname, arguments, {trigger:true})).then(function() {
			
			$.when(self.layoutObj.render(self)).then(function() {
				
				// trigger update layout on child items
				_.each(self.getActiveItems(), function(item) {
					item.trigger("layoutchange");
				});
					
				$.when(self.apply("after" + cbname, arguments, {trigger:true})).then(
					_dfd.resolve,
					_dfd.reject
				);
				
			},_dfd.reject);	
		},_dfd.reject);	
		
		return _dfd.promise();
	};
	
	Panel.prototype._layoutItem = function(item) {
		return item.layout(true);
	};
	
	Panel.prototype._finalizeLayout = function() {};
	
	
	
	return Panel;
	
});