/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * AppClass
 *
 * This module is responsible of creating a global scoped namespace
 * to handle all Application informations.
 * 
 * 
 *
 * ## Initialization Process
 * 
 * all methods involved in initialization process should return a
 * DeferredPromise to fulfill initialization flow:
 * 
 * - compose default values
 * - build instance options
 * - setup
 * - startup
 * - >> running application
 * 
 * 
 * 
 *
 */

define([
	"jquery", "underscore", "backbone",
	"./utils",
	
	"plugin/jquery.easing"

], function(
	$, _, Backbone,
	Utils

) {
	
	
	var AppClass_Defaults = {
		name			: "App",
		version			: "0.0.0",
		
		/**
		 * configure how to display an hidden document body.
		 *[none|fade|slide,slideUp|slideDown|slideLeft|slideRight]
		 */
		displayBodyWith	: "slide",
		
		/**
		 * Collect a list of application public properties to be
		 * attached to the application instance at initialization time
		 */
		props			: {},
		
		/**
		 * collect default values for an "application.data" model
		 * each data property will be observable as a Backbone.Model property!
		 */
		data			: {},
		dataHandlers	: {}
		
	};
	
	
	
		
	var AppClass = function() {
		this.__construct__.apply(this, arguments);
	};
	
	// Inherith extend capability from Backbone.extend() utility
	AppClass.extend = Backbone.View.extend;
	
	// Append functionalities
	_.extend(
		AppClass.prototype, 
		Backbone.Events
	);
	
	
	
	
	
	
	
	
	
	
	AppClass.prototype.__construct__ = function(options) {
		var self = this;
		
		var initDeferred 	= $.Deferred();
		self.initPromise	= initDeferred.promise();
		
		var readyDeferred 	= $.Deferred();
		self.readyPromise	= readyDeferred.promise();
		
		$.when(
			this.defaults()
		
		// -- setup
		).then(
			function(defaults) {
				self.initialize(options, defaults);
				return $.when(
					self.setup.call(self),
					self.setupUi.call(self)
				);
			}
		
		// -- startup
		).then(
			function() {
				initDeferred.resolve.call(self, self);
				return $.when(
					self.startup.call(self),
					self.startupUi.call(self)
				);
			
			
			}, 
			function() {
				initDeferred.reject.call(self, self);
			}
		
		// -- end initialization process	
		).then(
			function() {
				readyDeferred.resolve.call(self, self);
				}, 
			function() {
				readyDeferred.reject.call(self, self);
			}
		);
		
	};
	
	
	/**
	 * Synchronous method to mix up options with computed default values
	 */
	AppClass.prototype.initialize = function(options, defaults) {
		
		// apply configuration options
		// you can override initialization process methods with options!
		this.options = _.extend({}, defaults, options);
		
		// export main application informations to the instance's root level
		this.name 		= this.options.name;
		this.version 	= this.options.version;
		
		// build the observable data model
		this.data		= new Backbone.Model(this.options.data);
		
		// bind data handlers to data change events
		// @TODO: handle a string as handler so it need to be searched inside options and instance
		for (key in this.options.dataHandlers) {
			if (key == "_all_") {
				this.data.on("change", this.options.dataHandlers[key], this);
			} else {
				this.data.on("change:" + key, this.options.dataHandlers[key], this);	
			}
		};
		
		// permit some configuration methods to override instance's ones
		if (this.options.displayBody) this.displayBody = _.bind(this.options.displayBody, this);
		
		// export startup properties to the root level of application instance
		// >> safe filter known properties from override important things!
		for (key in this.options.props) {
			if (["options", "name", "version", "data", "displayBody"].indexOf(key) == -1) {
				this[key] = this.options.props[key];
			}
		};

	};
	
	
	
	
	
	
	
	
	
// -------------------------------- //
// ---[[   D E F A U L T S   ]] --- //	
// -------------------------------- //
	
	AppClass.prototype.defaults = function() {
		return AppClass_Defaults;
	};
	
	
// ------------------------- //	
// ---[[   S E T U P   ]]--- //	
// ------------------------- //
	
	AppClass.prototype.setup = function() {};
	
	AppClass.prototype.setupUi = function() {};
	
	
// ----------------------------- //	
// ---[[   S T A R T U P   ]]--- //	
// ----------------------------- //
	
	AppClass.prototype.startup = function() {};
	
	AppClass.prototype.startupUi = function() {};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Smooth Body Display utility
	 * it remove loading overlay with an effect if present on the page
	 */
	AppClass.prototype.displayBody = function() {
		var self = this;
		var _dfd = $.Deferred();
		
		setTimeout(function() {
			
			var $overlay 		= null,
				animateRules 	= null,
				animateDone		= true;
			
			if (!self.options.displayBodyWith) {
				self.options.displayBodyWith = "none";
			}
			
			if (self.options.displayBodyWith !== false) {
				
				$overlay = $(".jqbrick-loadingOverlay");
				
				// fix overlay height in iphone browser with hidden url bar
				// !!! here happen a flikering !!!
				if ($overlay.length && ("standalone" in window.navigator) && !window.navigator.standalone) {
					$overlay.css("height", $(window).height() + 60);
				}
				
			};
			
			switch (self.options.displayBodyWith) {
				case "fade":
					animateRules = {
						display: "none"
					};
					isDone = $overlay.fadeOut();
					break;
				case "slideLeft":
					animateRules = {
						left: 0 - $overlay.width()
					};
					break;
				case "slideRight":
					animateRules = {
						left: $overlay.width()
					};
					break;
				case "slide":
				case "slideUp":
					animateRules = {
						top: 0 - $overlay.height()
					};
					break;
				case "slideDown":
					animateRules = {
						top: $overlay.height()
					};
					break;
			};
			
			if (animateRules != null && $overlay.length) {
				animateDone = $overlay.animate(animateRules, 350, "easeInExpo").promise().done(animateDone.resolve);
			};
			
			$.when(animateDone).then(function() {
				if ($overlay) $overlay.remove();
				_dfd.resolve();
			});
			
		},0);
		
		$('html').removeClass("jqbrick-startingApp");
		return _dfd.promise();
		
	};
	
	
	
	
	
	
	/**
	 * Quick callbacks APIs
	 */
	 
	AppClass.prototype.onReady = function(callback) {
		this.readyPromise.done(callback);
		return this;
	};
	AppClass.prototype.onError = function(callback) {
		this.initPromise.fail(callback);
		this.readyPromise.fail(callback);
		return this;
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	return AppClass;
	
});
