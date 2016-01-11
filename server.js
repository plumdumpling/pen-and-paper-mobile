/* NODE JS MODULES */
var fs = require('fs'),
	ejs = require('ejs'),
	express = require('express'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	nconf = require('nconf'),
	mysql = require('mysql'),
	app = express(),
	http = require('http'),
	shortId = require('shortid');

/* ROUTES */
var general = require('./routes/general.js'),
	character = require('./routes/character.js'),
	adventure = require('./routes/adventure.js'),
	userContent = require('./routes/userContent.js');


/* CONFIGURATIONS */
nconf.argv()
	.env()
	.file({ file: nconf.get('config') || 'config.json' });


/* CREATE HTTP SERVER */
var httpServer = http.createServer(app).listen(nconf.get('httpPort'));
console.log('Http listen on port '+nconf.get('httpPort'));

/* WEB SOCKETS - SOCKET.IO */
var io = require('socket.io')(httpServer);

/* APP CONFIGURATIONS */
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/public');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true, limit:'5mb'}));
app.use(cookieParser());


/* FILE PATHS */
app.get('*.css', function(req, res){
  var filename = req.path.slice(req.path.lastIndexOf("/"));
  res.sendFile(__dirname+'/public/css/'+filename);
});
app.get('*.js', function(req, res){
  var filename = req.path.slice(req.path.lastIndexOf("/"));
  res.sendFile(__dirname+'/public/js/'+filename);
});
app.get('*.png', function(req, res){
	var filename = req.path.slice(req.path.lastIndexOf("/"));
  res.sendFile(__dirname+'/public/'+filename);
});


/* CONNECT TO MYSQL DATABASE */
var connection = mysql.createConnection(nconf.get('connection'));
connection.connect(function(err){
	if(err){
		console.log('could not connect to mysql database');
	}
});


/* SESSIONS */
var MemoryStore = session.MemoryStore,
	sessionStore = new MemoryStore();

app.use(session({
	secret:nconf.get('sessionSecret'),
	store: sessionStore,
	key: 'sessionID',
	saveUninitialized: false,
	resave: false
}));


/* GAME ROOMS */
// initalize var to remember conntected users in rooms
// gamemasters in rooms are saved with username, socket id and connection status
// players in rooms are saved with username, user id, session id, socket id, connection status, readyForPlay status, charactername and character id
// adventureStatus - 0=connecting - 1=prepare start scene and characters - 2=in game
// startLevel defines the startLevel for the player characters
var rooms = {};


/* CLEAN UP */
// clean up sessions
var sessionCleanup = function() {
  sessionStore.all(function(err, sessions){
		for(var i=sessions.length-1; i>=0; i--){
      sessionStore.get(sessions[i], function(){});
    }
  });
}
var sessionCleanUpInterval = setInterval(sessionCleanup, 600000);

// cleanup rooms
var roomCleanup = function() {
	var sessionWithKey, sessionsToGo;
	// get all room keys
	var roomKeys = Object.keys(rooms);
	// get all sessions
  sessionStore.all(function(err, sessions){
		// check if there is at least one session for each room key
		for(var i=0; i<roomKeys.length; i++){
			sessionWithKey = false;
			sessionsToGo = Object.keys(sessions).length;
			// go through all sessions to compare the session rooms with the room key
			for(var sid in sessions){
				compareRoomKeys(sid, roomKeys[i], function (result){
					if(result) sessionWithKey = true;
					// check if this was the last session for this key
					if(--sessionsToGo === 0){
						// delete room if no session with room key was found
						if(!sessionWithKey) delete rooms[roomKeys[i]];
					}
				});
			}
		}
  });
}

function compareRoomKeys (sid, roomKey, callback){
	getSessionRoomId(sid, roomKey, function (roomID, key){
		// compare room key with session room key
		if(roomID === key) return callback(true);
		return callback(false);
	});
}

function getSessionRoomId (sid, key, callback){
	// get room id from session
	sessionStore.get(sid, function (error, session){
		return callback(session.roomID, key);
	});
}
// clean up every 5 minutes = 300 000 milliseconds
var roomCleanUpInterval = setInterval(roomCleanup, 300000);


/* -------------------------------- ROUTING -------------------------------- */
/* INDEX */
app.get('/', function (req, res) { sendIndexPage(req, res, false, false); });

/* ERRORS */
app.get('/error', function (req, res) { sendErrorPage(res, 'Not found'); });

/* REGISTRATION, LOGIN AND LOGOUT */
app.post('/registrate', function (req, res){ registrate(req, res); });
app.post('/login', function (req, res){ login(req, res); });
app.get('/logout', function (req, res){ logout(req, res); });

/* GET DATA FROM DATABASE */
app.post('/selectFromDB', function (req, res){ if(req.session.loggedin===true) selectAllFromTable(req, res); else res.send({error:'Not found'}); });
app.post('/selectContent', function (req, res){ if(req.session.loggedin===true) selectContent(req, res); else res.send({error:'Not found'}); });

/*  MANAGE USER CONTENT */
app.get('/manage/:contentType', function (req, res){ if(req.session.loggedin===true) manageUserContent(req, res); else res.redirect('/'); });
app.get('/create/:contentType', function (req, res){ if(req.session.loggedin===true) createUserContent(req, res); else res.redirect('/'); });
app.get('/edit/:contentType/:contentID/:roomID', function (req, res){ if(req.session.loggedin===true) editUserContent(req, res); else res.redirect('/'); });

app.post('/save/:contentType', function (req, res){ if(req.session.loggedin===true) saveUserContent(req, res); else res.send({error:'Not found'}); });
app.put('/save/:contentType', function (req, res){ if(req.session.loggedin===true) updateUserContent(req, res); else res.send({error:'Not found'}); });
app.delete('/delete/:contentType', function (req, res){ if(req.session.loggedin===true) deleteUserContent(req, res); else res.send({error:'Not found'}); });

app.post('/draw/saveImage', function (req, res){ if(req.session.loggedin===true) saveDrawing(req, res); else res.send({error:'Not found'}); });

/* HOST AND JOIN GAME */
app.get('/host', function (req, res){ if(req.session.loggedin===true) connectHost(req, res); else res.redirect('/'); });
app.get('/join', function (req, res){ if(req.session.loggedin===true) connectJoin(req, res); else res.redirect('/'); });
app.get('/connect', function (req, res){ if(req.session.loggedin===true) connectingPage(req, res); else res.redirect('/'); });

app.post('/host', function (req, res){ if(req.session.loggedin===true) hostGame(req, res); });
app.get('/join/:roomID', function (req, res){ if(req.session.loggedin===true) joinGame(req, res); else res.redirect('/'); });

/* PREPARE GAME AND INTRODUCE USERS */
app.get('/prepare/:roomID', function (req, res){ if(req.session.loggedin===true) introduction(req, res); else res.redirect('/'); });
app.post('/prepare/:roomID', function (req, res){ if(req.session.loggedin===true) prepareCharacter(req, res); else res.send({error:'Not found'}); });
app.post('/getReady', function (req, res){ if(req.session.loggedin===true) getReady(req, res); else res.send({error:'Not found'}); });
app.post('/saveGame', function (req, res){ if(req.session.loggedin===true) saveGame(req, res); else res.send({error:'Not found'}); });

/* START THE ADVENTURE */
app.get('/play/:roomID/:scene', function (req, res){ if(req.session.loggedin===true) adventureGM(req, res); else res.redirect('/'); });
app.get('/play/:roomID', function (req, res){ if(req.session.loggedin===true) adventureP(req, res); else res.redirect('/'); });

/* CLOSE THE ADVENTURE */
app.get('/close/:roomID', function (req, res){ if(req.session.loggedin===true) closeAdventure(req, res); else res.redirect('/'); });

/* RETURN TO THE ADVENTURE */
app.get('/returnTo/:roomID', function (req, res){ if(req.session.loggedin===true) returnToAdventure(req, res); else res.redirect('/'); });

/* IN GAME */
app.post('/nextScene', function (req, res){ if(req.session.loggedin===true) nextScene(req, res); else res.send({error:'Not found'}); });
app.put('/saveInventory', function (req, res){ if(req.session.loggedin===true) saveInventory(req, res); else res.send({error:'Not found'}); });
app.post('/selectPlayerContent', function (req, res){ if(req.session.loggedin===true) selectPlayerContent(req, res); else res.send({error:'Not found'}); });
app.put('/saveEnemies', function (req, res){ if(req.session.loggedin===true) saveEnemies(req, res); else res.send({error:'Not found'}); });
app.delete('/deleteEnemies', function (req, res){ if(req.session.loggedin===true) deleteEnemies(req, res); else res.send({error:'Not found'}); });
app.post('/selectDices', function (req, res){ if(req.session.loggedin===true) selectDices(req, res); else res.send({error:'Not found'}); });
app.post('/saveCharacterInfo', function (req, res){ if(req.session.loggedin===true) updateCharacterInfo(req, res); else res.send({error:'Not found'}); });
app.post('/toggleTutorial', function (req, res){ if(req.session.loggedin===true) toggleTutorial(req, res); else res.send({error:'Not found'}); });

/* SOCKET CONNECTIONS */
io.on('connection', function (socket){ socketConnections(socket); });






/* ------------------------------- FUNCTIONS ------------------------------- */

/* BASIC ERROR PAGE */
var sendErrorPage = function (res, err){
	// render error page, if an error occured
	console.log('ERROR PAGE - res: '+res+' err: '+err);
	res.sendFile(__dirname+'/public/error.html');
};


/* INDEX PAGE */
var sendIndexPage = function (req, res, regiError, loginError){
	console.log('User with IP '+req.connection.remoteAddress+' connected.');
	if(req.session.loggedin!==true){
		res.render(__dirname+'/index.html', {
			registrate: regiError,
			login: loginError,
			userdata: {username:req.body.username, email:req.body.email}
		});
	}
	else sendMainPage(req, res, req.session.username, req.session.userID);
};


/* MAIN PAGE */
var sendMainPage = function (req, res, username, userID){
	console.log('SERVER - main page user '+userID+' '+username);
	var userRoomID = null;
	// check if there is still a game running but the room does not exist anymore or user is player
	if(req.session.currentGame){
		if(!rooms[req.session.roomID] || req.session.role === 'player'){
			// delete current game variables
			req.session.currentGame = null;
			req.session.roomID = null;
			req.session.role = null;

			if(req.session.role === 'player'){
				req.session.characterID = null;
				req.session.ready = false;
			}
		}
		else{
			// remember room id of current game for gamemaster to reconnect
			userRoomID = req.session.roomID;
		}
	}

	// select preview of user created characters, scenes, enemies and items from database and send back to user
	userContent.selectPreviewForAll(userID, function (err, response){
		if(err) return sendErrorPage(res, err);
		if(response) {
			res.render(__dirname+'/public/main.html', {
				username: username,
				characters: response.characters,
				scenes: response.scenes,
				enemies: response.enemies,
				items: response.items,
				roomID: userRoomID
			});
		}
	});
};


/* REGISTRATION, LOGIN AND LOGOUT */
var registrate = function (req, res){
	var username = req.body.username,
		email = req.body.email,
		password = req.body.password;
	// save new user account in database
	general.registrate(req, username, email, password, function (err, response){
		if(err==='409') return sendIndexPage(req, res, 'Der Benutzername existiert bereits. Bitte verwende einen anderen Namen.', false);
		if(err) return sendErrorPage(res, err);
		if(response) res.redirect('/');
	});
};

var login = function (req, res){
	var username = req.body.username,
		password = req.body.password;
	// try to login user with entered username and password
	general.login(req, username, password, function (err, response){
		if(err) return sendIndexPage(req, res, false, 'Der Benutzername oder das Passwort waren falsch.');
		if(response) res.redirect('/');
	});
};

var logout = function (req, res){
	// logout the user and show index page
	general.logout(req, function (err, response){
		if(err) return sendErrorPage(res, err);
		res.redirect('/');
	});
};


/* GET DATA FROM DATABASE */
var selectAllFromTable = function (req, res){
	// select all data from database table and return the selected json data to sender
	var table = req.body.table;
	general.selectAllFromTable(table, function (err, response){
		if(err) return sendErrorPage(res, err);
		res.status(200).json({data:response});
	});
};

var selectContent = function (req, res){
	// get all user ids from group
	var userIDs = [req.session.userID];
	for(var i=0; i<rooms[req.session.roomID].players.length; i++){
		userIDs.push(rooms[req.session.roomID].players[i].userID);
	}

	// select all data from database table and return the selected json data to sender
	adventure.selectContent(req.body.table, req.body.userTable, req.body.categoryTable, userIDs, function (err, response){
		if(err) return sendErrorPage(res, err);
		res.status(200).json(response);
	});
};

var selectPlayerContent = function (req, res){
	userContent.selectById(req.session.characterID, req.session.userID, 'characters', function (err, response){
		// send character sheet data to player
		res.status(200).json({
			err: err,
			character: {
				attributeValues: response.attributeValues[0],
				skillValues: response.skillValues[0],
				advanValues: response.advanValues[0],
				disadvanValues: response.disadvanValues[0]
			}
		});
	});
};


/* MANAGE USER CONTENT */
var manageUserContent = function (req, res){
	// select preview of content for user
	userContent.selectByUser(req.session.userID, req.params.contentType, function (err, response){
		if(err) return sendErrorPage(res, err);
		general.selectCategories(req.params.contentType, function (err2, categories){
			if(err2) return sendErrorPage(res, err2);
			res.render(__dirname+'/public/manageContent.html', {
				username: req.session.username,
				contentType: req.params.contentType,
				categories: categories,
				response: response.rows
			});
		});
	});
};

var createUserContent = function (req, res){
	// get character sheet parameters for creating a character
	var attributes, skills, characteristics;
	if(req.params.contentType==='characters'){
		var jsonData = require(__dirname+'/json/characterSheet.json');
		attributes = jsonData.attributes;
		skills = jsonData.skills;
		characteristics = jsonData.characteristics;
	}

	// show empty character sheet, item-, scene- or enemie-card
	general.selectCategories(req.params.contentType, function (err, categories){
		if(err) return sendErrorPage(res, err);
		var colorsData = require(__dirname+'/json/drawingColors.json');
		res.render(__dirname+'/public/contentEditor.html', {
			username: req.session.username,
			newContent: true,
			contentType: req.params.contentType,
			contentID: false,
			response: false,
			startLevel: false,
			categories: categories,
			attributes: attributes,
			skills: skills,
			characteristics: characteristics,
			colors: colorsData.colors,
			ingame: false
		});
	});
};

var editUserContent = function (req, res){
	// select user content
	userContent.selectById(req.params.contentID, req.session.userID, req.params.contentType, function (err, response){
		if(err) return sendErrorPage(res, err);
		if(response.rows.length<=0) return sendErrorPage(res, 'access denied');

		var colorsData = require(__dirname+'/json/drawingColors.json');

		var roomID = false;
		if(req.params.roomID != '0') roomID = req.params.roomID;

		// show character sheet of selected user character
		if(req.params.contentType==='characters'){
			var jsonData = require(__dirname+'/json/characterSheet.json');
			res.render(__dirname+'/public/contentEditor.html', {
				username: req.session.username,
				newContent: false,
				contentType: req.params.contentType,
				contentID: req.params.contentID,
				response: {
					attributeValues: response.attributeValues[0],
					skillValues: response.skillValues[0],
					advanValues: response.advanValues[0],
					disadvanValues: response.disadvanValues[0],
					informations: response.rows[0]
				},
				startLevel: response.rows[0].startLevel,
				attributes: jsonData.attributes,
				skills: jsonData.skills,
				characteristics: jsonData.characteristics,
				colors: colorsData.colors,
				ingame: roomID
			});
		}
		// show selected item-, scene- or enemie-card
		else{
			res.render(__dirname+'/public/contentEditor.html', {
				username: req.session.username,
				newContent: false,
				contentType: req.params.contentType,
				contentID: req.params.contentID,
				response: response.rows[0],
				categories: response.categories,
				colors: colorsData.colors,
				ingame: roomID
			});
		}
	});
};

var saveUserContent = function (req, res){
	// check if content is character sheet
	if(req.params.contentType === 'characters') return saveCharacter(req, res);
	// save new item-, scene- or enemie-card
	userContent.insert(req.session.userID, req.params.contentType, req.body.data, function (err, response){
		res.status(200).json({ err:err, savedContentID:response.insertId });
	});
};

var updateUserContent = function (req, res){
	// check if content is character sheet
	if(req.params.contentType === 'characters') return updateCharacter(req, res);
	// save changes in item-, scene- or enemie-card
	userContent.update(req.body.contentID, req.session.userID, req.params.contentType, req.body.data, function (err, response){
		res.status(200).json({ err:err });
	});
};

var deleteUserContent = function (req, res){
	// check if content is character sheet
	if(req.params.contentType === 'characters') return deleteCharacter(req, res);
	// delete selected item, scene or enemie
	userContent.delete(req.body.contentID, req.session.userID, req.params.contentType, function (err, response){
		res.status(200).json({ err:err });
	});
};


/* USER CHARACTERS */
var saveCharacter = function (req, res){
	console.log('SERVER - character should be saved');
	character.insert(req.session.userID, req.body.data, function (err, response){
		// check if character creation was part of an adventure
		if(!err && req.session.roomID){
			//save status of completed character creation and character id in session
			req.session.ready = true;
			req.session.characterID = response.insertId;
		}
		res.status(200).json({ err:err, savedCharacterID:response.insertId });
	});
};

var updateCharacter = function (req, res){
	console.log('SERVER - character should be updated');
	character.updateComplete(req.body.contentID, req.session.userID, req.body.data, function (err){
		res.status(200).json({ err:err });
	});
};

var updateCharacterInfo = function (req, res){
	console.log('SERVER - character informations should be updated');
	character.updateOptions(req.body.options, function (err){
		res.status(200).json({ err:err });
	});
};

var deleteCharacter = function (req, res){
	console.log('SERVER - character should be deleted');
	character.delete(req.body.contentID, req.session.userID, function (err){
		res.status(200).json({ err:err });
	});
};


/* SAVE USER IMAGES */
var saveDrawing = function (req, res) {
	// get image data
	var imgData = req.body.imageData;
	var data = imgData.replace(/^data:image\/\w+;base64,/, "");

	// get name of directory where user created images are saved
	var dirName = 'u'+('00000000000'+req.session.userID).slice(-11);

	// create directory if it doesn't already exist
	makeDirectory(dirName, function (err) { if(err){ console.log(err); } });

	// check if imagepath is already set
	var imageName;
	if(req.body.imagepath){
		// get existing image name
		var filename = req.body.imagepath.split('/')[3];
		imageName = filename.replace('.png', '');

		// save image file in directory
		saveImageInDirectory(dirName, imageName, data, function (err) {
			if(err){
				console.log('ERROR saveImage - saveImageInDirectory');
				console.log(err);
				res.status(200).json({ err:err });
			}
			else{
				// save image data in database
				console.log('saveImage - image successfully saved');
				res.status(200).json({ err:false, imagepath:'/uploads/'+dirName+'/'+imageName+'.png' });
			}
		});
	}
	else{
		// create unique name for image
		imageName = 'img_'+Date.now();

		// try to open image file
		fs.exists(__dirname+'/public/uploads/'+dirName+'/'+imageName+'.png', function (err) {
			// check if image file exits
			if(!err) {
				// save image file in directory
				saveImageInDirectory(dirName, imageName, data, function (err) {
					if(err){
						console.log('ERROR saveImage - saveImageInDirectory');
						console.log(err);
					}
					else{
						// save image data in database
						console.log('saveImage - image successfully saved');
						res.status(200).json({ err:false, imagepath:'/uploads/'+dirName+'/'+imageName+'.png' });
					}
				});
			}
			else {
				console.log('ERROR saveImage - image file already exists');
				res.status(200).json({ err:'Es existiert bereits eine Datei mir Namen '+imageName+'.'});
			}
		});
	}
};

function makeDirectory (dirName, callback) {
	fs.mkdir(__dirname+'/public/uploads/'+dirName, function (err) {
		if(err){
			if(err.code == 'EEXIST'){
				// folder already exists - ignore error
				callback(false);
			}
			else callback(err);
		}
		else callback(false);
	});
}

function saveImageInDirectory (dirName, imageName, data, callback) {
	var buf = new Buffer(data, 'base64');
	fs.writeFile(__dirname+'/public/uploads/'+dirName+'/'+imageName+'.png', buf, function (err){
		callback(err);
	});
}


/* HOST AND JOIN GAME */
var connectHost = function (req, res){
	// remember user as gamemaster in session
	setRoleTo(req, 'gamemaster', function (){
		// redirect to connecting page for having the same url for host and join
		res.redirect('/connect');
	});
};

var connectJoin = function (req, res){
	// remember user as player in session
	setRoleTo(req, 'player', function (){
		// redirect to connecting page for having the same url for host and join
		res.redirect('/connect');
	});
};

var setRoleTo = function (req, newRole, callback){
	req.session.role = newRole;
	callback();
};

var connectingPage = function (req, res){
	// check if user wants to host (gamemaster) or join (player)
	if(req.session.role === 'gamemaster'){
		console.log('SERVER - gamemaster in connection room');
		// select saved games for gamemaster to load
		general.selectSavegames(req.session.userID, function (err, response){
			if(err) return sendErrorPage(res, err);
			if(response) {
				// render connecting page for gamemaster
				res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
				// check if room was already created
				if(req.session.roomID) res.render(__dirname+'/public/connectGM.html', {username:req.session.username, savegames:response, players:rooms[req.session.roomID].players, roomID:req.session.roomID});
				else res.render(__dirname+'/public/connectGM.html', {username:req.session.username, savegames:response, players:false, roomID:false});
			}
		});
	}
	else if(req.session.role === 'player'){
		console.log('SERVER - player in connection room');
		// render connecting page for player
		res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		// check if user already joined
		console.log(req.session.roomID);
		if(req.session.roomID) res.render(__dirname+'/public/connectP.html', {username:req.session.username, roomID:req.session.roomID, sessionID:req.session.id, userID:req.session.userID});
		else res.render(__dirname+'/public/connectP.html', {username:req.session.username, roomID:null, sessionID:null, userID:null});
	}
	else{
		// render main page, if user didn't choose a role (gamemaster or player)
		res.redirect('/');
	}
};

var hostGame = function (req, res){
	console.log('SERVER - gamemaster host game');
	// check for existing session room
	if(typeof req.session.roomID === 'undefined' || !req.session.roomID){
		// generate new room id
		var roomID = shortId.generate();
		// check if the generated room id already exists
		while(rooms[roomID]){
			// if the generated room id already exists generate a new one until it is unique
			roomID = shortId.generate();
		}
		// save new unique room id in session
		req.session.roomID = roomID;

		// create a new room for the adventure
		rooms[roomID] = { adventureStatus:0 };
		console.log('room '+roomID+' generated');
	}

	// check if gamemaster wants to start a new game or load a saved one
	if(req.body.savegame){
		console.log('SERVER - gamemaster load savegame '+req.body.savegame);
		// remember game in session and room
		req.session.currentGame = req.body.savegame;
		rooms[req.session.roomID].currentGame = req.body.savegame;
		// load savegame
		general.loadGameCharacters(req.body.savegame, function (err, response){
			// send room id and savegame characters back to host
			console.log('SERVER - in savegame allowed characters...');
			res.status(200).json({err:err, roomID:req.session.roomID, characterIDs:response});
		});
	}
	else{
		console.log('SERVER - no savegame selected, start new one');
		// send room id back to host
		res.status(200).json({err:null, roomID:req.session.roomID, characterIDs:false});
	}
};

var joinGame = function (req, res){
	console.log('SERVER - player join game '+req.params.roomID);
	// get room id
  var roomID = req.params.roomID;
	// check if room id currently exists
	if(rooms[roomID]){
	  // save room id and role in session
	  req.session.roomID = roomID;
	  req.session.role = 'player';
		// let the user join the room
		res.redirect('/connect');
	}
	else{
		// send back an error, if the room id doesn't currently exist
		return sendErrorPage(res, 'Es wurde kein Spiel mit dem Code '+roomID+' gefunden.');
	}
};


/* PREPARE GAME AND INTRODUCE USERS */
var introduction = function (req, res){
	// render introduction file for gamemaster
	if(req.session.role === 'gamemaster'){
		console.log('SERVER - introduce gamemaster with scenes selection');
		// select all scenes the gamemaster can choose from as start scene
		adventure.selectScenesPreview(req.session.userID, function (err, response){
			if(err) return sendErrorPage(res, err);
			general.getTutorialValue(req.session.userID, function (err, tutorialMode){
				if(err) return sendErrorPage(res, err);
				res.render(__dirname+'/public/introGM.html', {
					username: req.session.username,
					roomID: req.params.roomID,
					scenesData: response,
					tutorial: tutorialMode
				});
			});
		});
	}
	// render introduction file for player
	else if(req.session.role === 'player'){
		console.log('SERVER - introduce player with character sheet');
		var jsonData = require(__dirname+'/json/characterSheet.json');
		// select predefined characters and prepared user characters

		console.log(rooms[req.params.roomID].startLevel);

		character.selectCharacterList(rooms[req.params.roomID].startLevel, req.session.userID, function (err, response){
			if(err) return sendErrorPage(res, err);
			if(response) {
				res.render(__dirname+'/public/introP.html', {
					username: req.session.username,
					roomID: req.params.roomID,
					sessionID: req.session.id,
					ready: req.session.ready,
					contentType: 'characters',
					response: false,
					newContent: true,
					startLevel: rooms[req.params.roomID].startLevel,
					characters: response.characters,
					userCharacters: response.userCharacters,
					attributes: jsonData.attributes,
					skills: jsonData.skills,
					characteristics: jsonData.characteristics
				});
			}
		});
	}
	// error handling if user role is not defined
	else res.redirect('/');
};

var prepareCharacter = function (req, res){
	console.log('SERVER - load character data');
	// check if character is user created or not
	var cid, table;
	if(req.body.characterID.indexOf('u') > -1) {
		cid = req.body.characterID.split('u')[1];
		table = 'UserCharacters';
	}
	else{
		cid = req.body.characterID;
		table = 'Characters';
	}
	// select character sheet data of predefined character
	character.selectCharactersets(cid, table, function (err, response){
		if(err) return sendErrorPage(res, err);
		if(response) res.status(200).json(response);
	});
};

var getReady = function (req, res){
	console.log('SERVER - loaded user character is ready');
	req.session.ready = true;
	res.status(200).json(true);
};

var saveGame = function (req, res){
	console.log('SERVER - save new game with characters');
	// get characters of game
	var characters = [];
	for(var i=0; i<rooms[req.body.roomID].players.length; i++) {
		characters.push(rooms[req.body.roomID].players[i].characterID);
	}
	// create new savegame
	general.saveGame(req.body.gamename, characters, req.session.userID, function (err, savegameID){
		if(err) res.status(200).json({ err:err });
		// remember currently running game in session and room
		req.session.currentGame = savegameID;
		rooms[req.body.roomID].currentGame = savegameID;

		res.status(200).json({ err:false });
	});
};

/* START THE ADVENTURE */
var adventureGM = function (req, res){
	if(req.session.role === 'gamemaster'){
		console.log('SERVER - gamemaster is in game');
		// load savegame start scenes
		general.loadGameContent(req.session.currentGame, function (err, savegame){
			if(err) return sendErrorPage(res, err);
			general.getTutorialValue(req.session.userID, function (err2, tutorialMode){
				if(err2) return sendErrorPage(res, err2);
				// check if start scene was already set
				console.log('SERVER - savegame sceneHistory');
				console.log(savegame.sceneHistory);
				if(savegame.sceneHistory){
					console.log('SERVER - load sceneHistory');
					adventure.selectStartScenes(savegame.sceneHistory, function (err3, scenes){
						if(err3) return sendErrorPage(res, err3);
						// select informations about players characters
						character.selectOptions(rooms[req.session.roomID].players, function (err4, playerOptions){
							if(err4) return sendErrorPage(res, err4);
							// check if game was saved in battle
							if(savegame.currentEnemies){
								console.log('SERVER - load gamemaster game with start scenes and enemies');
								// prepare enemies data for database
								var currentEnemies = savegame.currentEnemies.replace(new RegExp('},{', 'g'), '}//SPLIT//{');
								var enemiesData = currentEnemies.split('//SPLIT//');
								for(var i=0; i<enemiesData.length; i++){
									enemiesData[i] = JSON.parse(enemiesData[i]);
								}
								// get enemies from database
								adventure.selectContents('Enemies', enemiesData, function (err5, enemiesContent){
									if(err5) return sendErrorPage(res, err5);
									// render adventure file for gamemaster with enemies
									res.render(__dirname+'/public/adventureGM.html', {
										username: req.session.username,
										roomID: req.params.roomID,
										scenes: scenes,
										players: rooms[req.session.roomID].players,
										playerOptions: playerOptions,
										inBattle: true,
										enemies: {content:enemiesContent, data:enemiesData},
										tutorial: tutorialMode
									});
								});
							}
							else{
								console.log('SERVER - load gamemaster game start scenes');
								// render adventure file for gamemaster without enemies
								res.render(__dirname+'/public/adventureGM.html', {
									username: req.session.username,
									roomID: req.params.roomID,
									scenes: scenes,
									players: rooms[req.session.roomID].players,
									playerOptions: playerOptions,
									inBattle: false,
									tutorial: tutorialMode
								});
							}
						});
					});
				}
				else if(req.params.scene){
					console.log('SERVER - save start scene in new game');
					// update savegame with start scenes
					general.updateGameScenes(req.params.scene, req.session.currentGame, req.session.userID, function (err3, savegameID){
						if(err3) return sendErrorPage(res, err3);
						// select scene from database
						adventure.selectStartScenes(req.params.scene, function (err4, scenes){
							if(err4) return sendErrorPage(res, err4);
							// select informations about players characters
							character.selectOptions(rooms[req.params.roomID].players, function (err5, playerOptions){
								if(err5) return sendErrorPage(res, err5);
								//render adventure file for gamemaster
								res.render(__dirname+'/public/adventureGM.html', {
									username: req.session.username,
									roomID: req.params.roomID,
									scenes: scenes,
									players: rooms[req.params.roomID].players,
									playerOptions: playerOptions,
									inBattle: false,
									tutorial: tutorialMode
								});
							});
						});
					});
				}
				else return sendErrorPage(res, 'No scenes for game found.');
			});
		});
	}
	// if user is no gamemaster
	else if(req.session.role === 'player') res.redirect('/play/'+req.params.roomID);
	else res.redirect('/');
};

var adventureP = function (req, res){
	// select character data for player
	if(req.session.role === 'player'){
		// save game id in player session if not done yet
		if(!req.session.currentGame){
			req.session.currentGame = rooms[req.session.roomID].currentGame;
		}

		// get character id for player if it is not set yet
		if(!req.session.characterID){
			var characterID;
			if(typeof rooms[req.session.roomID] !== 'undefined'){
				for (var i=0; i<rooms[req.session.roomID].players.length; i++) {
					if(rooms[req.session.roomID].players[i].name.toLowerCase() === req.session.username.toLowerCase()){
						characterID = rooms[req.session.roomID].players[i].characterID;
					}
				}
			}
			if(!characterID) return sendErrorPage(res, 'No character for player found.');
			req.session.characterID = characterID;
			req.session.ready = true;
		}

		// get character and inventory data for plyer
		userContent.selectCharacterInformations(req.session.characterID, req.session.userID, function (err, response){
			if(err) return sendErrorPage(res, err);
			general.getTutorialValue(req.session.userID, function (err2, tutorialMode){
				if(err2) return sendErrorPage(res, err2);
				character.getInventory(req.session.characterID, req.session.userID, function (err3, inventory){
					if(err3) return sendErrorPage(res, err3);
					// load savegame
					general.loadGameContent(req.session.currentGame, function (err4, savegame){
						if(err4) return sendErrorPage(res, err4);
						console.log('SERVER - savegame for player loadad');
						var jsonData = require(__dirname+'/json/characterSheet.json');
						// check if game was saved in battle
						if(savegame.currentEnemies){
							console.log('SERVER - load player game with enemies');
							// prepare enemies data for database
							var currentEnemies = savegame.currentEnemies.replace(new RegExp('},{', 'g'), '}//SPLIT//{');
							var enemiesData = currentEnemies.split('//SPLIT//');
							for(var i=0; i<enemiesData.length; i++){
								enemiesData[i] = JSON.parse(enemiesData[i]);
							}
							// get enemies from database
							adventure.selectContents('Enemies', enemiesData, function (err3, enemiesContent){
								// render adventure file for player with enemies
								res.render(__dirname+'/public/adventureP.html', {
									username: req.session.username,
									roomID: req.params.roomID,
									sessionID: req.session.id,
									inventory: inventory,
									inventoryOrder: response.rows[0].inventory.split(','),
									response: { informations: response.rows[0] },
									inBattle: true,
									enemies: {content:enemiesContent, data:enemiesData},
									startLevel: false,
									attributes: jsonData.attributes,
									skills: jsonData.skills,
									characteristics: jsonData.characteristics,
									tutorial: tutorialMode
								});
							});
						}
						else{
							console.log('SERVER - render adventure file for player');
							// render adventure file for player without enemies
							res.render(__dirname+'/public/adventureP.html', {
								username: req.session.username,
								roomID: req.params.roomID,
								sessionID: req.session.id,
								inventory: inventory,
								inventoryOrder: response.rows[0].inventory.split(','),
								response: { informations: response.rows[0] },
								inBattle: false,
								startLevel: false,
								attributes: jsonData.attributes,
								skills: jsonData.skills,
								characteristics: jsonData.characteristics,
								tutorial: tutorialMode
							});
						}
					});
				});
			});
		});
	}
	// if user is no player
	else if(req.session.role === 'gamemaster') adventureGM(req, res);
	else res.redirect('/');
};


/* CLOSE THE ADVENTURE */
var closeAdventure = function (req, res){
	console.log('SERVER - user quit game');
	// forget current game variables
	if(req.session.role === 'player'){
		req.session.characterID = null;
		req.session.ready = false;
	}
	req.session.roomID = null;
	req.session.currentGame = null;
	req.session.role = null;

	res.redirect('/');
};


/* RETURN TO THE ADVENTURE */
var returnToAdventure = function (req, res){
	console.log('SERVER - return to the adventure');
	// check status of running game
	switch (rooms[req.params.roomID].adventureStatus) {
		case 0:
			return res.redirect('/connect/');
		case 1:
			return res.redirect('/prepare/'+req.params.roomID);
		case 2:
			return res.redirect('/play/'+req.params.roomID);
		default:
			return sendErrorPage(res, 'Could not return to the adventure');
	}
};


/* IN GAME */

var nextScene = function (req, res){
	console.log('SERVER - load next scene for savegame '+req.session.currentGame);
	// select next scene from database and save in scene history of savegame
	adventure.chooseNextScene(req.body.sceneID, req.session.userID, req.session.currentGame, function (err, sceneData){
		res.status(200).json({ err:err, sceneData:sceneData });
	});
};

var saveInventory = function (req, res){
	console.log('SERVER - save character inventory');
	// save updated inventory of user character in database
	character.saveInventory(req.session.characterID, req.session.userID, req.body.inventoryData, function (err){
		res.status(200).json({ err:err });
	});
};

var saveEnemies = function (req, res){
	console.log('SERVER - save enemies');
	// save updated enemies of battle in database
	adventure.saveEnemies(req.session.currentGame, req.session.userID, req.body.enemiesData, function (err){
		res.status(200).json({ err:err });
	});
};

var deleteEnemies = function (req, res){
	console.log('SERVER - delete enemies and stop battle');
	// delete enemies from database and stop battle
	adventure.deleteEnemies(req.session.currentGame, req.session.userID, function (err){
		res.status(200).json({ err:err });
	});
};

var selectDices = function (req, res){
	console.log('SERVER - select dices for skill '+req.body.skill);
	// calculate number and attribute types of dices for player character
	var jsonData = require(__dirname+'/json/characterSheet.json');
	character.getAttributesValuesForSkill(req.body.skill, req.session.characterID, jsonData, function (err, response){
		res.status(200).json({ err:err, attributes:response.attributes, numOfDices:response.attrValues[0] });
	});
};

/* TUTORIAL */
var toggleTutorial = function (req, res){
	// change tutorial mode
	general.changeTutorialValue(req.session.userID, req.body.tutorial, function (err){
		res.status(200).json({ err:err });
	});
};









/* SOCKET CONNECTIONS */
var socketConnections = function (socket) {

	/* HOST AND JOIN GAME */
	socket.on('hostGame', function (data){
		// check for existing rooms
		if(typeof rooms[data.roomID] !== 'undefined'){
			console.log('SOCKETS - add gamemaster to room');
			var players = [];
			// check if hosted game is savegame
			if(data.characterIDs.length > 0){
				// preset which characters are allowed in game
				for (var i = 0; i < data.characterIDs.length; i++) {
					players.push({characterID:data.characterIDs[i].characterID});
				}
			}

			// save gamemaster and player data in room
			rooms[data.roomID].gamemaster = {name:data.username, socketID:socket.id, connected:true};
			rooms[data.roomID].players = players;

			// connect gamemaster to socket room
			socket.join(data.roomID);
		}
		else{
			console.log('ERROR connectGamemasterToRoom - room does not exit');
			socket.emit('error', null);
		}
	});

	socket.on('joinGame', function (data){
		// check for existing room
		if(typeof rooms[data.roomID] !== 'undefined'){
			console.log('SOCKETS - add player to room '+data.roomID);
			// check if player was already connected and lost the connection
			var knownPlayer = false, savegameCharacters = [];
			for(var i=rooms[data.roomID].players.length-1; i>=0; i--){

				// check if savegame with character presets was loaded
				if(typeof rooms[data.roomID].players[i].name === 'undefined'){
					if(typeof rooms[data.roomID].players[i].characterID !== 'undefined'){
						savegameCharacters.push(rooms[data.roomID].players[i].characterID);
					}
				}
				else if(rooms[data.roomID].players[i].name.toLowerCase() === data.username.toLowerCase()){
					// error handling - first player in array at 0 would be recognized as unknown
					knownPlayer = i+1;
				}
			}

			if(knownPlayer){
				// reconnect known player
				// update variables in room
				rooms[data.roomID].players[knownPlayer-1].socketID = socket.id;
				rooms[data.roomID].players[knownPlayer-1].connected = true;
				console.log('SOCKETS - player reconnected');

				// connect player to socket room
				socket.join(data.roomID);
				// send the adventure status to the player to know where to go on
				socket.emit('connected', { err:false, adventureStatus:rooms[data.roomID].adventureStatus });
				// send updated list of players to the gamemaster
				socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('updatePlayerList', {players:rooms[data.roomID].players});
			}
			else if(rooms[data.roomID].adventureStatus <= 0){
				console.log('SOCKETS - connect player to save game room');
				// check if player is allowed in room
				if(savegameCharacters.length > 0){
					// get character name of savegame character
					character.CharactersOfUser(savegameCharacters, data.username, function (err, character){
						if(err || !character){
							socket.emit('connected', { err:'Dies ist eine geschlossene Spielrunde. Du kannst dem Spiel nicht beitreten, da du keinen passenden Charakter besitzt.' } );
							return;
						}
						else{
							// add player data to room
							for(var i=rooms[data.roomID].players.length-1; i>=0; i--){
								if(rooms[data.roomID].players[i].characterID === character.id){
									rooms[data.roomID].players[i].name = data.username;
									rooms[data.roomID].players[i].userID = data.id;
									rooms[data.roomID].players[i].sessionID = data.sessionID;
									rooms[data.roomID].players[i].socketID = socket.id;
									rooms[data.roomID].players[i].connected = true;
									rooms[data.roomID].players[i].ready = false;
									rooms[data.roomID].players[i].charactername = character.name;
									rooms[data.roomID].players[i].imagepath = character.imagepath;

									// connect player to socket room
									socket.join(data.roomID);
									// send the adventure status to the player to know where to go on
									socket.emit('connected', { err:false, adventureStatus:rooms[data.roomID].adventureStatus });
									// send updated list of players to the gamemaster
									socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('updatePlayerList', {players:rooms[data.roomID].players});
									return;
								}
							}
						}
					});
				}
				else{
					console.log('SOCKETS - new player added');
					// add new player to room
					rooms[data.roomID].players.push({name:data.username, userID:data.id, sessionID:data.sessionID, socketID:socket.id, connected:true, ready:false});

					// connect player to socket room
					socket.join(data.roomID);
					// send the adventure status to the player to know where to go on
					socket.emit('connected', { err:false, adventureStatus:rooms[data.roomID].adventureStatus });
					// send updated list of players to the gamemaster
					socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('updatePlayerList', {players:rooms[data.roomID].players});
				}
			}
			else{
				socket.emit('connected', { err:'Das Abenteuer hat bereits begonnen.' } );
				return;
			}
		}
		else socket.emit('connected', { err:'Es konnte kein Spiel mit Code '+data.roomID+' gefunden werden. Bitte versuche es erneut.' } );
	});


	/* RECONNECT */
	socket.on('connectGamemaster', function (data){
		// check for existing room
		if(typeof rooms[data.roomID] !== 'undefined'){
			console.log('SOCKETS - gamemaster available');
			// check if gamemaster is registered in room
			if(rooms[data.roomID].gamemaster.name.toLowerCase() === data.username.toLowerCase()){
				// reconnect gamemaster to socket room
				socket.join(data.roomID);
				// update variables in room
				rooms[data.roomID].gamemaster.socketID = socket.id;
				rooms[data.roomID].gamemaster.connected = true;
				// send updated list of players to the gamemaster
				socket.emit('updatePlayerList', {players:rooms[data.roomID].players});
				// inform players about reconnected gamemaster
				for (var i=rooms[data.roomID].players.length - 1; i >= 0; i--) {
					socket.broadcast.to(rooms[data.roomID].players[i].socketID).emit('gamemasterConnected');
				}
			}
			else{
				console.log('ERROR connectGamemaster - gamemaster unknown');
				socket.emit('error', null);
			}
		}
		else{
			console.log('ERROR connectGamemaster - could not find room');
			socket.emit('error', null);
		}
	});

	socket.on('connectPlayer', function (data){
		// check for existing room
		if(typeof rooms[data.roomID] !== 'undefined'){
			console.log('SOCKETS - player available');
			// check if player was already connected and lost the connection
			var knownPlayer = false;
			for(var i=rooms[data.roomID].players.length-1; i>=0; i--){
				if(rooms[data.roomID].players[i].name.toLowerCase() === data.username.toLowerCase()){
					// error handling - first player in array at 0 would be recognized as unknown
					knownPlayer = i+1;
				}
			}

			// reconnect known player
			if(knownPlayer>0){
				// update variables in room
				rooms[data.roomID].players[knownPlayer-1].socketID = socket.id;
				rooms[data.roomID].players[knownPlayer-1].connected = true;
				// connect player to socket room
				socket.join(data.roomID);
				// send updated list of players to the gamemaster
				socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('updatePlayerList', {players:rooms[data.roomID].players});
			}
			else{
				console.log('ERROR connectPlayer - player unknown');
				socket.emit('error', null);
			}
		}
		else{
			console.log('ERROR connectPlayer - could not find room');
			socket.emit('error', null);
		}
	});


	/* DISCONNECT */
	socket.on('disconnect', function (){
		console.log('SOCKET - DISCONNECT');
		// get all rooms the user is connected to
		var userRooms = socket.adapter.rooms;

		for(var roomID in userRooms){
			// check if room is known as game room
			if(typeof rooms[roomID] !== 'undefined'){
				console.log('got room id');
				// // get clients in game room
				// var clients = Object.keys(userRooms[roomID]);
				//
				// // close room if second last client disconnects
				// if(clients.length <= 1){
				// 	// close room
				// 	// broadcast to remaining client to close room
				// 	for(var client in clients){
				// 		socket.broadcast.to(client).emit('adventureClosed');
				// 	}
				//
				// 	// delete room from rooms array
				// 	delete rooms[roomID];
				// }
				// else{
					// check role of disconnected user
					if(rooms[roomID].gamemaster.socketID === socket.id){
						// disconnect gamemaster
						console.log('SOCKETS - gamemaster disconnected');
						// update variables in room
						rooms[roomID].gamemaster.connected = false;
						// inform players about disconnected gamemaster
						for(var i=rooms[roomID].players.length-1; i>=0; i--){
							socket.broadcast.to(rooms[roomID].players[i].socketID).emit('gamemasterDisconnected');
						}
					}
					else{
						// check which user disconnected
						for(var i=rooms[roomID].players.length-1; i>=0; i--){
							if(rooms[roomID].players[i].socketID === socket.id){
								// disconnect player
								console.log('SOCKETS - player disconnected');
								// update variables in room
								rooms[roomID].players[i].connected = false;
								// send updated list of players to the gamemaster
								socket.broadcast.to(rooms[roomID].gamemaster.socketID).emit('updatePlayerList', {players:rooms[roomID].players});
							}
						}
					}
				// }
			}
			// leave all rooms
			socket.leave(roomID);
		}
	});


	/* INTRODUCTION */
	socket.on('startIntro', function (data){
		console.log('SOCKETS - start introduction');
		// update adventure status
		rooms[data.roomID].adventureStatus = 1;
		// save character start level in room
		rooms[data.roomID].startLevel = data.characterLevel;
		// send start command to users
		socket.broadcast.to(data.roomID).emit('startIntro', {roomID:data.roomID});
		// confirm start command to gamemaster
		socket.emit('startIntro', {roomID:data.roomID});
	});

	socket.on('characterReady', function (data){
		console.log('SOCKETS - character choosen');
		// update character status variables of player in room
		for(var i=rooms[data.roomID].players.length-1; i>=0; i--){
			if(rooms[data.roomID].players[i].name.toLowerCase() == data.username.toLowerCase()){
				rooms[data.roomID].players[i].charactername = data.charactername;
				rooms[data.roomID].players[i].characterID = data.characterID;
				rooms[data.roomID].players[i].imagepath = data.imagepath;
				rooms[data.roomID].players[i].ready = true;
			}
		}
		// inform gamemaster
		socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('characterReady', {username:data.username, charactername:data.charactername});
		socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('updatePlayerList', {players:rooms[data.roomID].players});
	});


	/* START THE ADVENTURE */
	socket.on('startAdventure', function (data){
		console.log('SOCKETS - start adventure');
		// update adventure status
		rooms[data.roomID].adventureStatus = 2;
		// make sure players are ready
		for(var i=rooms[data.roomID].players.length-1; i>=0; i--){
			rooms[data.roomID].players[i].ready = true;
		}
		// send start command to users
		socket.broadcast.to(data.roomID).emit('startAdventure', {roomID:data.roomID});
		// confirm start command to gamemaster
		socket.emit('startAdventure', {roomID:data.roomID, startScene:data.startScene});
	});


	/* CLOSE THE ADVENTURE */
	socket.on('closeAdventure', function (data){
		console.log('SOCKETS - close adventure');
		// leave room
		socket.leave(data.roomID);
		// delete room
		delete rooms[data.roomID];
		// close game for all users
		socket.broadcast.to(data.roomID).emit('adventureClosed');
		// confirm close command to gamemaster
		socket.emit('adventureClosed');
	});

	socket.on('leaveAdventure', function (data){
		console.log('SOCKETS - player leaved adventure');
		// leave room
		socket.leave(data.roomID);

		// update status of player in room
		for(var i=rooms[data.roomID].players.length-1; i>=0; i--){
			if(rooms[data.roomID].players[i].name.toLowerCase() == data.username.toLowerCase()){
				rooms[data.roomID].players[i].connected = false;
				// inform gamemaster
				socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('updatePlayerList', {players:rooms[data.roomID].players});
			}
		}
		// confirm close command to player
		socket.emit('leaveAdventure');
	});


	/* IN GAME FUNCTIONS */
	socket.on('sendContentToPlayers', function (data){
		console.log('SOCKETS - send to player content of type '+data.contentType);
		if(data.contentType === 'Games'){
			// send minigame to all selected players
			for(var i=0; i<data.playerSockets.length; i++){
				socket.broadcast.to(data.playerSockets[i]).emit('receiveContent', { contentType:data.contentType, game:data.content[0] });
			}
		}
		else{
			adventure.selectContents(data.contentType, data.content, function (err, response){
				if(err) socket.emit('sendContentCallback', { err:err });
				if(response){
					// send content to all selected players
					for(var i=0; i<data.playerSockets.length; i++){
						if(data.contentType === 'Enemies') socket.broadcast.to(data.playerSockets[i]).emit('receiveContent', { contentType:data.contentType, content:response, enemiesData:data.content });
						else socket.broadcast.to(data.playerSockets[i]).emit('receiveContent', { contentType:data.contentType, content:response });
					}
				}
			});
		}
	});

	socket.on('receiveContentCallback', function (data){
		socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('sendContentCallback', { err:data.err });
	});

	socket.on('sendOptionsToPlayer', function (data){
		console.log('SOCKETS - send options to player');
		character.updateOptions(data.options, function (err){
			if(!err){
				// send options to player
				socket.broadcast.to(data.playerSocket).emit('receiveOptions', { options:data.options });
			}
			socket.emit('receiveOptionsCallback', { err:err });
		});
	});


	/* SCENE IMAGE FOR PLAYERS */
	socket.on('requestSceneImage', function (data){
		console.log('SOCKETS - scene image requested');
		socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('requestSceneImage');
	});

	socket.on('sceneImage', function (data){
		// send new scene to all players in room
		console.log('SOCKETS - scene image '+data.imagepath);
		socket.broadcast.to(data.roomID).emit('receiveSceneImage', {imagepath:data.imagepath});
	});


	/* BATTLE*/
	socket.on('attackTheEnemie', function (data){
		console.log('SOCKETS - give dices to player to attack the enemie');
		socket.broadcast.to(data.playerSocket).emit('attackTheEnemie', {level:data.level, enemie:data.enemie});
	});

	socket.on('hitTheEnemie', function (data){
		console.log('SOCKETS - player hits the enemie');
		socket.broadcast.to(rooms[data.roomID].gamemaster.socketID).emit('enemieGetHit', {hit:data.hit, enemie:data.enemie});
	});

	socket.on('updateEnemies', function (data){
		socket.broadcast.to(data.roomID).emit('updateEnemies', {enemiesData:data.enemiesData});
	});

	socket.on('hitThePlayer', function (data){
		console.log('SOCKETS - enemie hits the player');
		socket.broadcast.to(data.playerSocket).emit('getHit', {hit:data.hit, enemieID:data.enemieID});
	});

	socket.on('stopBattle', function (data){
		console.log('SOCKETS - stop battle');
		socket.broadcast.to(data.roomID).emit('stopBattle');
	});

};
