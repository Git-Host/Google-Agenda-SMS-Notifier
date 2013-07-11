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
	
	
	
	$(document).delegate('#home', 'pagecreate', function() {
		
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
		
	});
	
});

