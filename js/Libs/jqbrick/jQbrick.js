/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * jQbrick Namespace Constructor
 * It includes basic packages but let to be extended with custom packages.
 * 
 * So, AMD packages should "compose" a jQbrick version by including
 * some custom modules, overriding jQbrick constructor, etc.
 *
 * Example: 
 * "amdJqm" will include packages specialized for jQueryMobile framework only!
 * 
 * 
 * 
 */

define([
	"underscore",
	"./lib.utils",
	"./lib.xtype",
	
	// Logic Components
	"./AppClass",
	
	// UI Components
	"./view.View",
	"./view.Component",
	"./view.ComponentLayout"
	
], function(
	_,
	LibUtils,
	LibXType,
	
	// Logic Components
	AppClass,
	
	// UI Components
	View,
	Component,
	ComponentLayout

	
) {
	
	var jQbrick = function() {
		return this.__construct__.apply(this, arguments);
	};
	
	
	jQbrick.prototype.__construct__ = function(libs) {
		
		this.libs = _.extend({
			"AppClass" 				: AppClass,
			"View"					: View,
			"Component"				: Component,
			"ComponentLayout"		: ComponentLayout
		}, libs);
		
		this._setupUtiliesLibrary();
		this._setupXtypes();
		return this.libs;
	};
	
	
	
	/**
	 * Setup LibUtils library and inject into framework modules
	 */
	jQbrick.prototype._setupUtiliesLibrary = function() {
		
		this.utils = new LibUtils(this);
		
		this.libs.AppClass.prototype.utils 	= this.utils;
		this.libs.View.prototype.utils 		= this.utils;
	};
	
	
	/**
	 * Setup LibXType and register all known types
	 */
	jQbrick.prototype._setupXtypes = function() {
		
		this.xtype = new LibXType(this);
		
		// add xtype
		this.libs.View.prototype.xtype = this.xtype;
		
		// register core's XTypes
		this.xtype.register("view", this.libs.View);
		this.xtype.register("component", this.libs.Component);
		this.xtype.register("componentlayout", this.libs.ComponentLayout);
		
	};
	
	return jQbrick;
	
});