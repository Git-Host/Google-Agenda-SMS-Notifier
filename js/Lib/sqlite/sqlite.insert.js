/**
 * ---[[   S Q L i t e   ]]---
 * Mobile Db Abstraction Layer
 * ===========================
 * 
 * 
 */

define([
	"jquery",
	"./sqlite.class"
	
], function(
	$,
	SQLite
	
) {
	
	
	
	/**
	 * It run a single SQL statement inside a transaction
	 */
	SQLite.prototype.insert = function() {
		
		var self = this,
			args = arguments,
			_err = null,
			_cfg = this.configQuery.apply(this, []),
			_dfd = null;
		
		// first param must be insert data object
		if (args.length && $.isPlainObject(args[0])) {
			_cfg.data = args[0];
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		// second param should be a configuration object
		if (args.length && $.isPlainObject(args[0])) {
			_cfg = $.extend({}, _cfg, args[0]);
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		// ... or a string for target's table name
		if (args.length && typeof args[0] == "string") {
			_cfg.table = args[0];
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		// "success" callback from params
		if (args.length && typeof args[0] == "function") {
			_cfg.success = args[0];
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		// "error" callback from params
		if (args.length && typeof args[0] == "function") {
			_cfg.error = args[0];
			args = Array.prototype.slice.call(args, 1, args.length);
		};
		
		// build configuration defaults and sync DeferredObject
		_cfg = $.extend({}, {table : ""}, _cfg);
		_dfd = this.configDeferred(_cfg);
		
		// -- evt queque postponer
		setTimeout(function() {
			
			self.query({
				query	: self._buildInsertSql(_cfg.data, _cfg.table),
				success	: function(res) {
					_dfd.resolveWith(self, [res, _cfg]);
				},
				error	: function(err) {
					_dfd.rejectWith(self, [err, _cfg]);
				}
			});
			
		}, 0); // evt queque postponer --
		return _dfd.promise();
	};
	
		
});