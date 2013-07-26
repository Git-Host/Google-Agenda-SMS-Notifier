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
				html: 		'TestComponent<hr>',
				
				style: 		"border:4px solid red",
				innerStyle: "border:4px solid yellow",
				
				
				
				
				
				/**
				 * Initialize some items to be created during
				 * Component initialization process
				 *
				 * Each component should expose it's callbacks!
				 */
				
				items: [{
					id:		"item-01",
					html: 	"Item 01"
				},{
					id: 	"item-02",
					html: 	"Item 02",
					items: [{
						id:		"subItem-02-01",
						html:	"SubItem 02-01"
					},{
						id:		"subItem-02-02",
						html:	"SubItem 02-02"
					}],
					itemDefaults: {
						xtype: 'view',
						css: {marginLeft:10,fontSize:'9pt'}
					},
					onBeforeRemove: function() {
						var _dfd = $.Deferred();
						this.$el.slideUp(2000, _dfd.resolve);
						return _dfd.promise();
					},
					onAfterAppend: function() {
						var _dfd = $.Deferred();
						this.$el.slideDown(2000, _dfd.resolve);
						return _dfd.promise();
					}
				}],
				
				itemDefaults: {
					style: "margin-left:10px;border: 2px solid blue"
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
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onBeforeItems: function() {
					console.log('[CALLBACK] onBeforeItems');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				onAfterItems: function() {
					console.log('[CALLBACK] onAfterItems');
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
				
				onRenderComplete: function() {
					console.log('[CALLBACK] onRenderComplete');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
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
			 * Component Events (blocking)
			 * events who are involved in initialization or rendering process can block
			 * that process using "e.block()" and "e.unblock()" apis
			 */
			
			testComponent.on("setup", function(e) {
				console.log("[EVENT] on:setup");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testComponent.on("beforeitems", function(e) {
				console.log("[EVENT] on:beforeitems");
				console.log(e);
				e.block();setTimeout(e.unblock, Test.options.timeout);
			});
			
			testComponent.on("afteritems", function(e) {
				console.log("[EVENT] on:afteritems");
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
			
			
			
			
			
			
			
			
			
			
			
			/**
			 * Component Events (non blocking)
			 * these events are not involved in any process to they can't be
			 * considered as blocking events!
			 */
			
			testComponent.on("rendercomplete", function(e) {
				console.log("[EVENT] on:rendercomplete");
				console.log(e);
			});
			
			testComponent.on("ready", function(e) {
				console.log("[EVENT] on:ready");
				console.log(e);
			});
			
			testComponent.on("modelready", function(e) {
				console.log("[EVENT] on:modelready");
				console.log(e);
			});
			
			testComponent.on("collectionready", function(e) {
				console.log("[EVENT] on:collectionready");
				console.log(e);
			});
			
			
			
			
			
			
			
			
			
			
			
			/**
			 * Component CheckPoints
			 */
			
			$.when(testComponent.getDeferred('initialized')).then(
				function() {console.log("[Deferred] initialized - done")},
				function() {console.log("[Deferred] initialized - fail")},
				function() {console.log("[Deferred] initialized - progress")}
			).always(
				function() {console.log("[Deferred] initialized - complete")}
			);
			
			$.when(testComponent.getDeferred('rendered')).then(
				function() {console.log("[Deferred] rendered - done")},
				function() {console.log("[Deferred] rendered - fail")},
				function() {console.log("[Deferred] rendered - progress")}
			).always(
				function() {console.log("[Deferred] rendered - complete")}
			);
			
			$.when(testComponent.getDeferred('ready')).then(
				function() {console.log("[Deferred] ready - done")},
				function() {console.log("[Deferred] ready - fail")},
				function() {console.log("[Deferred] ready - progress")}
			).always(
				function() {console.log("[Deferred] ready - complete")}
			);
			
			$.when(testComponent.getDeferred('modelready')).then(
				function() {console.log("[Deferred] modelready - done")},
				function() {console.log("[Deferred] modelready - fail")},
				function() {console.log("[Deferred] modelready - progress")}
			).always(
				function() {console.log("[Deferred] modelready - complete")}
			);
			
			$.when(testComponent.getDeferred('collectionready')).then(
				function() {console.log("[Deferred] collectionready - done")},
				function() {console.log("[Deferred] collectionready - fail")},
				function() {console.log("[Deferred] collectionready - progress")}
			).always(
				function() {console.log("[Deferred] collectionready - complete")}
			);
			
			
			
			
			
			
			
			
			
			
			
			
			/**
			 * Checkpoint's Callbacks
			 */
			
			testComponent.on("initializedcheckpoint", function(e) {
				console.log("[checkpointEvent] on:initializedcheckpoint");
				console.log(e);
			});
			
			testComponent.on("renderedcheckpoint", function(e) {
				console.log("[checkpointEvent] on:renderedcheckpoint");
				console.log(e);
			});
			
			testComponent.on("readycheckpoint", function(e) {
				console.log("[checkpointEvent] on:readycheckpoint");
				console.log(e);
			});
			
			testComponent.on("modelreadycheckpoint", function(e) {
				console.log("[checkpointEvent] on:modelreadycheckpoint");
				console.log(e);
			});
			
			testComponent.on("collectionreadycheckpoint", function(e) {
				console.log("[checkpointEvent] on:collectionreadycheckpoint");
				console.log(e);
			});
			
			
			
			
			
			
			
			
			/**
			 * Simulation of out-of-process checkpoints resolution
			 */
			
			testComponent.on("rendercomplete", function() {
				
				console.log("###");
				console.log("### READY RESOLUTION SIMULATION");
				console.log("###");
				
				setTimeout(function() {
					testComponent.resolve("modelready");
				}, Test.options.timeout);
				
				setTimeout(function() {
					testComponent.resolve("collectionready");
				}, Test.options.timeout*4);
				
				setTimeout(function() {
					testComponent.resolve("ready");
				}, Test.options.timeout*8);
				
			});
			
			
			
			
			
			
			
			
			
			
			
			/**
			 * Simulation of altering Items structure
			 */
			
			testComponent.on("ready", function() {
				
				console.log("###");
				console.log("### PLAY WITH ITEMS");
				console.log("###");
				
				console.log("-- Instance.itemAt(0):");
				console.log(testComponent.itemAt(0));
				console.log("-- Instance.itemAt(1):");
				console.log(testComponent.itemAt(1));
				console.log("-- Instance.itemAt(5) -- expected \"-1\" --:");
				console.log(testComponent.itemAt(5));
				
				var __add 		= $.Deferred();
				var __toggle 	= $.Deferred();
				
				// Run add new item
				console.log("-- Add new item:");
				$.when(testComponent.addItem({
					getDeferred: 	true,
					html: 			'New Item',
					onInit: 		function() {
						var _dfd = $.Deferred();
						this.$el.hide().fadeIn(2000, _dfd.resolve);
						return _dfd.promise();
					}
				})).then(function() {
					console.log("-- new item added");
					__add.resolve()
				});
				
				
				// Run toggle
				$.when(__add).then(function(){
					console.log("-- Toggle item 2:");
					$.when(testComponent.toggleItem('item-02', true)).then(function() {
						console.log("-- Toggle Back:");
						$.when(testComponent.toggleItem('item-02', true)).then(function() {
							console.log("-- Toggle Complete");
							__toggle.resolve();
						});
					});
				});
				
				
			});
			
		}
	});
	
	
	
	return Test;
	
});

