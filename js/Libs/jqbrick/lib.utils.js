/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Utility Library
 * it is attached to all jQbrick namespaces and objects constructorr under "utils" attribute!
 *
 */

define(['jquery', 'underscore'], function($, _) {
	
	var LibUtils = function(jQbrick) {
		this.jQbrick = jQbrick;
	};
	
	
	
	
	/**
	 * Check if given input is a $.Deferred object
	 */
	LibUtils.prototype.isDeferred = function(obj) {
		if (!obj || !obj.state) return false;
		if (typeof obj.state == 'function') {
			return true;
		} else {
			return false;
		}
	};
	
	
	/**
	 * Set a list of attributes to a given DOM node
	 */
	LibUtils.prototype.applyAttributes = function($dom, attrs) {
		for (k in attrs) {
			$dom.attr(k, attrs[k]);
		}
	};
	
	
	/**
	 * Move all childNodes from a $(DOM) to another without
	 * losing active bindings (es listeners)
	 */
	LibUtils.prototype.moveChilds = function($from, $to) {
		while ($from[0].hasChildNodes()) {
			$to[0].appendChild($from[0].removeChild($from[0].firstChild));
		}
	};
	
	
	
	/**
	 * Return true only if "object" is something like "{}"
	 * Here a list of tested inputs ho return false:
	 * - functions
	 * - instances
	 * - scalar (strings, numeric, boolean)
	 * - verctors ([])
	 */
	LibUtils.prototype.isPlainObject = function(object) {
		if (!_.isObject(object)) 	return false;
		if (_.isArray(object)) 		return false;
		if (_.isFunction(object)) 	return false;
		
		if (!object.prototype && _.isEmpty(object.__proto__) && object.constructor && object.constructor instanceof Object) {
			return true;
		} else {
			return false;
		}
	};
	
	
	
	LibUtils.prototype.ucFirst = function(str) {
		str += '';
		var f = str.charAt(0).toUpperCase();
		return f + str.substr(1);
	};
	
	LibUtils.prototype.lcFirst = function(str) {
		str += '';
		var f = str.charAt(0).toLowerCase();
		return f + str.substr(1);
	};
	
	
	
	
	
	
	
	/**
	 * Static method to return a DeferredObject who resolve after
	 * given interval.
	 */
	LibUtils.prototype.delayedDeferred = function(delay) {
		if (delay !== false) {
			delay = delay || 1;
		}
		var _dfd = $.Deferred();
		if (delay !== false) {
			setTimeout(_dfd.resolve, delay);
		}
		return _dfd.promise();
	};
	
	
	
	LibUtils.prototype.elapsed = function(t1, t2) {
		
		t1 = t1 || Date.now();
		t2 = t2 || Date.now();
		
		return t2 - t1;
	}
	
	
	
	
	
	
	/**
	 * Global namespace singleton:
	 * various namespaces under jQbrick will link this instance!
	 */
	if (!window.__jQbrickUtilsLibrary__) {
		window.__jQbrickUtilsLibrary__ = new LibUtils;
	}
	
	return LibUtils;
	
});