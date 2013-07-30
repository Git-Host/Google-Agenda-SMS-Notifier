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
				width: 			this.width || this.Panel.options.width,
				height:			this.height || this.Panel.options.height,
				
				// $body match at least $el dimensions
				fullsize:		this.Panel.options.fullsize,
				
				// [false=disabled; true=iScoll or native; native=force to use only native behavior]
				scrollable:		this.Panel.options.scrollable || "auto",
				
				paddingTop: 	0,
				paddingRight: 	0,
				paddingBottom: 	0,
				paddingLeft: 	0
			}, this.options);
			
			// default true value but allow to setup a false value from configuration
			if (!_.isBoolean(this.options.fullsize)) this.options.fullsize = true;
			
			this.width 			= this.options.width;
			this.height 		= this.options.height;
			this.paddingTop 	= this.options.paddingTop;
			this.paddingRight 	= this.options.paddingRight;
			this.paddingBottom 	= this.options.paddingBottom;
			this.paddingLeft 	= this.options.paddingLeft;
			
			this.Panel.$el.css({
				display: 	"block",
				overflow: 	"hidden"
			}).addClass("jqbrick-ly-block");
			
			this.Panel.$wrapper.css({
				display: 	"block",
				overflow:	"hidden",
				position: 	"relative"
			});
			
			this.Panel.$bodyWrapper.css({
				display: 	"block",
				overflow:	"hidden",
				position:	"relative"
			});
			
			this._initializeScroller();
		},
		
				
		_elSize: function(width, height) {
			
			// outer box size are blocked by outside component!
			if (this.__sizeIsBlocked && this.__sizeIsBlocked == true) {
				width 	= this.Panel.$el.width();
				height 	= this.Panel.$el.height();
			}
			
			width 	= width 	|| this.width;
			height 	= height 	|| this.height;
			
			// in case of NULL values fetch box itself values (ex defaults)
			if (width == null) 	width 	= this.__outerWidthValue(this.Panel.$el.parent());
			if (height == null) height 	= this.Panel.$el.outerHeight();
			
			this.beforeWidth 	= this.width;
			this.beforeHeight 	= this.height;
			
			this.width 	= this.__outerWidthValue(width, this.Panel.$el);
			this.height = this.__outerHeightValue(height, this.Panel.$el);
			
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
		 * Walk throught panel's toolbars, place toolbars at the right
		 * place and estimate their occupied space.
		 */
		_toolbarsSize: function() {
			this.toolbarTop 	= 0;
			this.toolbarRight 	= 0;
			this.toolbarBottom 	= 0;
			this.toolbarLeft 	= 0;
			
			if (!this.Panel.toolbars.length) return;
			
			for (var i=0; i<this.Panel.toolbars.length; i++) {
				if (this.Panel.toolbars[i].options.docked == "top" || this.Panel.toolbars[i].options.docked == "bottom") {
					var attrs = {
						position: 	"absolute",
						left: 		0,
						width:		this.width,
						height:		this.Panel.toolbars[i].options.size
					};
					switch(this.Panel.toolbars[i].options.docked) {
						case "top":
							attrs.top			= this.toolbarTop;
							this.toolbarTop 	+= this.Panel.toolbars[i].options.size;
							break;
						case "bottom":
							attrs.bottom		= this.toolbarBottom;
							this.toolbarBottom 	+= this.Panel.toolbars[i].options.size;
							break;
					}
					this.Panel.toolbars[i].$el.css(attrs);
					this.Panel.toolbars[i].trigger("blocksize");
					this.Panel.toolbars[i].trigger("layoutchange");
				}
			};
			
			for (var i=0; i<this.Panel.toolbars.length; i++) {
				if (this.Panel.toolbars[i].options.docked == "left" || this.Panel.toolbars[i].options.docked == "right") {
					var attrs = {
						position: 	"absolute",
						top: 		this.toolbarTop,
						width:		this.Panel.toolbars[i].options.size,
						height:		this.height - this.toolbarTop - this.toolbarBottom
					};
					switch(this.Panel.toolbars[i].options.docked) {
						case "left":
							attrs.left			= this.toolbarLeft;
							this.toolbarLeft 	+= this.Panel.toolbars[i].options.size;
							break;
						case "right":
							attrs.right			= this.toolbarRight;
							this.toolbarRight 	+= this.Panel.toolbars[i].options.size;
							break;
					}
					this.Panel.toolbars[i].$el.css(attrs);
					this.Panel.toolbars[i].trigger("blocksize");
					this.Panel.toolbars[i].trigger("layoutchange");
				}
			};
			
		},
		
		/**
		 * Calculates $bodyWrapper dimensions and margins based on
		 * - toolbarXXX dimensions
		 * - paddingXXX properties
		 */
		_bodyWrapperSize: function() {
			
			this.bodyWrapperWidth 	= this.width - this.toolbarLeft - this.toolbarRight - this.paddingLeft - this.paddingRight;
			this.bodyWrapperHeight 	= this.height - this.toolbarTop - this.toolbarBottom - this.paddingTop - this.paddingBottom;
			
			this.Panel.$bodyWrapper.css({
				width: 			this.bodyWrapperWidth,
				height: 		this.bodyWrapperHeight,
				marginTop: 		this.paddingTop + this.toolbarTop,
				marginRight: 	this.paddingRight,
				marginBottom: 	this.paddingBottom,
				marginLeft: 	this.paddingLeft + this.toolbarLeft
			});
		},
		
		_bodySize: function() {
			if (this.options.fullsize) {
				this.Panel.$body.css({
					minWidth: 	this.__outerWidthValue(this.Panel.$bodyWrapper.width(true), this.Panel.$body),
					minHeight:	this.__outerHeightValue(this.bodyWrapperHeight, this.Panel.$body) -1 // mozilla need a "-1".... to fix!
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
				
			} else if (this.options.scrollable === "native") {
				this.Panel.$bodyWrapper.css({
					"overflow-x" : "auto",
					"overflow-y" : "auto",
					"-webkit-overflow-scrolling" : "touch"
				});
			}
		},
		
		
		_updateScroller: function() {},
		
		_finalizeScroller: function() {
			var self = this;
			
			setTimeout(function() {
				
				// do autoscroll
				self._autoScroller();
				
				// refresh scroller plugin if available
				if (self.Panel.$bodyWrapper.data('iScroll')) {
					self.Panel.$bodyWrapper.data('iScroll').refresh();
				}
				
			}, 1);
		},
		
		/**
		 * activate / deactivate iScroll plugin based on body size
		 */
		_autoScroller: function() {
			if (this.options.scrollable == "auto") {
				if (this.Panel.$body.height() > this.Panel.$bodyWrapper.height()) {
					if (window.iScroll && !this.Panel.$bodyWrapper.data('iScroll')) {
						this.Panel.$bodyWrapper.data('iScroll', new iScroll(this.Panel.$bodyWrapper[0]));
					}
				} else {
					if (this.Panel.$bodyWrapper.data('iScroll')) {
						this.Panel.$bodyWrapper.data('iScroll').destroy();
						this.Panel.$bodyWrapper.data('iScroll', null);
					}
				}
			}
		}
		
		
		
		
		
	});
	
	
	
	return BlockLayout;
	
});