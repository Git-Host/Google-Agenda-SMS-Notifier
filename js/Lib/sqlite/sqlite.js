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
	"./sqlite.class",
	
	// methods
	"./sqlite.connect",
	"./sqlite.query"
	
], function(
	$, Async,
	SQLite
	
) {
		
	return SQLite;
	
});


/*
===============  N O T E S  =====================

## onCreate, onConnect, onReady, onError
all these callbacks receive class instance as default execution context

## onCreate(), onConnect()
- should return an Error() object who interrupt connection cycle and generate a general connection error as global db error
- should return a DeferredPromise to be solved to handle async logic in callbacks. 
  rejecting a DeferredPromise stop connection cycle and generate a global error.
  you are pleased to reject with a custom error: dfd.reject(Error("custom error message"));




*/

