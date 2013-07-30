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
			console.log("###");
			
			
			
			var testPanel = new jQbrickPanel({
				autoRender: false,
				container: 	this.options.viewport,
				html: 		'TestPanel',
				
				style: 		"border:4px solid red",
				bodyStyle: 	"border:4px solid yellow",
				
				
				items: [{
					html: "Item 01"
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
				
				
				/**
				 * Working Callbacks (blocking)
				 * these callbacks are invoked during initialization and rendering process
				 * 
				 * these are all "blocking callbacks":
				 * you can return a DeferredObject as callback output to stop main logic
				 * until this deferred resolve!
				 * !!! a failure deferred will block the process!
				 *
				 * 
				 *
				 */
				
				onSetup: function() {
					console.log('[CALLBACK] onSetup');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onBeforeItems: function() {
					console.log('[CALLBACK] onBeforeItems');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onAfterItems: function() {
					console.log('[CALLBACK] onAfterItems');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onInit: function() {
					console.log('[CALLBACK] onInit');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				// rendering
				
				onBeforeRender: function() {
					console.log('[CALLBACK] onBeforeRender');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onAfterRender: function() {
					console.log('[CALLBACK] onAfterRender');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				
				
				// layouting
				
				onBeforeInitializeLayout: function() {
					console.log('[CALLBACK] onBeforeInitializeLayout');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onAfterInitializeLayout: function() {
					console.log('[CALLBACK] onAfterInitializeLayout');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onBeforeLayout: function() {
					console.log('[CALLBACK] onBeforeLayout');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onAfterLayout: function() {
					console.log('[CALLBACK] onAfterLayout');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				// layout manager name based callbacks
				
				onBeforeInitializeDefaultLayout: function() {
					console.log('[CALLBACK] onBeforeInitializeDefaultLayout');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onAfterInitializeDefaultLayout: function() {
					console.log('[CALLBACK] onAfterInitializeDefaultLayout');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onBeforeDefaultLayout: function() {
					console.log('[CALLBACK] onBeforeDefaultLayout');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onAfterDefaultLayout: function() {
					console.log('[CALLBACK] onAfterDefaultLayout');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				
				
				
				
				/**
				 * Service Callbacks (non blocking)
				 */
				
				onRenderComplete: function() {
					console.log('[CALLBACK] onRenderComplete');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onLayoutComplete: function() {
					console.log('[CALLBACK] onLayoutComplete');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onReady: function() {
					console.log('[CALLBACK] onReady');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onModelReady: function() {
					console.log('[CALLBACK] onModelReady');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				onCollectionReady: function() {
					console.log('[CALLBACK] onCollectionReady');
					return this.utils.delayedDeferred(Test.options.timeout);
				},
				
				
				
				
				
				/**
				 * CheckPoints
				 * allows you to configure some non-blocking callbacks to be invoked
				 * when view reaches some particular points... checkpoints!
				 *
				 * You can fill your initialization process with many checkpoints and
				 * use them at your choice!
				 */
				
				checkpoints: {
					"initialized" 		: "InitializedCheckpoint",
					"rendered"			: "RenderedCheckpoint",
					"layouted"			: "LayoutedCheckpoint",
					"ready"				: "ReadyCheckpoint",
					"modelready"		: "ModelReadyCheckpoint",
					"collectionready"	: "CollectionReadyCheckpoint"
				},
				
				InitializedCheckpoint: function() {
					console.log('[CHECKPOINT CALLBACK] initialized');
				},
				
				RenderedCheckpoint: function() {
					console.log('[CHECKPOINT CALLBACK] rendered');
				},
				
				LayoutedCheckpoint: function() {
					console.log('[CHECKPOINT CALLBACK] layouted');
				},
				
				ReadyCheckpoint: function() {
					console.log('[CHECKPOINT CALLBACK] ready');
				},
				
				ModelReadyCheckpoint: function() {
					console.log('[CHECKPOINT CALLBACK] modelready');
				},
				
				CollectionReadyCheckpoint: function() {
					console.log('[CHECKPOINT CALLBACK] collectionready');
				}
				
				
			});
			
			
			
			
			
			
			
			
			
			
			
			
			
			/**
			 * Component Events (blocking)
			 * events who are involved in initialization or rendering process can block
			 * that process using "e.block()" and "e.unblock()" apis
			 */
			
			testPanel.on("setup", function(e) {
				console.log("[EVENT] on:setup");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("beforeitems", function(e) {
				console.log("[EVENT] on:beforeitems");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("afteritems", function(e) {
				console.log("[EVENT] on:afteritems");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("init", function(e) {
				console.log("[EVENT] on:init");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("beforerender", function(e) {
				console.log("[EVENT] on:beforerender");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("afterrender", function(e) {
				console.log("[EVENT] on:afterrender");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			// layout initialization events
			
			testPanel.on("beforeinitializelayout", function(e) {
				console.log("[EVENT] on:beforeinitializelayout");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("afterinitializelayout", function(e) {
				console.log("[EVENT] on:afterinitializelayout");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			// layout initialization NAMED events
			
			testPanel.on("beforeinitializedefaultlayout", function(e) {
				console.log("[EVENT] on:beforeinitializedefaultlayout");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("afterinitializedefaultlayout", function(e) {
				console.log("[EVENT] on:afterinitializedefaultlayout");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			// layouting events
			
			testPanel.on("beforelayout", function(e) {
				console.log("[EVENT] on:beforelayout");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("afterlayout", function(e) {
				console.log("[EVENT] on:afterlayout");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			// layouting NAMED events
			
			testPanel.on("beforedefaultlayout", function(e) {
				console.log("[EVENT] on:beforedefaultlayout");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testPanel.on("afterdefaultlayout", function(e) {
				console.log("[EVENT] on:afterdefaultlayout");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});


			
			
			
			
			
			
			
			
			testPanel.is("initialized", function() {
				var self = this;
				setTimeout(function() {
					console.log("###");
					console.log("### MANUAL RENDERING");
					console.log("###");
					$.when(self.render("complete")).then(function() {
						console.log("END CUSTOM RENDER ACTION");
					});
				}, Test.options.timeout*3);
			});
			
			
			testPanel.is("layouted", function() {
				var self = this;
				setTimeout(function() {
					console.log("###");
					console.log("### DO SOME TRIGGERS");
					console.log("###");
					
					setTimeout(function() {
						self.resolve("modelready");
					}, Test.options.timeout);
					
					setTimeout(function() {
						self.resolve("collectionready");
					}, Test.options.timeout*4);
					
					setTimeout(function() {
						self.resolve("ready");
					}, Test.options.timeout*8);
					
				}, Test.options.timeout*3);
			});
						
			
		}
	});
	
	
	
	return Test;
	
});

