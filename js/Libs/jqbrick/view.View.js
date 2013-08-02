/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 * Extends BackboneJS's View component adding some useful methods and
 * prototyping an inheritance for subclassing View object itself. 
 * 
 * $el vs $body
 * -----------------
 * BackboneJS's Views has a $el poiter to the main wrapped DOM element
 * who contain all view's structure.
 *
 * jQbrick's View first subclass is a "UI component" and a component can 
 * contain other components; each component should have some structural  
 * differences between wrapper element and content element those pointers
 * have two dedicated names.
 *
 * NOTE: this class does not implement any Component logic!
 *       component logic is delegated to Component subclass!
 *
 *
 *
 * CALLBACKS:
 * -----------------
 *
 * on
 *
 * EVENTS:
 * -----------------
 *
 * DEFERREDS:
 * -----------------
 * 
 */

define([
	"jquery", "underscore", "backbone",
	"./mixin.Callback",
	"./mixin.Deferred",
	"./layout.Interface"
	
], function(
	$, _, Backbone,
	CallbackMixin,
	DeferredMixin,
	LayoutInterface
	
) {

	var View = Backbone.View.extend({
		
		xtype: 	"view",
		
		tagName: 	'div',
		className:	'jqbrick',
		
		defaults: {
				
			// link to the parent Backbone.View class
			parent:		null,
			
			// link to the DOM container (because it should be different from a parent.$el)
			// (if empty but "parent" was set it will use parent's body or box)
			container: null,
			
			// View layer ($el) attributes
			html:		null,	// initialize view with some HTML contents inside
			attrs:		{},		// a list of attributes to apply to $el
			style:		'',
			css:		{},
			cls:		{},		// one or more class names to add to hard coded class name
			
			
			layout: 	null,
			
			// initialization chain facilities
			autoRender: true,
			autoLayout: true
			
		}
				
	});





// ----------------------------------------- //	
// ---[[   L I F E C Y C L E   A P I   ]]--- //	
// ----------------------------------------- //

	View.prototype.initialize = function() {
		var self = this;
		var args = arguments;
		
		// save a startup timer for debuggin porposes
		self.__execTime = Date.now();
		
		// setup checkpoints
		this.Deferred(
			"initialized",
			"allinitialized",
			
			"rendered",
			"allrendered",
			
			"modelready",
			"collectionready",
			"dataready",
			
			"ready"
		);
		
		var ___ = function() {
			self.reject("initialized");
		};
		
		var ___C = function() {
			self.reject("allinitialized");
		};
		
		// run asyncronously to allow external code to bind on triggered events.
		// NOTE: it slow about 5 milliseconds!
		setTimeout(function() {
			$.when(self._options.apply(self, args)).then(function() {
				
				$.when(self.apply("startup", arguments, {trigger:true})).then(function() {
					
					$.when(self._setup()).then(function() {
						
						$.when(self.apply("setup", arguments, {trigger:true})).then(function() {
							
							$.when(self._init()).then(function() {
							
								$.when(self.apply("init", arguments, {trigger:true})).then(function() {
									
									console.log("Initialized in: " + self.utils.elapsed(self.__execTime) + "ms");
									self.resolve("initialized");
									
									$.when(self._initContent()).then(function() {
									
										$.when(self.apply("initContent", arguments, {trigger:true})).then(function() {
											
											console.log("Content Initialized in: " + self.utils.elapsed(self.__execTime) + "ms");
											self.resolve("allinitialized");
											
										},___C);
									},___C);
									
									// throw auto-render asynchronously to improve initialization performances!
									setTimeout(_.bind(self._autoRender,self),0);
									
								},___);
							},___);
						},___);
					},___);
				},___);
			},___);
		},0);
		
		return this;
	};
	
	
	View.prototype.render = function() {
		var self = this;
		var args = arguments;
	
		// save a rendering startup timer for debuggin porposes
		self.__renderTime = Date.now();
		
		// append to container if not!
		if (!this.$el.parent().length) this._append();
		
		// renew per call deferred objects
		this.renderComplete 		= $.Deferred();
		this.renderContentComplete 	= $.Deferred();
		
		var ___ = function() {
			self.renderComplete.reject();
		};
		
		var ___C = function() {
			self.renderContentComplete.reject();
		};
		
		// run asyncronously to allow external code to bind on triggered events.
		// NOTE: it slow about 5 milliseconds!
		setTimeout(function() {
			$.when(self.apply("beforeRender", args, {trigger:true})).then(function() {
					
				$.when(self._render.apply(args)).then(function() {
						
					$.when(self.apply("afterRender", args, {trigger:true})).then(function() {
						
						console.log("Rendered in: " + self.utils.elapsed(self.__renderTime) + "ms");
						self.resolve("rendered");
						self.renderComplete.resolve();
						
						$.when(self._renderContent.apply(args)).then(function() {
						
							$.when(self.apply("afterRenderContent", args, {trigger:true})).then(function() {
							
								console.log("Content Rendered in: " + self.utils.elapsed(self.__renderTime) + "ms");
								self.resolve("allrendered");
								self.renderContentComplete.resolve();
							
							},___C);
						},___C);
	
						// throw auto-layout asynchronously to improve initialization performances!
						setTimeout(_.bind(self._autoLayout,self),0);
					
					},___);
				},___);
			},___);
		},0);
		
		if (arguments.length && arguments[arguments.length-1] === true) {
			return this.renderComplete.promise();
		} else if (arguments.length && arguments[arguments.length-1] === "all") {
			return this.renderContentComplete.promise();
		} else {
			return this;
		}
	};
	
	
	View.prototype.destroy = function() {};
	
	





// ----------------------------------- //	
// ---[[   P U B L I C   A P I   ]]--- //	
// ----------------------------------- //
	
	/**
	 * Following methods are public API to access interternal DOM properties
	 * who refer to the most external and internal tags.
	 *
	 * Please use them instead of "Instance.$el" or similar!
	 *
	 *     Instance.getBox().hide()     // good way
	 *     Instance.$el.hide()          // bad way
	 * 
	 */	
	
	View.prototype.getBox = function() {
		return this.$el;
	};
	
	View.prototype.getBody = function() {
		return this.$el;
	};
	
	View.prototype.getContainer = function() {
		return this.$container;
	};
	
	
	
	/**
	 * Set up a new layout manager for the view.
	 * It try to remove an existing manager before to setup new one!
	 */
	View.prototype.setLayoutManager = function(layout) {
		var self = this;
		var _dfd = $.Deferred();
		
		if (layout) {
			$.when(self.unsetLayoutManager(true)).then(function() {
				self.layout = layout;
				$.when(self.layout.initialize(self)).then(function() {
					// bind layout events
					self.on("layoutchange", 	self.doLayout, self);
					self.on("contentchange", 	self.updateLayout, self);
					
					_dfd.resolve();
				},_dfd.reject);
			},_dfd.reject);
			
		} else {
			_dfd.reject();
		}
		
		// conditional deferred output
		if (arguments.length && arguments[arguments.length-1] === true) {
			return _dfd;
		} else {
			return this;
		}
	};
	
	
	/**
	 * Completely destroy and remove current layout manager (if exists)
	 */
	View.prototype.unsetLayoutManager = function() {
		var self = this;
		var _dfd = $.Deferred();
		
		if (this.layout) {
			$.when(self.layout.destroy(self)).then(function() {
				// unbind layout events
				self.off("layoutchange", 	self.doLayout);
				self.off("contentchange", 	self.updateLayout);
				
				self.layout = null;
				
				_dfd.resolve();
			},_dfd.reject);
			
		} else {
			_dfd.resolve();
		}
		
		// conditional deferred output
		if (arguments.length && arguments[arguments.length-1] === true) {
			return _dfd;
		} else {
			return this;
		}
	};
	
	
	
	
	/**
	 * this method apply some layouting rules respondig to external factors 
	 * es window resize.
	 *
	 * it is also binded to the "layoutchange" event received by the view.
	 */
	View.prototype.doLayout = function() {
		var self = this;
		var args = arguments;
	
		// save a rendering startup timer for debuggin porposes
		self.__layoutTime = Date.now();
		
		// renew per call deferred objects
		this.layoutComplete 		= $.Deferred();
		this.layoutContentComplete 	= $.Deferred();
		
		var ___ = function() {
			self.layoutComplete.reject();
		};
		
		var ___C = function() {
			self.layoutContentComplete.reject();
		};
		
		// run asyncronously to allow external code to bind on triggered events.
		// NOTE: it slow about 5 milliseconds!
		setTimeout(function() {
			$.when(self.apply("beforeLayout", args, {trigger:true})).then(function() {
					
				$.when(self.layout.render()).then(function() {
						
					$.when(self.apply("afterLayout", args, {trigger:true})).then(function() {
						
						console.log("Layouted in: " + self.utils.elapsed(self.__layoutTime) + "ms");
						self.layoutComplete.resolve();
						
						$.when(self.layout.renderContent()).then(function() {
						
							$.when(self.apply("afterContentLayout", args, {trigger:true})).then(function() {
							
								console.log("Contents Layouted in: " + self.utils.elapsed(self.__layoutTime) + "ms");
								self.layoutContentComplete.resolve();
							
							},___C);
						},___C);		
					},___);
				},___);
			},___);
		},0);
		
		// conditional deferred output
		if (arguments.length && arguments[arguments.length-1] === true) {
			return this.renderComplete.promise();
		} else if (arguments.length && arguments[arguments.length-1] === "all") {
			return this.renderContentComplete.promise();
		} else {
			return this;
		}
	};
	
	
	/**
	 * this method update layout responding to internal factors
	 * es content length change, new items...
	 *
	 * I think the main usage of this method is to update internal
	 * scroller plugin if exists...
	 */
	View.prototype.updateLayout = function() {
		var self = this;
		var args = arguments;
	
		// save a rendering startup timer for debuggin porposes
		self.__layoutUpdateTime = Date.now();
		
		// renew per call deferred objects
		this.layoutUpdated 			= $.Deferred();
		
		var ___ = function() {
			self.layoutUpdated.reject();
		};
		
		
		// run asyncronously to allow external code to bind on triggered events.
		// NOTE: it slow about 5 milliseconds!
		setTimeout(function() {
			$.when(self.apply("beforeUpdateLayout", args, {trigger:true})).then(function() {
					
				$.when(self.layout.update()).then(function() {
						
					$.when(self.apply("afterUpdateLayout", args, {trigger:true})).then(function() {
						
						console.log("Layout Updated in: " + self.utils.elapsed(self.__layoutUpdateTime) + "ms");
						self.layoutUpdated.resolve();
								
					},___);
				},___);
			},___);
		},0);
		
		// conditional deferred output
		if (arguments.length && arguments[arguments.length-1] === true) {
			return this.renderComplete.promise();
		} else if (arguments.length && arguments[arguments.length-1] === "all") {
			return this.renderContentComplete.promise();
		} else {
			return this;
		}
	};
	
	
	
	
	
	View.prototype.append = function() {};
	
	View.prototype.remove = function() {};




















// ------------------------------------------------------- //	
// ---[[   O V E R R I D D A B L E   M E T H O D S   ]]--- //	
// ------------------------------------------------------- //
	
	/**
	 * Setup "instance.options" property mixing defaults with given
	 * initialization options.
	 *
	 * This happen because "default" class key should be both an object
	 * or a method who return an object!
	 */
	View.prototype._options = function(options) {
		var self = this;
		
		// fetch default options coming from structure or method output
		var defaults = this.defaults;
		if (_.isFunction(this.defaults)) {
			defaults = this.defaults();
		}
		
		// default method return a DeferredObject
		// it's solution will contain defaults for the class
		if (this.utils.isDeferred(defaults)) {
			defaults.done(function(defaults) {
				self.options = $.extend({}, defaults||{}, options||{});
			});
			return defaults;
		
		// defaults values are a clean object!
		} else {
			this.options = $.extend({}, defaults||{}, options||{});
		}
	};
	
	
	/**
	 * Internal properties and events initialization:
	 * - setup start values
	 * - register to events
	 */
	View.prototype._setup = function() {
		var self = this;
		
		// setup internal DeferredObject renewed at every public API call
		this.renderComplete 		= $.Deferred();
		this.renderContentComplete 	= $.Deferred();
		this.appendComplete 		= $.Deferred();
		this.removeComplete 		= $.Deferred();
		
		// watch data checkpoints resolution and bind them to callbacks & events
		this.when("modelready").then(function() {			self.apply("modelReady", arguments, {trigger:true})			});
		this.when("collectionready").then(function() {		self.apply("collectionReady", arguments, {trigger:true})	});
		this.when("dataready").then(function() {			self.apply("dataReady", arguments, {trigger:true})			});
		this.when("ready").then(function() {				self.apply("ready", arguments, {trigger:true})				});
		
		this._resolveDataCheckpoints();
		this._resolveParentContainer();
		
		this.setLayoutManager(this._resolveLayoutManager());
	};
	
	
	/**
	 * Internal DOM structure initialization:
	 * - add DOM nodes to this.$el
	 * - setup initial styles and attributes
	 */
	View.prototype._init = function() {
		
		// default component id from view's CID
		if (!this.options.id) {
			this.options.id = this.cid;
			this.options.attrs['id'] = this.options.id;
		}
		
		// setup wrapper attributes
		this.utils.applyAttributes(this.$el, this.options.attrs);
		if (this.options.style) 		this.$el.attr('style', this.options.style);
		if (this.options.css) 			this.$el.css(this.options.css);
		if (this.options.cls)			this.$el.addClass(this.options.cls);
		
	};
	
	
	/**
	 * Content and sub-views initialization logic goes here:
	 */
	View.prototype._initContent = function() {
		if (_.isString(this.options.html)) {
			this.getBody().html(this.options.html);
		}
	};
	
	
	/**
	 * This piece of logic scope is to resolve "dataXXX" checkpoints basing on
	 * what kind of data objects are given to the instance.
	 *
	 * NOTE: Below implementation figure only one model or collection should be
	 * given to the view as BackboneJS teach.
	 * 
	 */
	View.prototype._resolveDataCheckpoints = function() {
		var self = this;
		
		// resolve "modelready"
		if (!this.model) {
			this.resolve("modelready");
		} else {
			this.model.on("ready", function() {
				self.resolve("modelready");
			});
		}
		
		// resolve "collectionready"
		if (!this.collection) {
			this.resolve("collectionready");
		} else {
			this.collection.on("ready", function() {
				self.resolve("collectionready");
			});
		}
		
		// resolve "dataready"
		$.when(this.getDeferred("modelready"), this.getDeferred("collectionready")).then(function() {
			self.resolve("dataready");
		});
	};
	
	
	/**
	 * Try to resolve "parent" and "$container" properties from instance options.
	 *
	 * - $container: rapresent the real box wrapper for the View
	 * - parent: rapresent direct ancestor View instance
	 * 
	 */
	View.prototype._resolveParentContainer = function() {
		this.parent 	= this.options.parent;
		this.$container = this.options.container;
		
		if (_.isString(this.$container)) {
			this.$container = $(this.$container).first();
		}
		
		if (!this.$container && this.parent) {
			// parent is jQbrick.view.View or subclass
			if (_.isFunction(this.parent.getBody) && this.parent.getBody()) {
				this.$container = this.parent.getBody();
			// parent is generic BackboneJS View
			} else if (this.parent.$el) {
				this.$container = this.parent.$el;
			}
		}
	};



	
	
	
	
	
// ------------------------------------------------------------- //
// ---[[   R E N D E R I N G   O V E R R I D D A B L E S   ]]--- //
// ------------------------------------------------------------- //
	
	View.prototype._autoRender = function() {
		if (this.options.autoRender == true) {
			this.render();
		
		// wait for parent object to resolve "rendered" DeferredObject until render itself
		} else if (this.options.autoRender === "cascade") {
			if (this.parent && _.isFunction(this.parent.is)) {
				this.parent.is("rendered", _.bind(this.render, this));	
			}
		
		// wait for an internal checkpoint to resolve
		} else if (["ready", "modelready","collectionready","dataready"].indexOf(this.options.autoRender) != -1) {
			this.is(this.options.autoRender, this.render);
		
		// wait for a custom DeferredObject to be resolved
		} else if (this.utils.isDeferred(this.options.autoRender)) {
			this.options.autoRender.done(_.bind(this.render, this));
		}
	};
	
	
	View.prototype._render = function() {};
	
	View.prototype._renderContent = function() {};
	










// ------------------------------------------------------------- //
// ---[[   L A Y O U T I N G   O V E R R I D D A B L E S   ]]--- //
// ------------------------------------------------------------- //
	
	/**
	 * Try to obtain a LayoutManager to be applied to the View
	 * (it does not perform initializations... they are done by "setLayoutManager()" API.
	 * 
	 * finding a LayoutManager depends on "options.layout" value.
	 * 
	 * STRING / OJECT
	 * you can setup a string value rapresenting the name of desired layout
	 * or an object filled with other layout options:
	 *
	 *     layout: "block"
	 *     
	 *     layout: {
	 *       name:  "block",
	 *       width: 200
	 *     }
	 *
	 * CUSTOM LAYOUT MANAGER
	 * 
	 */
	View.prototype._resolveLayoutManager = function() {
		
		if (this.options.layout == false) return;
		
		var LayoutManager = null;
		
		// defaults data type
		var _layout = this.options.layout || "default";
		if (_.isString(_layout)) _layout = {name:_layout};
		
		// get layout manager by name
		if (this.utils.isPlainObject(_layout)) {
			
			// specific object type layout
			if (this.LayoutManager.check(_layout.name + this.xtype)) {
				LayoutManager = new (this.LayoutManager.get(_layout.name + this.xtype))(_layout);
			
			// fallback to an ancestor type layout
			} else if (this.layoutType && this.LayoutManager.check(this.layoutType + _layout.name)) {
				LayoutManager = new (this.LayoutManager.get(this.layoutType + _layout.name))(_layout);
			
			// fallback to a general behavior layout
			} else {
				LayoutManager = new (this.LayoutManager.get(_layout.name))(_layout);
			}
		
		// custom LayoutManager instance
		} else if (_layout instanceof LayoutInterface) {
			LayoutManager = _layout;
			this.options.layout = "custom";
			
		// custom LayoutManager constructor
		} else if (_.isFunction(_layout)) {
			LayoutManager = new _layout;
			this.options.layout = "custom";
		}
		
		// fallback to default layout manager
		if (!LayoutManager) {
			LayoutManager = new (this.LayoutManager.get("default"));
			this.options.layout = "default";
		}
		
		return LayoutManager;
	};
	
	View.prototype._autoLayout = function() {
		// check for a LayoutManager to exists!
		if (!this.layout) {
			return;
		}
		
		// do layout
		if (this.options.autoLayout == true) {
			this.doLayout();
		
		// wait for a custom DeferredObject to be resolved
		} else if (this.utils.isDeferred(this.options.autoLayout)) {
			this.options.autoLayout.done(_.bind(this.doLayout, this));
		}
	};
		
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	View.prototype._remove = function() {
		this.$el.remove();
	};
	
	
	View.prototype._append = function(options) {
		options = $.extend({}, {
			before:		null,
			after:		null,
			target: 	this.$container
		}, options||{});
		
		if (options.before && options.before.length) {
			options.before.before(this.$el);
			return true;
			
		} else if (options.after && options.after.length) {
			options.after.after(this.$el);
			return true;
			
		} else if (options.target && options.target.length) {
			this.$el.appendTo(options.target);
			return true;
			
		}
		
		return false;
	};




// --------------------------------------------- //
// ---[[   P R I V A T E   M E T H O D S   ]]--- //
// --------------------------------------------- //
	
	














	
	
	
	
	


	
	
	
	
	
	
	


// ------------------------- //
// ---[[   M I X I N   ]]--- //	
// ------------------------- //

	_.extend(
		View.prototype, 
		CallbackMixin.prototype, 
		DeferredMixin.prototype
	);
	
	
	
	
	
	
	
	return View;
	
});