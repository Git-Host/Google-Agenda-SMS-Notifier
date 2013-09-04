/**
 * ---[[    j Q B r i c k    ]]---
 * Bricks for Mobile App Directors
 * ===============================
 * 
 * Appliction Entry Point
 *
 */


define([
	"jqbrick",
	"sqlite"
	
], function(
	jQbrick
	
) {
	
	
	var App = jQbrick.App({
		sqlite: true
		
	}).onReady(function() {
		
		// setup todos table and trigger loading todos
		$.when(this.sqlite.query("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY DEFAULT NULL, title TEXT)")).then(function() {
			$("#todo-list").trigger("update");
		});
		
	});
	
	
	/**
	 * UI UPDATE:
	 * Refresh local todos list
	 */
	$(document).delegate("#todo-list", "update", function(e) {
		var $ul 	= $(e.target),
			query 	= null;
		
		setTimeout(function() {
			query = App.sqlite.list("SELECT * FROM todos");
			
			query.done(function(rows) {
				$ul.html("");
				$.each(rows, function(i, item) {
					$ul.append('<li data-icon="check"><a href="#todo-done" data-id="' + item.id + '">' + item.title + '</a></li>');
				});
				$ul.listview("refresh");
			});
		}, 0);
		
		return false;
	});
	
	
	/**
	 * UI EVENT:
	 * Handle new todo request
	 */
	$(document).delegate("#todo-add", "submit", function(e) {
		var $form 	= $(e.target),
			$input	= $form.find("input[type=text]"),
			todo	= $input.val()
			query	= null;
		
		setTimeout(function() {
			if (todo.length) {
				
				query = App.sqlite.insert({
					title: todo
				}, "todos");
				
				query.done(function() {
					$input.val("")[0].blur();
					$("#todo-list").trigger("update");
				});
				
				query.fail(function(err) {
					alert(err.message);
				});
			
			} else {
				alert("Please write your todo!");
			}
		}, 0);
		
		return false;
	});
	
	
	/**
	 * UI EVENT:
	 * Handle request of make a todo complete
	 */
	$(document).delegate("[href=#todo-done]", "click", function(e) {
		var $link 	= $(e.target),
			$li		= $link.parents("li"),
			$ul		= $li.parent(),
			todoId	= $link.attr("data-id"),
			query	= null;
		
		setTimeout(function() {
			query = App.sqlite.query("DELETE FROM todos WHERE id="+todoId);
			
			query.done(function(res) {
				$li.slideUp().promise().done(function() {
					$li.remove();
					$ul.listview("refresh");
				});
			});
		}, 0);
		
		return false;
	});
	
	
	
	
	
	
	/*
	
	jQbrick.App({
		
		sqlite: {
			schema: [{
				table: "colors",
				fields: [
					{name: "color", type: "varchar", len: 50}
				]
			}]
		},
		
		data: {
			steps: 0
		}
		
	}).onReady(function() {
		
		this.sqlite.query("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY DEFAULT NULL, title TEXT)");
		
		var $home = App.createPage({
			title: "Todo",
			content: '<ul data-role="listview"></ul>'
		});
		
		// setup footer ui
		$home.$footer = $(''
		+ '<div data-role="footer" data-theme="b" data-position="fixed">'
			+ '<form id="add" class="ui-grid-a" style="margin:3px 10px">'
				+ '<div class="ui-block-a" style="width:70%"><input type="text" data-clear-btn="true"></div>'
				+ '<div class="ui-block-b" style="width:30%;padding-top:3px"><input type="submit" value="Add"></div>'
			+ '</form>'
		+ '</div>').appendTo($home);
		
		
		$home.readyPromise.done(function() {
			$home.$content.find('ul').trigger("update");
		});
		
		// update tasks list
		$(document).delegate($home.$content.find('ul'), "update", function(e) {
			var $ul = $(e.target).html("");
			App.sqlite.list("SELECT * FROM todos", function(rows) {
				$.each(rows, function(i, item) {
					$ul.append('<li><a href="#done" data-id="' + item.id + '">' + item.title + '</a></li>');
				});
				$ul.listview("refresh");
			});
		});
		
		// handle add new task
		$(document).delegate("#add", "submit", function(e) {
			var todo = $(e.target).find("input[type=text]").val();
			if (!todo.length) return false;
				
			$.when(App.sqlite.insert({title:todo}, "todos")).then(function() {
				$(e.target).find("input[type=text]").val("");
				$(e.target).find("input[type=text]")[0].blur();
				$home.$content.find('ul').trigger("update");
			});
			
			return false;
		});
		
				
		
	}).onError(function() {
		console.log("Initialization errors occours!");
		
	});
	*/
				
});