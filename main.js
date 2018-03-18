console.log('main process loaded');

var drw = require('./data_read_write.js');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const fs = require("fs");	//node.js filesystem
const ipc = electron.ipcMain;
const dialog = electron.dialog;

let win;
const TESTING = true;
const file_path = 'data/test_data.txt';

function createWindow() {
	win = new BrowserWindow();
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true		
	}));

	/** SIMPLE BACKEND TESTING */
	/** TODO: DELETE WHEN PUT IN TEST SUITE */
	if(TESTING) {
		drw.readTestData('data/test_data.txt');

		if(drw.test_read()) console.log("test_read success");
		else console.log("test_read fail");

		if(drw.test_write()) console.log("test_write success");
		else console.log("test_write fail");

		drw.create_game_file('test_create_file');
		if(fs.existsSync('data/test_create_file.csv')) console.log("test_create_file success");
		else console.log("test_create_file fail");

		if(drw.create_game_file('test_create_file')) console.log("test_create_file fail");
		else console.log("test_create_file success");
	}

	win.on('closed', () => {
		win = null;
		app.quit();
	})
}




/**
 * Sends data from the front end to the back end. 
 * Dummy function for the front end. Temporary
 * --USED FOR TESTING--
 * STAT FORMAT AS FOLLOWS:
 *
 *			
 * [PLAYER_NUMBER, FIELDGOAL, FIELDGOAL_ATTEMPT, MADE_3, FREETHROW, FREETHROW_ATTEMPT, REBOUND, ASSIST, PERSONAL FOUL, BLOCK, TURNOVER, STEAL]
 * [			0			 ,		1			,					2				 ,	3		 ,		 4		,					5				 ,		6   ,   7   ,        8      ,	 9  , 	 10   ,  11  ]
 *
 */

 
function addPlay(keystrokes){ 
	var statArray = [0,0,0,0,0,0,0,0,0,0];
	var keyArray = keystrokes.split(/ /);
	if(TESTING) console.log(keyArray);
		
	//input parsing
	statArray[0] = keyArray[1];	//add player's number
	switch(keyArray[0]){
		case "d" || "l" || "p" || "j" || "w" || "y":
			statArray[1] = 1;	//fieldgoal attempt			
			switch(keyArray[2]){
				case "g" || "G" || "q" || "Q":
					statArray[0] = 1;	//fieldgoal
					break;
				case "y":
					statArray[3] = 1;	//made 3-pointer
					break;
				case "r":
					//statArray[6] = 1; //rebound
					break;
				case "x":
					//statArray[6] = 1; //rebound	
					break;
				case "k":
					//blocked shot
					break;
				case "p":
					//in the paint
					break;
				case "f":
					//fast break
					break;
				case "z":
					//fast break in paint
					break;
			}
		case "e":
			statArray[5] = 1; //freethrow attempt
			if (keyArray[2] == "g") statArray[4] = 1;
			break;
		case "r":
			statArray[6] = 1;	//rebound
			break;
		case "a":
			statArray[7] = 1; //assist
			break;
		case "f":
			statArray[8] = 1;	//foul
			break;
		case "t":
			statArray[10] = 1; //turnover
			//team turnover
			//dead ball
			break;
		case "s":
			statArray[11] = 1;	//steal
			break;
	}
	drw.write_to_game_file(statArray, file_path);
}
 
ipc.on('send-data', function (event,keystrokes){ 
	try {
		addPlay(keystrokes);
	} catch (e) {
		//if failure
		console.log("An error occurred in file writing: " + e);
		event.sender.send('send-data-failure');
		return;
	}
	event.sender.send('send-data-success');
});

/**
 * Sends data from the back end to the front end.
 * Dummy function for the front end. Temporary
 * --USED FOR TESTING--
 */
ipc.on('get-data', function(event){ 
	var test_data;
	try {
		test_data = drw.readTestData(file_path);
	} catch (e) {
		//if failure
		console.log("An error occurred in file reading: " + e);
		event.sender.send('get-data-failure');
		return;
	}
	event.sender.send('get-data-success', test_data);

})


/**
 * Example for using IPC to communicate between frontend & backend
 * (see corresponding script in index.html)
 *
 */

ipc.on('async-message', function(event){
	event.sender.send('async-reply', 'Main process opened the error dialog'); 
})

app.on('ready', createWindow);

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}	
})
