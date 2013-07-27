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
		
		initialize: function() {
			DefaultLayout.prototype.initialize.apply(this, arguments);
			
			this.options = $.extend({}, {
				width: 		this.width,
				height:		this.height,
				fullsize:	true,			// $body match at least $el dimensions
				scrollable:	false			// [false=disabled; true=iScoll or native; native=force to use only native behavior]
			}, this.options);
			
			this.width 	= this.options.width;
			this.height = this.options.height;
			
			this.Panel.$el.css({
				display: 	"block",
				overflow: 	"hidden"
			});
			
			this.Panel.$wrapper.css({
				display: 	"block",
				overflow:	"hidden",
				position:	"relative"
			});
			
			this._initializeScroller();
			console.log(this.Panel.$wrapper);
		},
		
		layout: function() {
			DefaultLayout.prototype.layout.apply(this, arguments);
			
			this._outerSize();
			this._wrapperSize();
			this._innerSize();
			
			this._updateScroller();
		},
		
		finalize: function() {
			this._finalizeScroller();
		},
		
		_outerSize: function(width, height) {
			
			width = width || this.width;
			height = height || this.height;
			
			this.beforeWidth = this.width;
			this.beforeHeight = this.height;
			
			this.width = width;
			this.height = height;
			
			this.Panel.$el.css({
				width: 	this.width,
				height: this.height
			});
			
		},
		
		_wrapperSize: function() {
			this.Panel.$wrapper.css({
				width: 	this.width,
				height: this.height
			});
		},
		
		_innerSize: function() {
			if (this.options.fullsize) {
				this.Panel.$body.css({
					minWidth: 	this.__hSpace(),
					minHeight:	this.__vSpace()
				});
			}
		},
		
		
		
		
		
		
		
		
		
		/**
		 * Implements Scrollable
		 */
		
		_initializeScroller: function() {
			if (!this.options.scrollable) return;
			
			if (window.iScroll && this.options.scrollable === true) {
				if (!this.Panel.$wrapper.data('iScroll')) {
					this.Panel.$wrapper.data('iScroll', new iScroll(this.Panel.$wrapper[0]));
				}
				
			} else {
				this.Panel.$wrapper.css({
					"overflow-x" : "auto",
					"overflow-y" : "auto",
					"-webkit-overflow-scrolling" : "touch"
				});
			}
		},
		
		_updateScroller: function(Panel) {
			
		},
		
		_finalizeScroller: function() {
			if (this.Panel.$wrapper.data('iScroll')) {
				this.Panel.$wrapper.data('iScroll').refresh();
			}
		}
		
		
		
		
		
	});
	
	
	
	return BlockLayout;
	
});