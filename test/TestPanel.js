/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * jQbrick.Component Test Case
 * ------------------------
 *
 *
 */

define([
	"jqbrick/TestClass",
	"jqbrick/view.Panel"
], function(
	TestClass,
	jQbrickPanel
) {
	
	var Test = TestClass.extend({
		run: function() {
			var Test = this;
			
			console.log("###");
			console.log("### RUN PANEL TEST");
			console.log("###");
			
			
			
			var testPanel = new jQbrickPanel({
				autoRender: true,
				container: 	this.options.viewport,
				html: 		'TestPanel',
				
				style: 		"border:4px solid red",
				bodyStyle: 	"border:4px solid yellow",
				
				items: [{
					html: "Item 01"
				},{
					html: "Item 02"
				},{
					html: "Item 03"
				},{
					html: "Item 04"
				},{
					html: "Item 05"
				}],
				
				itemDefaults: {
					style: "border:1px dashed #666"
				},
				
				layout: {
					name: "fit",
					width: 300,
					height: 150,
					scrollable: true,
					//fullsize: false,
					itemLayoutOverrides: {name:"block",height:70},
					
					/*
					paddingTop: 10,
					paddingRight: 20,
					paddingBottom: 30,
					paddingLeft: 40
					*/
				},
				
				
				toolbars: [{
					docked: "top",
					html:	"Page Title",
					style:	"border:4px solid #444;background:#aaa;text-align:center",
					bodyStyle: "line-height:30px",
					toolbars: [{
						docked: "left",
						html: "left",
						style: "border-right:1px solid #fff;line-height:30px"
					},{
						docked: "right",
						html:"right",
						style: "border-left:1px solid #fff;line-height:30px"
					}]
				},{
					docked: "bottom",
					size: 	60,
					html:	"bottom layout",
					style:	"border:2px solid #444;background:#aaa"
				},{
					docked: "left",
					size: 	96,
					html:	"<p>left 01</p><p>left 02</p><p>left 03</p><p>left 04</p>",
					style:	"border:2px solid blue;background:#aaa"
				},{
					docked: "right",
					size: 	96,
					html:	"<p>right 01</p><p>right 02</p><p>right 03</p><p>right 04</p><p>right 05</p><p>right 06</p><p>right 07</p><p>right 08</p><p>right 09</p>",
					style:	"border:2px solid blue;background:#aaa"
				}]
			
				
			});
			
			
			testPanel.on('beforerender', function(e) {
				console.log("-- before RENDER");
			});
			
			testPanel.on('afterrender', function(e) {
				console.log("-- after RENDER");
				e.block();
				$.when(this.layout(true)).then(e.unblock);
			});
			
			testPanel.on('beforelayout', function(e) {
				console.log("-- before LAYOUT");
			});
			
			testPanel.on('afterlayout', function(e) {
				console.log("-- after LAYOUT");
			});
			
			
			testPanel.on('beforedefaultlayout', function(e) {
				console.log("-- before DefaultLayout");
			});
			testPanel.on('afterdefaultlayout', function(e) {
				console.log("-- after DefaultLayout");
			});
			
			
			
		}
	});
	
	
	
	return Test;
	
});

