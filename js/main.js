/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Application Entry Point
 *
 */

define([
	"jqbrick/amd.jqm"
], function(
	jQbrick
) {
	
	window.App = new jQbrick.AppClass({
		resetUrl: true,
		jqmDefaults: {
			ajaxEnabled: false
		}
	});
	
});

