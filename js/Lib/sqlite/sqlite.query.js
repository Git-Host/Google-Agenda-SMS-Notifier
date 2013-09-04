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
	SQLite.prototype.query = function() {
		
		var self = this,
			_err = null,
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
					_err = err; // propagate query error to the rollback error handler to propagate it outside this method
					if (_cfg.rollback) return true;
					_dfd.rejectWith(_cfg.context, [_err, _cfg]);
				});
				
			}, function(err) {
				_dfd.rejectWith(_cfg.context, [_err, _cfg]);
			});
		
		}, 0); // evt queque postponer --
		return _dfd.promise();
	};
	
		
});