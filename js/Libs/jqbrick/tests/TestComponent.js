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
				//autoRender: true,
				container: 	this.options.viewport,
				html: 		'TestView',
				
				style: 		"border:4px solid red",
				innerStyle: "border:4px solid yellow",
				
				
				
				items: [{
					html: 	"Item 01",
					active: false,
					onSetup: function() {
						console.log("setup Item 01");
						return TestClass.utils.delayedDeferred(5);
					}
				},{
					id: 	"it2",
					html: 	"Item 02",
					onSetup: function() {
						console.log("setup Item 02");
						return TestClass.utils.delayedDeferred(5);
					}
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
			*/
			
			
			/*
			testComponent.on("beforeadditem", function(e) {
				console.log("[EVENT] on:beforeadditem");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("additem", function(e) {
				console.log("[EVENT] on:additem");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("beforeadditems", function(e) {
				console.log("[EVENT] on:beforeadditem(s)");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("additems", function(e) {
				console.log("[EVENT] on:additem(s)");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			
			
			testComponent.on("beforeremoveitem", function(e) {
				console.log("[EVENT] on:beforeremoveitem");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("removeitem", function(e) {
				console.log("[EVENT] on:removeitem");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("beforeremoveitems", function(e) {
				console.log("[EVENT] on:beforeremoveitem(s)");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("removeitems", function(e) {
				console.log("[EVENT] on:removeitem(s)");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			*/
			
			
			
			testComponent.on("beforeenableitem", function(e) {
				console.log("[EVENT] on:beforeenableitem");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("enableitem", function(e) {
				console.log("[EVENT] on:enableitem");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("beforeenableitems", function(e) {
				console.log("[EVENT] on:beforeenableitems(s)");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("enableitems", function(e) {
				console.log("[EVENT] on:enableitems(s)");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			
			
			testComponent.on("beforedisableitem", function(e) {
				console.log("[EVENT] on:beforedisableitem");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("disableitem", function(e) {
				console.log("[EVENT] on:disableitem");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("beforedisableitems", function(e) {
				console.log("[EVENT] on:beforedisableitems(s)");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			testComponent.on("disableitems", function(e) {
				console.log("[EVENT] on:disableitems(s)");
				console.log(e);
				e.block();setTimeout(e.unblock, 50);
			});
			
			
			
			
			/**
			 * Bind on Items
			 */
			
			testComponent.is("initialized", function() {
				
				/*
				testComponent.itemAt(0).on("beforerender", function(e) {
					console.log("[EVENT] ItemAt(0) :: beforeRender");
					e.block();
					setTimeout(e.unblock, 1000);
				});
				
				testComponent.itemAt(1).on("beforerender", function(e) {
					console.log("[EVENT] ItemAt(1) :: beforeRender");
					e.block();
					setTimeout(e.unblock, 1000);
				});
				*/
				
				
				$.when(testComponent.getDeferred("initialized")).then(function() {
					setTimeout(function() {
						testComponent.enableItems([0,5], {
							silent:false
						});
					}, 1000);
					/*
					setTimeout(function() {
						testComponent.disableItems(["it2", "aa"], {
							silent:false
						});
					}, 2000);
					*/
				});
				
				
			});
			
		}
	});
	
	
	
	return Test;
	
});

