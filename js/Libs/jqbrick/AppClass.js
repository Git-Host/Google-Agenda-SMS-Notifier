/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 *
 *
 */


define([
	"jquery", "underscore", 
	"./mixin.Callback",
	"./mixin.Deferred"

], function(
	$, _, 
	CallbackMixin,
	DeferredMixin

) {
	
	
	var AppClass = function() {this.__construct__.apply(this,arguments)};
	
	_.extend(
		AppClass.prototype, 
		Backbone.Events, 
		CallbackMixin.prototype, 
		DeferredMixin.prototype
	);
	
	
	
	
	
	
	
	AppClass.prototype.__construct__ = function(options) {
		var self = this;
		
		// App Default Values
		this.options = _.extend({}, {
			jqmDefaults 	: {},					// apply defaults to jQueryMobile
			jqmStartup		: true,					// rules to starup jQueryMobile [init = as soon as loaded|ready = wait for App.initialize to solve|false = manual]
			bodyDisplay		: "fade",				// [fade|show] configure how to display an hidden document body.
			resetUrl		: false					// prevent to reload internal pages
		}, options||{});
		
		// Reset Url
		if (this.options.resetUrl !== false) this.resetUrl();
		
		// Deferred Checkpoints
		this.Deferred("initialized", "ready", "started");
		
		// -- setup step
		$.when(
			this.setup(),
			this.setupUi()
		).always(function() {
			
			self.resolve("initialized");
			
			// -- startup step
			$.when(
				self.startup(),
				self.startupUi()
			).then(
				function() {
					self.resolve("ready");
					self.call("ready");
				},
				function() {
					self.reject("ready");
					self.call("error");
				}
			).always(function() {
				self.resolve("started");
			});
			
		});

		
	};
	
	
	
	
	
	AppClass.prototype.setup = function() {
		return this.apply("setup");
	};
	
	AppClass.prototype.setupUi = function() {
		return this.apply("setupui");
	};
	
	AppClass.prototype.startup = function() {
		return this.apply("startup");
	};
	
	AppClass.prototype.startupUi = function() {
		var self = this;
		var _dfd = $.Deferred();
		
		setTimeout(function() {
			switch (self.options.bodyDisplay) {
				case "fade":
					$('body').fadeIn(_dfd.resolve);
					break;
				case "block":
				default:
					$('body').show(_dfd.resolve);
					break;	
			}
		}, 1);
		
		return _dfd.pipe(this.apply("startupui"));
	};
	
	
	
	
	
	
	AppClass.prototype.resetUrl = function() {		
		var _before = window.location.hash;
		if (this.options.resetUrl == true) {
			window.location.hash = "";
		} else {
			window.location.hash = this.options.reseturl;
		}
		this.call("resetUrl", _before, window.location.hash);
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	return AppClass;
	
});