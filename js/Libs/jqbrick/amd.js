/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Build jQbrick Singleton Namespace
 * 
 * 
 * 
 * 
 */

define([
	"./jQbrick"
	
], function(
	jQbrick
	
) {
	
	
	/**
	 * AMD Output
	 * export an instance of jQbrick namespace so all features should be
	 * globally accessed and extended.
	 *
	 * If no global namespace conflicts exists it export jQbrick
	 * instance to the global namespace too.
	 */
	
	var _Singleton = new jQbrick({
		/*
		NewLibName : NewLibObj,
		NewLibName : NewLibObj,
		NewLibName : NewLibObj,
		*/
	});
	
	if (!window.jQbrick) {
		window.jQbrick = _Singleton;
	}
	
	return _Singleton;
	
});