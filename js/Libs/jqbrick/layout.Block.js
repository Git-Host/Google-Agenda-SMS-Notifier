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
		
		// store $bodyWrapper applied dimension
		bodyWrapperWidth: null,
		bodyWrapperHeight: null,
		
		// body padding space
		paddingTop: 	0,
		paddingRight: 	0,
		paddingBottom: 	0,
		paddingLeft: 	0,
		
		
		initialize: function() {
			DefaultLayout.prototype.initialize.apply(this, arguments);
			
			this.options = $.extend({}, {
				width: 			this.width,
				height:			this.height,
				fullsize:		true,			// $body match at least $el dimensions
				scrollable:		false,			// [false=disabled; true=iScoll or native; native=force to use only native behavior]
				paddingTop: 	0,
				paddingRight: 	0,
				paddingBottom: 	0,
				paddingLeft: 	0
			}, this.options);
			
			this.width 			= this.options.width;
			this.height 		= this.options.height;
			this.paddingTop 	= this.options.paddingTop;
			this.paddingRight 	= this.options.paddingRight;
			this.paddingBottom 	= this.options.paddingBottom;
			this.paddingLeft 	= this.options.paddingLeft;
			
			this.Panel.$el.css({
				display: 	"block",
				overflow: 	"hidden"
			});
			
			this.Panel.$wrapper.css({
				display: 	"block",
				overflow:	"hidden",
				position:	"relative"
			});
			
			this.Panel.$bodyWrapper.css({
				display: 	"block",
				overflow:	"hidden",
				position:	"relative"
			});
			
			this._initializeScroller();
		},
		
		layout: function() {
			DefaultLayout.prototype.layout.apply(this, arguments);
			
			this._elSize();
			this._wrapperSize();
			this._bodyWrapperSize();
			this._bodySize();
			
			this._updateScroller();
		},
		
		finalize: function() {
			this._finalizeScroller();
		},
		
		_elSize: function(width, height) {
			
			width 	= width || this.width;
			height 	= height || this.height;
			
			this.beforeWidth 	= this.width;
			this.beforeHeight 	= this.height;
			
			this.width 	= width;
			this.height = height;
			
			this.Panel.$el.css({
				width: 	this.width,
				height: this.height
			});
			
		},
		
		/**
		 * Match $el size but with "relative" positioning style
		 * so it become possible to absolute align internal components
		 * like docked areas
		 */
		_wrapperSize: function() {
			this.Panel.$wrapper.css({
				width: 	this.width,
				height: this.height
			});
		},
		
		/**
		 * Calculates $bodyWrapper dimensions and margins based on
		 * - docked dimensions
		 * - paddingXXX properties
		 */
		_bodyWrapperSize: function() {
			
			this.bodyWrapperWidth 	= this.width - this.paddingLeft - this.paddingRight;
			this.bodyWrapperHeight 	= this.height - this.paddingTop - this.paddingBottom;
			
			this.Panel.$bodyWrapper.css({
				width: 			this.bodyWrapperWidth,
				height: 		this.bodyWrapperHeight,
				marginTop: 		this.paddingTop,
				marginRight: 	this.paddingRight,
				marginBottom: 	this.paddingBottom,
				marginLeft: 	this.paddingLeft
			});
		},
		
		_bodySize: function() {
			if (this.options.fullsize) {
				this.Panel.$body.css({
					minWidth: 	this.bodyWrapperWidth - this.__bodyHBordersWidth(),
					minHeight:	this.bodyWrapperHeight - this.__bodyVBordersWidth()
				});
			}
		},
		
		
		
		
		
		
		
		
		
		/**
		 * Implements Scrollable
		 */
		
		_initializeScroller: function() {
			if (!this.options.scrollable) return;
			
			if (window.iScroll && this.options.scrollable === true) {
				if (!this.Panel.$bodyWrapper.data('iScroll')) {
					this.Panel.$bodyWrapper.data('iScroll', new iScroll(this.Panel.$bodyWrapper[0]));
				}
				
			} else {
				this.Panel.$bodyWrapper.css({
					"overflow-x" : "auto",
					"overflow-y" : "auto",
					"-webkit-overflow-scrolling" : "touch"
				});
			}
		},
		
		_updateScroller: function(Panel) {
			
		},
		
		_finalizeScroller: function() {
			if (this.Panel.$bodyWrapper.data('iScroll')) {
				this.Panel.$bodyWrapper.data('iScroll').refresh();
			}
		}
		
		
		
		
		
	});
	
	
	
	return BlockLayout;
	
});