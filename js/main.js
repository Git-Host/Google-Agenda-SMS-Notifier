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
			//console.log("App Ready");
			//this.initUi();
			
		}
	});
	
	
	$(document).delegate('#home', 'pagecreate', function() {
		//console.log("pagecreated");
		
		/*
		var aa = $.Deferred();
		
		var brick = new jQbrick.View({
			
			$container: $('#foo'),
			
			html: 'test',
			css: {
				background:'yellow'
			},
			style:'color:blue',
			
			
			when: {
				"rendered" : "onAfterRender"
			},
			
			onAfterRender: function() {
				console.log("rendered");
				this.$body.append("MONA");
			},
			
			autoRender: true
			
		});
		
		setTimeout(function() {
			console.log("resolve");
			brick.resolve("ready");
			aa.resolve();
		}, 2500);
		
		
		var subbrick = new jQbrick.View({
			parent: brick,
			html: "subbrick",
			autoRender: "cascade"
		});
		*/
		
		/*
		var a = new jQbrick.ComponentLayout({
			$container: '#foo',
			html: "TestContainer",
			autoRender: true,
			attrs: {
				"data-foo" : "mona",
				"rel" : "haha"
			},
			css: {
				display: 'block',
				background:'yellow',
				color:'blue'
			},
			innerCss: {
				display: 'block',
				padding: 20,
				margin:20,
				background: 'green'
			},
			items: [{
				html: "Item1"
			},{
				html: "Item2"
			}]
		});
		
		var bb = new jQbrick.Component({
			html: "MONA"
		});
		
		setTimeout(function() {
			a.addItem({
				html: "Item3"
			});
			a.addItem(bb);
			
			console.log(a.items);
		}, 1000);
		
		setTimeout(function() {
			a.removeItem(bb);
		}, 2000);
		
		
		$('#faa a').on("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			alert("CHICLI");
		});
		
		var test = new jQbrick.Component({
			el: '#faa',
			style: 'border:1px solid black;padding:10px',
			innerStyle: 'border:1px solid red;padding:10px'
		});
		*/
		
		
		var test1 = new jQbrick.Component({
			$container: '#faa',
			autoRender: true,
			html: 'mona',
			css: {
				background: '#666',
				padding:10
			},
			style: "color:#fff",
			innerStyle: 'background:red;',
			items: [{
				xtype:	"view",
				id:		"cmp1",
				html: 	"sottocomponente 1",
			},{
				xtype:	"view",
				id:		"cmp2",
				html: 	"sottocomponente 2"
			},{
				xtype:	"view",
				id:		"cmp3",
				html: 	"sottocomponente 3"
			}]
		});
		
		test1.$body.append("after components");
		
		
		/*
		var test2 = new jQbrick.Component({
			html: "sottocomponente 4"
		});
		
		test1.addItem([test2,{html:'mona cmp'}]);
		
		//console.log(test1.getItem('cmp1'));
		
		setTimeout(function() {
			test1.removeItem('cmp1');
			test1.removeItem('cmp2');
			test1.removeItem('cmp3');
		}, 1000);
		
		*/
		setInterval(function() {
			console.log("toggle");
			test1.toggleItem("cmp3");
		}, 1000);
		
		
		
	});
	
});

