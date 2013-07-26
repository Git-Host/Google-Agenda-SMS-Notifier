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
	"jqbrick/TestClass"
], function(
	jQbrickView,
	TestClass
) {
	
	var Test = TestClass.extend({
		run: function() {
			var Test = this;
			
			var testView = new jQbrickView({
				//autoRender: true,
				container: 	this.options.viewport,
				html: 		'TestView',
				
				
				
				
				
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
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onInit: function() {
					console.log('[CALLBACK] onInit');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onBeforeRender: function() {
					console.log('[CALLBACK] onBeforeRender');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onAfterRender: function() {
					console.log('[CALLBACK] onAfterRender');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onBeforeRemove: function () {
					console.log('[CALLBACK] onBeforeRemove');
					var _dfd = $.Deferred();
					this.$el.fadeOut(2000, _dfd.resolve);
					return _dfd;
				},
				
				onAfterRemove: function () {
					console.log('[CALLBACK] onAfterRemove');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onBeforeAppend: function () {
					console.log('[CALLBACK] onBeforeAppend');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onAfterAppend: function () {
					console.log('[CALLBACK] onAfterAppend');
					var _dfd = $.Deferred();
					this.$el.fadeIn(2000, _dfd.resolve);
					return _dfd;
				},
				
				
				
				/**
				 * Non blocking callback
				 */
				
				onRenderComplete: function() {
					console.log('[CALLBACK] onRenderComplete');
				},
				
				
				
				
				/**
				 * CheckPoints Related Callbacks (non blocking)
				 * these callbacks are invoked only when name-related checkpoints resolve with success.
				 *
				 * these are non blocking callbacks because they are outside initialization
				 * or rendering process.
				 *
				 * these callbacks are invoked after Checkpoint's callbacks and events!
				 */
				
				onReady: function() {
					console.log('[CALLBACK] onReady');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onModelReady: function() {
					console.log('[CALLBACK] onModelReady');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onCollectionReady: function() {
					console.log('[CALLBACK] onCollectionReady');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
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
			 * View Events (blocking)
			 * events who are involved in initialization or rendering process can block
			 * that process using "e.block()" and "e.unblock()" apis
			 */
			
			testView.on("setup", function(e) {
				console.log("[EVENT] on:setup");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testView.on("init", function(e) {
				console.log("[EVENT] on:init");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testView.on("beforerender", function(e) {
				console.log("[EVENT] on:beforerender");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			
			/**
			 * Non Blocking Events
			 */
			testView.on("afterrender", function(e) {
				console.log("[EVENT] on:afterrender");
				console.log(e);
			});
			
			
			
			
			
			
			
			/**
			 * View Events (non blocking)
			 * these events are not involved in any process to they can't be
			 * considered as blocking events!
			 */
			
			testView.on("rendercomplete", function(e) {
				console.log("[EVENT] on:rendercomplete");
				console.log(e);
			});
			
			testView.on("ready", function(e) {
				console.log("[EVENT] on:ready");
				console.log(e);
			});
			
			testView.on("modelready", function(e) {
				console.log("[EVENT] on:modelready");
				console.log(e);
			});
			
			testView.on("collectionready", function(e) {
				console.log("[EVENT] on:collectionready");
				console.log(e);
			});
			
			
			
			
			/**
			 * View CheckPoints events
			 */
			
			$.when(testView.getDeferred('initialized')).then(
				function() {console.log("[Deferred] initialized - done")},
				function() {console.log("[Deferred] initialized - fail")},
				function() {console.log("[Deferred] initialized - progress")}
			).always(
				function() {console.log("[Deferred] initialized - complete")}
			);
			
			$.when(testView.getDeferred('rendered')).then(
				function() {console.log("[Deferred] rendered - done")},
				function() {console.log("[Deferred] rendered - fail")},
				function() {console.log("[Deferred] rendered - progress")}
			).always(
				function() {console.log("[Deferred] rendered - complete")}
			);
			
			$.when(testView.getDeferred('ready')).then(
				function() {console.log("[Deferred] ready - done")},
				function() {console.log("[Deferred] ready - fail")},
				function() {console.log("[Deferred] ready - progress")}
			).always(
				function() {console.log("[Deferred] ready - complete")}
			);
			
			$.when(testView.getDeferred('modelready')).then(
				function() {console.log("[Deferred] modelready - done")},
				function() {console.log("[Deferred] modelready - fail")},
				function() {console.log("[Deferred] modelready - progress")}
			).always(
				function() {console.log("[Deferred] modelready - complete")}
			);
			
			$.when(testView.getDeferred('collectionready')).then(
				function() {console.log("[Deferred] collectionready - done")},
				function() {console.log("[Deferred] collectionready - fail")},
				function() {console.log("[Deferred] collectionready - progress")}
			).always(
				function() {console.log("[Deferred] collectionready - complete")}
			);
			
			
			
			
			
			/**
			 * Checkpoint's Callbacks
			 */
			
			testView.on("initializedcheckpoint", function(e) {
				console.log("[checkpointEvent] on:initializedcheckpoint");
				console.log(e);
			});
			
			testView.on("renderedcheckpoint", function(e) {
				console.log("[checkpointEvent] on:renderedcheckpoint");
				console.log(e);
			});
			
			testView.on("readycheckpoint", function(e) {
				console.log("[checkpointEvent] on:readycheckpoint");
				console.log(e);
			});
			
			testView.on("modelreadycheckpoint", function(e) {
				console.log("[checkpointEvent] on:modelreadycheckpoint");
				console.log(e);
			});
			
			testView.on("collectionreadycheckpoint", function(e) {
				console.log("[checkpointEvent] on:collectionreadycheckpoint");
				console.log(e);
			});
			
			
			
			
			
			
			
			/**
			 * Manual rendering to test direct callback and renderComplete deferred
			 */
			testView.on("initializedcheckpoint", function() {
				console.log("========= THROW MANUAL RENDERING PROCESS ============");
				this.render(function() {
					console.log("-------> RENDER COMPLETE (from direct callback)");
				});
				this.renderComplete.done(function() {
					console.log("-------> RENDER COMPLETE (from deferred)");
				});
			});
			
			
			
			
			
			
			/**
			 * Simulation of out-of-process checkpoints resolution
			 */
			testView.on("renderedcheckpoint", function() {
				
				console.log("=========== READY RESOLUTION SIMULATION =============");
				
				setTimeout(function() {
					testView.resolve("modelready");
				}, Test.options.timeout);
				
				setTimeout(function() {
					testView.resolve("collectionready");
				}, Test.options.timeout*4);
				
				setTimeout(function() {
					testView.resolve("ready");
				}, Test.options.timeout*8);
				
			});
			
			
			testView.on("readycheckpoint", function() {
				var self = this;
				setTimeout(function() {
					console.log("============= READY CHECKPOINT =============");
					
					console.log("--- remove():");
					$.when(self.remove(true)).then(function() {
						console.log("--- append():");
						$.when(self.append(true)).then(function() {
							console.log(">>>>>>>>>>>>>>>>>>> TEST END !!!");
						});
					});
					
					
				}, Test.options.timeout);
			});
			
			
		}
	});
	
	
	
	return Test;
	
});

