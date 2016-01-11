/* NODE JS MODULES */
var express = require('express'),
	nconf = require('nconf'),
	mysql = require('mysql');


/* CONFIGURATIONS */
nconf.argv()
	.env()
	.file({ file: nconf.get('config') || 'config.json' });


/* CONNECT TO MYSQL DATABASE */
var connection = mysql.createConnection(nconf.get('connection'));
connection.connect();


/* ADD USER CONTENT */
exports.insert = function (userID, table, data, callback){
	console.log('USER CONTENT - insert user content of type '+table);
	// select correct table name for content type
	switch (table){
		case 'scenes':
			table = 'UserScenes';
			break;
		case 'enemies':
			table = 'UserEnemies';
			break;
		case 'items':
			table = 'UserItems';
			break;
	}
	// insert data into table
	connection.query("INSERT INTO "+table+" VALUES (NULL,?,"+data+");", [userID], function (err, rows){
		if(err) return callback(err);
		return callback(false, rows);
	});
};

/* EDIT USER CONTENT */
exports.update = function (id, userID, table, data, callback){
	console.log('USER CONTENT - update user content of type '+table);
	// select correct table name for content type
	switch (table){
		case 'scenes':
			table = 'UserScenes';
			break;
		case 'enemies':
			table = 'UserEnemies';
			break;
		case 'items':
			table = 'UserItems';
			break;
	}
	console.log(data);
	// update table data
	connection.query("UPDATE "+table+" SET "+data+" WHERE id=? AND userID=?", [id, userID], function (err, response){
		if(err) return callback(err);
		return callback(false);
	});
};


/* DELETE USER CONTENT */
exports.delete = function (id, userID, table, callback){
	console.log('USER CONTENT - delete user content of type '+table);
	// select correct table name for content type
	switch (table){
		case 'scenes':
			table = 'UserScenes';
			break;
		case 'enemies':
			table = 'UserEnemies';
			break;
		case 'items':
			table = 'UserItems';
			break;
	}
	// delete data from table
	connection.query("DELETE FROM "+table+" WHERE id=? AND userID=?", [id, userID], function (err, response){
		if(err) return callback(err);
		return callback(false);
	});
};


/* SELECT USER CONTENT */
exports.selectPreviewForAll = function (userID, callback){
	console.log('USER CONTENT - load menue preview of user contents');
	// select data about user created characters
	connection.query("SELECT name, imagepath FROM UserCharacters WHERE userID=?;", [userID], function (err, characters){
		if(err) return callback(err);
		// select data about user created scenes
		connection.query("SELECT name, imagepath FROM UserScenes WHERE userID=?;", [userID], function (err2, scenes){
			if(err2) return callback(err2);
			// select data about user created enemies
			connection.query("SELECT name, imagepath FROM UserEnemies WHERE userID=?;", [userID], function (err3, enemies){
				if(err3) return callback(err3);
				// select data about user created items
				connection.query("SELECT name, imagepath FROM UserItems WHERE userID=?;", [userID], function (err4, items){
					if(err4) return callback(err4);
					return callback (null, {characters:characters, scenes:scenes, enemies:enemies, items:items});
				});
			});
		});
	});
};

exports.selectByUser = function (userID, table, callback){
	console.log('USER CONTENT - select content for user of type '+table);
	// select correct table name for content type
	switch (table){
		case 'characters':
			table = 'UserCharacters';
			break;
		case 'scenes':
			table = 'UserScenes';
			break;
		case 'enemies':
			table = 'UserEnemies';
			break;
		case 'items':
			table = 'UserItems';
			break;
	}
	// select all table datas
	connection.query("SELECT * FROM "+table+" WHERE userID=?;", [userID], function (err, rows){
		if(err) return callback(err);
		return callback (null, {rows:rows});
	});
};

exports.selectById = function (id, userID, table, callback){
	console.log('USER CONTENT - select for user with id '+userID+' content with '+id+' from table '+table);
	var categoryTable = false;
	// select correct table name for content type
	switch (table){
		case 'characters':
			table = 'UserCharacters';
			break;
		case 'scenes':
			table = 'UserScenes';
			categoryTable = 'SceneCategories';
			break;
		case 'enemies':
			table = 'UserEnemies';
			categoryTable = 'EnemieCategories';
			break;
		case 'items':
			table = 'UserItems';
			categoryTable = 'ItemCategories';
			break;
	}
	// select all table datas
	connection.query("SELECT * FROM "+table+" WHERE id=? AND userID=?;", [id, userID], function (err, rows){
		if(err) return callback(err);
		if(table==='UserCharacters'){
			connection.query("SELECT * FROM Attributeset WHERE id=?;", [rows[0].attributeset], function (err2, attributeValues){
				if(err2) return callback(err2);
				connection.query("SELECT * FROM Skillset WHERE id=?;", [rows[0].skillset], function (err3, skillValues){
					if(err3) return callback(err3);
					connection.query("SELECT * FROM Advantageset WHERE id=?;", [rows[0].advantageset], function (err4, advanValues){
						if(err4) return callback(err4);
						connection.query("SELECT * FROM Disadvantageset WHERE id=?;", [rows[0].disadvantageset], function (err5, disadvanValues){
							if(err5) return callback(err5);
							return callback (null, {rows:rows, attributeValues:attributeValues, skillValues:skillValues, advanValues:advanValues, disadvanValues:disadvanValues});
						});
					});
				});
			});
		}
		else if(categoryTable){
			connection.query("SELECT * FROM "+categoryTable+";", function (err2, categories){
				if(err2) return callback(err2);
				return callback (null, {rows:rows, categories:categories});
			});
		}
	});
};

exports.selectCharacterInformations = function (id, userID, callback){
	console.log('USER CONTENT - select user '+userID+' inventory');
	connection.query("SELECT * FROM UserCharacters WHERE id=? AND userID=?;", [id, userID], function (err, rows){
		if(err) return callback(err);
		return callback (null, {rows:rows});
	});
};
