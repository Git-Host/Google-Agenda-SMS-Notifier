/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Build jQbrick Singleton Namespace
 * ---------------------------------
 * -J Q U E R Y   M O B I L E   U I-
 * ---------------------------------
 *
 * NOTE: Your "require.app" need to include "jqm" package and
 * configure "app/main" as dependencies for it using shim!
 * 
 */

define([
	"jquery",
	"./jQbrick",
	"./AppClass"
	
], function(
	$,
	jQbrick,
	AppClass
	
) {
	
	
	/**
	 * Custom AppClass
	 * implements jQueryMobile UI startup with options
	 */
	var JqmAppClass = AppClass.extend({
		
		defaults: function() {
			return $.extend({}, AppClass.prototype.defaults.apply(this), {
				jqmDefaults 	: {},					// apply defaults to jQueryMobile
				jqmStartup		: true					// rules to starup jQueryMobile [init = as soon as loaded|ready = wait for App.initialize to solve|false = manual]
			});
		},
		
		setupUi: function() {
			var self = this;
			var _dfd = $.Deferred();
			
			this.Deferred("jqmready");
			
			$(document).on('mobileinit', function() {
				_.extend($.mobile, {
					autoInitializePage 		: false,
					defaultPageTransition 	: "slide"
				}, self.options.jqmDefaults);
				
				switch (self.options.jqmStartup) {
					case false:
					case "false":
					case "off":
					case "no":
						break;
					case "initialized":
						self.is("initialized", _.bind(self.jqmInitializePage,self));
						break;
					case "ready":
						self.is("ready", _.bind(self.jqmInitializePage,self));
						break;
					default:
						self.jqmInitializePage();
						break;
				}
				
				$.when(self.call("setupUi")).always(_dfd.resolve);
			});
			
			return _dfd.promise();
		},
		
		jqmInitializePage: function() {
			var _dfd = $.Deferred();
			var self = this;
			
			setTimeout(function() {
				switch (self.options.bodyDisplay) {
					case "fade":
						$('body').fadeIn();
						break;
					case "block":
					default:
						$('body').show();
						break;	
				}
				
				$.mobile.initializePage();
				self.resolve("jqmready");
				
			}, 1);
			
			return _dfd.promise();
		}
	});
	
	
	
	
	/**
	 * AMD Output
	 * export an instance of jQbrick namespace so all features should be
	 * globally accessed and extended.
	 *
	 * If no global namespace conflicts exists it export jQbrick
	 * instance to the global namespace too.
	 */
	
	var _Singleton = new jQbrick({
		AppClass : JqmAppClass
	});
	
	if (!window.jQbrick) {
		window.jQbrick = _Singleton;
	}
	
	return _Singleton;
	
});