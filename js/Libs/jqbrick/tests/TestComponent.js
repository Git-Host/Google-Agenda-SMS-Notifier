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
	"jqbrick/view.Component"
], function(
	TestClass,
	jQbrickComponent
) {
	
	var Test = TestClass.extend({
		run: function() {
			var Test = this;
			
			console.log("###");
			console.log("### RUN TEST COMPONENT");
			console.log("###");
			
			var testComponent = new jQbrickComponent({
				autoRender: true,
				container: 	this.options.viewport,
				html: 		'TestView',
				
				style: 		"border:4px solid red",
				innerStyle: "border:4px solid yellow",
				
				items: [{
					html: 	"Item 01"
				},{
					id: 	"it2",
					html: 	"Item 02"
				}],
				
				itemDefaults: {
					//xtype: "view",
					style: "border: 2px solid blue"
				}
			});
			
			/**
			 * View Events (blocking)
			 * events who are involved in initialization or rendering process can block
			 * that process using "e.block()" and "e.unblock()" apis
			 */
			/*
			testComponent.on("setup", function(e) {
				console.log("[EVENT] on:setup");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testComponent.on("init", function(e) {
				console.log("[EVENT] on:init");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testComponent.on("beforerender", function(e) {
				console.log("[EVENT] on:beforerender");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testComponent.on("afterrender", function(e) {
				console.log("[EVENT] on:afterrender");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testComponent.on("additem", function(e) {
				console.log("[EVENT] on:additem");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			*/
			
			
			
			/**
			 * Bind on Items
			 */
			
			testComponent.is("initialized", function() {
				
				testComponent.itemAt(0).on("beforerender", function(e) {
					console.log("[EVENT] ItemAt(0) :: beforeRender");
					//e.block();
				});
				
				testComponent.itemAt(1).on("beforerender", function(e) {
					console.log("[EVENT] ItemAt(1) :: beforeRender");
					//e.block();
				});
				
				
				setTimeout(function() {
					testComponent.removeItems([0, 'it2']);
				}, 100);
				
			});
			
		}
	});
	
	
	
	return Test;
	
});

