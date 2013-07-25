/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Layout Library
 * allow to collect and dinamically inject layout manager objects
 *
 */

define(["backbone", "./layout.Default"], function(Backbone, DefaultLayout) {
	
	var LibLayout = function(jQbrick) {
		this.jQbrick = jQbrick;
		this.__layouts = {};
	};
	
	LibLayout.prototype.register = function(name, obj) {
		this.__layouts[name] = obj;
	};
	
	
	LibLayout.prototype.get = function(name) {
		if (this.__layouts[name])	{
			return this.__layouts[name];
		} else {
			return DefaultLayout;
		}
	};
	
	
	return LibLayout;
	
});