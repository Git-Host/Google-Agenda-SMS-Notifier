/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Appliction Entry Point
 *
 */


define([
	"jqbrick",
	"async",
	"sqlite"
	
], function(
	jQbrick,
	Async,
	SQLite
	
) {
	
	jQbrick.App({
		name: "MyApp",
		displayBodyWith: "slideLeft",
		
		data: {
			steps: 0
		}
		
	}).onReady(function() {
		//console.log("App is ready!");
		
		//console.log(this.data.get("steps"));
		
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
	
	
	
	var db = new SQLite({
		name: "mona"
		
	}).onReady(function() {
		
		this.query("CREATE TABLE IF NOT EXISTS colors (color VARCHAR(20))", function() {
			this.log("Table \"colors\" ok");
		});
		
		this.many([
			"INSERT INTO colors (color) VALUES ('blue')",
			"INSERT INTO colors (color) VALUES ('black')",
			"INSERT INTO colors (color) VALUES ('yellow')"
		]).always(function() {
			console.log("many queries always");
			console.log(arguments);
		});
		
			
	});
	
	
	
	/*
	Async.series([
		function(callback) {
			return callback(new Error("Task1 cancelled"));
			console.log("Task1 Start");
			setTimeout(function() {
				console.log("Task1 End");
				callback();
			}, 2000);
		},
		function(callback) {
			console.log("Task2 Start");
			setTimeout(function() {
				console.log("Task2 End");
				callback();
			}, 1000);
		}
	], function(err) {
		if (err) {
			console.log("Error Happens");
			console.log(err);
		} else {
			console.log("Done");
		}
	});
	*/
	
			
});