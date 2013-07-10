/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 * Extends BackboneJS's View component adding some useful methods and
 * prototyping an inheritance for subclassing View object itself. 
 * 
 * $el vs $cnt
 * -----------------
 * BackboneJS's Views has a $el poiter to the main wrapped DOM element
 * who contain all view's structure.
 *
 * jQbrick's View is a "UI component" and a component can contain other
 * components; each component should have some structural differences 
 * between wrapper element and content element those pointers have
 * two dedicated names.
 *
 * NOTE: this class does not implement any Component logic!
 *       component logic is delegated to Component subclass!
 *
 *
 *
 *
 * CALLBACKS:
 * ---------------------
 * Throwing callbacks is a very often implemented architecture so View class
 * implement two methods, "call" and "apply" to let things works fine.
 *
 * ViewInstance.call(function(a, b, c) {}, "a", "b", "c");
 * -> try to run given callback with instance context
 * . following arguments are given to the view and to generated custom events
 * . callback should return a custom DeferredObject who is sent back to 
 *
 * ViewInstance.call("methodName", "a", "b", "c");
 * -> try to run "instance.options.method" - instance context
 * -> try to run "instance.method" - instance context
 * -> trigger "methodname" event on instance itself
 * -> trigger "methodname" event on instance.$el element
 * (following arguments are given to the view and to generated custom events)
 *
 * ViewInstance.apply("methodName", [args], context);
 * -> works much like "call" but allow to setup a custom execution context as
 *    third optional argument
 *
 * 
 *
 *
 * 
 *
 * DEFERRED OBJECTS
 * ---------------------
 * View object implements jQuery's DeferredObject technique providing
 * some internal methods to setup, solve and check DFD easily and to
 * handle callbacks binded to resolution events.
 * 
 * You can enjoy the "when" configuration options who let you configure
 * DFD callbacks just like Backbone's "events" configuration.
 *
 * Subclasses can extend "_setup" method to define new Deferred Holding Points
 * using the Deferred() method:
 *
 *     // Just a piece of the Subclass:
 *     _setup: function() {
 *         Page.prototype._setup.apply(this, arguments);
 *         this.Deferred("foo1", "foo2", ...);
 *     },
 *     customMethod: function() {
 *         if (... custom logic ...) {
 *             this.resolve("foo1");
 *         } else {
 *             this.reject("foo1");
 *         }
 *     }
 *     
 *     // Just a way to use it:
 *     SubclassInstance.when("foo1").then(
 *         function() { ... },	// "done" tree
 *         function() { ... }	// "fail" tree
 *     );
 *
 * -- ABOUT DEFERRED RESOLUTION (and arguments):
 * Internal "resolve()" and "reject()",  take only the name of the
 * DFD to act on, they don't understand arguments.
 * (you can pass other arguments but they are not considerd by checking methods!)
 *
 * This is because they are intended to work much like an on/off control so you can
 * alter it's status (resolve/reject) but nothing more.
 *
 * -- CHECKING DEFERRED:
 * You can use "is()", "not()", "after()" who watch a named deferred and throw a callback:
 * 
 *     ViewInstance.is("ready", function() {...});
 *     ViewInstance.not("rendered", function() {...});
 *
 * Callback function is supplied with instance context.
 * You can pass explicit params to the callback:
 *
 *     ViewInstance.is("ready", function(arg1, arg2) {}, "arg1", "arg2");
 * 
 * 
 * -- CHECKING MULTIPLE DEFERRED:
 * There is no implemented utilities to check multiple deferreds but you can use
 * getDeferred('name') to obtain direct access to a deferred object.
 * 
 *     $.when(ViewInstance.getDeferred('ready'), ViewInstance.getDeferred('rendered')).then(
 *         function() {}
 *     );
 *
 * Read "getDeferred()" documentation to learn more about this feature!
 * 
 */

