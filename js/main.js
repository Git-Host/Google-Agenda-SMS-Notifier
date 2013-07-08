/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Application Entry Point
 *
 */

define(["jqbrick/amd"], function(jQbrick) {
	
	
	window.App = new jQbrick.AppClass({
		reseturl: true,
		uidefaults: {
			"defaultPageTransition" : "slide"
		},
		initialize: function() {
			var _dfd = $.Deferred();
			
			setTimeout(_dfd.resolve, 1);
			
			return _dfd;
		},
		onReady: function() {
			console.log("App Ready");
			//this.initUi();
			
		}
	});
	
	
	$(document).delegate('#home', 'pagecreate', function() {
		console.log("pagecreated");
		
		var brick = new jQbrick.View({
			html: 'test',
			css: {
				background:'yellow'
			},
			style:'color:blue'
		}).renderTo($('#foo'));
		
		//$('#foo');
	});
	
});

