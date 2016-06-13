/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Html Driven App Demo
 * Single Page App
 *
---

This demo run a very simple application who display 3 mobile
pages who are hard coded into `index.html` file.

This main script is responsible of startupping the application
and handle `jQM` page events to collect to display a 
simple view counter in both internal pages.

> Please be careful about single-page apps because of DOM and
> memory issues if a large application is done this way! 

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
	jQbrick.App();
	
	
	/**
	 * Handle Counters
	 */
	var p1Count = 0,
		p2Count = 0;
	
	$(document).delegate("#page1", "pagebeforeshow", function() {
		$(this).find("[data-role=content] b").html(p1Count+=1);
	});
	
	$(document).delegate("#page2", "pagebeforeshow", function() {
		$(this).find("[data-role=content] b").html(p2Count+=1);
	});
		
});