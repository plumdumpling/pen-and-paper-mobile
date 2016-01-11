/* NODE JS MODULES */
var express = require('express'),
	nconf = require('nconf'),
	mysql = require('mysql');

var adventure = require('./adventure.js');


/* CONFIGURATIONS */
nconf.argv()
	.env()
	.file({ file: nconf.get('config') || 'config.json' });


/* CONNECT TO MYSQL DATABASE */
var connection = mysql.createConnection(nconf.get('connection'));
connection.connect();


/* SAVE CHARACTER */
exports.insert = function (userID, data, callback){
	console.log('CHARACTER - insert user character');
	// save attribute values in database
	connection.query("INSERT INTO Attributeset VALUES (NULL,"+data.attributes+");", function (err, aResult){
		if(err) return callback(err);
		console.log(err);
		// save skill values in database
		connection.query("INSERT INTO Skillset VALUES (NULL,"+data.skills+");", function (err2, sResult){
			if(err2) return callback(err2);
			console.log(err2);
			// save characteristics in database
			connection.query("INSERT INTO Advantageset VALUES (NULL,"+data.advantages+");", function (err3, caResult){
				if(err3) return callback(err3);
				console.log(err3);
				connection.query("INSERT INTO Disadvantageset VALUES (NULL,"+data.disadvantages+");", function (err4, cdResult){
					if(err4) return callback(err4);
					console.log(err4);
					// save user informations in database
					connection.query("INSERT INTO UserCharacters (userID,name,age,occupation,origin,description,startLevel,cp,imagepath,attributeset,skillset,advantageset,disadvantageset,inventory) VALUES (?,"+data.informations+",?,?,?,?,'0,0,0,0,0,0,0,0,0,0');",
						[userID, aResult.insertId, sResult.insertId, caResult.insertId, cdResult.insertId], function (err5, savedCharacter){
						console.log(err5);
						console.log(savedCharacter);
						if(err5) return callback(err5);
						return callback(false, savedCharacter);
					});
				});
			});
		});
	});
};


/* UPDATE CHARACTER */
exports.updateComplete = function (characterID, userID, data, callback){
	console.log('CHARACTER - update complete user character');
	// select set ids
	connection.query("SELECT attributeset,skillset,advantageset,disadvantageset FROM UserCharacters WHERE id=? AND userID=?;", [characterID, userID], function (err, rows){
		if(err) return callback(err);
		// save attribute values in database
		connection.query("UPDATE Attributeset SET "+data.attributes+" WHERE id=?;", [rows[0].attributeset], function (err2){
			if(err2) return callback(err2);
			// save skill values in database
			connection.query("UPDATE Skillset SET "+data.skills+" WHERE id=?;", [rows[0].skillset], function (err3){
				if(err3) return callback(err3);
				// save characteristics in database
				connection.query("UPDATE Advantageset SET "+data.advantages+" WHERE id=?;", [rows[0].advantageset], function (err4){
					if(err4) return callback(err4);
					connection.query("UPDATE Disadvantageset SET "+data.disadvantages+" WHERE id=?;", [rows[0].disadvantageset], function (err5){
						if(err5) return callback(err5);
						// save user informations in database
						connection.query("UPDATE UserCharacters SET "+data.informations+" WHERE id=? AND userID=?;", [characterID, userID], function (err6){
							if(err6) return callback(err6);
							return callback(false);
						});
					});
				});
			});
		});
	});
};

exports.updateOptions = function (options, callback){
	console.log('CHARACTER - update options of user character');
	connection.query("UPDATE UserCharacters SET cp=?, minorInjury=?, middleInjury=?, severeInjury=?, health=?, constitution=? WHERE id=?",
		[options.cp, options.minorInjury, options.middleInjury, options.severeInjury, options.health, options.constitution, options.id], function (err){
		if(err) return callback(err);
		return callback(false);
	});
};


