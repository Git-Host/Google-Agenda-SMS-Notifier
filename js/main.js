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
	"jqbrick/tests/TestViewInstance"
], function(
	jQbrick,
	TestViewInstance
) {
	
	window.App = new jQbrick.AppClass({
		resetUrl: true
	});
	
	
	
	$(document).delegate('#home', 'pageshow', function() {
		
		var test = new TestViewInstance({
			viewport: 	'#viewport'
		});
		
	});
	
});

