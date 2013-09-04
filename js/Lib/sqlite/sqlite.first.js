/**
 * ---[[   S Q L i t e   ]]---
 * Mobile Db Abstraction Layer
 * ===========================
 * 
 * Try to read the first record from a given query.
 * - success: only if that first record exists
 * - error: if empty recordset or if other errors
 *
 */

define([
	"jquery",
	"./sqlite.class"
	
], function(
	$,
	SQLite
	
) {
	
	SQLite.prototype.first = function() {
		
		var self = this,
			rows = [],
			_cfg = this.configQuery.apply(this, arguments),
			_dfd = this.configDeferred(_cfg);
		
		// -- evt queque postponer
		setTimeout(function() {
			
			// @TODO: try to automagically add "LIMIT 0,1" to the given query
			
			self.read({
				query	: _cfg.query,
				data	: _cfg.data,
				success	: function(rows) {
					if (rows.length) {
						_dfd.resolveWith(self, [rows[0], _cfg]);
					} else {
						_dfd.rejectWith(self, [Error("empty recordset"), _cfg]);
					}
				},
				error	: function(err) {
					_dfd.rejectWith(self, [err, _cfg]);
				}
			});
		
		}, 0); // evt queque postponer --
		return _dfd.promise();
	};
		
});