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
				$.when(self._options.apply(self, args)).then(function() {
					
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
				
				$.when(self._render()).then(function() {
					
					$.when(self.apply("afterRender", arguments, {trigger:true})).then(function() {
					
							$.when(self._finalize()).then(function() {
								
								self.renderComplete.resolve();
								self.apply("renderComplete", arguments, {trigger:true});
								self.resolve('rendered');
									
							},self.renderComplete.reject);
					}, self.renderComplete.reject);
				}, self.renderComplete.reject);
			}, self.renderComplete.reject);
			
			// allow last given param to be a direct callback to be
			if (arguments.length && _.isFunction(arguments[arguments.length-1])) {
				$.when(self.renderComplete).then(_.bind(arguments[arguments.length-1], self));
			}
			
			// last argument "true" to return deferred
			if (arguments.length && arguments[arguments.length-1] === true) {
				return this.renderComplete.promise();
			} else {
				return this;
			}
		},
		
		
		/**
		 * chain several steps when append in the view into a container.
		 * it allow to apply effects and use DeferredObject to synchronize them.
		 */
		append: function(options) {
			var self = this;
			var args = arguments;
			
			// reset rendered DeferredObject to fit this rendering process
			this.appendComplete = $.Deferred();
			
			$.when(self.apply("beforeAppend", args, {trigger:true})).then(function() {
				$.when(self._append.apply(self, args)).then(function() {
					$.when(self.apply("afterAppend", args, {trigger:true})).then(
						self.appendComplete.resolve,
						self.appendComplete.reject
					);
				}, self.appendComplete.reject);
			}, self.appendComplete.reject);
			
			// allow last given param to be a direct callback to be
			if (arguments.length && _.isFunction(arguments[arguments.length-1])) {
				$.when(self.appendComplete).then(_.bind(arguments[arguments.length-1], self));
			}
			
			// last argument "true" to return deferred
			if (arguments.length && arguments[arguments.length-1] === true) {
				return this.appendComplete.promise();
			} else {
				return this;
			}
		},
		
		
		/**
		 * chain several steps when removing the view from it's container.
		 * it allow to apply effects and use DeferredObject to synchronize them.
		 */
		remove: function(options) {
			var self = this;
			var args = arguments;
			
			// reset rendered DeferredObject to fit this rendering process
			this.removeComplete = $.Deferred();
			
			$.when(self.apply("beforeRemove", args, {trigger:true})).then(function() {
				$.when(self._remove.apply(self, args)).then(function() {
					$.when(self.apply("afterRemove", args, {trigger:true})).then(
						self.removeComplete.resolve,
						self.removeComplete.reject
					);
				}, self.removeComplete.reject);
			}, self.removeComplete.reject);
			
			// allow last given param to be a direct callback to be
			if (arguments.length && _.isFunction(arguments[arguments.length-1])) {
				$.when(self.renderComplete).then(_.bind(arguments[arguments.length-1], self));
			}
			
			// last argument "true" to return deferred
			if (arguments.length && arguments[arguments.length-1] === true) {
				return this.removeComplete.promise();
			} else {
				return this;
			}
		},
		
		
		destroy: function(options) {
			var self = this;
			var args = arguments;
			
			// reset rendered DeferredObject to fit this rendering process
			this.destroyComplete = $.Deferred();
			
			$.when(self.apply("beforeRemove", args, {trigger:true})).then(function() {
				$.when(self._destroy.apply(self, args)).then(function() {
					$.when(self.apply("afterDestroy", args, {trigger:true})).then(
						self.destroyComplete.resolve,
						self.destroyComplete.reject
					);
				}, self.destroyComplete.reject);
			}, self.destroyComplete.reject);
			
			// allow last given param to be a direct callback to be
			if (arguments.length && _.isFunction(arguments[arguments.length-1])) {
				$.when(self.destroyComplete).then(_.bind(arguments[arguments.length-1], self));
			}
			
			// last argument "true" to return deferred
			if (arguments.length && arguments[arguments.length-1] === true) {
				return this.destroyComplete.promise();
			} else {
				return this;
			}
		}
		
		
	});
	
	
	







	
	
	
	
	
	
	
