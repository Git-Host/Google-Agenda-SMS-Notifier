/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Application Entry Point
 *
 */

define(["jqbrick/amd.jqm"], function(jQbrick) {
	
	window.App = new jQbrick.AppClass({
		
		resetUrl: true,
		
		/*
		reseturl: true,
		uidefaults: {
			"defaultPageTransition" : "slide"
		},
		uistartup: "init",
		initialize: function() {
			var _dfd = $.Deferred();
			
			setTimeout(_dfd.resolve, 1);
			
			return _dfd;
		},
		onReady: function() {
			//console.log("App Ready");
			//this.initUi();
			
		}
		*/
		
		/*
		onSetup: function() {
			var _dfd = $.Deferred();
			setTimeout(_dfd.resolve, 2000);
			return _dfd.promise();
		},
		
		onStartup: function() {
			var _dfd = $.Deferred();
			setTimeout(_dfd.resolve, 2000);
			return _dfd.promise();
		},
		*/
		
		onReady: function() {
			console.log("OK");
		},
		
		onError: function() {
			console.log("KO");
		}
		
	});
	
	
	App.is("jqmready", function() {
		console.log("OK JQM");
	});
	
	
	$(document).delegate('#home', 'pagecreate', function() {
		
		var test1 = new jQbrick.Component({
			$container: $(this).find('[data-role="content"]'),
			html: "mona",
			autoRender: true
		});		
		
	});
	
});

