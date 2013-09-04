/**
 * ---[[   S Q L i t e   ]]---
 * Mobile Db Abstraction Layer
 * ===========================
 * 
 * This method acts much like "read" but it never reject ot output errors.
 * If something goes wrong it simply output an empty array.
 *
 */

define([
	"jquery",
	"./sqlite.class"
	
], function(
	$,
	SQLite
	
) {
	
	SQLite.prototype.list = function() {
		
		var self = this,
			rows = [],
			_cfg = this.configQuery.apply(this, arguments),
			_dfd = this.configDeferred(_cfg);
		
		// -- evt queque postponer
		setTimeout(function() {
			
			self.read({
				query	: _cfg.query,
				data	: _cfg.data,
				success	: function(rows) {
					_dfd.resolveWith(self, [rows, _cfg])
				},
				error	: function(err) {
					_dfd.resolveWith(self, [rows, _cfg])
				}
			});
		
		}, 0); // evt queque postponer --
		return _dfd.promise();
	};
		
});