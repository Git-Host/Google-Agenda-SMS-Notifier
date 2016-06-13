/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * - RequireJs configuration
 * - general fix
 * - load App entry point
 *
 */


	
requirejs.config({
	"baseUrl" : "./",
	"urlArgs" : "devTime=" + (new Date()).getTime(),
	
	
	
	
	"paths" : {
		
		// Libraries
		"jquery"		: "./js/Lib/jquery/jquery-2.0.3",
		"underscore"	: "./js/Lib/underscore/underscore.1.5.1",
		"backbone"		: "./js/Lib/backbone/backbone.1.0.0",
		"async"			: "./js/Lib/asyncjs/async.0.2.9",
		"jqm"			: "./js/Lib/jquerymobile/jquery.mobile-1.3.2",
		"jqueryui"		: "./js/Lib/jqueryui",
		"plugin"		: "./js/Lib/plugins",
		
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
		// going to develop:
		//
		// - loader         : standard Web App
		// - loader.jqm     : jQueryMobile UI App
		{
			name			: "jqbrick",
			location		: "./js/Lib/jqbrick",
			main			: "loader.jqm"
		},
		
		// SQLite Package
		// mobile database abstraction layer
		{
			name			: "sqlite",
			location		: "./js/Lib/sqlite",
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



