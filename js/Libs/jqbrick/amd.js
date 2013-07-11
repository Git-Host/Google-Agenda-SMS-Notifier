/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Build jQbrick singleton namespace
 * 
 */

define([
	"./AppClass",
	
	"./lib.utils",
	"./lib.xtype",
	
	"./view.View",
	"./view.Component",
	"./view.ComponentLayout"
	
], function(
	AppClass,
	
	LibUtils,
	LibXType,
	
	View,
	Component,
	ComponentLayout
	
) {
	
	
	var jQbrick = function() {
		
		this.__setupUtilisLibrary();
		
		this.__setupXtypes();
		
		return {
			"AppClass" 				: AppClass,	
			"View"					: View,
			"Component"				: Component,
			"ComponentLayout"		: ComponentLayout
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
	 * Setup LibXType and register all known types
	 */
	jQbrick.prototype.__setupXtypes = function() {
		
		this.xtype = new LibXType(this);
		
		View.prototype.xtype = this.xtype;
		
		// register core's XTypes
		this.xtype.register("view", View);
		this.xtype.register("component", Component);
		this.xtype.register("componentlayout", ComponentLayout);
		
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