/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Html Driven App Demo
 * Multi Page App
 *
 */

define(["jquery"], function() {
	
	$(document).delegate("#page2", "pagebeforeshow", function() {
		$(this).find("[data-role=content] b").html(App.counters.page2+=1);
	});
	
});