/* DELETE CHARACTER */
exports.delete = function (characterID, userID, callback){
	console.log('CHARACTER - delete user character');
	// check if character is still used in a savegame
	connection.query("SELECT * FROM SavegameCharacters WHERE characterID=?;", [characterID], function (err, rows){
		if(err) return callback(err);
		// do not delete characters that are still used in a savegame
		if(rows.length > 0) return callback('Character is still used in a game');

		// select required ids from user character table
		connection.query("SELECT attributeset, skillset, advantageset, disadvantageset FROM UserCharacters WHERE id=? AND userID=?;", [characterID, userID], function (err2, result){
			if(err2) return callback(err2);
			// delete attribute values from database
			connection.query("DELETE FROM Attributeset WHERE id=?;", [result[0].attributeset], function (err3){
				if(err3) return callback(err3);
				// delete skill values from database
				connection.query("DELETE FROM Skillset WHERE id=?;", [result[0].skillset], function (err4){
					if(err4) return callback(err4);
					// delete characteristics from database
					connection.query("DELETE FROM Advantageset WHERE id=?;", [result[0].advantageset], function (err5){
						if(err5) return callback(err5);
						connection.query("DELETE FROM Disadvantageset WHERE id=?;", [result[0].disadvantageset], function (err6){
							if(err6) return callback(err6);
							// delete user character from database
							connection.query("DELETE FROM UserCharacters WHERE id=? AND userID=?;", [characterID, userID], function (err7){
								if(err7) return callback(err7);
								return callback(false);
							});
						});
					});
				});
			});
		});
	});
};


/* GET USER CHARACTER DATA */
exports.getInventory = function (characterID, userID, callback){
	console.log('CHARACTER - get user character inventory items');
	connection.query("SELECT inventory FROM UserCharacters WHERE id=? AND userID=?", [characterID, userID], function (err, characterRows){
		if(err) return callback(err);
		// get items from character inventory
		var inventoryItems = characterRows[0].inventory.split(',');
		// select items from database
		adventure.selectContents('Items', inventoryItems, function (err2, itemsRows){
			if(err2) return callback(err2);
			return callback(false, itemsRows);
		});
	});
};


/* CHECK IF CHARACTER IS CHARACTER OF USER */
exports.CharactersOfUser = function (characters, username, callback){
	console.log('CHARACTER - check if user has character for loaded save game');
	connection.query("SELECT id FROM Users WHERE name=?", [username], function (err, userRows){
		if(err) return callback(err);
		connection.query("SELECT id, name, imagepath FROM UserCharacters WHERE id in (?) AND userID=?", [characters.join(), userRows[0].id], function (err2, rows){
			console.log(rows);
			if(err2) return callback(err2);
			if(rows.length > 0) return callback(false, rows[0]);
			return callback(false, false);
		});
	});
};


/* SELECT CHARACTERS */
exports.selectCharacterList = function (startLevel, userID, callback){
	// get predefined characters
	connection.query("SELECT id, name, description FROM Characters", function (err, characterRows){
		if(err) return callback(err);
		// get user characters for start level
		connection.query("SELECT id, name FROM UserCharacters WHERE startLevel=? AND userID=?", [startLevel, userID], function (err2, userCharacterRows){
			if(err2) return callback(err2);

			// check if user characters selected
			if(userCharacterRows.length > 0){
				// get character ids
				var userCharacterIDs = [];
				for(var i=0; i<userCharacterRows.length; i++){
					userCharacterIDs.push(userCharacterRows[i].id);
				}
				// check if user characters are in game
				connection.query("SELECT characterID FROM SavegameCharacters WHERE characterID in ("+userCharacterIDs.join()+");", function (err3, charactersInGame){
					if(err3) return callback(err3);
					// get all characters who are currently available for a new game
					var remainingCharacters = userCharacterRows;
					var inGameCount = 0;
					for(var n=0; n<userCharacterRows.length; n++){
						remainingCharacters[n].inGame = false;
						for(var m=0; m<charactersInGame.length; m++){
							if(userCharacterRows[n].id === charactersInGame[m].characterID){
								remainingCharacters[n].inGame = true;
								inGameCount++;
							}
						}
						// check if there is at least one character available
						if(inGameCount >= remainingCharacters.length) remainingCharacters = null;
					}
					console.log('remaining characters left');
					console.log(remainingCharacters);

					return callback (null, { characters:characterRows, userCharacters:remainingCharacters });
				});
			}
			else{
				return callback (null, { characters:characterRows, userCharacters:null });
			}
		});
	});
};

