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
 * -> try to run "instance.options.onMethodName" - instance context
 * -> try to run "instance.onMethodName" - instance context
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
	
	
	var Mixin = function() {};


// ----------------------------------------------------- //
// ---[[   C A L L B A C K S   U T I L I T I E S   ]]--- //
// ----------------------------------------------------- //
	
	
	/**
	 * Callback Utility
	 * - throw callback from [given anonymous function | instance configuration options | object callback method]
	 * - trigger a custom event on view's instance class
	 * - trigger a custom event on view's DOM node
	 *
	 * callback's names are prefixed by "on" so if you code:
	 *     ViewInstance.apply('render')
	 *     -> instance.options.onRender()
	 *     -> instance.onRender()
	 *     -> "render" event thrown on instance
	 *     -> "render" event thrown on instance.$el
	 *
	 *     ViewInstance.apply('custoEvent')
	 *     -> instance.options.onCustomEvent()
	 *     -> instance.onCustomEvent()
	 *     -> "customevent" event thrown on instance
	 *     -> "customevent" event thrown on instance.$el
	 *
	 * callbacks should return a DeferredObject who is sent
	 * back to the point where callback request began!
	 *
	 * !!! anonymous functions skip triggering of events because the name is... anonymous!
	 *
	 * ViewInstance.apply(function(a, b, c) {}, ['a', 'b', 'c']);
	 * ViewInstance.apply('afterCustomEvent');
	 * ViewInstance.apply('render', null, anotherContext);
	 */
	Mixin.prototype.apply = function(name, args, ctx) {
		ctx = ctx || this;
		
		var _cbName = "on" + this.utils.ucFirst(name);
		
		// first argument is a function
		if (_.isFunction(name)) {
			return name.apply(ctx, args);
		
		// options defined callback	
		} else if (this.options[_cbName] && _.isFunction(this.options[_cbName])) {
			var promise = this.options[_cbName].apply(ctx, args);
		
		// object defined callback
		} else if (this[_cbName] && _.isFunction(this[_cbName])) {
			var promise = this[_cbName].apply(ctx, args);
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
		if (this.$el) this.$el.trigger($.Event(evtName, evtInfo));
		
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
	Mixin.prototype.call = function() {
		var args = []; Array.prototype.push.apply(args, arguments);
		return this.apply(args.shift(), args);
	};
	
	
	
	
	return Mixin;
	
});