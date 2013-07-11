/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 * Backbone.View
 *  |
 *   -- jQbrick.View
 *    |
 *     -- jQbrick.Component
 *
 * Subclass of "View" to add some "container" behaviors to a View.
 *
 *
 * - WRAPPER / CONTENT
 * Container class add a separated layer (DIV) for the $cnt property and
 * fill some base classNames:
 *
 *     <div class="jqbrick-cmp">
 *         <div class="jqbrick-cmp-inner"></div>
 *     </div>
 *
 *
 * 
 *
 */

define([
	"jquery", "underscore", "backbone",
	"./view.View"
	
], function(
	$, _, Backbone,
	View
	
) {
	
	var Component = View.extend({
		
		defaults: function() {
			return $.extend({}, View.prototype.defaults.apply(this,arguments), {
				
				xtype: "component",
				
				// Content layer ($cnt) attributes:
				innerAttrs:		{},		// a list of attributes to apply to $cnt
				innerStyle: 	'',
				innerCss: 		{},
				
				// A list of sub-items configuration to add to the component during initialization
				items: []
				
			});
		}
		
	});
	
	
	
	
	
	
	/**
	 * Initialization
	 */
	Component.prototype._initialize = function() {
		View.prototype._initialize.apply(this, arguments);
		this._initializeComponent();
		this._initializeComponentItems();
	};
	
	Component.prototype._initializeComponent = function() {
		
		// separate container from content layer
		this.$cnt = $('<div>')
		this.utils.moveChilds(this.$el, this.$cnt);
		this.$cnt.appendTo(this.$el);
		
		// apply raw attributes to the node
		this.utils.applyAttributes(this.$cnt, this.options.innerAttrs);
		if (this.options.innerStyle) 	this.$cnt.attr('style', this.options.innerStyle);
		if (this.options.innerCss) 		this.$cnt.css(this.options.innerCss);
		
		// add basic classes
		this.$el.addClass('jqbrik-cmp');
		this.$cnt.addClass('jqbrik-cmp-inner');
	};
	
	Component.prototype._initializeComponentItems = function() {
		this.items = [];
		this.addItem(this.options.items, {render:false});
	};
	
	
	
	
	
	/**
	 * Overrides Rendering Process
	 * inject Component's rendering logic just before to inject DOM to container object
	 */
	Component.prototype._render = function() {
		this.__renderHTML();
		this._renderComponent();
		this.__appendToContainer();
	};
	
	/**
	 * Propagate rendering to sub-items
	 */
	Component.prototype._renderComponent = function() {
		for (var i=0; i<this.items.length; i++) {
			if (this.items[i].active) {
				this.items[i].item.render();
			}
		}
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
// ----------------------------------------------- //
// ---[[   I T E M S   M A N A G E M E N T   ]]--- //
// ----------------------------------------------- //
	
	
	Component.prototype.__alterItem__ = function(item, options, actionName, evtName) {
		var self = this;
		var _dfd = $.Deferred();
		
		options = $.extend({}, {
			render: true,
			silent: false,
			complete: function() {}
		}, options||{});
		
		
		
		// add multiple items, prevent from rendering for each item!
		// (self call one by one)
		if (_.isArray(item)) {
			evtName += 's';
			var _remaining = item.length;
			for (var i=0; i<item.length; i++) {
				var _options = $.extend({},options,{render: false});
				$.when(this[actionName].call(this, item[i], _options)).always(function() {
					_remaining-= 1;
					if (_remaining == 0) _dfd.resolve();
				});
			}
		
		// add single component
		} else {
			$.when(this[actionName].call(this, item, options)).always(_dfd.resolve);
		}
		
		// render component if required
		_dfd.done(function() {
			if (!options.silent) {
				options.complete.call(self, item, options);
				self.call(evtName, item, options);
			}
			if (options.render) {
				self.render();
			}
		});
			
		return this;
	};
	
	
	
	
	Component.prototype.itemPos = function(item) {
		for (var i=0; i<this.items.length; i++) {
			if (this.items[i].item == item) {
				return i;
			}
		}
		return -1;
	};
	
	Component.prototype.itemAt = function(idx) {
		if (this.items[idx]) {
			return this.items[idx].item;	
		}
	};
	
	Component.prototype.hasItem = function(item) {
		return this.itemPos(item) != -1;
	};
	
	
	
	
	/**
	 * Add a new Component (or General View) to Component's Body
	 * it handle single or multiple items and it is able to
	 * throw "render()" when all new components are done
	 */
	Component.prototype.addItem = function(item, options) {
		return this.__alterItem__(item, options, '_addItem', 'additem');
	};
	
	/**
	 * @TODO:
	 * should return a deferred to delay "add()" events triggering...
	 * this may be used to delay "add" to match "initialized" deferred of each sub items....
	 * or may be unuseful!
	 */
	Component.prototype._addItem = function(item, options) {
		// configuration object, create new XType
		if (this.utils.isPlainObject(item)) {
			var item = this.xtype.make(null, item, this);
			this.items.push({
				item:	item,
				active:	true
			});
		
		// object instance.
		// need to change parent, container and remove from existing DOM position
		} else if (item instanceof View && !this.hasItem(item)) {
			item.setParent(this);
			item.setContainer(this.$cnt);
			item.$el.remove();
			this.items.push({
				item:	item,
				active:	true
			});
		}
	};
	
	
	
	
	
	Component.prototype.removeItem = function(item, options) {
		return this.__alterItem__(item, options, '_removeItem', 'removeitem');
	};
	
	Component.prototype._removeItem = function(item, options) {
		if (this.hasItem(item)) {
			this.items.splice(this.itemPos(item), 1);
			item.$el.remove();
		} else {
			return false;
		}
	};
	
	
	
	
	return Component;
	
});