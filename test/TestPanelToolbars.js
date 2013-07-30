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
				},{
					html: "Item 06"
				},{
					html: "Item 07"
				},{
					html: "Item 08"
				},{
					html: "Item 09"
				},{
					html: "Item 10"
				}],
				
				itemDefaults: {
					style: 		"border:1px dashed #666; background:#ccc",
					bodyStyle: 	"padding:5px",
					layout: 	"block",
					height: 	50
				},
				
				layout: "fit",
				
				toolbars: [{
					html: 		"Toolbar - docked on Top",
					style:		"border: 4px solid blue;"
				},{
					docked: 	"bottom",
					html: 		"Toolbar - docked on Bottom",
					style:		"border: 4px solid blue;"
				},{
					docked:		"right",
					html:		"Toolbar - docked on Right",
					style:		"border: 4px solid green;font-size:8pt"
				},{
					docked:		"left",
					html:		"Toolbar - docked on Left",
					style:		"border: 4px solid green;font-size:8pt"
				}]
				
				
				
				
			});
			
		}
	});
	
	
	
	return Test;
	
});