define([
	"jquery", "underscore", "backbone"
	
], function(
	$, _, Backbone
	
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
				
				// link to the parent Backbone.View class
				parent:		null,
				
				// link to the DOM container
				// (if empty but "parent" was set it will use parent's $cnt or $el)
				$container: null,
				
				/**
				 * Attach callbacks to DFD resolution events:
				 * when: {
				 *    "ready" : "customOnReady",
				 *    "foo" : "fooCallback"
				 * }
				 */
				when: {},
				
				html:		'',
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
			
			$.when(self._buildOptions.apply(self, arguments)).always(function() {
				
				$.when(self._setup()).always(function() {
					
					$.when(self.apply("setup", arguments)).always(function() {
						
						$.when(self._initialize()).always(function() {
							
							$.when(self.apply("initialized", arguments)).always(function() {
								
								self.resolve('initialized');
								
								self._autoRender();
								
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
		 */
		render: function() {
			
			var self = this;
			$.when(self.apply("beforeRender", arguments)).always(function() {
				
				$.when(self._render()).always(function() {
					
					$.when(self.apply("afterRender", arguments)).always(function() {
					
						self.resolve('rendered');
					});
				});
			});	
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
		this.Deferred('ready', 'initialized', 'rendered');
		
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
		
		// setup parent and $container objects
		this.parent 	= this.options.parent;
		this.$container = this.options.$container;
		
		if (!this.$container && this.parent) {
			if (this.parent.$cnt) {
				this.$container = this.parent.$cnt;
			} else if (this.parent.$el) {
				this.$container = this.parent.$el;
			}
		}
		
		// !! subclasses may add some DOM layers between $el and $cnt!
		// !! $el is appended to $container
		// !! $cnt is the container for sub-modules views!
		this.$cnt = this.$el;
		
		// bind callbacks to Deferred holding points
		for (var k in this.options.when) {
			this.is(k, this.options.when[k]);
		}
		
	};
	
	
	/**
	 * Run class related rendering logic.
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
		
		if (this.options.style) {
			this.$cnt.attr('style', this.options.style);
		}
		
		if (this.options.css) {
			this.$cnt.css(this.options.css);
		}
		
		if (this.options.html.length) {
			this.$cnt.append(this.options.html);
		}
		
		if (!this.$el.parent().length && this.$container) {
			this.appendTo(this.$container);
		}
		
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
		
		// wait for parent object so solve "rendered" Deferred to be solved
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
	
	
	
	
	
	



// --------------------------------------------- //
// ---[[   P R I V A T E   M E T H O D S   ]]--- //
// --------------------------------------------- //
	
	
	
	
	
	
	













// ----------------------------------------------------- //
// ---[[   C A L L B A C K S   U T I L I T I E S   ]]--- //
// ----------------------------------------------------- //
	
	
	/**
	 * Callback Utility
	 * - throw callback from [given anonymous function | instance configuration options | object callback method]
	 * - trigger a custom event on view's instance class
	 * - trigger a custom event on view's DOM node
	 *
	 * callbacks should return a DeferredObject who is sent
	 * back to the point where callback request began!
	 *
	 * anonymous functions skipt triggering of events because the name is... anonymous!
	 *
	 * ViewInstance.apply(function(a, b, c) {}, ['a', 'b', 'c']);
	 * ViewInstance.apply('afterCustomEvent');
	 * ViewInstance.apply('render', null, anotherContext);
	 */
	View.prototype.apply = function(name, args, ctx) {
		ctx = ctx || this;
		
		// first argument is a function
		if (_.isFunction(name)) {
			return name.apply(ctx, args);
		
		// options defined callback	
		} else if (this.options[name] && _.isFunction(this.options[name])) {
			var promise = this.options[name].apply(ctx, args);
		
		// object defined callback
		} else if (this[name] && _.isFunction(this[name])) {
			var promise = this[name].apply(ctx, args);
		}
		
		// trigger callback event on both View instance and DOM node
		var evtName = name.toLowerCase();
		var evtInfo = {
			type:			evtName,
			originalName:	name,
			details: 		args,
			context: 		ctx
		};
		this.trigger(evtName, $.extend({},evtInfo,{}));
		this.$el.trigger($.Event(evtName, evtInfo));	
		
		return promise;
	};
	
	/**
	 * Apply a callback by name passing a list of params instead of an array as in "apply".
	 * you can't change execution context with this method!
	 *
	 * ViewInstance.call(function(a, b, c) {}, 'a', 'b', 'c');
	 * ViewInstance.apply('afterCustomEvent', 'result');
	 * ViewInstance.apply('render');
	 */
	View.prototype.call = function() {
		var args = []; Array.prototype.push.apply(args, arguments);
		return this.apply(args.shift(), args);
	};
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
// --------------------------------------- //
// ---[[   D E F E R R E D   A P I   ]]--- //	
// --------------------------------------- //
	
	/**
	 * return a DeferredObject by it's name storing into a
	 * private array of objects.
	 *
	 * "make" param should be set to "true" to create a new
	 * DeferredObject when first accessing a "name" position.
	 * 
	 */
	View.prototype.__deferred = function(name, make) {
		if (!this.__deferreds) {
			this.__deferreds = [];
		}
		if (!this.__deferreds[name]) {
			if (make) {
				this.__deferreds[name] = $.Deferred();
			} else {
				return null;
			}
		}
		return this.__deferreds[name];
	};
	
	
	/**
	 * Setup one or more internal deferred by name
	 *
	 * ViewInstance.Deferred('name');
	 * ViewInstance.Deferred('dfd1', 'dfd2', 'dfd3', ...);
	 */
	View.prototype.Deferred = function() {
		for (var name in arguments) {
			this.__deferred(name, true);	
		}
		return this;
	};
	
	/**
	 * Retrieve a deferred object by name.
	 * If it does not exists a new DFD is created.
	 *
	 * -- You can pass a "false" param to skip implicit
	 * creation!
	 *
	 *     ViewInstance.getDeferred('nonExisting')       -> [DeferredObject]
	 *     ViewInstance.getDeferred('nonExisting',false) -> null
	 *
	 */
	View.prototype.getDeferred = function(name, method) {
		if (method == undefined || method !== false) method = true;
		return this.__deferred(name, method);
	};
	// shortcut
	View.prototype._d = View.prototype.getDeferred;
	
	View.prototype.resolve = function() {
		var args = []; Array.prototype.push.apply(args, arguments);
		var name = args.shift();
		this.__deferred(name, true).resolveWith(this, args);
		return this;
	};
	
	View.prototype.reject = function() {
		var args = []; Array.prototype.push.apply(args, arguments);
		var name = args.shift();
		this.__deferred(name, true).rejectWith(this, args);
		return this;
	};
	
	View.prototype.when = function(name) {
		return $.when(this.__deferred(name));
	};
	
	/**
	 * throw a callback when required Deferred is done.
	 *
	 * you can pass arguments to that callback:
	 * ViewInstance.is('ready', function(a, b) {}, 'a', 'b');
	 *
	 * you can call an internal method or an option method:
	 * ViewInstance.is('ready', 'onReady');
	 *
	 */
	View.prototype.is = function(name, callback) {
		var args = []; Array.prototype.push.apply(args, arguments);
		args.shift();
		args.shift();
		
		var self = this;
		this.getDeferred(name).done(function() {
			self.apply(callback, args);
		});
		return this;
	};
	
	/**
	 * throw a callback when required Deferred is failed
	 */
	View.prototype.not = function(name, callback) {
		var args = []; Array.prototype.push.apply(args, arguments);
		args.shift();
		args.shift();
		
		var self = this;
		this.getDeferred(name).fail(function() {
			self.apply(callback, args);
		});
		return this;
	};
	
	/**
	 * throw a callback when required Deferred is solved, it doesn't matter how
	 */
	View.prototype.after = function(name, callback) {
		var args = []; Array.prototype.push.apply(args, arguments);
		args.shift();
		args.shift();
		
		var self = this;
		this.getDeferred(name).always(function() {
			self.apply(callback, args);
		});
		return this;
	};
	
	/**
	 * throw a callback id required Deferred is already pending
	 */
	View.prototype.pending = function(name, callback) {
		var args = []; Array.prototype.push.apply(args, arguments);
		args.shift();
		args.shift();
		
		var self = this;
		if (this.getDeferred(name).state() == 'pending') {
			self.apply(callback, args);
		}
		return this;
	};
	
	
	
	
	
	
	
	



// ----------------------------------------------------------- //
// ---[[   C A L L B A C K S   P L A C E H O L D E R S   ]]--- //	
// ----------------------------------------------------------- //
	
	View.prototype.setup = function() {};
	
	View.prototype.initialized = function() {};
	
	View.prototype.beforeRender = function() {};
	
	View.prototype.afterRender = function() {};
	
	
	
	
	
	return View;
	
});