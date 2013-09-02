/**
 * ---[[   S Q L i t e   ]]---
 * Mobile Db Abstraction Layer
 * ===========================
 * 
 * AMD Depedencies
 * - jQuery
 * - async.js
 * 
 */
define([
	"jquery", "async",
	
	// modules
	"./sqlite.class"
	
], function(
	$, Async,
	
	// modules
	SQLite
	
) {
	
	
	SQLite.prototype.initialize = function() {};
	
	
	return SQLite;
	
});