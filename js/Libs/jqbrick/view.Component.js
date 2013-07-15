/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
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
				
				// Content layer ($body) attributes:
				innerAttrs:		{},		// a list of attributes to apply to $body
				innerStyle: 	'',
				innerCss: 		{},
				
				// A list of sub-items configuration to add to the component during initialization
				items: [],
				itemDefaults: {}
				
			});
		}
		
	});
	
	
	
	/**
	 * Initialization Process
	 * - handle $el / $body separation
	 * - add items into the DOM node without render them!
	 */
	
	Component.prototype._initializeEl = function() {
		return this._initializeElComponent();
	}
	
	Component.prototype._initializeElComponent = function() {
		
		// separate container from content layer
		this.$body = $('<div>')
		this.utils.moveChilds(this.$el, this.$body);
		this.$body.appendTo(this.$el);
		
		// apply raw attributes to the node
		this.utils.applyAttributes(this.$body, this.options.innerAttrs);
		if (this.options.innerStyle) 	this.$body.attr('style', this.options.innerStyle);
		if (this.options.innerCss) 		this.$body.css(this.options.innerCss);
		
		// add basic classes
		this.$el.addClass('jqbrik-cmp');
		this.$body.addClass('jqbrik-cmp-inner');
		
		// append raw html
		this.$body.append(this.options.html);
		
		// waith for items initialization to solve 
		_dfd = this._initializeItems();
		_dfd.done(_.bind(this.__appendToContainer, this));
		return _dfd;	
	};
	
	Component.prototype._initializeItems = function() {
		this.items = [];
		return this.addItems(this.options.items, {
			defaults: 		this.options.itemDefaults,
			overrides: 		{autoRender:false},
			getDeferred:	true
		});
	};
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Rendering Process
	 * - attach $el to parent
	 * - render each "active" item in the correct order
	 */
	
	Component.prototype._render = function() {
		var self = this;
		var _dfd = $.Deferred();
		
		$.when(View.prototype._render.apply(this, arguments)).then(function() {
			$.when(self._renderItems()).then(_dfd.resolve);
		});
		
		return _dfd.promise();
	};
	
	Component.prototype._renderItems = function() {
		// compose a list of items to render
		var items = [];
		for (var i=0; i<this.items.length; i++) {
			if (this.items[i].active) {
				items.push(this.items[i].item);
			}
		}
		// walk through items and render them
		return this.__walkItems(items, this._renderItem, this);
	};
	
	Component.prototype._renderItem = function(item) {
		return item.render().renderComplete;
	};
	
	
	
	
	
	
		
	
	
	
	
	
	
	
	
		
	
	
	
	/**
	 * Add New Item
	 *
	 * @TODO: initialization data should have an "active:false" key so that
	 * item starts inactive... it is initialized but not rendered!
	 */
	Component.prototype.addItems = function(items, options) {
		
		if (!_.isArray(items)) {
			items = [items];
		};
		
		if (_.isBoolean(options)) {
			options = {getDeferred:options};
		};
		
		options = $.extend({}, {
			defaults: 		{},
			overrides: 		{},
			getDeferred:	false
		}, options||{});
		
		// apply defaults and overrides to each item before to walk through
		for (var i=0; i<items.length; i++) {
			items[i] = $.extend({}, options.defaults, items[i], options.overrides);
		};
		
		// walk through i
		var _dfd = this.__walkItems(items, this._addItem, this);
		
		if (options.getDeferred) {
			return _dfd;
		} else {
			return this;
		}
	};
	
	Component.prototype._addItem = function(item) {
		var self = this;
		var _dfd = $.Deferred();
		
		// Configuration object, create new XType
		if (this.utils.isPlainObject(item)) {
			var _item = this.xtype.make(null, item, this);
			
		// Object instance:
		// need to change parent, container and remove from existing DOM position
		} else if (item instanceof View && !this.hasItem(item)) {
			var _item = item;
			_item.setParent(this);
			_item.setContainer(this.$body);
		}
		
		// Check for item validity and add to the items stack.
		// item is appended to component items if valid
		// blocking deferred is resolved when item initialization ends
		// and "addItem" callback and events resolves.
		if (_item) {
			this.items.push({
				item:	_item,
				active:	true
			});
			_item.is("initialized", function() {
				$.when(self.apply("addItem", [_item], {trigger:true})).then(_dfd.resolve);
			});
		} else {
			_dfd.reject();
		}
		
		return _dfd.promise();
	};
	
	
	
	
	
	
	
	
	
	
	
	
	Component.prototype.removeItems = function(items, options) {
		
		if (!_.isArray(items)) {
			items = [items];
		};
		
		if (_.isBoolean(options)) {
			options = {getDeferred:options};
		};
		
		options = $.extend({}, {
			getDeferred:	false
		}, options||{});
		
		console.log("REMOVE ITEMS");
		
		// walk through i
		var _dfd = this.__walkItems(this.getItems(items), this._removeItem, this);
		
		if (options.getDeferred) {
			return _dfd;
		} else {
			return this;
		}
		
	};
	
	Component.prototype._removeItem = function(item) {
		var self = this;
		var _dfd = $.Deferred();
		
		if (this.hasItem(item)) {
			$.when(item.remove()).then(function() {
				self.items.splice(self.itemPos(item), 1);
				_dfd.resolve();
			});
		} else {
			_dfd.reject();
		}
		return _dfd.promise();		
	};
	
	
	
	
	
	
	
	
	
	
	
	
