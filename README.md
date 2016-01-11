# pen-and-paper-mobile

———— INSTRUCTION ————

Here’s a short instruction how to get the web application running on your computer.


1. INSTALL NODE v0.12.2	

	$ wget http://nodejs.org/dist/v0.12.2/
	
	$ tar -xvf node-v0.12.2.tar.gz
	
	$ cd node-v0.12.2
	
	$ ./configure
	
	$ make
	
	$ sudo make install


2. MAKE SURE NPM IS INSTALLED
	
	$ npm -v

	This should show you the version of your installed npm.
	If it’s not install npm with:

	$ curl http://npmjs.org/install.sh | sh


3. INSTALL REQUIRED NODE-MODULES FROM „package.json“

	$ npm install

	The modules should be installed in „node_modules“-folder.


4. ADD REQUIRED JAVASCRIPT FRAMEWORKS TO “public/js“-FOLDER

	You need …

	… the „Draggabilly“-framework v.1.1.2:
	„draggabilly.pkgd.min.js“ from http://draggabilly.desandro.com

	… the „Hammer.js“-framework v.2.0.4:
	„hammer.min.js“ from http://hammerjs.github.io

	… and „jQuery“ v1.11.2:
	„jquery-1.11.2.min.js“ from http://code.jquery.com/jquery-1.11.2.min.js

	Put all three files in “public/js“.


5. SETUP A MYSQL DATABASE

	Create a MySQL-database „penandpaper“,
	or select your own name and change it in „config.json“.

	Create a database user „pap-user“ with password „lovepenandpaper“,
	or select your own name and password and change it in „config.json“.

	I suggest to limit the permissions of the pap-user 
	so that the user has no permission to write in
	„Character...“-Tables, „Scene...“-Tables, „Enemie...“-Tables and „Item...“-Tables.
	Than add a second database user „admin“ 
	with unlimited permissions for development.


	Import database dump from „penandpaper_database.sql“:

	$ mysql -u username -p password database < penandpaper_database.sql


6. START SERVER

	$ node server.js



Have fun playing your individual pen-&-paper-adventure on your smartphone.
