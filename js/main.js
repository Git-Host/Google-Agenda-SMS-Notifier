/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Application Entry Point
 *
 */

define([
	"jqbrick/amd.jqm",
	"jqbrick/tests/TestView",
	"jqbrick/tests/TestComponent"
], function(
	jQbrick,
	TestView,
	TestComponent
) {
	
	window.App = new jQbrick.AppClass({
		resetUrl: true
	});
	
	
	
	$(document).delegate('#home', 'pageshow', function() {
		
		
		
		// TestView
		/*
		var test = new TestView({
			viewport: 	'#viewport'
		});
		*/
		
		
		// TestComponent
		var test = new TestComponent({
			viewport: 	'#viewport',
			timeout: 	500
		});
		
		
	});
	
});

