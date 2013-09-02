/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Utily Library
 * a useful namespace full of tricky functions
 *
 */



define([
	"jquery", "underscore"

], function(
	$, _

) {
	
	var Utils = {};
	
	
	
	
	
	
	
	
	/**
	 * return a DeferredPromise who will be fulfill after a given delay.
	 * - timeout
	 * - mode (boolean) resolve/reject
	 * - args (array) a list of arguments to be sent to the callback
	 */
	Utils.delayedPromise = function(timeout, mode, args) {
		var dfd = $.Deferred();
		
		if (timeout == undefined) timeout = 0;
		if (mode == undefined) mode = true;
		if (args == undefined) args = [];
		
		if (!_.isArray(args)) args = [args];
		
		setTimeout(function() {
			if (mode) {
				dfd.resolve.apply(this, args);
			} else {
				dfd.reject.apply(this, args);
			}
		}, timeout);
		
		return dfd.promise();
	};
	
	
	
	/**
	 * return a randomization of given input:
	 *
	 * - [10]    return a number between 0 and 10
	 * - [5,10]  return a number between 5 and 10
	 * - [array] return a random array item
	 * - [array, true] return a random array index
	 * - [object] return a random object's value
	 * - [object, true] return a random object's key
	 */
	Utils.random = function() {

		// array as input, will return a random value
		if (_.isArray(arguments[0])) {
			var from 	= 0;
			var to		= arguments[0].length-1;
			if (arguments.length === 1) {
				var _array	= arguments[0];
			}
		
		// object as input, will return a random key
		} else if (_.isObject(arguments[0])) {
			if (arguments.length > 1 && arguments[1] === true) {
				var _array	= _.keys(arguments[0]);
			} else {
				var _array	= _.values(arguments[0]);
			}
			var from 	= 0;
			var to		= _array.length-1;

		// higer limit only, start from [0]
		} else if (arguments.length == 1) {
			var from 	= 0;
			var to 		= arguments[0];

		// lower and higer limits was given
		} else if (arguments.length == 2) {
			var from 	= arguments[0];
			var to 		= arguments[1];
		} else {
			return;
		}

		//console.log("random ["+from+" - "+ to +"]");

		if (_array) {
			return _array[Math.floor(Math.random() * (to - from + 1) + from)];
		} else {
			return Math.floor(Math.random() * (to - from + 1) + from);
		}
	};
	
	
	
	
	
	
	
	return Utils;
		
});
