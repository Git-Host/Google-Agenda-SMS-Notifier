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
		var self = this;
		var _dfd = $.Deferred();
		
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
		
		// waith for items initialization to solve.
		// DOM manipulation are done after all items are ready inside component $el
		$.when(this._initializeItems()).always(function() {
			self.__appendToContainer();
			_dfd.resolve();
		});
		
		return _dfd;	
	};
	
	/**
	 * Items initialization run "addItems()" in silent mode because this is not
	 * an explicit items addition but just an initialization of the entire component
	 */
	Component.prototype._initializeItems = function() {
		this.items = [];
		if (!this.options.items || !this.options.items.length) {
			return true;
		}
		return this.addItems(this.options.items, {
			defaults: 		this.options.itemDefaults,
			overrides: 		{autoRender:false},
			silent: 		false,
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
	 * Add New Items
	 *
	 * @TODO: initialization data should have an "active:false" key so that
	 * item starts inactive... it is initialized but not rendered!
	 */
	Component.prototype.addItems = function(items, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		if (!_.isArray(items)) {
			items = [items];
		};
		
		if (_.isBoolean(options)) {
			options = {getDeferred:options};
		};
		
		options = $.extend({}, {
			silent:			null,
			getDeferred:	true,
			success:		function(items) {},
			error:			function() {}
		}, options||{});
		
		return this.__performOnComponentItems(self.addItem, items, options, "beforeAddItems", "addItems");
	};
	
	Component.prototype.addItem = function(item, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		options = $.extend({}, {
			defaults: 		{},
			overrides: 		{},
			active:			true,
			
			silent:			null,
			getDeferred:	true,
			success:		function() {},
			error:			function() {}
		}, options||{});
		
		// listen to an item's "active" property and propagate to the creation options.
		if (_.isBoolean(item.active)) {
			options.active = item.active;
		}
		
		return this.__performOnComponentItem(self.__addItem, item, options, "beforeAddItem", "addItem");
	};
	
	Component.prototype.__addItem = function(item, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		// Configuration object, create new XType
		// defaults and overrides from options are applied before creating new object
		if (this.utils.isPlainObject(item)) {
			item = $.extend({}, options.defaults, item, options.overrides);
			var _item = this.xtype.make(null, item, this);
			
		// Existing Object Instance:
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
			$.when(_item.getDeferred("initialized")).then(function() {
				self.items.push({
					item:	_item,
					active:	options.active
				});
				
				// remove inactive item from the DOM the quick possible way.
				// here i don't use high level APIs such "item.remove()"
				// because I just don't want item's HTML inside component's DOM now.
				if (!options.active) _item.$el.remove();
				
				_dfd.resolve(_item, self.items.length-1);
				
			}, _dfd.reject);
		} else {
			_dfd.reject();
		}
		
		return _dfd.promise();
	};
	
	
	
	
	
	
	
	
	/**
	 * Remove Items
	 */
	
	Component.prototype.removeItems = function(items, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		if (!_.isArray(items)) {
			items = [items];
		};
		
		if (_.isBoolean(options)) {
			options = {getDeferred:options};
		};
		
		options = $.extend({}, {
			silent:			null,
			getDeferred:	false,
			success:		function(items) {},
			error:			function() {}
		}, options||{});
		
		return this.__performOnComponentItems(self.removeItem, items, options, "beforeRemoveItems", "removeItems");
	};
	
	Component.prototype.removeItem = function(item, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		options = $.extend({}, {
			silent:			null,
			getDeferred:	true,
			success:		function() {},
			error:			function() {}
		}, options||{});
		
		return this.__performOnComponentItem(self._removeItem, item, options, "beforeRemoveItem", "removeItem");
	};
	
	Component.prototype._removeItem = function(item) {
		var self 	= this;
		var _dfd 	= $.Deferred();
		var _item 	= this.getItem(item);
		
		if (_item !== -1) {
			if (this.hasItem(_item)) {
				$.when(_item.remove()).then(function() {
					var _itemPos = self.itemPos(_item);
					self.items.splice(_itemPos, 1);
					_dfd.resolve(_item, _itemPos);
				});
			} else {
				_dfd.reject();
			}		
		} else {
			_dfd.reject();
		}
		
		return _dfd.promise();		
	};


	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * Enable Items
	 */
	
	Component.prototype.enableItems = function(items, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		if (!_.isArray(items)) {
			items = [items];
		};
		
		if (_.isBoolean(options)) {
			options = {getDeferred:options};
		};
		
		options = $.extend({}, {
			silent:			null,
			getDeferred:	false,
			success:		function(items) {},
			error:			function() {}
		}, options||{});
		
		return this.__performOnComponentItems(self.enableItem, items, options, "beforeEnableItems", "enableItems");
	};
	
	Component.prototype.enableItem = function(item, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		options = $.extend({}, {
			silent:			null,
			getDeferred:	true,
			success:		function() {},
			error:			function() {}
		}, options||{});
		
		return this.__performOnComponentItem(self.__enableItem, item, options, "beforeEnableItem", "enableItem");
	};
	
	Component.prototype.__enableItem = function(item) {
		var _dfd = $.Deferred();
		
		if ((item = this.getItem(item)) !== -1) {
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
				this.items[idx].item.$el.appendTo(this.$body);
			}
			
			_dfd.resolve(item, this.itemPos(item));
		} else {
			_dfd.reject();
		}
		
		return _dfd.promise();
	};
	
	
	
	
	
	
	
	
	
	/**
	 * Disable Items
	 */
	
	Component.prototype.disableItems = function(items, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		if (!_.isArray(items)) {
			items = [items];
		};
		
		if (_.isBoolean(options)) {
			options = {getDeferred:options};
		};
		
		options = $.extend({}, {
			silent:			null,
			getDeferred:	false,
			success:		function(items) {},
			error:			function() {}
		}, options||{});
		
		return this.__performOnComponentItems(self.disableItem, items, options, "beforeDisableItems", "disableItems");
	};
	
	Component.prototype.disableItem = function(item, options) {
		var self = this;
		var _dfd = $.Deferred();
		
		options = $.extend({}, {
			silent:			null,
			getDeferred:	true,
			success:		function() {},
			error:			function() {}
		}, options||{});
		
		return this.__performOnComponentItem(self.__disableItem, item, options, "beforeDisableItem", "disableItem");
	};
	
	Component.prototype.__disableItem = function(item, options) {
		var _dfd = $.Deferred();
		
		if ((item = this.getItem(item)) !== -1) {
			this.items[this.itemPos(item)].active = false;
			this.items[this.itemPos(item)].item.$el.remove();
			
			_dfd.resolve(item, this.itemPos(item));
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
// ----------------------------------------- //
// ---[[   R E C A P   M E T H O D S   ]]--- //
// ----------------------------------------- //
//
// following method tries to recap repeated logic
// to maintain APIs methods as DRY as possibile!
// 
// 


	
	Component.prototype.__walkItems = function(items, callback, context, args) {
		var self 	= this;
		var _dfd 	= $.Deferred();
		var _items 	= []; // resolved items
		
		args = args || [];
		
		var __step = function() {
			// detect walking ends and return items who resolved
			if (!items.length) {
				_dfd.resolve(_items);
				return;
			}
			
			// inject step item as first argument for the callback
			var _args = [items[0]].concat(args);
			
			// run callback waiting for execution to end
			$.when(callback.apply(context, _args)).done(function() {
				_items.push(items[0]);
			}).always(function() {
				items = items.slice(1);
				__step();
			});			
		};
		
		// startup walking and return DeferredObject
		__step();
		return _dfd.promise();
	};
	
	
	/**
	 * Apply "__walkItems()" with custom METHOD_NAME on given ITEMS array.
	 * it is used by:
	 * - addItems()
	 * - removeItems()
	 *
	 * options.silent - is used to decide if to throw callbacks (BEFORE, AFTER) or not.
	 * options.getDeferred - is used to decide if to return an execution complete DeferredObject or instance itself.
	 */
	
	Component.prototype.__performOnComponentItems = function(__METHOD_NAME__, __ITEMS__, __OPTIONS__, __BEFORE__, __AFTER__) {
		var self = this;
		var _dfd = $.Deferred();
		
		// collect object who have been really involved into the action
		var _involvedItems 	= [];
		
		// shortcut to walk through items initialization
		var __applyWalkingLogic = function() {
			return self.__walkItems(__ITEMS__, __METHOD_NAME__, self, [$.extend({}, __OPTIONS__, {
				getDeferred: 	true,
				silent: 		__OPTIONS__.silent === false ? false : true,
				success: 		function(_item, _itemPos) {_involvedItems.push(_item)},
				error:			function() {}
			})]);
		};
		
		// silent mode
		if (__OPTIONS__.silent) {
			$.when(__applyWalkingLogic()).then(function() {
				_dfd.resolve(_involvedItems);
			}, _dfd.reject);
		
		// verbose - trigger blocking events
		} else {
			$.when(self.apply(__BEFORE__, {items:__ITEMS__, options:__OPTIONS__}, {trigger:true})).then(function() {
				$.when(__applyWalkingLogic()).then(function() {
					$.when(self.apply(__AFTER__, {items:_involvedItems}, {trigger:true})).then(function() {
						_dfd.resolve(_involvedItems);
					}, _dfd.reject);
				}, _dfd.reject);
			}, _dfd.reject);
		}
		
		
		// throw direct callbacks from given options
		// these are non-blocking callbacks
		$.when(_dfd).then(
			_.bind(__OPTIONS__.success, self),
			_.bind(__OPTIONS__.error, self)
		);
		
		
		
		if (__OPTIONS__.getDeferred) {
			return _dfd;
		} else {
			return this;
		}
		
	};
	
	
	/**
	 * Run an internal METHOD_NAME on a given ITEM + OPTIONS.
	 * used by:
	 * - addItem()
	 * - removeItem()
	 * 
	 * options.silent - is used to decide if to throw callbacks (BEFORE, AFTER) or not.
	 * options.getDeferred - is used to decide if to return an execution complete DeferredObject or instance itself.
	 */
	Component.prototype.__performOnComponentItem = function(__METHOD_NAME__, __ITEM__, __OPTIONS__, __BEFORE__, __AFTER__) {
		var self = this;
		var _dfd = $.Deferred();
		
		// remove item in silent mode
		if (__OPTIONS__.silent) {
			$.when(__METHOD_NAME__.call(self, __ITEM__, __OPTIONS__)).then(function(_item) {
				_dfd.resolve(_item);
			},_dfd.reject);
		
		// remove item within "xxxRemoveItem" events chain
		} else {
			$.when(self.apply(__BEFORE__, {item:__ITEM__, options:__OPTIONS__}, {trigger:true})).then(function() {
				$.when(__METHOD_NAME__.call(self, __ITEM__, __OPTIONS__)).then(function(_item, _itemPos) {
					$.when(self.apply(__AFTER__, {item:_item, pos:_itemPos}, {trigger:true})).then(function() {
						_dfd.resolve(_item);
					},_dfd.reject);
				}, _dfd.reject);
			}, _dfd.reject);	
		};
		
		// throw direct callbacks from given options
		// these are non-blocking callbacks
		$.when(_dfd).then(
			_.bind(__OPTIONS__.success, self),
			_.bind(__OPTIONS__.error, self)
		);
		
		if (__OPTIONS__.getDeferred) {
			return _dfd.promise();
		} else {
			return this;
		}
		
	};
	
	
	
	
	return Component;
	
});