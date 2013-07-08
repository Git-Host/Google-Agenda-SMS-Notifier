/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * RequireJs configuration
 *
 */



requirejs.config({
	"baseUrl" : "Libs",
	"urlArgs" : "devTime=" + (new Date()).getTime(),
	"paths" : {
		"app" 			: "../App",
		"model" 		: "../App/Model",
		"collection"	: "../App/Collection",
		"view"			: "../App/View",
		"template"		: "../App/Template",
		"page"			: "../App/Page"
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
require(["jqm"]);
