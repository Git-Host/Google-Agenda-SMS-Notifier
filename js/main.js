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
		
		resetUrl: true
		
	});
	
	
	
	$(document).delegate('#home', 'pageshow', function() {
		
		/*
		var test1 = new jQbrick.Component({
			$container: $(this).find('[data-role="content"]'),
			html: "mona",
			autoRender: true,
			style: 'background:#eee;border:1px solid #555;border-radius:8px;margin-top:20px',
			innerStyle: 'margin:10px',
			items: [{
				id: 	"cmp1",
				html: 	"Component 01"
			},{
				id: 	"cmp2",
				html: 	"Component 02"
			},{
				id: 	"cmp3",
				html: 	"Component 03"
			}]
		});	
		
		setInterval(function() {
			test1.toggleItem('cmp2');
		}, 1000);
		*/
		
		/*
		var test1 = new jQbrick.ComponentLayout({
			id: "CMP1",
			$container: "#viewport",
			html: "-- test component layout --",
			autoRender: true,
			layout: 'fit',
			style: 'background:yellow',
			innerStyle: 'background:blue',
			items: [{
				id: "CMP1-1",
				html: "SubComponent 01",
				onBeforeRender: function() {
					var _dfd = $.Deferred();
					return _dfd;
				}
			},{
				id: "CMP1-2",
				html: "SubComponent 02",
				style: "background:red"
			}],
			
			onAfterRender: function() {
				console.log("render main component");
			}
		});
		
		setTimeout(function() {
			test1.layout({recursive:true});
		}, 500);
		*/
		
	});
	
});