exports.selectCharactersets = function (characterID, table, callback){
	console.log('characterID: '+characterID+' table: '+table);
	connection.query("SELECT * FROM "+table+" WHERE id=?;", [characterID], function (err, rows){
		if(err) return callback(err);
		connection.query("SELECT * FROM Attributeset WHERE id=?;", [rows[0].attributeset], function (err2, attributeValues){
			if(err2) return callback(err2);
			connection.query("SELECT * FROM Skillset WHERE id=?;", [rows[0].skillset], function (err3, skillValues){
				if(err3) return callback(err3);
				connection.query("SELECT * FROM Advantageset WHERE id=?;", [rows[0].advantageset], function (err4, advanValues){
					if(err4) return callback(err4);
					connection.query("SELECT * FROM Disadvantageset WHERE id=?;", [rows[0].disadvantageset], function (err5, disadvanValues){
						if(err5) return callback(err5);
						if(table==='UserCharacters') return callback (null, {attributeValues:attributeValues[0], skillValues:skillValues[0], advanValues:advanValues[0], disadvanValues:disadvanValues[0], informations:rows[0]});
						else return callback (null, {attributeValues:attributeValues[0], skillValues:skillValues[0], advanValues:advanValues[0], disadvanValues:disadvanValues[0], informations:null});
					});
				});
			});
		});
	});
};

exports.selectOptions = function (playersArray, callback){
	// collect character ids
	var characterIDs = [];
	for(var i=0; i<playersArray.length; i++){
		characterIDs.push(playersArray[i].characterID);
	}
	// select character points, injuries and constitution for character
	connection.query("SELECT id, cp, minorInjury, middleInjury, severeInjury, health, constitution FROM UserCharacters WHERE id in(?);", [characterIDs.join()], function (err, rows){
		if(err) return callback(err);
		return callback (null, rows);
	});
};

/* IN GAME */
exports.saveInventory = function (characterID, userID, data, callback){
	console.log('CHARACTER - save inventory in database');
	connection.query("UPDATE UserCharacters SET inventory=? WHERE id=? and userID=?;", [data, characterID, userID], function (err){
		if(err) return callback(err);
		return callback(false);
	});
};

exports.getAttributesValue = function (attribute, characterID, callback){
	console.log('CHARACTER - get attribute values');
	// get attribute value of character from datbase
	connection.query("SELECT attributeset FROM UserCharacters WHERE id=?", [characterID], function (err, rows){
		if(err) return callback(err);
		connection.query("SELECT "+attribute+" FROM Attributeset WHERE id=?", [rows[0].attributeset], function (err2, attrValue){
			if(err2) return callback(err2);
			return callback(false, { attrValues:attrValue });
		});
	});
};

exports.getAttributesValuesForSkill = function (skill, characterID, jsonData, callback){
	console.log('CHARACTER - get attribute values for skill');
	// select attributes for skill
	var attributes, attributesNames = [];
	for (var i=0; i<jsonData.skills.name.length; i++) {
		if(jsonData.skills.name[i] === skill) attributes = jsonData.skills.attributes[i].split('-');
	}

	for (var n=0; n<attributes.length; n++) {
		for (var m=0; m<jsonData.attributes.name.length; m++) {
			if(attributes[n] == jsonData.attributes.name[m]) attributesNames.push(jsonData.attributes.title[m]);
		}
	}

	// get attribute values of character from datbase
	connection.query("SELECT attributeset FROM UserCharacters WHERE id=?", [characterID], function (err, rows){
		if(err) return callback(err);
		connection.query("SELECT "+attributes[0]+", "+attributes[1]+" FROM Attributeset WHERE id=?", [rows[0].attributeset], function (err2, attrValues){
			if(err2) return callback(err2);
			return callback(false, { attributes:attributesNames, attrValues:attrValues });
		});
	});
};
