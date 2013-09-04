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
	SQLite.prototype.insertMany = function() {
		
		var self = this,
			args = arguments,
			_err = null,
			_cfg = this.configQuery.apply(this, []),
			_dfd = null;
		
		// first param must be insert data object
		if (args.length && $.isArray(args[0])) {
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
			
			var done 	= [],
				undone 	= [],
				cfgMany = {
					query: [],
					stepSuccess: function(res, stepCfg) {
						var stepResult = {
							insertId: res.insertId,
							query	: stepCfg.query,
							data	: _cfg.data[cfgMany.query.indexOf(stepCfg.query)]
						};
						done.push(stepResult);
						_dfd.notifyWith(_cfg.context, [stepResult, _cfg]);
					},
					stepError: function(err, stepCfg) {
						var stepResult = {
							err		: err,
							data	: _cfg.data[cfgMany.query.indexOf(stepCfg.query)]
						};
						undone.push(stepResult);
						_dfd.notifyWith(_cfg.context, [stepResult, _cfg]);
					},
					success: function(res) {
						_dfd.resolveWith(_cfg.context, [done, _cfg]);
					},
					error: function(err) {
						_dfd.rejectWith(_cfg.context, [undone, _cfg, done]);
					}
				};
			
			// import config to pass to many() API
			if (_cfg.parallel) cfgMany.parallel = _cfg.parallel;
			if (_cfg.parallelLimit) cfgMany.parallelLimit = _cfg.parallelLimit;
			
			// build many queries
			$.each(_cfg.data, function(i, item) {
				cfgMany.query.push(self._buildInsertSql(item, _cfg.table));
			});
			
			// run many queries
			self.many(cfgMany);
			
		}, 0); // evt queque postponer --
		return _dfd.promise();
	};
	
		
});