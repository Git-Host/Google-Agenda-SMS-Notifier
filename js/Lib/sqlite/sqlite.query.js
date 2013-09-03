/**
 * ---[[   S Q L i t e   ]]---
 * Mobile Db Abstraction Layer
 * ===========================
 * 
 * 
 */

define([
	"jquery", "async",
	"./sqlite.class"
	
], function(
	$, Async,
	SQLite
	
) {
	
	
	
	/**
	 * It run a single SQL statement inside a transaction
	 */
	SQLite.prototype.query = function() {
		
		var self = this,
			_cfg = this.configQuery.apply(this, arguments),
			_dfd = this.configDeferred(_cfg);
		
		// -- evt queque postponer
		setTimeout(function() {
			
			if (!self.db) {
				_dfd.rejectWith(_cfg.context, [Error("missing db connection!"), _cfg]);
				return _dfd.promise();
			};
			
			self.db.transaction(function(tx) {
				
				tx.executeSql(_cfg.query, _cfg.data, function(tx, res) {
					_dfd.resolveWith(_cfg.context, [res, _cfg]);
					
				}, function(tx, err) {
					if (_cfg.rollback) return true;
					_dfd.rejectWith(_cfg.context, [err, _cfg]);
				});
				
			}, function(err) {
				_dfd.rejectWith(_cfg.context, [err, _cfg]);
			});
		
		}, 0); // evt queque postponer --
		return _dfd.promise();
	};
	
	
	
	
	
	
	/**
	 * It run a number of query in both series or parallel mode providing
	 * a global DeferredPromise who fulfil when all queries have been processed
	 *
	 * by default "series" mode is used but you can activate a "parallel:true"
	 * option if you don't care execution order.
	 *
	 * when doing queries in parallel care about "parallelLimit" option who
	 * rule maximum amount of queries who can run in parallel.
	 * (this may depend on device hardware!)
	 */
	SQLite.prototype.many = function() {
		
		var self = this,
			_cfg = this.configQuery.apply(this, arguments),
			_dfd = this.configDeferred(_cfg),
			tasks = [],
			doneQueries = [], 
			failedQueries = [];
		
		// -- evt queque postponer
		setTimeout(function() {
		
			// add local configuration params default values
			_cfg = $.extend({}, {
				parallel		: false,
				parallelLimit	: 20,
				stepSuccess		: function(res, config) {},
				stepError		: function(res, config) {},
				stepComplete	: function(xxx, config) {}
			}, _cfg);
		
			// build a task list to be executed with Async library
			// each task executes a single SQL statement from queries array
			$.each(_cfg.query, function(i,q) {
				tasks.push(function(callback) {
					self.query({
						query	: q,
						data	: _cfg.data,
						rollback: _cfg.rollback,
						success	: function(res, config) {
							_cfg.stepSuccess.apply(self, [res, {query:q}]);
							doneQueries.push(q);
						},
						error	: function(err, config) {
							_cfg.stepError.apply(self, [res, {query:q}]);
							failedQueries.push(q);
						},
						complete: function() {
							_cfg.stepComplete.apply(self, [{query:q}]);
							callback();	
						}
					});
				});
			});
			
			// run created tasks by reqest mode
			if (_cfg.parallel) {
				Async.parallelLimit(tasks, _cfg.parallelLimit, complete);
			} else {
				Async.series(tasks, complete);
			};
			
			// tasks done callback to resolve internal DeferredPromise
			function complete() {
				if (doneQueries.length == _cfg.query.length) {
					_dfd.resolveWith(_cfg.context, [doneQueries, _cfg]);
				} else {
					_dfd.rejectWith(_cfg.context, [undoneQueries, _cfg, doneQueries]);
				}
			};
		
		}, 0); // evt queque postponer --
		return _dfd.promise();
	};
	
});