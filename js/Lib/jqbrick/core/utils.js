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
	
	
	
	
	
	
	
	
	
	return Utils;
		
});
