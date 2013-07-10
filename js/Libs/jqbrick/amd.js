/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Build jQbrick singleton namespace
 * 
 */

define([
	"./lib.utils",
	"./AppClass",
	"./View"
	
], function(
	LibUtils,
	AppClass,
	View
	
) {
	
	
	var jQbrick = function() {
		
		this.__setupUtilisLibrary();
		
		return {
			"AppClass" 		: AppClass,	
			"View"			: View
		}
	};
	
	
	/**
	 * Setup LibUtils library and inject into framework modules
	 */
	jQbrick.prototype.__setupUtilisLibrary = function() {
		
		this.utils = new LibUtils(this);
		
		AppClass.prototype.utils 	= this.utils;
		View.prototype.utils 		= this.utils;
	};
	
	
	
	
	/**
	 * AMD Output
	 * export an instance of jQbrick namespace so all features should be
	 * globally accessed and extended.
	 *
	 * If no global namespace conflicts exists it export jQbrick
	 * instance to the global namespace too.
	 */
	if (!window.jQbrick) {
		window.jQbrick = new jQbrick();
	}
	
	return window.jQbrick;
	
});