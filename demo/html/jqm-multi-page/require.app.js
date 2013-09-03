/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * - RequireJs configuration
 * - general fix
 * - load App entry point
 *
 * !!! DEMO NOTES !!!
 * all libraries paths points to the main project "js/Lib"
 * folder. If you try to run this example after moving
 * sources you may need to edit paths in this file!
 *
 */

// shortcut used in demo folders
var __relativeLibPath__ = "../../../js/Lib/";

requirejs.config({
	"baseUrl" : "./",
	"urlArgs" : "devTime=" + (new Date()).getTime(),
	
	
	
	
	"paths" : {
		
		// Libraries
		"jquery"		: __relativeLibPath__ + "jquery/jquery-2.0.3",
		"underscore"	: __relativeLibPath__ + "underscore/underscore.1.5.1",
		"backbone"		: __relativeLibPath__ + "backbone/backbone.1.0.0",
		"async"			: __relativeLibPath__ + "asyncjs/async.0.2.9",
		"jqm"			: __relativeLibPath__ + "jquerymobile/jquery.mobile-1.3.2",
		"jqueryui"		: __relativeLibPath__ + "jqueryui",
		"plugin"		: __relativeLibPath__ + "plugins",
		
		// Application Related
		"app" 			: "./js",
		"lib"			: "./js/Lib",
		"delegate"		: "./js/Delegate",
		"model" 		: "./js/Model",
		"collection"	: "./js/Collection",
		"view"			: "./js/View"
		
	},
	
	"packages" : [
		
		// jQbrick Package
		// here you can configure what kind of jQbrick application you are
		// going to develope:
		//
		// - loader         : standard Web App
		// - loader.jqm     : jQueryMobile UI App
		{
			name			: "jqbrick",
			location		: __relativeLibPath__ + "jqbrick",
			main			: "loader.jqm"
		},
		
		// SQLite Package
		// mobile database abstraction layer
		{
			name			: "sqlite",
			location		: __relativeLibPath__ + "sqlite",
			main			: "sqlite"
			
		}
	],
	
	
	
	
	/**
	 * Global Dependencies
	 */
	"shim" : {
		"jquery" : {
			"exports" : "jQuery"
		},
		"underscore" : {
			"deps"		: ["jquery"],
			"exports"	: "_"
		},
		"backbone" : {
			"deps" 		: ["underscore", "jquery"],
			"exports" 	: "Backbone"
		},
		"plugin/jquery.easing" : {
			"deps"		: ["jquery"]	
		},
		
		// This is an important configuration when using "loader.jqm" package because
		// jQueryMobile library must be loaded after all application scripts
		"jqm" : {
			"deps"		: ["jquery", "app/main"]
		}
		
	}
	
});




/**
 * Fix for those browsers who don't support console
 */

if (!window.console) {
	window.console = {};
}
if (!window.console.log) {
	window.console.log = function() {};
}



/**
 * Features Sniffing Utilities
 */

if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
	document.getElementsByTagName("html").item().className += " jqbrick-deviceAndroid";
}
if (navigator.userAgent.toLowerCase().indexOf("apple") > -1 && (navigator.userAgent.toLowerCase().indexOf("iphone") > -1 || navigator.userAgent.toLowerCase().indexOf("ipad") > -1)) {
	document.getElementsByTagName("html").item().className += " jqbrick-deviceApple";
}





/**
 * Load Application Entry Point
 */

require(["app/main", "jqm"]);



