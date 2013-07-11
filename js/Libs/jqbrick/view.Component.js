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
 * - HANDLING ITEMS
 * The most important feature of Component object is the ability to handle a list of
 * sub-components named "items".
 *
 * !!! sub components are at least instances of "jQbrick.View" object !!!
 *
 *     var ComponentInstance = new jQmbr.Component({
 *         items: [{
 *             xtype: "view",
 *             html: "Item 01"
 *         },{
 *             xtype: "component",
 *             html: "Item 02"
 *         }]
 *     });
 * 
 * When Component.render() then it propagate to each items to maintain everything
 * up to date.
 * 
 * Item's "parent" property link container Component object.
 * Item's "$container" property link container Component.$body DOM node
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
	
	
	Component.prototype.hasItem = function(item) {
		return this.getItem(item) != null;
	};
	
	Component.prototype.getItem = function(id) {
		if (_.isString(id)) {
			return this.getItemById(id);
		} else {
			return this.itemAt(this.itemPos(id));
		}
	};
	
	Component.prototype.getItemById = function(id) {
		for (var i=0; i<this.items.length; i++) {
			if (this.items[i].item.id == id) {
				return this.items[i].item;
			}
		}
		return -1;
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
		if (idx != -1 && this.items[idx]) {
			return this.items[idx].item;
		} else {
			return null;
		}
	};
	
	Component.prototype.getItemStatus = function(item) {
		var idx = this.itemPos(this.getItem(item));
		if (idx != -1 && this.items[idx]) {
			return this.items[idx].active;
		} else {
			return false;
		}
	};
	
	
	
	
	
	
	
	
	
	/**
	 * This is a private logic to apply an action to a set of Component's items.
	 * It can receive a single item or an array of items.
	 *
	 * When action ends over all involved items a callback and an event are thrown.
	 * (internal action logic should return a DeferredObject)
	 *
	 * CALLBACKS:
	 * it uses internal callbacks utility "apply()" throwing
	 * actionName - on each single item
	 * actionName + "Complete" - when all items completes
	 *
	 * OPTIONS:
	 * - render:   trigger component's render() after action [default:true]
	 * - silent:   prevent to trigger callbacks and events [default:false]
	 * - complete: anonymous callback triggered when all actions complete
	 * - each:     anonymous callback triggered on each
	 *
	 */
	Component.prototype.__alterItem__ = function(item, options, actionName, evtName) {
		var self = this;
		var _dfd = $.Deferred();
		
		var options = $.extend({}, {
			render: 	true,
			silent: 	false,
			each:		function() {},
			complete: 	function() {}
		}, options||{});
		
		// prevent internal logic to render the component.
		// rendering is done at the end of the game!
		var _options = $.extend({},options,{render: false});
		
		// add multiple items, prevent from rendering for each item!
		// (self call one by one)
		if (_.isArray(item)) {
			var _remaining = item.length;
			for (var i=0; i<item.length; i++) {
				var _item = _.isString(item[i]) ? this.getItem(item[i]) : item[i];
				$.when(this[actionName].call(this, _item, _options)).always(function() {
					$.when(
						options.each.call(self, _item, options),
						self.call(evtName, _item, options)
					).always(function() {
						if (_remaining-=1 == 0) _dfd.resolve();
					});
				});
			}
		
		// add single component
		} else {
			var _item = _.isString(item) ? this.getItem(item) : item;
			$.when(this[actionName].call(this, _item, _options)).always(function() {
				$.when(
					options.each.call(self, _item, options),
					self.call(evtName, _item, options)
				).always(function() {
					_dfd.resolve();
				});
			});
		}
		
		// render component if required
		_dfd.done(function() {
			if (!options.silent) {
				var _callbacks = $.when(
					options.complete.call(self, item, options),
					self.call(evtName+"Complete", item, options)
				);
			} else {
				var _callbacks = true;
			}
			if (options.render) {
				$.when(_callbacks).always(_.bind(self.render, self));
			}
		});
			
		return this;
	};
	
	
	
	
	/**
	 * APIS for addItem(), removeItem(), enableItem(), disableItem(), toggleItem()
	 */
	
	
	
	
	/**
	 * addItem()
	 * ---------------------
	 */
	 
	Component.prototype.addItem = function(item, options, getDeferred) {
		var _dfd = this.__alterItem__(item, options, '_addItem', 'addItem');
		if (getDeferred === true) {
			return _dfd;
		} else {
			return this;
		}
	};
	
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
	
	
	/**
	 * removeItem()
	 * ---------------------
	 */
	 
	Component.prototype.removeItem = function(item, options, getDeferred) {
		var _dfd = this.__alterItem__(item, options, '_removeItem', 'removeItem');
		if (getDeferred === true) {
			return _dfd;
		} else {
			return this;
		}
	};
	
	Component.prototype._removeItem = function(item, options) {
		var _dfd = $.Deferred();
		if (this.hasItem(item)) {
			this.items.splice(this.itemPos(item), 1);
			$.when(item.remove()).always(_dfd.resolve);
		} else {
			_dfd.reject();
		}
		return _dfd.promise();
	};
	
	
	/**
	 * toggleItem()
	 * ---------------------
	 */
	
	Component.prototype.toggleItem = function(item, options, getDeferred) {
		var _dfd = this.__alterItem__(item, options, '_toggleItem', 'toggleItem');
		if (getDeferred === true) {
			return _dfd;
		} else {
			return this;
		}
	};
	
	Component.prototype._toggleItem = function(item, options) {
		if (this.getItemStatus(item)) {
			return this.disableItem(item, {render:false}, true);
		} else {
			return this.enableItem(item, {render:false}, true);
		}
	}
	
	
	/**
	 * disableItem()
	 * ---------------------
	 */
	
	Component.prototype.disableItem = function(item, options, getDeferred) {
		var _dfd = this.__alterItem__(item, options, '_disableItem', 'disableItem');
		if (getDeferred === true) {
			return _dfd;
		} else {
			return this;
		}
	};
	
	Component.prototype._disableItem = function(item, options) {
		if (this.hasItem(item)) {
			this.items[this.itemPos(item)].active = false;
			this.items[this.itemPos(item)].item.$el.remove();
			return true;
		} else {
			return false;
		}
	};
	
	
	/**
	 * enableItem()
	 * ---------------------
	 * this is the most difficult items handling logic because 
	 * enabled item's DOM need to be re-injected into component's body
	 * at the correct place!
	 */
	
	Component.prototype.enableItem = function(item, options, getDeferred) {
		var _dfd = this.__alterItem__(item, options, '_enableItem', 'enableItem');
		if (getDeferred === true) {
			return _dfd;
		} else {
			return this;
		}
	};
	
	Component.prototype._enableItem = function(item, options) {
		if (this.hasItem(item)) {
			var idx = this.itemPos(item);
			this.items[idx].active = true;
			
			// Try to find out the correct place where to inject
			// enabled item's DOM node.
			
			// First Item.
			// append before to the first enabled item - if available
			if (idx == 0) {
				var _done = false;
				for (var i=1; i<this.items.length; i++) {
					if (!_done && this.items[i].active) {
						this.items[i].item.$el.before(this.items[idx].item.$el);
						_done = true;
					}
				}
			
			// Last Item
			// append after the last enabled item - if available
			} else if (idx === this.items.length-1) {
				var _done = false;
				for (var i=this.items.length-2; i>=0; i--) {
					if (!_done && this.items[i].active) {
						this.items[i].item.$el.after(this.items[idx].item.$el);
						_done = true;
					}
				}
				
			} else {
				var _done = false;
				for (i=idx-1; i>=0; i--) {
					if (!_done && this.items[i].active) {
						this.items[i].item.$el.after(this.items[idx].item.$el);
						_done = true;
					}
				}
				for (i=idx+1; i<this.items.length; i++) {
					if (!_done && this.items[i].active) {
						this.items[i].item.$el.before(this.items[idx].item.$el);
						_done = true;
					}
				}
			}
			
			// Fallback: append to the component's content if no other situation match
			if (!this.items[idx].item.$el.parent().length) {
				this.items[idx].item.$el.appendTo(this.$cnt);
			}
			
			return true;
		} else {
			return false;
		}
	};
	
	
	
	
	return Component;
	
});