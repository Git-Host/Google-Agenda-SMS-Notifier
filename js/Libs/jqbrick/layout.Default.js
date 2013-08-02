/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Default Layout Manager
 *
 */

define([
	"backbone",
	"./layout.Interface"
], function(
	Backbone,
	LayoutInterface
) {
	
	
	var DefaultLayout = LayoutInterface.extend({
		
		name: "default"
		
	});	
	
		
	return DefaultLayout;
	
});