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
				innerStyle: "border:4px solid yellow",
				
				items: [{
					html: "Item 01"
				},{
					html: "Item 02"
				},{
					html: "Item 03"
				}],
				
				itemDefaults: {
					style: "border:1px dashed #666"
				},
				
				
				layout: {
					name: "fit",
					width: 200,
					height: 150,
					scrollable: true,
					fullsize: true,
					itemOverrideLayout: {name:"block",height:70},
					paddingTop: 10,
					paddingRight: 20,
					paddingBottom: 30,
					paddingLeft: 40
				}
				
				//fullsize:	true,
				//layout: "fit",
				//scrollable: true
				
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

