/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * BlockLayout
 * Element occupy exaclty given space or entire H availabel space
 * 
 * SCROLLABLE:
 * The element should become scrollable.
 * it depends on iScroll plugin availability to apply smooth scroll or simply
 * use "-webkit-overflow-scrolling" CSS spec (on iPhone/iPad)
 *
 */

define(["backbone", "./layout.Default"], function(Backbone, DefaultLayout) {
	
	var BlockLayout = DefaultLayout.extend({
		
		// actual size
		width: 	null,
		height: null,
		
		// last implemented size
		beforeWidth: null,
		beforeHeight: null,
		
		initialize: function(Panel) {
			DefaultLayout.prototype.initialize.apply(this, arguments);
			
			this.options = $.extend({}, {
				width: 		this.width,
				height:		this.height,
				fullsize:	true,			// $body match at least $el dimensions
				scrollable:	false			// [false=disabled; true=iScoll or native; native=force to use only native behavior]
			}, this.options);
			
			this.width 	= this.options.width;
			this.height = this.options.height;
			
			Panel.$el.css({
				display: 	"block",
				overflow: 	"hidden"
			});
			
		},
		
		layout: function(Panel) {
			DefaultLayout.prototype.layout.apply(this, arguments);
			
			console.log("BlockLayout on " + Panel.cid + " ("+this.name+")");
			this._outerSize(Panel);
			this._innerSize(Panel);
			this._updateScroller(Panel);
		},
		
		finalize: function(Panel) {
			this._finalizeScroller(Panel);
		},
		
		_outerSize: function(Panel, width, height) {
			
			width = width || this.width;
			height = height || this.height;
			
			this.beforeWidth = this.width;
			this.beforeHeight = this.height;
			
			this.width = width;
			this.height = height;
			
			Panel.$el.css({
				width: 	this.width,
				height: this.height
			});
			
		},
		
		_innerSize: function(Panel) {
			if (this.options.fullsize) {
				Panel.$body.css({
					minWidth: 	this.__hSpace(),
					minHeight:	this.__vSpace()
				});
			}
			
		},
		
		
		
		
		
		
		
		
		
		/**
		 * Implements Scrollable
		 */
		
		_updateScroller: function(Panel) {
			if (!this.options.scrollable) return;
			
			if (!this.__scrollerInitialized) {
				Panel.$body.wrap('<div class="jqbrick-scroller-wrapper">');
				this.__scrollerInitialized = true;
			}
			
			var $scroller = Panel.$body.parent();
			$scroller.css({
				display: 	"block",
				overflow: 	"hidden",
				position:	"relative",
				width: 		Panel.$el.innerWidth(),
				height:		Panel.$el.innerHeight()
			});
			
			if (window.iScroll && this.options.scrollable === true) {
				var scroll = $scroller.data('iScroll');
				if (!scroll) {
					scroll = new iScroll($scroller[0]);
					$scroller.data('iScroll', scroll);
				} else {
					scroll.refresh();
				}
				
				
			} else {
				$scroller.css({
					"overflow-x" : "auto",
					"overflow-y" : "auto",
					"-webkit-overflow-scrolling" : "touch"
				});
			}
			
		},
		
		_finalizeScroller: function(Panel) {
			if (!this.options.scrollable) return;
			
			if (window.iScroll && this.options.scrollable === true) {
				Panel.$body.parent().data('iScroll').refresh()
			}
		}
		
		
		
		
		
	});
	
	/*
	
	
	BlockLayout.prototype.name = "block";
	
	BlockLayout.prototype.initialize = function(View) {
		View.options.itemDefaults.layout = "block";
	};
	
	BlockLayout.prototype.render = function(View) {
		DefaultLayout.prototype.render.apply(this, arguments);
		this._scrollable(View);
	};
	
	BlockLayout.prototype._outerSize = function(View) {
	
		View.$el.css("display", "block");
		
		// check for forced dimensions setted up by parent component
		if (this._forcedOuterSize(View)) return true;
		
		var rules = {};
		
		if (View.options.width != null) {
			View.width 		= View.options.width;
			rules.width 	= View.width;
		}
		if (View.options.height != null) {
			View.height 	= View.options.height;
			rules.height 	= View.height;
		}
		
		View.$el.css(rules);
	};
	
	
	BlockLayout.prototype._scrollable = function(View) {
		
		var rules = {};
		
		if (View.options.scrollable) {
			if (window.iScroll) {
				
				View.$el.css({
					display:	"block",
					overflow: 	"hidden",
					position: 	"relative"
				});
				
				var scroll = View.$el.data('iScroll');
				if (!scroll) {
					scroll = new iScroll(View.el);
					View.$el.data('iScroll', scroll);
				} else {
					scroll.refresh();
				}
				
			} else {
				rules.overflow = "auto";
				rules["-webkit-overflow-scrolling"] = "touch";	
			}
		} else {
			rules.overflow = "hidden";
		};
		
		View.$el.css(rules);
		
	};
	*/
	
	return BlockLayout;
	
});