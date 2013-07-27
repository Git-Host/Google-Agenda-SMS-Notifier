/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 * 
 */

define([
	"jquery", "underscore", "backbone",
	"./view.Container",
	"./layout.Default"
	
], function(
	$, _, Backbone,
	Container,
	DefaultLayout
	
) {
	var Panel = Container.extend({
		
		defaults: function() {
			return $.extend({}, Container.prototype.defaults.apply(this,arguments), {
				
				xtype: 		"panel",
				itemXtype: 	"panel",
				
				
				// active properties to configure box layout
				// you can set a simple layout name as string without other params
				layout: {
					name: "default"
					// a lot of detailed configurations should be used
					// by different layouts!
					// please refer to those layouts documentation
				}
								
			});
		},
		
		
		
		/**
		 * This is the public layout API to make panel update it's appearence.
		 * by default it returns a "this" reference but give the last TRUE param
		 * to get process promise() as output!
		 *
		 * Many of core process is demanded to "_layout()" internal method who is
		 * the real responsible in apply layouting rules!
		 */
		layout: function(options) {
			var self = this;
			
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
		Container.prototype._setup.apply(this, arguments);
		this._setupPanel.apply(this, arguments);
	};
	
	Panel.prototype._setupPanel = function() {
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
		Container.prototype._initialize.apply(this, arguments);
		return this._initializePanel.apply(this, arguments);
	};
	
	/**
	 * It is responsible in finding the correct layout manager 
	 */
	Panel.prototype._initializePanel = function() {
		
		// interpret a string layout option
		if (_.isString(this.options.layout)) {
			var _layout = {name:this.options.layout};
		} else {
			var _layout = this.options.layout;
		}
		
		// get the layout manager object from string
		if (this.utils.isPlainObject(_layout)) {
			this.layoutObj = new (this.LayoutManager.get(_layout.name))(_layout);
		
		// get the layout manager from a given manager object constructor
		} else if (_.isFunction(_layout)) {
			this.layoutObj = new _layout;
			this.options.layout = "custom";
		
		// fallback to the default layout manager
		} else {
			this.layoutObj = new DefaultLayout;
			this.options.layout = "default";
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Chain Container's initialization with Panel's operations.
	 * return a promise() when all stuff is done.
	 *
	 * Inject Panel DOM manipulations before Items initialization!
	 *
	 * may need refactoring to make easy to extend Panel and add 
	 * DOM ligic inside!
	 * IDEA: introduce an empty method "_initializePanelStructure()" 
	 * before initialize layout
	 */
	Panel.prototype._initializeEl = function() {
		var self = this;
		var _dfd = $.Deferred();
		
		this._initializeElContainer();
		
		$.when(self._initializeElPanel()).then(function() {
			$.when(self._initializeLayout()).then(function() {
				$.when(self._initializeContainerItems()).then(
					_dfd.resolve,
					_dfd.reject
				);
			},_dfd.reject);
		},_dfd.reject);
		
		return _dfd.promise();
	};
	
	
	
	/**
	 * Panel's $el Initialization:
	 * - wrap $body with a custom DIV
	 * - create docked DOMs (TODO)
	 *
	 * REFACTORING NOTES:
	 * this logic introduce $wrapper and docked items.
	 * it may take some time to end so I will need to return a promise()
	 *
	 * I may decide to introduce an internal empty method "_initializePanelBody" 
	 * to be extended by Panel's subclasses to make easy inject come body related DOM nodes
	 */
	Panel.prototype._initializeElPanel = function() {
		this.$wrapper = $('<div class="jqbrick-wrapper">').append(this.$body);
		this.$el.append(this.$wrapper);
	};
	
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
	 * - before{LayoutName}Layout
	 * -> layoutObj::layout
	 * -> propagate to items
	 * - after{LayoutName}Layout
	 * -> layoutObj::finalize
	 */
	
	Panel.prototype._layout = function() {
		var self 	= this;
		var _dfd 	= $.Deferred();
		var cbname 	= this.utils.ucFirst(this.options.layout) + "Layout";
		
		$.when(self.apply("before" + cbname, arguments, {trigger:true})).then(function() {
			
			$.when(self.layoutObj.layout(self)).then(function() {
				
				// Propagate layout update to children
				// NOTICE: this is not a blocking process and may be really hard to switch into!
				_.each(self.getActiveItems(), function(item) {
					item.trigger("layoutchange");
				});
					
				$.when(self.apply("after" + cbname, arguments, {trigger:true})).then(function() {
					
					// allow layout finalize itself after layouting all items
					$.when(self.layoutObj.finalize(self)).then(
						_dfd.resolve,
						_dfd.reject
					);
				},_dfd.reject);
			},_dfd.reject);	
		},_dfd.reject);	
		
		return _dfd.promise();
	};
	
	
	
	/**
	 * Run some Panel level post-layouting logic
	 */
	
	Panel.prototype._finalizeLayout = function() {};
	
	
	
	return Panel;
	
});