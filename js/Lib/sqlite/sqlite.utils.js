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
	SQLite.prototype._buildInsertSql = function(fields, table) {
		var l1 = '';
		var l2 = '';
		
		$.each(fields, function(key, val) {
			l1 += key+',';
			l2 += '\'' + val.toString().replace(/\'/g, "''") + '\',';
		});
		
		return 'INSERT INTO ' + table + ' (' + l1.substr(0, l1.length-1) + ') VALUES (' + l2.substr(0, l2.length-1) + ')';
	};
	
		
});