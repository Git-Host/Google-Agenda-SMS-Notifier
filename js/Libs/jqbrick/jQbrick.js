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
	
	"./mixin.Callback",
	"./mixin.Deferred",
	
	// Logic Components
	"./AppClass",
	
	// UI Components
	"./view.View",
	"./view.Component",
	//"./view.ComponentLayout"
	
], function(
	_,
	LibUtils,
	LibXType,
	
	CallbackMixin,
	DeferredMixin,
	
	// Logic Components
	AppClass,
	
	// UI Components
	View,
	Component
	//ComponentLayout

	
) {
	
	var jQbrick = function() {
		return this.__construct__.apply(this, arguments);
	};
	
	
	jQbrick.prototype.__construct__ = function(libs) {
		
		this.libs = _.extend({
			"AppClass" 				: AppClass,
			"mixin"					: {},
			"view"					: {}
		}, libs);
		
		this.libs.mixin = _.extend({
			"Callback"				: CallbackMixin,
			"Deferred"				: DeferredMixin
		}, this.libs.mixin);
		
		this.libs.view = _.extend({
			"View"					: View,
			"Component"				: Component,
			//"ComponentLayout"		: ComponentLayout
		}, this.libs.view);
		
		this._setupUtiliesLibrary();
		this._setupXtypes();
		return this.libs;
	};
	
	
	
	/**
	 * Setup LibUtils library and inject into framework modules
	 */
	jQbrick.prototype._setupUtiliesLibrary = function() {
		
		this.utils = new LibUtils(this);
		
		this.libs.AppClass.prototype.utils 			= this.utils;
		this.libs.view.View.prototype.utils 		= this.utils;
	};
	
	
	/**
	 * Setup LibXType and register all known types
	 */
	jQbrick.prototype._setupXtypes = function() {
		
		this.xtype = new LibXType(this);
		
		// add xtype
		this.libs.view.View.prototype.xtype = this.xtype;
		
		// register core's XTypes
		this.xtype.register("view", this.libs.view.View);
		this.xtype.register("component", this.libs.view.Component);
		//this.xtype.register("componentlayout", this.libs.view.ComponentLayout);
		
	};
	
	return jQbrick;
	
});