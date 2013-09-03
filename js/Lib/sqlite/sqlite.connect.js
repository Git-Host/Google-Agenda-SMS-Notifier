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
	
	
	
	SQLite.prototype.connect = function() {
		var self = this;
		var _dfd = $.Deferred();
		
		this.log("### Start Connect");
		
		Async.series([
			$.proxy(__connect__, this),
			$.proxy(__schema__, this),
			$.proxy(__version__, this)
			
		], function(err) {
			
			self.log("### Connect Cycle End");
			
			if (err) {
				_dfd.rejectWith(this, [err]);
			} else {
				_dfd.resolveWith(this);	
			}
		});
		
		// bind "readyDeferred" to first connection attempt:
		if (this.__readyDeferred.state() == "pending") {
			$.when(_dfd).then(function() {
				self.__readyDeferred.resolveWith(self);
			}, function(err) {
				self.__readyDeferred.rejectWith(self, [err]);
			});
		}
		
		return _dfd.promise();
	};
	
	
	
	
	
	/**
	 * -- Initialization ASYNC Step --
	 * is responsible to establish a real connection with the database and
	 * to throw create/connect callbacks
	 */
	var __connect__ = function(callback) {
		this.log("##### __connect__");
		
		var self = this;
		var isnw = false;
		
		try {
			this.db = openDatabase(
				this.config.name, 
				this.config.version, 
				this.config.desc, 
				this.config.size * 1024 * 1024, 
				function() {isnw = true}
			);
		} catch (err) {
			return callback(err);
		};
		
		// run onCreate, onConnect callbacks one after one 
		setTimeout(function() {
			Async.series([
				// onCreate callback
				function(callback) {
					if (!isnw) return callback();
					self.log("throw: onCreate() callback");
					$.when(self.config.onCreate.apply(self)).then(callback,function(err) {
						if (!err) err = Error("onCreate(): rjected promise");
						callback(err);
					});
				}, 
				// onConnect callback
				function(callback) {
					self.log("throw: onConnect() callback");
					$.when(self.config.onConnect.apply(self)).then(callback,function(err) {
						if (!err) err = Error("onConnect(): rjected promise");
						callback(err);
					});
				}
			], callback);
		}, 0);
		
	};
	
	var __schema__ = function(callback) {
		this.log("##### __schema__");
		callback();
	};
	
	var __version__ = function(callback) {
		this.log("##### __version__");
		callback();
	};
	
	
	
});