// ------------------------------------------------------------- //
// ---[[   I T E M S   F I N D I N G   U T I L I T I E S   ]]--- //	
// ------------------------------------------------------------- //
	
	Component.prototype.hasItem = function(item) {
		return this.getItem(item) != null;
	};
	
	Component.prototype.getItem = function(id) {
		if (_.isString(id)) {
			return this.getItemById(id);
			
		} else if (_.isNumber(id)) {
			return this.itemAt(id);
		
		} else {
			return this.itemAt(this.itemPos(id));
		}
	};
	
	/**
	 * Take an array of eterogeneous item references and return
	 * an array of item instances.
	 *
	 * You can filter on active/inactive only
	 * 
	 * -> ['foo', 0, obj]
	 * <- [obj, obj, obj]
	 */
	Component.prototype.getItems = function(items, activeOnly) {
		var objects = [];
		var item 	= null;
		
		if (!this.items) {
			return objects;
		}
		
		for (var i=0; i<items.length; i++) {
			console.log("check: " + items[i]);
			if ((item = this.getItem(items[i])) != -1) {
				if (activeOnly === true) {
					if (this.getItemStatus(item)) {
						objects.push(item);
					}
				} else if (activeOnly === false) {
					if (!this.getItemStatus(item)) {
						objects.push(item);
					}
				} else {
					objects.push(item);
				}
			}
		}
		
		return objects;
	};
	
	Component.prototype.getItemById = function(id) {
		if (!this.items) {
			return false;
		}
		
		for (var i=0; i<this.items.length; i++) {
			if (this.items[i].item.id == id) {
				return this.items[i].item;
			}
		}
		
		return -1;
	};
	
	Component.prototype.itemPos = function(item) {
		if (!this.items) {
			return false;
		}
		
		for (var i=0; i<this.items.length; i++) {
			if (this.items[i].item == item) {
				return i;
			}
		}
		
		return -1;
	};
	
	/**
	 * Return an item object by it's position index or false if don't exists.
	 * you can also pass a callback function to be applied to matching item.
	 *
	 * NOTE: this method can work only after "initialized" checkpoint!
	 */
	Component.prototype.itemAt = function(idx, options) {
		if (!this.items) {
			return false;
		}
		
		if (_.isFunction(options)) options = {apply:options};
		options = $.extend({}, {
			apply: function() {}
		}, options||{});
		
		if (idx >= 0 && idx < this.items.length) {
			options.apply.call(this, this.items[idx].item, idx);
			return this.items[idx].item;
		} else {
			return -1;
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	Component.prototype.__walkItems = function(items, callback, context, args) {
		var self = this;
		var _dfd = $.Deferred();
		
		args = args || [];
		
		var __step = function() {
			// detect walking end
			if (!items.length) {
				_dfd.resolve();
				return;
			}
			// inject step item as first argument for the callback
			var _args = args;
			_args.unshift(items[0]);
			// run callback waiting for execution to end
			$.when(callback.apply(context,_args)).then(function() {
				items = items.slice(1);
				__step();
			});			
		};
		
		// startup walking and return DeferredObject
		__step();
		return _dfd.promise();
	};
	
	
	
	
	return Component;
	
});