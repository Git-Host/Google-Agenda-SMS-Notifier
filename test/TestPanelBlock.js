/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * jQbrick.view.Panel - Test Case
 * ------------------------
 * 
 * Implement a simple Panel with many items and a given BlockLayout
 *
 */

define([
	"jqbrick/TestClass",
	"jqbrick/view.Panel"
], function(
	TestClass,
	jQbrickPanel
) {
	
	var Test = TestClass.extend({
		run: function() {
			var Test = this;
			
			console.log("###");
			console.log("### RUN PANEL TEST");
			console.log("### BlockLayout");
			console.log("###");
			
			
			
			var testPanel = new jQbrickPanel({
				autoRender: true,
				container: 	this.options.viewport,
				html: 		'TestPanel - BlockLayout',
				
				style: 		"border:4px solid red",
				bodyStyle: 	"border:4px solid yellow",
				
				
				items: [{
					html: "Item 01"
				},{
					html: "Item 02",
				},{
					html: "Item 03"
				},{
					html: "Item 04"
				},{
					html: "Item 05"
				}],
				
				itemDefaults: {
					style: "border:1px dashed #666; background:#ccc",
					bodyStyle: "padding:5px"
				},
				
				
				
				layout: {
					name:	"block",
					width:	250,
					height:	200,
					
					itemLayout: {
						name: "block",
						height: 50
					}
					
				},
				
				
				/**
				 * You can also setup some layout properties inside
				 * panel's configuration.
				 *
				 * It depens on your coding preferences!
				 */
				/*
				layout: "block",
				width: 250,
				height: 200,
				fullsize: false
				*/
				
			});
			
		}
	});
	
	
	
	return Test;
	
});