// ------------------------------------------------------- //	
// ---[[   O V E R R I D D A B L E   M E T H O D S   ]]--- //	
// ------------------------------------------------------- //
	
	/**
	 *
	 * Subclassing:
	 * if you are sure your subclass don't use complex defaults ligics you
	 * can override this method skipping Deferred object usage... this will
	 * increase performances!
	 *
	 * -- SUBCLASSING:
	 * Subclass.prototype._setup = function() {
	 *   var self = this;
	 *   var _dfd = $.Deferred();
	 *   
	 *   $.when(View.prototype._setup.apply(this)).then(function() {
	 *     ... subclass logic ....
	 *   });
	 *   
	 *   return _dfd.promise();
	 * };
	 *
	 *
	 * -- NO DEFERRED OBJECT VERSION:
	 * -- if you don't need asynchronous operations you should override
	 * -- as follow to increase performances.
	 * View.prototype._buildOptions = function(options) {
	 *   this.__applyDefaultValues(options);
	 *   return this;
	 * };
	 *
	 *
	 */
	View.prototype._options = function(options) {
		return this.__applyDefaultValues(options);
	};
	
	
	
	
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
		
		// setup default deferred checkpoints
		this.Deferred(
			
			// initialization process is complete
			// onSetup, onInit callbacks have solved
			'initialized', 
			
			// rendering process is complete
			// onBeforeRender, onAfterRender have solved
			'rendered',
			
			// data related deferreds
			'modelready',
			'collectionready',
			
			// manual or data-driven checkpoint
			// if a model or a collection are given to the view
			// then them can solve this checkpoint when data is ready
			'ready'
			
		);
		
		// please read about this property on "render()" documentation
		this.renderComplete = $.Deferred();
		this.appendComplete = $.Deferred();
		this.removeComplete = $.Deferred();
		
		// bind onXXXReady() callbacks to checkpoints resolutions
		// 
		var self = this;
		$.when(this.getDeferred("ready")).then(function() {				self.apply("ready", arguments, {trigger:true})				});
		$.when(this.getDeferred("modelready")).then(function() {		self.apply("modelReady", arguments, {trigger:true})			});
		$.when(this.getDeferred("collectionready")).then(function() {	self.apply("collectionReady", arguments, {trigger:true})	});
		
		// register checkpoints callbacks defined by the options set.
		this.__registerOptionsCheckpoints();
		
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
		this.$el.addClass('jqbrik');
		this.$body = this.$el;
		this.$body.append(this.options.html);
		this._append();
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
	View.prototype._render = function() {};
	View.prototype._finalize = function() {};
	
	
	/**
	 * Run class related "removing" logic.
	 * should return a DeferredObject
	 */
	View.prototype._remove = function() {
		this.$el.remove();
	};
	
	/**
	 * Free as much memory as possible of istance
	 */
	View.prototype._destroy = function() {
		this._remove();
		this.$el = null;
		this.$body = null;
	};
	
	/**
	 * Run class related "appending" logic.
	 * try to append $el to the $container property or a given
	 * options.$target property.
	 *
	 * return a DeferredObject who resolves is appending success
	 * or reject if no container exists.
	 */
	View.prototype._append = function(options) {
		var _dfd = $.Deferred();
		
		options = $.extend({}, {
			before:		null,
			after:		null,
			target: 	this.$container
		}, options||{});
		
		if (options.before) {
			options.before.before(this.$el);
			_dfd.resolve();
			
		} else if (options.after) {
			options.after.after(this.$el);
			_dfd.resolve();
			
		} else if (options.target) {
			this.$el.appendTo(options.target);
			_dfd.resolve();
			
		} else {
			_dfd.reject();
			
		}
		
		return _dfd.promise();
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
	 * It build instance obtions extending class's defaults with initialization options.
	 * It allow this.defaults to be a function who return an object or a deferred
	 *
	 * If this.defaults() returns a promise then it MUST be resolved! 
	 * Otherwise initialization process blocks!
	 */
	View.prototype.__applyDefaultValues = function(options) {
		var self = this;
		var _dfd = $.Deferred();
		
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
				_dfd.resolve();
			});
		
		// defaults values are a clean object!
		} else {
			this.options = $.extend({}, defaults||{}, options||{});
			_dfd.resolve();
		}
		
		return _dfd.promise();
	};
	
	View.prototype.__registerOptionsCheckpoints = function() {
		for (var k in this.options.checkpoints) {
			this.is(k, this.options.checkpoints[k]);
		}
	};














// ----------------------------------- //	
// ---[[   P U B L I C   A P I   ]]--- //	
// ----------------------------------- //
	
	View.prototype.setParent = function(parent) {
		this.parent = parent;
	}
	
	View.prototype.setContainer = function($container) {
		this.$container = $container;
	}
	
	View.prototype.appendTo = function($target) {
		if ($target instanceof Backbone.View) {
			this.$el.appendTo($target.el);
		} else {
			this.$el.appendTo($target);
		}
		return this;
	};
	
	View.prototype.renderTo = function($target) {
		var self = this;
		$.when(this.append({target:$target})).then(function() {
			self.render();
		});
		return this;
	};
	
	
	
	
	


	
	
	
	
	
	
	


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