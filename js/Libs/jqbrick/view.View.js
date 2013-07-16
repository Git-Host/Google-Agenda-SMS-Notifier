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
	"./mixin.Deferred"
	
], function(
	$, _, Backbone,
	CallbackMixin,
	DeferredMixin
	
) {

	var View = Backbone.View.extend({
		
		/**
		 * Subclasses can add more defaults this way:
		 *
		 * defaults: function() {
		 *     return $.extend({}, View.prototype.defaults.apply(this,arguments), {
		 *         newDefault: "value",
		 *         style: "background:red" // override existing param
		 *     });
		 * }
		 *
		 * Complex Defaults Logic:
		 * if you need to implement some complex logic or some asyncronous calls and
		 * you want to block initialization process you can use DeferredObject as follow:
		 *
		 * defaults: function() {
		 *     var _dfd = $.Deferred();
		 *     var defaults = {};
		 *     
		 *     $.when($.ajax()).then(function(r) {
		 *       defaults.r = r;
		 *       _dfd.resolve([defaults]);
		 *     });
		 *  
		 *     return _dfd.promise();   
		 * }
		 *
		 */
		defaults: function() {
			return {
				
				xtype: "view",
				
				// link to the parent Backbone.View class
				parent:		null,
				
				// link to the DOM container
				// (if empty but "parent" was set it will use parent's $body or $el)
				container: null,
				
				/**
				 * Attach callbacks to DFD resolution events:
				 * when: {
				 *    "ready" : "customOnReady",
				 *    "foo" : "fooCallback"
				 * }
				 */
				checkpoints: {},
				
				// View layer ($el) attributes
				html:		'',		// initialize view with some HTML contents inside
				attrs:		{},		// a list of attributes to apply to $el
				style:		'',
				css:		{},
				
				// see "_autoRender()" comments for options
				autoRender: false
			}
		},
		
		
		/**
		 * chain several initialization steps and callbacks with DeferredObject technique
		 * so is is possible to handle heavy asyncronous actions maintaining desired order!
		 *
		 * NOTE: by default no DeferredObject are used so performance are quite good!
		 */
		initialize: function(options) {
			var self = this;
			var args = arguments;
			
			// timeout allow to add events listeners from otside og given instance
			// whithout this timeout you are not able to listen to events without
			// also defining related callbacks!
			setTimeout(function() {
				$.when(self._buildOptions.apply(self, args)).then(function() {
					
					$.when(self._setup()).then(function() {
						
						$.when(self.apply("setup", arguments, {trigger:true})).then(function() {
							
							$.when(self._initialize()).then(function() {
							
								$.when(self._initializeEl()).then(function() {
								
									$.when(self.apply("init", arguments, {trigger:true})).then(function() {
										
										self.resolve('initialized');
										
										self._autoRender();
										
									});
								});
							});
						});
					});
				});
			});
			
			return this;
			
		},
		
		/**
		 * chain several rendering steps and callbacks with DeferredObject technique
		 * so is is possible to handle heavy asyncronous actions maintaining desired order!
		 *
		 * NOTE: by default no DeferredObject are used so performance are quite good!
		 *
		 * "renderComplete" DeferredObject:
		 * -------------------------------------
		 * every step of rendering process should return a DeferredObject to syncronize
		 * steps into the right order.
		 * 
		 * It may be very important to know when a rendering process end and if it fail.
		 * You can use the "rendering" property who is a DFD renewed at each render() call:
		 *
		 *     $.when(ViewInstance.render().renderComplete).then(...);
		 *
		 *
		 */
		render: function(options) {
			var self = this;
			
			// reset rendered DeferredObject to fit this rendering process
			this.renderComplete = $.Deferred();
			
			$.when(self.apply("beforeRender", arguments, {trigger:true})).then(function() {
				
				$.when(self._render()).always(function() {
					
					$.when(self.apply("afterRender", arguments, {trigger:true})).then(function() {
						
						self.resolve('rendered');
						
						$.when(self.apply("renderComplete", arguments, {trigger:true})).then(
							self.renderComplete.resolve,
							self.renderComplete.reject
						);
						
					}, self.renderComplete.reject);
				}, self.renderComplete.reject);
			}, self.renderComplete.reject);
			
			return this;
		},
		
		
		remove: function() {
			
			var self = this;
			
			// reset rendered DeferredObject to fit this rendering process
			this.removeComplete = $.Deferred();
			
			$.when(self.apply("beforeRemove", arguments, {trigger:true})).then(function() {
				
				$.when(self._remove()).always(function() {
					
					$.when(self.apply("afterRemove", arguments, {trigger:true})).then(
						self.removeComplete.resolve,
						self.removeComplete.reject
					);
				}, self.removeComplete.reject);
			}, self.removeComplete.reject);
			
			return this;
		}
		
	});
	
	
	







	
	
	
	
	
	
	
// ------------------------------------------------------- //	
// ---[[   O V E R R I D D A B L E   M E T H O D S   ]]--- //	
// ------------------------------------------------------- //
	
	/**
	 * It build instance obtions extending class's defaults with initialization options.
	 * It allow this.defaults to be a function who return an object or a deferred
	 *
	 * If this.defaults() returns a deferred then this deferred MUST to 
	 * be resolved! Otherwise initialization process will block!
	 *
	 * Subclassing:
	 * if you are sure your subclass don't use complex defaults ligics you
	 * can override this method skipping Deferred object usage... this will
	 * increase performances!
	 */
	View.prototype._buildOptions = function(options) {
		var self = this;
		var _dfd = $.Deferred();
		
		// fetch default options coming from structure or method output
		var defaults = this.defaults;
		if (_.isFunction(this.defaults)) defaults = this.defaults();
		
		// default method return a DeferredObject
		// it's solution will contain defaults for the class
		if (this.utils.isDeferred(defaults)) {
			defaults.done(function(defaults) {
				self.options = $.extend({}, defaults||{}, options||{});
				_dfd.resolveWith(self);
			});
		
		// defaults values are a clean object!
		} else {
			this.options = $.extend({}, defaults||{}, options||{});
			_dfd.resolveWith(this);
		}
		
		// bind callbacks to Deferred checkpoints
		// checkpoints need to be configured as soon as possibile
		// to be called before external cheking (is(), when())
		_dfd.done(function() {
			for (var k in self.options.checkpoints) {
				self.is(k, self.options.checkpoints[k]);
			}
		});
		
		return _dfd.promise();
	};
	
	/*
	// no DeferredObject version
	// just a memo to speed up performances!
	View.prototype._buildOptions = function(options) {
		
		// fetch default options coming from structure or method output
		var defaults = this.defaults;
		if (_.isFunction(this.defaults)) defaults = this.defaults();
		
		// mix defaults with given options
		this.options = $.extend({}, defaults||{}, options||{});
		return this;
	};
	*/
	
	
	
	
	/**
	 * Setup initial values for internal properties.
	 *
	 * This piece of logic run before the "setup" callback 
	 * and before triggering "setup" events.
	 *
	 * -- SUBCLASSING:
	 * Subclass.prototype._setup = function() {
	 *   View.prototype._setup.apply(this);
	 * };
	 *
	 */
	View.prototype._setup = function() {
		
		// setup default deferred holding points
		this.Deferred(
			
			// initialization process is complete
			// onSetup, onInit callbacks have solved
			'initialized', 
			
			// rendering process is complete
			// onBeforeRender, onAfterRender have solved
			'rendered',
			
			'modelready',
			
			'collectionready',
			
			// manual or data-driven checkpoint
			// if a model or a collection are given to the view
			// then them can solve this checkpoint when data is ready
			'ready'
			
		);
		
		// please read about this property on "render()" documentation
		this.renderComplete = $.Deferred();
		
		// bind xxReady() callbacks to checkpoints resolutions
		var self = this;
		$.when(this.getDeferred("ready")).then(function() {				self.apply("ready")				});
		$.when(this.getDeferred("modelready")).then(function() {		self.apply("modelReady")		});
		$.when(this.getDeferred("collectionready")).then(function() {	self.apply("collectionReady")	});
		
	};
	
	
	/**
	 * Run class related initialization logic.
	 * 
	 * This piece of code run between "setup" and "initialized" public hooks.
	 *
	 * -- SUBCLASSING:
	 * Subclass.prototype._initialize = function() {
	 *   View.prototype._initialize.apply(this);
	 * };
	 *
	 */
	View.prototype._initialize = function() {
		var self = this;
		
		// setup parent and $container objects
		this.parent 	= this.options.parent;
		this.$container = this.options.container;
		
		if (_.isString(this.$container) && this.$container.length) {
			this.$container = $(this.$container);
		}
		
		if (!this.$container && this.parent) {
			if (this.parent.$body) {
				this.$container = this.parent.$body;
			} else if (this.parent.$el) {
				this.$container = this.parent.$el;
			}
		}
		
		// default component id from view's CID
		if (!this.options.id) {
			this.options.id = this.cid;
			this.options.attrs['id'] = this.options.id;
		}
		
		// setup wrapper attributes
		this.utils.applyAttributes(this.$el, this.options.attrs);
		if (this.options.style) 		this.$el.attr('style', this.options.style);
		if (this.options.css) 			this.$el.css(this.options.css);
	};
	
	
	
	/**
	 * Specific DOM initialization extension point.
	 * subclasses should add more complex logic (think to component logic or layouting)
	 * and return a DeferredObject promise object to syncronize 
	 * initialization process
	 */
	View.prototype._initializeEl = function() {
		// !! subclasses may add some DOM layers between $el and $body!
		// !! $el is appended to $container
		// !! $body is the container for sub-modules views!
		this.$body = this.$el;
		this.$body.append(this.options.html);
		this.__appendToContainer();
	};
	
	
	/**
	 * Run class related "rendering" logic.
	 * it run between "beforeRender" and "afterRender" callbacks
	 *
	 * -- SUBCLASSING:
	 * Subclass.prototype._render = function() {
	 *   var _dfd = new $.Deferred();
	 *   View.prototype._render.apply(this);
	 *   return _dfd.promise();
	 * };
	 *
	 * Return a Promise:
	 * subclasses implementations should return a PromiseObject
	 * to defer "afterRender" callback execution util promise solution!
	 * 
	 */
	View.prototype._render = function() {
		this.__appendToContainer();
	};
	
	
	/**
	 * Run class related "removing" logic.
	 * should return a DeferredObject
	 */
	View.prototype._remove = function() {
		this.$el.remove();
	};
	
	
	/**
	 * Implement AutoRender logic after View's initialization.
	 */
	View.prototype._autoRender = function() {
		if (this.options.autoRender == true) {
			this.render();
		
		// wait for internal "ready" deferred to be resolved
		} else if (this.options.autoRender === 'ready') {
			this.is('ready', this.render);
		
		// wait for parent object to resolve "rendered" DeferredObject until render itself
		} else if (this.options.autoRender === 'cascade') {
			if (this.parent && _.isFunction(this.parent.is)) {
				this.parent.is('rendered', _.bind(this.render, this));	
			}
			
		// wait for model's "ready" deferred to be resolved
		} else if (this.options.autoRender === 'modelready') {
			console.log("modelready - to be implemented");
			
		// wait for collection's "ready" deferred to be resolved
		} else if (this.options.autoRender === 'collectionready') {
			console.log("collectionready - to be implemented");
		
		// wait for a custom DeferredObject to be resolved
		} else if (this.utils.isDeferred(this.options.autoRender)) {
			this.options.autoRender.done(_.bind(this.render, this));
		}
	};









// --------------------------------------------- //
// ---[[   P R I V A T E   M E T H O D S   ]]--- //
// --------------------------------------------- //
	
	
	/**
	 * Append instance $el to container's DOM node.
	 * you can skip from outside using
	 * __preventAppendToContainer() API
	 */
	View.prototype.__appendToContainer = function() {
		if (this.__preventAppendToContainer__) {
			this.__preventAppendToContainer__ = null;
			return;
		}
		if (!this.$el.parent().length && this.$container) {
			this.appendTo(this.$container);
		}
	};
	
	/**
	 * Skip the next call to __appendToContainer()
	 * -- very useful in extensions initialization methods
	 * -- where many operations may need to be done before
	 * -- append item to relative container
	 */
	View.prototype.__preventAppendToContainer = function() {
		this.__preventAppendToContainer__ = true;
	}
	














// ----------------------------------- //	
// ---[[   P U B L I C   A P I   ]]--- //	
// ----------------------------------- //
	
	
	View.prototype.appendTo = function($target) {
		if ($target instanceof Backbone.View) {
			this.$el.appendTo($target.el);
		} else {
			this.$el.appendTo($target);
		}
		return this;
	};
	
	View.prototype.renderTo = function($target) {
		this.render();
		this.appendTo($target);
		return this;
	};
	
	View.prototype.setParent = function(parent) {
		this.parent = parent;
	}
	
	View.prototype.setContainer = function($container) {
		this.$container = $container;
		this.__appendToContainer();
	}
	
	
	
	
	


	
	
	
	
	
	
	


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