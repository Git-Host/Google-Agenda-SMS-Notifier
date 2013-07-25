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
	"./lib.layout",
	
	"./mixin.Callback",
	"./mixin.Deferred",
	
	"./layout.Default",
	"./layout.Fit",
	
	// Logic Components
	"./AppClass",
	
	// UI Components
	"./view.View",
	"./view.Component",
	"./view.Box"
	
], function(
	_,
	LibUtils,
	LibXType,
	LibLayout,
	
	CallbackMixin,
	DeferredMixin,
	
	DefaultLayout,
	FitLayout,
	
	// Logic Components
	AppClass,
	
	// UI Components
	View,
	Component,
	Box

	
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
			"Box"					: Box
		}, this.libs.view);
		
		this._setupUtiliesLibrary();
		this._setupXTypes();
		this._setupLayouts();
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
	jQbrick.prototype._setupXTypes = function() {
		
		this.xtype = new LibXType(this);
		
		// add xtype
		this.libs.view.View.prototype.xtype = this.xtype;
		
		// register core's XTypes
		this.xtype.register("view", 		this.libs.view.View);
		this.xtype.register("component", 	this.libs.view.Component);
		this.xtype.register("box", 			this.libs.view.Box);
		
	};
	
	
	/**
	 * 
	 */
	jQbrick.prototype._setupLayouts = function() {
	
		this.LayoutManager = new LibLayout(this);
		
		this.libs.view.Box.prototype.LayoutManager = this.LayoutManager;
		
		this.LayoutManager.register("default", DefaultLayout);
		this.LayoutManager.register("fit", FitLayout);
	};
	
	
	return jQbrick;
	
});