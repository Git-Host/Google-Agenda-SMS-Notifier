/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * RequireJs configuration
 *
 */



requirejs.config({
	"baseUrl" : "./",
	"urlArgs" : "devTime=" + (new Date()).getTime(),
	"paths" : {
		
		// Libraries
		"jquery"		: "./js/Libs/jquery",
		"jqueryui"		: "./js/Libs/jqueryui",
		"underscore"	: "./js/Libs/underscore",
		"backbone"		: "./js/Libs/backbone",
		"jqm"			: "./js/Libs/jqm",
		"jqbrick"		: "./js/Libs/jqbrick",
		
		// Application
		"app" 			: "./js",
		"model" 		: "./js/Model",
		"collection"	: "./js/Collection",
		"view"			: "./js/View",
		"template"		: "./js/Template",
		"page"			: "./js/Page"
	},
	"shim" : {
		"underscore" : {
			"deps"		: ["jquery"],
			"exports"	: "_"
		},
		"backbone" : {
			"deps" 		: ["underscore", "jquery"],
			"exports" 	: "Backbone"
		},
		"jqm" : {
			"deps"		: ["jquery", "app/main"]
		}
	}
});

// Load Application Entry Point
require(["app/main", "jqm"]);