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
				},
				
				autoLayout: 	true,
				
				
				toolbars: 		[],
				toolbarSize: 	48
								
			});
		},
		
		
		/**
		 * Overrides render() process to queque layout() triggering if autoLayout is true.
		 * there are also scalar values you can give to render(xxx) to change it's behavior.
		 *
		 * if you throw render() on a specific instance and you want to force layouting 
		 * just use:
		 *     Instance.render("layout")
		 *
		 * if you want to run layout and to receive rendering deferred:
		 *     Instance.render("layout", true);
		 *
		 * if you want to run layout and receive a render+layout complete deferred:
		 *     Instance.render("complete");
		 *
		 */
		render: function(options) {
			var self = this;
			var _dfd = $.Deferred();
			
			// classig 
			if (options === true) {
				options = {
					getDeferred 	: true
				};
			
			// "layout" rendering option
			} else if (_.isString(options) && options.toLowerCase() === "layout") {
				options = {
					autoLayout		: true
				};
			
			// "complete" rendering option
			} else if (_.isString(options) && options.toLowerCase() === "complete") {
				options = {
					getDeferred 	: true,
					autoLayout		: true,
					returnDeferred	: "layout"
				};
			}
			
			// apply default options
			options = _.extend({
				getDeferred			: false,
				autoLayout			: this.options.autoLayout,
				returnDeferred		: "render"
			}, options || {});
			
			var _renderDfd = Container.prototype.render.call(this, options, true);
			var _layoutDfd = null;
			
			// run layouting process after 
			_renderDfd.done(function() {
				if (options.autoLayout == true) {
					_layoutDfd = self.layout(true);
					
					// --> resolve DFD after layouting
					if (options.returnDeferred == "layout") {
						_layoutDfd.done(_dfd.resolve).fail(_dfd.reject);
					}
					
				}
				
				// --> resolve DFD at parent's render()
				if (options.returnDeferred == "render") {
					_renderDfd.done(_dfd.resolve).fail(_dfd.reject);
				}
			});
			
			// last argument "true" to return deferred
			if (options.getDeferred || (arguments.length && arguments[arguments.length-1] === true)) {
				return _dfd;
			} else {
				return this;
			}
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
								
								self.apply("layoutComplete", arguments, {trigger:true});
								self.resolve('layouted');
								self.layoutComplete.resolve();
									
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
		this.removeComplete = $.Deferred();
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
		};
		
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
		};
		
		// setup toolbars handler array
		this.toolbars = [];
		
		// prevent autoLayout on panel's items!
		this.options.itemOverrides.autoLayout = false;
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
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
			$.when(self._initializeElToolbars()).then(function() {
				$.when(self._initializeLayout()).then(function() {
					$.when(self._initializeContainerItems()).then(
						_dfd.resolve,
						_dfd.reject
					);
				},_dfd.reject);
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
		this.$bodyWrapper = $('<div class="jqbrick-bodyWrapper">').append(this.$body);
		this.$wrapper = $('<div class="jqbrick-wrapper">').append(this.$bodyWrapper);
		this.$el.append(this.$wrapper);
	};
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Panel's Toolbars Initialization:
	 * toolbars are sub-panels attached to one of panel's borders.
	 */
	Panel.prototype._initializeElToolbars = function() {
		var self = this;
		var _dfd = $.Deferred();
		this.toolbars = [];
		
		if (this.options.toolbars.length) {
			$.when(this.__walkItems(this.options.toolbars, this._initializeElToolbar, this)).always(_dfd.resolve);
		} else {
			_dfd.resolve();
		};
		
		return _dfd.promise();
	};
	
	
	Panel.prototype._initializeElToolbar = function(tbOptions) {
		var self = this;
		
		var tbConfig	= _.extend({
			docked		: "top",
			size		: this.options.toolbarSize,
			layout		: {}
		}, tbOptions, {
			parent		: this,
			container	: this.$wrapper
		});
		
		// layout config defaults
		tbConfig.layout = _.extend({
			scrollable: "auto"
		}, tbConfig.layout, {
			name:		"block"
		});
		
		var tbObj = new Panel(tbConfig);
		var tbDfd = tbObj.getDeferred("initialized");
		
		tbDfd.done(function() {
			tbObj.$el.addClass("jqbrick-panel-toolbar");
			tbObj.$el.css({
				position: 	"absolute",
				overflow:	"hidden"
			});
			self.toolbars.push(tbObj);
		});
		
		tbDfd.fail(function() {
			tbObj.destroy();
			tbObj = null;
		});
		
		return tbDfd;
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
		var cbname 	= "Initialize" + this.utils.ucFirst(this.options.layout.name) + "Layout";
		
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
		var cbname 	= this.utils.ucFirst(this.options.layout.name) + "Layout";
		
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