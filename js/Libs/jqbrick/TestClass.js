/**
 * ---[[    jQBE    ]]---
 * Bricks for Mobile Apps
 * =======================
 * 
 * Basic TestClass to be extended to create unit testing tools
 *
 */


define([
	"jquery", "underscore", "backbone",
	"./lib.utils"

], function(
	$, _, Backbone,
	LibUtils

) {
	
	
	var TestClass = function() {this.__construct__.apply(this,arguments)};
	
	// Inherith extend capability from Backbone.extend() utility
	TestClass.extend 	= Backbone.View.extend;
	TestClass.utils 	= new LibUtils();
	
	
	
	/**
	 * Test Cases Defaults
	 * they should be overridden by TestCases subclasses or
	 * by TestCase instances options
	 */
	TestClass.prototype.autoRun 	= true;
	TestClass.prototype.viewport 	= 'body';
	TestClass.prototype.timeout 	= 500;
	
	
	TestClass.prototype.__construct__ = function(options) {
		
		// you should give a viewport XPath as single string param
		if (_.isString(options)) options = {viewport:options};
		
		this.options = $.extend({}, {
			autoRun:	this.autoRun,
			viewport:	this.viewport,
			timeout:	this.timeout
		}, options||{});
		
		if (this.options.autoRun) {
			this.run();
		}
		
	};
	
	
	/**
	 * TestCase subclasses should override this method with test's
	 * logic code...
	 */
	TestClass.prototype.run = function() {
		return this;
	};
	
	
	
	
	
	
	return TestClass;
	
});