/**
 * ---[[   S Q L i t e   ]]---
 * Mobile Db Abstraction Layer
 * ===========================
 * 
 * Query method specialized in output a list of fetched row's objects instead of a 
 * resultset. 
 *
 */

define([
	"jquery",
	"./sqlite.class"
	
], function(
	$,
	SQLite
	
) {
	
	SQLite.prototype.read = function() {
		
		var self = this,
			rows = [],
			_cfg = this.configQuery.apply(this, arguments),
			_dfd = this.configDeferred(_cfg);
		
		// -- evt queque postponer
		setTimeout(function() {
			
			if (!self.db) {
				_dfd.rejectWith(_cfg.context, [Error("missing db connection!"), _cfg]);
				return _dfd.promise();
			};
			
			self.query({
				query	: _cfg.query,
				data	: _cfg.data,
				success	: function(res) {
					
					// transform a resultset into an array of row objects
					for ( var i=0; i<res.rows.length; i++ ) {
						rows.push(res.rows.item(i));
					};
					
					_dfd.resolveWith(self, [rows, _cfg])
				},
				error	: function(err) {
					_dfd.rejectWith(self, [err, _cfg])
				}
			});
		
		}, 0); // evt queque postponer --
		return _dfd.promise();
	};
		
});