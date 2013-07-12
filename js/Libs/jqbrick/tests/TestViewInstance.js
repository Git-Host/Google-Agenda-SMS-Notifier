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
		timeout: 2500,
		run: function() {
			var Test = this;
			
			var testView = new jQbrickView({
				container: 	this.options.viewport,
				html: 		'TestView',
				autoRender: true,
				
				
				
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
				
				onRenderComplete: function() {
					console.log('[CALLBACK] onRenderComplete');
					var _dfd = $.Deferred();
					setTimeout(_dfd.resolve, Test.options.timeout);
					return _dfd;
				},
				
				
				
				
				
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
				
				
				
				
				checkpoints: {
					"initialized" 		: "InitializedCheckpoint",
					"rendered"			: "RenderedCheckpoint",
					"ready"				: "ReadyCheckpoint",
					"modelready"		: "ModelReady",
					"collectionready"	: "CollectionReady"
				},
				
				InitializedCheckpoint: function() {
					console.log('[CHECKPOINT] initialized');
				},
				
				RenderedCheckpoint: function() {
					console.log('[CHECKPOINT] rendered');
				},
				
				ReadyCheckpoint: function() {
					console.log('[CHECKPOINT] ready');
				},
				
				ModelReady: function() {
					console.log('[CHECKPOINT] modelready');
				},
				
				CollectionReady: function() {
					console.log('[CHECKPOINT] collectionready');
				}
			});
			
			
			
			/**
			 * View Events
			 */
			
			testView.on("setup", function() {
				console.log("[EVENT] on:setup");
			});
			
			testView.on("init", function() {
				console.log("[EVENT] on:init");
			});
			
			testView.on("beforerender", function() {
				console.log("[EVENT] on:beforerender");
			});
			
			testView.on("afterrender", function() {
				console.log("[EVENT] on:afterrender");
			});
			
			testView.on("rendercomplete", function() {
				console.log("[EVENT] on:rendercomplete");
			});
			
			testView.on("ready", function() {
				console.log("[EVENT] on:ready");
			});
			
			testView.on("modelready", function() {
				console.log("[EVENT] on:modelready");
			});
			
			testView.on("collectionready", function() {
				console.log("[EVENT] on:collectionready");
			});
			
			
			
			
			/**
			 * View CheckPoints
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
			
			testView.on("initializedcheckpoint", function() {
				console.log("[checkpointEvent] on:initializedcheckpoint");
			});
			
			testView.on("renderedcheckpoint", function() {
				console.log("[checkpointEvent] on:renderedcheckpoint");
			});
			
			testView.on("readycheckpoint", function() {
				console.log("[checkpointEvent] on:readycheckpoint");
			});
			
			
			
			
			
			
			testView.on("rendercomplete", function() {
				
				console.log("=========== READY RESOLUTION SIMULATION =============");
				
				setTimeout(function() {
					testView.resolve("modelready");
				}, Test.options.timeout);
				
				setTimeout(function() {
					testView.resolve("collectionready");
				}, Test.options.timeout*2);
				
				setTimeout(function() {
					testView.setReady();
				}, Test.options.timeout*4);
				
				
			});
			
			
		}
	});
	
	
	
	return Test;
	
});

