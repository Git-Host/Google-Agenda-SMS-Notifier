/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * jQueryMobile Application Package
 *
 */


define([
	"jquery",
	"./core/jqbrick",
	"./core/AppClass",
	
	"./jqm-helpers/createPage"

], function(
	$,
	jQbrick,
	AppClass
	
) {

	
	var mobileInitDeferred = $.Deferred();
	var mobileInitPromise = mobileInitDeferred.promise();
	
	var mobileReadyDeferred = $.Deferred();
	var mobileReadyPromise = mobileReadyDeferred.promise();
	
	$(document).on('mobileinit', function() {
		mobileInitDeferred.resolve();
		setTimeout(mobileReadyDeferred.resolve, 0);
	});
	
	
	
	
	/** 
	 * This is a specialized version of the AppClass who is able to handle
	 * options for JQM configuration and startup mode.
	 */
	
	var JqmAppClass = AppClass.extend({
		
		defaults: function() {
			return $.extend({}, AppClass.prototype.defaults.apply(this), {
				jqmDefaults 	: {},					// apply defaults to jQueryMobile
				jqmStartup		: true					// rules to starup jQueryMobile [init = as soon as loaded|ready = wait for App.initialize to solve|false = manual]
			});
		},
		
		setupUi: function() {
			
			// store initialization cycle promises inside AppClass instance
			// these promises are used by helper functions too!
			this.jqmUiInitPromise 	= mobileInitPromise;
			this.jqmUiReadyPromise 	= mobileReadyPromise;
			
			// run main initialization
			this.jqmSetupUi();
		}
		
	}); // -- JqmAppClass
	
	
	/**
	 * Detect JQM hook to apply configuration and then run JQM UI tasks
	 * according to given options
	 */
	JqmAppClass.prototype.jqmSetupUi = function() {
		var self = this;
		
		// an empty BODY force a manual startup of jQueryMobile!
		if (!$("body div[data-role=page]").length) {
			self.options.jqmStartup = false;
		}
			
		this.jqmUiInitPromise.done(function() {
			
			_.extend($.mobile, {
				autoInitializePage 		: false,
				
				// allow old android device to run as default behavior for the framework
				gradeA					: function() {return true},
				
				// default is "slide" but fallback to "none" on android stock webkit browsers
				defaultPageTransition 	: 	(function() {	return navigator.userAgent.toLowerCase().indexOf("android") > -1 && navigator.userAgent.toLowerCase().indexOf("chrom") == -1 ? "none" : "slide"	})(),
				
				ajaxEnabled				: false,
				//pushStateEnabled		: false,
				//touchOverflowEnabled	: true,
				//dynamicBaseEnabled		: false,
				
			}, self.options.jqmDefaults);
			
			switch (self.options.jqmStartup) {
				case true:
				case "true":
				case "on":
					self.jqmInitializePage();
					break;
				case "initialized":
				case "init":
					self.initPromise.done(self.jqmInitializePage);
					break;
				case "ready":
					self.readyPromise.done(self.jqmInitializePage);
					break;
			}
		});
	};
	
	
	/**
	 * display BODY and run JQM page initialization tasks
	 * (need to be sure JQM is available at all)
	 */
	JqmAppClass.prototype.jqmInitializePage = function() {
		var self = this;
		var _dfd = $.Deferred();
		
		this.jqmUiReadyPromise.done(function() {
			$.mobile.initializePage();
			self.displayBody().done(_dfd.resolve);
		});
		
		return _dfd.promise();
	};
	
	
	
	
	
	
	
	
	
	/**
	 * AMD Output
	 * export an instance of jQbrick namespace with customized AppClass object
	 * to be able to handle JQM initialization within your app!
	 */
	
	var config = {
		build: "jQueryMobile",
		core: {
			"AppClass" : JqmAppClass
		}
	};
	
	if (!window.jQbrick) {
		window.jQbrick = new jQbrick(config);
	}
	
	return window.jQbrick;
	
});
