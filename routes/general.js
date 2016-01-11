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


/* MAIN PAGES */

/* REGISTRATION */
exports.registrate = function (req, username, email, password, callback){
	console.log('GENERAL - registrate new user');
  var uniqueName = true;
  // get all usernames from database
  connection.query("SELECT name FROM Users;", function (err, allUsers){
		if(err) return callback(err);

		// check if username allready exits in database
		for(var i=allUsers.length-1; i>=0; i--) {
			if(username.toLowerCase() == allUsers[i].name.toLowerCase()) uniqueName = false;
		}

		// if the entered username does not already exist
		if(uniqueName){
			// hash the password
			bcrypt.genSalt(10, function (err2, salt) {
				if(err2) return callback(err2);
				bcrypt.hash(password, salt, function (err3, hash) {
					if(err3) return callback(err3);
					// and save name, email address, password and registration date in database
					connection.query("INSERT INTO Users(name,email,password,since) VALUES(?,?,?, NOW());", [username,email,hash], function (err3, rows){
						if(err3) return callback(err3);
						// login the user by setting some session vars after a successful registration
						req.session.loggedin = true;
						req.session.username = username;
						req.session.userID = rows.insertId;
						return callback(null, true);
					});
				});
			});
		}
		else return callback('409');
	});
};


/* LOGIN AND LOGOUT */
exports.login = function (req, username, password, callback){
	console.log('GENERAL - user logged in');
	// get login data for username from database
	connection.query("SELECT id, name, password from Users where name = ?;", [username], function (err, rows){
		if(err) return callback(err);
		// return an error if there are more than one user login data selected
		if(rows.length !== 1){
			return callback(true);
		}
		else{
			// compare entered password with hashed password from database
			bcrypt.compare(password, rows[0].password, function (err, res){
				if(err) return callback(err);
				if(res){
					// set some session vars if user successfully logged in
					req.session.loggedin = true;
					req.session.username = username;
					req.session.userID = rows[0].id;
					return callback(null, true);
				}
				return callback(true);
			});
		}
	});
};

exports.logout = function (req, callback){
	console.log('GENERAL - user logged out');
	// destroy the session to logout the user
	req.session.destroy();
	return callback(null, true);
};


/* SAVE AND LOAD GAMES */
exports.saveGame = function (name, characters, userID, callback){
	console.log('GENERAL - save new game');
	connection.query("INSERT INTO UserSavegame (gamemasterID,name) VALUES (?,?);", [userID, name], function (err, savegame){
		if(err) return callback(err);
		// prepare SavegameCharacters values to save in database
		var savegameCharacters = '';
		for(var i=0; i<characters.length; i++) {
			savegameCharacters = savegameCharacters+'('+savegame.insertId+','+characters[i]+')';
			if(i+1 < characters.length) savegameCharacters = savegameCharacters+',';
		}
		console.log('GENERAL - savegameCharacters: '+savegameCharacters);
		connection.query("INSERT INTO SavegameCharacters (savegameID,characterID) VALUES "+savegameCharacters+";", function (err2){
			if(err2) return callback(err2);
			return callback(null, savegame.insertId);
		});
	});
};

exports.updateGameScenes = function (sceneHistory, savegameID, userID, callback){
	console.log('GENERAL - update game scene history');
	connection.query("UPDATE UserSavegame SET sceneHistory=? WHERE id=? AND gamemasterID=?;", [sceneHistory, savegameID, userID], function (err){
		if(err) return callback(err);
		return callback(null);
	});
};

exports.updateGameName = function (name, savegameID, userID, callback){
	console.log('GENERAL - update game name');
	connection.query("UPDATE UserSavegame SET name=? WHERE id=? AND gamemasterID=?;", [name, savegameID, userID], function (err){
		if(err) return callback(err);
		return callback(null);
	});
};

exports.loadGameCharacters = function (savegameID, callback){
	console.log('GENERAL - load game characters');
	connection.query("SELECT characterID FROM SavegameCharacters WHERE savegameID=?;", [savegameID], function (err, characterIDs){
		if(err) return callback(err);
		return callback(null, characterIDs);
	});
};

exports.loadGameContent = function (savegameID, callback){
	console.log('GENERAL - load game content for savegame id '+savegameID);
	connection.query("SELECT * FROM UserSavegame WHERE id=?;", [savegameID], function (err, savegame){
		if(err) return callback(err);
		return callback(null, savegame[0]);
	});
};

exports.loadGameName = function (savegameID, callback){
	console.log('savegameID: '+savegameID);
	if(!savegameID || savegameID === 'false'){
		console.log('if');
		return callback(null, false);
	}
	else{
		console.log('else');
		console.log('GENERAL - load game name');
		connection.query("SELECT name FROM UserSavegame WHERE id=?;", [savegameID], function (err, savegame){
			if(err) return callback(err);
			console.log(savegame);
			return callback(null, savegame[0].name);
		});
	}
};

exports.selectSavegames = function (userID, callback){
	console.log('GENERAL - get savegames for user');
	connection.query("SELECT id, name, saveTime FROM UserSavegame WHERE gamemasterID=? ORDER BY saveTime DESC;", [userID], function (err, savegames){
		if(err) return callback(err);
			return callback(null, savegames);
	});
};


/* GET DATA FROM DATABASE */
exports.selectAllFromTable = function (table, callback){
	connection.query("SELECT * FROM "+table+";", function (err, rows){
		if(err) return callback(err);
		return callback(null, rows);
	});
};

exports.selectCategories = function (table, callback){
	// select correct table name for content type
	switch (table){
		case 'characters':
			return callback(null, false);
			break;
		case 'scenes':
			table = 'SceneCategories';
			break;
		case 'enemies':
			table = 'EnemieCategories';
			break;
		case 'items':
			table = 'ItemCategories';
			break;
	}
	connection.query("SELECT * FROM "+table+";", function (err, rows){
		if(err) return callback(err);
		return callback(null, rows);
	});
};

/* TUTORIAL */
exports.getTutorialValue = function (userID, callback){
	console.log('GENERAL - get tutorial value for user');
	connection.query("SELECT tutorialMode FROM Users WHERE id=?;", [userID], function (err, tutorialMode){
		if(err) return callback(err);
		return callback(null, tutorialMode[0]);
	});
}

exports.changeTutorialValue = function (userID, tutorial, callback){
	var tutorialValue;
	if(tutorial=='true') tutorialValue = 1;
	else tutorialValue = 0;
	console.log('GENERAL - change tutorial value for user to '+tutorialValue);
	connection.query("UPDATE Users SET tutorialMode=? WHERE id=?;", [tutorialValue, userID], function (err){
		if(err) return callback(err);
		return callback(null);
	});
}
