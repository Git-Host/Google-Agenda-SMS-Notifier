/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * General Web Application Package
 *
 */


define([
	"./core/jqbrick",
	"./core/AppClass"

], function(
	jQbrick,
	AppClass

) {
	
	var WebAppClass = AppClass.extend({
		
		startupUi: function() {
			return this.displayBody();
		}
	
	});
	
	
	/**
	 * AMD Output
	 * export an instance of jQbrick namespace so all features should be
	 * globally accessed and extended.
	 */
	
	var config = {
		build: "webapp",
		core: {
			"AppClass" : WebAppClass
		}
	};
	
	if (!window.jQbrick) {
		window.jQbrick = new jQbrick(config);
	}
	
	return window.jQbrick;
	
});
