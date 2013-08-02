/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * View Test Case
 * ------------------------
 *
 * scope of this test is to study how View's initialization and rendering
 * callbacks should block instance creation.
 *
 * here I use all View's:
 * - Callbacks
 * - Events
 * - Checkpoints
 * - Checkpoint Events
 *
 */

define([
	"jqbrick/view.View",
	"jqbrick/TestClass",
	"jqbrick/layout.Default",
], function(
	jQbrickView,
	TestClass,
	DefaultLayout
) {
	
	
	
	var Test = TestClass.extend({
		run: function() {
			var Test = this;
			
			var __execTime = Date.now();
			var __renderTime = Date.now();
			
			var Instance = new jQbrickView({
				html: 	"TestView",
				cls:	"test-view",
				style: 	"color:white",
				css: 	{
					background: "#aaa",
					textShadow: "none",
					padding:	10
				},
				
				container: "#viewport",
				autoRender: true
				
			});
			
			/*
			Instance.when("initialized").then(function() {
				console.log("Instance Initialized " + this.cid + " ("+Instance.utils.elapsed(__execTime)+"ms)");
			},function() {
				console.log("Instance Initialization Failed " + this.cid);
			});
			
			
			Instance.when("allinitialized").then(function() {
				console.log("Instance Content Initialized " + this.cid + " ("+Instance.utils.elapsed(__execTime)+"ms)");
			},function() {
				console.log("Instance Content Initialization Failed " + this.cid);
			});
			
			Instance.when("rendered").then(function() {
				console.log("Instance Rendered " + this.cid + " ("+Instance.utils.elapsed(__renderTime)+"ms)");
			});
			
			Instance.when("allrendered").then(function() {
				console.log("Instance Content Rendered " + this.cid + " ("+Instance.utils.elapsed(__renderTime)+"ms)");
			});
			*/
			
			window.Instance = Instance;
			
		}
	});
	
	return Test;
	
});

