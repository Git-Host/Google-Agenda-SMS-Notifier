/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Appliction Entry Point
 *
 */


define([
	"jqbrick"
	
], function(
	jQbrick
	
) {
	
	
	jQbrick.App({
		name: "MyApp",
		displayBodyWith: "slideLeft",
		
		data: {
			steps: 0
		}
		
	}).onReady(function() {
		console.log("App is ready!");
		
		console.log(this.data.get("steps"));
		
		$home = MyApp.createPage({
			title: "Hello World!",
			content: 	"this is a <b>jQbrick</b> test.<br>" +
						"<a data-role=button>Click Me!</a>"
		});
		
		$home.find("a").click(function() {
			MyApp.createPage({
				title: "Detail Page",
				content: "this is a detail content",
				back: true
			});			
		});
		
		
	}).onError(function() {
		console.log("Initialization errors occours!");
		
	});
	
	
	
	/*
	jQbrick.App({
		jqmDefaults: {
			ajaxEnabled: true
		}
	});
	
	App.counters = {
		page1: 0,
		page2: 0
	};
	*/
	
	
	
	
	//console.log("--- INIT APP");
	
	/*
	jQbrick.App({
		//bodyDisplay: "none",
	}).onReady(function() {
		
		var self = this;
		
		var $btn = $('<a href="#" data-role="button">click</a>');
		
		var $p1 = this.createPage({
			show: 	false,
			title: 	"Page 1",
			content: $btn
		});
		
		$btn.click(function() {
			
			var $p2 = self.createPage({
				id: "aaa",
				title: "page2" + new Date().getTime(),
				back: true,
				destroy: false
			});
			
		});
		
		$p1.appendTo("body");
		this.jqmInitializePage();
		
	});
	*/
	
		
});