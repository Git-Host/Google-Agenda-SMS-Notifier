/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 *
 *
 * 
 *
 * DEFERRED OBJECTS MIXIN
 * ---------------------------
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
	
	
	var Mixin = function() {};
	
	
	
	
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
	Mixin.prototype.__deferred = function(name, make) {
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
	Mixin.prototype.Deferred = function() {
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
	Mixin.prototype.getDeferred = function(name, method) {
		if (method == undefined || method !== false) method = true;
		return this.__deferred(name, method);
	};
	// shortcut
	Mixin.prototype._d = Mixin.prototype.getDeferred;
	
	Mixin.prototype.resolve = function() {
		var args = []; Array.prototype.push.apply(args, arguments);
		var name = args.shift();
		this.__deferred(name, true).resolveWith(this, args);
		return this;
	};
	
	Mixin.prototype.reject = function() {
		var args = []; Array.prototype.push.apply(args, arguments);
		var name = args.shift();
		this.__deferred(name, true).rejectWith(this, args);
		return this;
	};
	
	Mixin.prototype.when = function(name) {
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
	Mixin.prototype.is = function(name, callback) {
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
	Mixin.prototype.not = function(name, callback) {
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
	Mixin.prototype.after = function(name, callback) {
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
	Mixin.prototype.pending = function(name, callback) {
		var args = []; Array.prototype.push.apply(args, arguments);
		args.shift();
		args.shift();
		
		var self = this;
		if (this.getDeferred(name).state() == 'pending') {
			self.apply(callback, args);
		}
		return this;
	};
	
	
	
	
	return Mixin;
	
});