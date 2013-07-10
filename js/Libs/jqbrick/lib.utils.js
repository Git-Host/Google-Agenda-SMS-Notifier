/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Utility Library
 * it is attached to all jQbrick namespaces and objects constructorr under "utils" attribute!
 *
 */

define(['jquery'], function($) {
	
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
	 * Global namespace singleton:
	 * various namespaces under jQbrick will link this instance!
	 */
	if (!window.__jQbrickUtilsLibrary__) {
		window.__jQbrickUtilsLibrary__ = new LibUtils;
	}
	
	return LibUtils;
	
});