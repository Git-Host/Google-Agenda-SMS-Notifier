/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Html Driven App Demo
 * Multi Page App
 *
---



---
 *
 */


define([
	"jquery",
	"jqbrick"
	
], function(
	$,
	jQbrick
	
) {
	
	
	/**
	 * Startup Application
	 */
	jQbrick.App().onReady(function() {
		
		// Just create a dynamic page once application is ready to handle it!
		var $page = this.createPage({
			title: "Hello World",
			content: "this is the first <b>JavaScript Driven</b> jQM App I build with <code>jQbrick</code>!"
		});
		
		// DEMO Index Back Link
		// please don't care about this code!
		$page.$header.prepend('<a href="../../" data-ajax="false" data-icon="home">Demo</a>');
		
	});
	
		
			
});