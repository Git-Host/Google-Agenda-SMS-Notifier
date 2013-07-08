/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 *
 *
 */


define(["jquery", "underscore"], function($, _) {
	
	var AppClass = function(options) {
		var self = this;
		
		// App Default Values
		this.options = _.extend({}, {
			"uidefaults" 	: {},					// apply defaults to jQueryMobile
			"uistartup"		: "ready",				// rules to starup jQueryMobile [init = as soon as loaded|ready = wait for App.initialize to solve|false = manual]
			"uieffect"		: "fade",				// [fade|show] configure how to display an hidden document body.
			"reseturl"		: false,				// prevent to reload internal pages
			"initialize" 	: this.initialize,
			"onReady" 		: this.onReady,
			"onError" 		: this.onError
		}, options||{});
		
		
		// Reset url's hash to prevent reloading of internal pages
		if (this.options.reseturl !== false) {
			if (this.options.reseturl == true) {
				window.location.hash = "";
			} else {
				window.location.hash = this.options.reseturl;
			}
		}
		
		
		// Apply jQueryMobile Configuration
		// and solve UI kit DeferredObject to run with initialization process
		var _uiready = $.Deferred();
		$(document).on('mobileinit', function() {
			
			_.extend($.mobile, {
				"autoInitializePage" 		: false,
				"defaultPageTransition" 	: "slide"
			}, self.options.uidefaults);
			
			if (self.options.uistartup === "init") self.initUi();
			_uiready.resolve();
		});
		
		
		// Resolve initialization DeferredObject and run post-initialization logics
		// "onReady, onError" callback should return DeferredObjects to posticipate
		// internal logic!
		this.ready = $.Deferred();
		$.when(
			this.options.initialize(),
			_uiready
		).then(
			function() {
				$.when(self.options.onReady.apply(self)).then(function() {
					self.initUi();
				}).always(function() {
					self.ready.resolveWith(self);
				});
			},
			function() {
				$.when(self.options.onError.apply(self)).always(function() {
					self.ready.rejectWith(self);
				});
			}
		);
		
	};
	
	
	
	
	
	/**
	 * Initialize jQueryMobile page.
	 * use <body style="display:none"> to hide content until UI is ready to load!
	 */
	AppClass.prototype.initUi = function() {
		var self = this;
		setTimeout(function() {
			if (self.options.uieffect == "fade") {
				$('body').fadeIn();
			} else {
				$('body').show();
			}
			$.mobile.initializePage();	
		}, 1);
	};
	
	
	
	/**
	 * Overriddable Callbacks
	 */
	AppClass.prototype.initialize 	= function() {};
	AppClass.prototype.onReady 		= function() {};
	AppClass.prototype.onError 		= function() {};

	
	return AppClass;
	
});