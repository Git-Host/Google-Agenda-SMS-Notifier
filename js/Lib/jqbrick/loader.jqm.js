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
	"./core/AppClass"

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
			
		mobileInitPromise.done(function() {
			
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
		
		mobileReadyPromise.done(function() {
			$.mobile.initializePage();
			self.displayBody().done(_dfd.resolve);
		});
		
		return _dfd.promise();
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Dynamic Page Object
	 * this is a very simple way to create a JQM page on the fly
	 * and inject it into the DOM.
	 */
	JqmAppClass.prototype.createPage = function(config) {
		var self = this;
		
		
		config = _.extend({
			id			: "page-" + new Date().getTime(),
			url			: null,
			title		: "",
			content		: "",
			
			// [boolean|(string text value)]
			back		: false,
			
			theme		: "d",
			headerTheme	: "b",
			
			// inject page into the DOM and display it
			show		: true,
			
			// boolean, unload DOM on page hide event
			selfDestroy	: null
		}, config || {});
		
		
		
		/**
		 * Collect internal promises to allow code flowing around
		 * page state changes.
		 */
		var readyDeferred = $.Deferred();
		var initDeferred = $.Deferred();
		
		
		
		
		/**
		 * Fetch an already existing DOM node and update it's properties
		 * if it was a created page then should be possible to update some contents
		 */
		if ($('#' + config.id).length) {
			$page = $('#' + config.id).first();
			
			// restore a full detailed object
			if ($page.data("jqbrick-jqmSimplePage")) {
				$page = $page.data("jqbrick-jqmSimplePage");
				
				// update page's title
				if ($page.config.title != config.title) {
					$page.$title.html(config.title);
				}
				
			}
			
			// if DOM already exists page must be already initialized!
			initDeferred.resolve();
		
		/**
		 * Build a new DOM object
		 * (this should be preferred way...)
		 */	
		} else {
		
			var $page = $('<div>')
				.attr("data-role", "page")
				.attr("id", config.id)
				.attr("data-url", config.url || config.id)
				.attr("data-theme", config.theme)
				;
			
			// header & title
			if (config.title !== false) {
				$page.$header = $('<div>')
					.attr("data-role", "header")
					.attr("data-theme", config.headerTheme)
					.appendTo($page)
					;
				$page.$title = $('<h1>')
					.append(config.title)
					.appendTo($page.$header)
					;
			}
			
			// back button
			if (config.back && config.title !== false) {
				if (!_.isString(config.back)) {
					config.back = "Back";
				};
				// destroy=true is a default value when back button required!
				if (config.selfDestroy == null) {
					config.selfDestroy = true;
				};
				$page.$backBtn = $('<a>')
					.attr("data-rel", "back")
					.attr("data-direction", "reverse")
					.attr("data-icon", "arrow-l")
					.prependTo($page.$header)
					.append(config.back.toString())
					;
			}
			
			$page.$content = $('<div>')
				.attr("data-role", "content")
				.appendTo($page)
				.append(config.content)
				;
						
			$page.on("pageinit", initDeferred.resolve);
		};
		
		
		$page.config = config;
		$page.data("jqbrick-jqmSimplePage", $page);
		
		$page.on("pageshow", readyDeferred.resolve);
		$page.initPromise = initDeferred.promise();
		$page.readyPromise = readyDeferred.promise();
		
		
		/**
		 * Handle the request to automagically unload DOM and memory as
		 * soon as page hides.
		 *
		 * I use "setTimeout" to shift this behavior after the end
		 * of the method in the evt queque so it may be possible to
		 * inject other logic from code outside.
		 *
		 * Example to prevent destroy from outside:
		 *   var $p = App.createPage({selfDestroy:true});
		 *   $p.on("pagehide", function() {
		 *     $p.config.selfDestroy = false;
		 *   });
		 *
		 */
		
		var __selfDestroy = function() {
			if ($page.config.selfDestroy) {
				$page.remove();
				$page = null;
			}
		};
		
		setTimeout(function() {
			$page
			.off("pagehide", __selfDestroy)
			.on("pagehide", __selfDestroy)
			;
		}, 0);
		
		
		/**
		 * Inject page into DOM and initialize it
		 */
		if (config.show) {
			$('body').append($page);
			setTimeout(function() {
				if (mobileReadyPromise.state() == "resolved") {
					$.mobile.changePage($page);
				} else {
					self.jqmInitializePage();
				}
			}, 0);
		}
		
		return $page;
		
	}; // -- createPage()
	
	
	
	
	
	
	
	
	
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
