/* NODE JS MODULES */
var express = require('express'),
	nconf = require('nconf'),
	bcrypt = require('bcryptjs'),
	mysql = require('mysql');


/* CONFIGURATIONS */
nconf.argv()
	.env()
	.file({ file: nconf.get('config') || 'config.json' });


/* CONNECT TO MYSQL DATABASE */
var connection = mysql.createConnection(nconf.get('connection'));
connection.connect();


/* SELECT CONTENT FROM DATABASE */
exports.selectContent = function (table, userTable, categoryTable, ids, callback){
	console.log('ADVENTURE - select from database contents of type '+table);
	connection.query("SELECT * FROM "+table+";", function (err, content){
		if(err) return callback(err);
		connection.query("SELECT * FROM "+userTable+" WHERE userID in ("+ids.join()+");", function (err2, userContent){
			if(err2) return callback(err2);
			connection.query("SELECT * FROM "+categoryTable+";", function (err3, categories){
				if(err3) return callback(err3);
				return callback(null, {content:content, userContent:userContent, categories:categories});
			});
		});
	});
};

exports.selectContents = function (contentType, data, callback){
	console.log('ADVENTURE - select '+contentType+' and user '+contentType+' from database');
	// capitalize first letter
	var table = contentType.charAt(0).toUpperCase()+contentType.slice(1);
	// split array into user created and not user created content
	var contents = [], userContents = [];
	for (var i=0; i<data.length; i++) {
		// check if contents are enemies
		if (table === 'Enemies'){
			if(data[i].id.indexOf('u') > -1) userContents.push(data[i].id.split('u')[1]);
			else contents.push(data[i].id);
		}
		else{
			if(data[i].indexOf('u') > -1) userContents.push(data[i].split('u')[1]);
			else contents.push(data[i]);
		}
	}

	// get string from arrays
	var contentString;
	var userContentString;

	if(contents.length <= 0) contentString = "''";
	else contentString = contents.join();

	if(userContents.length <= 0) userContentString = "''";
	else userContentString = userContents.join();

	// select contents from database
	connection.query("SELECT * FROM "+table+" WHERE id in ("+contentString+");", function (err, contentData){
		if(err) return callback(err);
		connection.query("SELECT * FROM User"+table+" WHERE id in ("+userContentString+")", function (err2, userContentData){
			if(err2) return callback(err2);
			// merge selected content arrays
			var allContents = contentData.concat(userContentData);
			return callback(null, allContents);
		});
	});
};


/* SCENES */
exports.selectScenesPreview = function (userID, callback){
	console.log('ADVENTURE - select scenes preview for gamemaster');
	// select predefined scenes from database
	connection.query("SELECT id,name,description,category,imagepath,soundpath FROM Scenes;", function (err, scenes){
		if(err) return callback(err);
		// select user scenes from database
		connection.query("SELECT id,name,description,category,imagepath,soundpath FROM UserScenes WHERE userID=?;", [userID], function (err2, userScenes){
			if(err2) return callback(err2);
			return callback (null, {scenes:scenes, userScenes:userScenes});
		});
	});
};

exports.selectStartScenes = function (sceneHistory, callback){
	console.log('ADVENTURE - select start scenes for game');
	var scenesArray = sceneHistory.split(',');
	// split scenesArray in user created and not user created scenes
	var sceneIDs=[], userSceneIDs=[];
	for(var i=0; i<scenesArray.length; i++){
		if(scenesArray[i].indexOf('u') > -1) userSceneIDs.push(scenesArray[i].split('u')[1]);
		else sceneIDs.push(scenesArray[i]);
	}

	// get string from arrays
	var scenesString;
	var userScenesString;

	if(sceneIDs.length <= 0) scenesString = "''";
	else scenesString = sceneIDs.join();

	if(userSceneIDs.length <= 0) userScenesString = "''";
	else userScenesString = userSceneIDs.join();

	// select scene data from database
	connection.query("SELECT * FROM Scenes WHERE id in ("+scenesString+");", function (err, scenesData){
		connection.query("SELECT * FROM UserScenes WHERE id in ("+userScenesString+");", function (err, userScenesData){
			if(err) return callback(err);
			// collect all scenes in history order
			var allScenes = [];
			for(var n=0; n<scenesArray.length; n++){
				if(scenesArray[n].indexOf('u') > -1){
					// collect user scene
					for(var m=0; m<userScenesData.length; m++){
						if(scenesArray[n].split('u')[1] == userScenesData[m].id){
							allScenes.push(userScenesData[m]);
						}
					}
				}
				else{
					// collect scene
					for(var m=0; m<scenesData.length; m++){
						if(scenesArray[n] == scenesData[m].id){
							allScenes.push(scenesData[m]);
						}
					}
				}
			}
			return callback (null, allScenes);
		});
	});
};

function positionOf (scene, array){
	for(var i=0; i<array.length; i++){
		if(array[i] == scene) return i;
	}
	return false;
}

exports.chooseNextScene = function (sceneID, userID, savegameID, callback){
	console.log('ADVENTURE - select next scene and save in savegame');
	// select correct table name for user created or not user created scene
	var table, id = sceneID;
	if(id.indexOf('u') > -1){
		table = 'UserScenes';
		id = id.split('u')[1];
	}
	else table = 'Scenes';

	// select scene from database
	connection.query("SELECT * FROM "+table+" WHERE id=?;", [id], function (err, sceneData){
		if(err) return callback(err);
		// get scene history for game
		connection.query("SELECT sceneHistory FROM UserSavegame WHERE id=? AND gamemasterID=?;", [savegameID, userID], function (err2, rows){
			if(err2) return callback(err2);
			// update scene history and save in savegame
			var newSceneHistory = rows[0].sceneHistory+','+sceneID;
			connection.query("UPDATE UserSavegame SET sceneHistory=? WHERE id=? AND gamemasterID=?;", [newSceneHistory, savegameID, userID], function (err3){
				if(err3) return callback(err3);
				return callback (null, sceneData[0]);
			});
		});
	});
};


/* ENEMIES */
exports.saveEnemies = function (savegameID, userID, enemies, callback){
	console.log('ADVENTURE - update enemies in game');
	connection.query("UPDATE UserSavegame SET currentEnemies=? WHERE id=? AND gamemasterID=?;", [enemies, savegameID, userID], function (err){
		if(err) return callback(err);
		return callback(null);
	});
};

exports.deleteEnemies = function (savegameID, userID, callback){
	console.log('ADVENTURE - delete enemies in game');
	connection.query("UPDATE UserSavegame SET currentEnemies=NULL WHERE id=? AND gamemasterID=?;", [savegameID, userID], function (err){
		if(err) return callback(err);
		return callback(null);
	});
};
