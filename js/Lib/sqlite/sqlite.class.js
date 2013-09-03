/**
 * ---[[   S Q L i t e   ]]---
 * Mobile Db Abstraction Layer
 * ===========================
 * 
 * 
 */

define([
	"jquery", "async"
	
], function(
	$, Async
	
) {
	
	
	/**
	 * CONSTRUCTOR
	 */
	var SQLite = function(config) {
		
		this.db = null;
		
		// Deferred used by onReady(), onError() to listen to first connection attempt
		// to trigger success/error callbacks from outside.
		//
		// Is fulfilled at first connect() attempt!
		this.__readyDeferred = $.Deferred();
		this.readyPromise = this.__readyDeferred.promise();
		
		
		
		// single string argument as dbname
		if (typeof config == 'string') {
			config = {
				name: cfg
			};
		}
		
		// apply defaults to instance configuration
		this.config = $.extend({}, {
			
			// database connection informations
			name:		'SQLiteDb',
			desc:		'sqlite database',
			version:	'',	// should be left empty to load any db version and apply versionin rules automagically
			size:		3, // Mb
			
			// show or hides logging utilities
			// - true: display all logs
			// - false: hide all logs
			// - [integer]: display logs under that level
			debug:				true, 
			autoConnect:		true,
			
			// callbacks
			// (should return a DeferredObject to stop work flow untill callback's logic end)
			onCreate: 			function() {}, // only if db does not exists
			onConnect:			function() {}, // called ad every connection
			onReady:			function() {}, // last callback for database setup & connection process
			onError: 			function() {}, // if connection fails
			
			// stores database tables and fields.
			// is checked up ad db opening and serve to maintain up to date database structure.
			// SQLite.checkSchema()
			schema: [],
			
			// apply a change of version for the database.
			// each version step should declare queries to run or detailed logc function.
			// SQLite.checkVersion()
			versions: []
			
		}, config||{});
		
		
		// bind configuration's callback to connection events:
		$.when(this.readyPromise).then(
			$.proxy(this.config.onReady, this),
			$.proxy(this.config.onError, this)
		);
		
		
		// run implicit connection
		if (this.config.autoConnect) this.connect();
		
	};
	
	
	
	
	/**
	 * Flow callbacks binding utilities
	 */
	SQLite.prototype.onReady = function(callback) {
		this.readyPromise.done(callback);
		return this;
	};
	
	
	SQLite.prototype.onError = function(callback) {
		this.readyPromise.fail(callback);
		return this;
	};
	
	
	
	
	
	
	/**
	 * Internal "console.log" wrappet to display internal logs
	 * based on "this.config.debug" value
	 */
	SQLite.prototype.log = function() {
		var args = arguments;
		var levl = 2;
		
		if (args.length && $.isNumeric(args[0])) {
			levl = args[0];
			args = Array.prototype.slice.call(args, 1, args.length);
		}
		
		if (this.config.debug === true || ($.isNumeric(this.console.debug) && levs <= this.console.debug)) {
			console.log.apply(console, args);
		};
		
		return this;
	};
	
	
	
	
	
	/**
	 * Internal utility methods to build up standard configuration
	 * objects to run SQL logic and return DeferredPromise with
	 * binded callbacks from configuration istelf.
	 *
	 * Any SQL related methods should be called as follow:
	 *
	 *     // with params
	 *     db.query("SELECT *", successCallback, errorCallback);
	 *     db.query("INSERT ... [?,?]", ["a", "b"], successCallback, errorCallback);
	 *     
	 *     // with configuration object
	 *     db.query({
	 *       query: "INSERT ... [?,?]",
	 *       data: ["a", "b"],
	 *       success: successCallback,
	 *       ...
	 *     });
	 *
	 * ## DeferredPromise: 
	 * every SQL related methods return a DeferredPromise
	 * object with already binded "success", "error" and "complete" callbacks.
	 *
	 * ## Transaction Rollback:
	 * 
	 * 
	 */
	SQLite.prototype.configQuery = function(config) {
		
		var args = arguments;
		
		// "SQL" query from params
		if (args.length && (typeof args[0] == "string" || $.isArray(args[0]))) {
			config = {query:args[0]};
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		// "data" array from params
		if (args.length && typeof args[0] == "array") {
			config = {data:args[0]};
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		// "success" callback from params
		if (args.length && typeof args[0] == "function") {
			config.success = args[0];
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		// "error" callback from params
		if (args.length && typeof args[0] == "function") {
			config.error = args[0];
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		return $.extend({},{
			query: 		'',
			data: 		[],
			success: 	function(res, config) {},
			error: 		function(err, config) {},
			complete: 	function() {},
			context: 	this,
			rollback:	true
		}, config);
	};
	
	SQLite.prototype.configDeferred = function(config) {
		return new $.Deferred()
			.done(config.success)
			.fail(config.error)
			.always(config.complete)
		;
	};
	
	
	return SQLite;
	
});