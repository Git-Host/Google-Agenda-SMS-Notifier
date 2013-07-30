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
				html: 		'TestPanel',
				
				style: 		"border:4px solid red",
				bodyStyle: 	"border:4px solid yellow",
				
				items: [{
					html: "Item 01",
					layout: {
						name: "block",
						height: 80
					}
				},{
					html: "Item 02"
				},{
					html: "Item 03"
				},{
					html: "Item 04"
				},{
					html: "Item 05"
				}],
				
				itemDefaults: {
					style: "border:1px dashed #666"
				},
				
				layout: {
					name: "block",
					width: 250,
					height: 250
				}
				
			});
			
		}
	});
	
	
	
	return Test;
	
});

