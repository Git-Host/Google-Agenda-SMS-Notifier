/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 *
 *
 * CALLBACK MIXIN:
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
	 *
	 * !!! anonymous functions skip triggering of events because the name is... anonymous!
	 *
	 *     ViewInstance.apply(function(a, b, c) {}, ['a', 'b', 'c']);
	 *     ViewInstance.apply('afterCustomEvent');
	 *     ViewInstance.apply('render', null, anotherContext);
	 *
	 *
	 * BLOCKING CALLBACKS:
	 * binded callbacks should return a DeferredObject.
	 * "apply" wait for this object to resolve before try to trigger events
	 *
	 * BLOCKING EVENTS:
	 * binded events should use "block()" and "unblock()" APIs to stop
	 * code execution and inject some strategic logic!
	 *
	 *     ViewInstance.on("customEvent", function(e) {
	 *         e.block();
	 *         setTimeout(e.unblock, 1000);
	 *     });
	 *
	 *
	 * IMPORTANT NOTE ABOUT BLOCKING CALLBACKS
	 * to be blocking callbacks working well the caller must listen to DeferredObject
	 * resolution to move on on the code!
	 *
	 *     // blocking callback works well:
	 *     $.when(this.apply("customCallback")).then(function() { alert("OK"); });
	 *     
	 *     // unuseful blocking callback 
	 *     this.apply("customCallback");
	 *     alert("OK");
	 * 
	 *
	 */
	Mixin.prototype.apply = function(name, args, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		var options = $.extend({}, {
			context: 		this,
			trigger:		null	// set to "true" to force triggering related events!
		}, options||{});
		
		
		// "callbackName" -> "onCallbackName"
		// !callbackName" -> "callbackName"
		if (name.length && name.substring(0, 1) == '!') {
			name = name.substring(1);
			var _cbName = name;
		} else {
			var _cbName = "on" + this.utils.ucFirst(name);
		}
		
		
		// first argument is a function
		// complete skip of event triggering!
		if (_.isFunction(name)) {
			return name.apply(options.context, args);
		
		// options defined callback	
		} else if (this.options[_cbName] && _.isFunction(this.options[_cbName])) {
			var callbackDfd = this.options[_cbName].apply(options.context, args);
		
		// object defined callback
		} else if (this[_cbName] && _.isFunction(this[_cbName])) {
			var callbackDfd = this[_cbName].apply(options.context, args);
			
		} else {
			var callbackDfd = true;
			// disable triggering of events if no callback exists
			// !! skip if events are strict required!
			if (_.isNull(options.trigger)) {
				options.trigger = false;
			}
		}
		
		
		
		// trigger callback event on both View instance and DOM node
		var eventDfd	= null;
		var evtName 	= name.toLowerCase();
		var evtInfo 	= {
			type:			evtName,
			originalName:	name,
			details: 		args,
			context: 		options.context,
			
			block: function() 	{if (!eventDfd) {eventDfd = $.Deferred()}},
			unblock: function() {if (eventDfd) 	{eventDfd.resolve()}},
		};
		
		
		// event trigger after callback resolves:
		// callback must exists for event to be triggered!
		// event's callbacks can block code execution using these methods
		// - block()
		// - unblock()
		if (options.trigger !== false) {
			$.when(callbackDfd).then(function() {
				self.trigger(evtName, $.extend({},evtInfo,{}));
				if (self.$el) self.$el.trigger($.Event(evtName, evtInfo));
				
				$.when(eventDfd).then(_dfd.resolve);
				
			});
		
		// no events, resolve only with binded callback
		} else {
			$.when(callbackDfd).then(_dfd.resolve);
		}
		
		return _dfd.promise();
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