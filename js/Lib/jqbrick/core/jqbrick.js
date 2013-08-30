/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Core: Namespace Builder
 *
 * this module loads very core libraries and return an object
 * who is able to create a working namespace for jQbrick.
 *
 * this namespace will contain both libraries and high level methods.
 * 
 *
 */



define([
	"underscore",
	"./utils",
	"./AppClass"

], function(
	_,
	Utils,
	AppClass

) {
	
	var ns = {
		build		: "core",
		version		: "1.0",
		
		core		: {},
		utils		: {},
		model		: {},
		collection	: {},
		view		: {},
		
		app			: null
		
	};
	
	var jQbrick = function(customizations) {
		
		// apply customized libraries to default namespace
		ns = _.extend({}, ns, customizations || {});
		
		
		
		// add default libraries to namespace:
		// -->
		
		ns.core = _.extend({
			"AppClass"			: AppClass
		}, ns.core);
		
		ns.utils = _.extend(Utils, ns.utils);
		
		ns.model = _.extend({
			//"FooClass"			: FooClass
		}, ns.model);
		
		ns.collection = _.extend({
			//"FooClass"			: FooClass
		}, ns.collection);
		
		ns.view = _.extend({
			//"FooClass"			: FooClass
		}, ns.view);
		
		
		
		return ns;
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
// -------------------------------------------------------------------- //	
// ---[[   C L I E N T   A P P L I C A T I O N   B U I L D E R   ]] --- //	
// -------------------------------------------------------------------- //
	
	
	/**
	 * It generates a global accessible application namespace.
	 * you can give your application a custom name and configuration.
	 * if you give only configuration "App" name is used as default.
	 *
	 *   jQbrick.App("fooApp", {config})
	 *   --> window.fooApp
	 *   
	 *   jQbrick.App({config});
	 *   --> window.App
	 *
	 *   jQbrick.App({name:"Foo"});
	 *   --> window.Foo
	 */
	ns.App = function(name, config) {
		
		if (!_.isString(name)) {
			config 	= name;
			name 	= "App";
		}
		
		config = _.extend({
			name		: name,
			version		: "0.0.0"
		}, config || {});
		
		name = config.name;
		window[name] = new this.core.AppClass(config);
		
		return window[name];
	};
	
	
	
	
	
	
	
	
	
	return jQbrick;
		
});
