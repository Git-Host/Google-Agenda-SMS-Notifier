/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Utility Library
 * it is attached to all jQbrick namespaces and objects constructorr under "utils" attribute!
 *
 */

define(["backbone", "./view.View"], function(Backbone, View) {
	
	var LibXType = function(jQbrick) {
		this.jQbrick = jQbrick;
		this.__types = {};
	};
	
	LibXType.prototype.register = function(name, obj) {
		this.__types[name] = obj;
	};
	
	
	LibXType.prototype.get = function(name) {
		if (this.__types[name])	{
			return this.__types[name];
		} else {
			return View;
		}
	};
	
	
	LibXType.prototype.make = function(xtype, options, parent) {
		
		// inerith defaults from parent's instance informations
		if (parent && parent.options) {
			var defaults = parent.options.xtype || {};
			if (_.isString(defaults)) defaults = {xtype:defaults};
			defaults.parent = parent;
			
		} else var defaults = {};
		
		options = $.extend({}, defaults, options);
		xtype 	= xtype || options.xtype || "view";
		
		return new (this.get(xtype))(options);
		
	};
	
		
	return LibXType;
	
});