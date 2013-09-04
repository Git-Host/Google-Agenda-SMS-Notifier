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
	"../core/jqbrick",
	"../core/AppClass"

], function(
	$,
	jQbrick,
	AppClass
	
) {

		
	
	
	
	
	
	/**
	 * Dynamic Page Object
	 * this is a very simple way to create a JQM page on the fly
	 * and inject it into the DOM.
	 */
	AppClass.prototype.createPage = function(config) {
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
				if (self.jqmUiReadyPromise.state() == "resolved") {
					$.mobile.changePage($page);
				} else {
					self.jqmInitializePage();
				}
			}, 0);
		}
		
		return $page;
		
	}; // -- createPage()
	
	
	
	
});
