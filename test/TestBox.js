/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * jQbrick.Component Test Case
 * ------------------------
 *
 *
 */

define([
	"jqbrick/TestClass",
	"jqbrick/view.Box"
], function(
	TestClass,
	jQbrickBox
) {
	
	var Test = TestClass.extend({
		run: function() {
			var Test = this;
			
			console.log("###");
			console.log("### RUN BOX TEST");
			console.log("###");
			
			var testBox = new jQbrickBox({
				autoRender: true,
				container: 	this.options.viewport,
				html: 		'TestBox',
				
				fullsize:	true,
				style: 		"border:4px solid red",
				innerStyle: "border:4px solid yellow",
				
				items: [{
					html: "Item 01",
				},{
					html: "Item 02"
				},{
					html: "Item 03"
				}]
				
			});
			
			
			testBox.on('beforerender', function(e) {
				
				console.log("BEFORE RENDER");
				e.block();
				
				$.when(this.layout(true)).then(e.unblock);
				
			});
			
			testBox.on('afterrender', function(e) {
				
				console.log("AFTER RENDER");
				
			});
			
			testBox.on('beforelayout', function(e) {
				
				console.log("BEFORE LAYOUT");
				
			});
			
			testBox.on('afterlayout', function(e) {
				
				console.log("AFTER LAYOUT");
				
			});
			
			
			
		}
	});
	
	
	
	return Test;
	
});

