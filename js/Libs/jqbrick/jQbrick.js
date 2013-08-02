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


if (!window.console) {
	window.console = {};
}
if (!window.console.log) {
	window.console.log = function() {};
}

define([
	"underscore",
	"./lib.utils",
	"./lib.layout",
	
	"./mixin.Callback",
	"./mixin.Deferred",
	
	// Logic Components
	"./AppClass",
	
	// UI Components
	"./view.View",
	
	// Layouts
	"./layout.Default"
	
], function(
	_,
	LibUtils,
	LibLayout,
	
	CallbackMixin,
	DeferredMixin,
	
	// Logic Components
	AppClass,
	
	// UI Components
	View,
	
	DefaultLayout

	
) {
	
	var jQbrick = function() {
		return this.__construct__.apply(this, arguments);
	};
	
	
	/**
	 * when create a new instance of jqbrick you can pass an object
	 * containing a full set of libraries to be added to the global
	 * namespace.
	 *
	 * please notice that given xtypes and layouts are registered to their
	 * managers!
	 *
	 * jQbrick adds commons libraries as default values for that
	 * configuration!
	 *
	 * NOTE: jQbrick "amd.xxx.js" files are responsible of creating
	 * distributions of jqbrick so they are using this configuration!
	 */
	jQbrick.prototype.__construct__ = function(libs) {
		
		this.libs = _.extend({
			"AppClass" 				: AppClass,
			"mixin"					: {},
			
			"view"					: {},
			"model"					: {},
			"collection"			: {},
			
			"xtype"					: {},
			"layout"				: {}
		}, libs);
		
		this.libs.mixin = _.extend({
			"Callback"				: CallbackMixin,
			"Deferred"				: DeferredMixin
		}, this.libs.mixin);
		
		this.libs.view = _.extend({
			"View"					: View
		}, this.libs.view);
		
		this.libs.model = _.extend({
			//"xxx"					: Xxx
		}, this.libs.model);
		
		this.libs.collection = _.extend({
			//"xxx"					: Xxx
		}, this.libs.collection);
		
		this.libs.xtype = _.extend({
			"view"					: View
		}, this.libs.xtype);
		
		this.libs.layout = _.extend({
			"default"				: DefaultLayout
		}, this.libs.layout);
		
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
		/*
		this.xtype = new LibXType(this);
		
		// add xtype
		this.libs.view.View.prototype.xtype = this.xtype;
		
		// register core's XTypes
		this.xtype.register("view", 		this.libs.view.View);
		this.xtype.register("container", 	this.libs.view.Container);
		this.xtype.register("panel", 		this.libs.view.Panel);
		
		lascia perdere le registrazioni manuali.
		registra tutto il namespace "this.libs.xtype"
		
		il seguente codice è più che altro una traccia... da testare e sistemare!
		
		_.each(this.libs.xtyps, function(k,v) {
			this.xtype.register(k,v)
		}, this);
		
		
		*/
	};
	
	
	/**
	 * 
	 */
	jQbrick.prototype._setupLayouts = function() {
		var self = this;
		
		this.LayoutManager = new LibLayout(this);
		
		this.libs.view.View.prototype.LayoutManager = this.LayoutManager;
		
		$.each(this.libs.layout, function(k,v) {
			self.LayoutManager.register(k,v)
		});
		
	};
	
	
	return jQbrick;
	
});