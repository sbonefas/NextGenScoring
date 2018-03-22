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
const file_name = 'test_read_game_file';

function createWindow() {
	win = new BrowserWindow();
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true		
	}));

	win.on('closed', () => {
		win = null;
		app.quit();
	})
}




/**
 * Sends data from the front end to the back end. 
 * Dummy function for the front end. Temporary
 * --USED FOR TESTING--
 * 
 * KEYARRAY HOLDS ARGUMENTS FROM FRONTEND
 * FORMAT:
 *	 
 * FOR FIELD GOALS: [PLAY_CODE, PLAYER_NUMBER, RESULT_CODE, REBOUND/ASSIST/BLOCK_PLAYER (REBOUND IF RESULT_CODE = 'R or X' / BLOCK IF RESULT_CODE = 'K' / ASSIST IF ANYTHING ELSE), HOME/AWAY]
 *                  [    0    ,       1      ,      2     ,                                                       3                                                               ,     4    ]	
 * 
 * FOR FREETHROWS: [E, PLAYER_NUMBER, RESULT_CODE, HOME/AWAY]
 *
 * FOR REBOUNDS/ASSISTS/FOULS/BLOCKS/TURNOVERS/STEALS: [PLAY_CODE, PLAYER_NUMBER, HOME/AWAY]
 *  
 * 
 *
 * STATARRAY GETS SUBMITTED TO GAME FILE
 * FORMAT:
 *
 *	 (1)/(0)
 * [HOME/AWAY, PLAYER_NUMBER, FIELDGOAL, FIELDGOAL_ATTEMPT, MADE_3, FREETHROW, FREETHROW_ATTEMPT, REBOUND, ASSIST, PERSONAL FOUL, BLOCK, TURNOVER, STEAL]
 * [    0    ,       1      ,     2    ,         3        ,    4  ,     5    ,         6        ,    7   ,   8   ,        9     ,   10 ,    11   ,   12 ]
 *
 * [7]-[12] ARE EDITED IN SUBPLAY FUNCTIONS BELOW
 *
 * TO: T (TEAM TURNOVER)
 * TO: D (DEAD BALL)
 *
 *
 */

 
function addPlay(keystrokes){ 
	var statArray = [0,0,0,0,0,0,0,0,0,0,0,0,0];
	var keyArray = keystrokes.split(/ /);
	if(TESTING) console.log(keyArray);
		
	//input parsing
	statArray[0] = 
	statArray[1] = keyArray[1];	//add player's number
	switch(keyArray[0]){
		case 'y':
		case 'w':
		case 'j':
		case 'p':
		case 'l':
		case 'd':
			
			var team = keyArray[4];
			statArray[3] = 1;	//fieldgoal attempt
			
			switch(keyArray[2]){
				case 'g' || 'G' || 'q' || 'Q':
					statArray[0] = 1;	//fieldgoal
					if (keyArray[3] != '') assist(team, keyArray[3]);	//If there's an assist, record it
					break;
				case 'y':
					statArray[4] = 1;	//made 3-pointer
					if (keyArray[3] != '') assist(team, keyArray[3]);	//If there's an assist, record it
					break;
				case 'r':
					if (keyArray[3] != '') rebound(team, keyArray[3]);	//If there's a rebound, record it
					break;
				case 'x':
					if (keyArray[3] != '') rebound(team, keyArray[3]);	//If there's a rebound, record it
					break;
				case 'k':
					block(team, keyArray[3]);
					break;
				case 'p':
					//in the paint
					break;
				case 'f':
					//fast break
					break;
				case 'z':
					//fast break in paint
					break;				
			}
			break;
		case 'e':
			statArray[6] = 1; //freethrow attempt
			if (keyArray[2] == 'g') statArray[4] = 1;
			break;
		case 'r':
			rebound(team, keyArray[3]);
			break;
		case 'a':
			assist(team, keyArray[3]); //assist
			break;
		case 'f':
			statArray[9] = 1;	//foul
			break;
		case 't':
			statArray[11] = 1; //turnover
			//team turnover
			//dead ball
			break;
		case 's':
			statArray[12] = 1;	//steal
			break;
	}
	console.log(statArray);
	drw.write_to_game_file(statArray, file_path);
} 
 
 
/*	
 *	SUBPLAY FUNCTIONS
 *	CALLED BY ADDPLAY()
 *
 *
 */ 
 
function rebound(team, player_number){
	var statArray = [team, player_number,0,0,0,0,0,1,0,0,0,0,0];
	drw.write_to_game_file(statArray, file_path);
}
 
function assist(team, player_number){
	var statArray = [team, player_number,0,0,0,0,0,0,1,0,0,0,0];
	drw.write_to_game_file(statArray, file_path);	
}

function block(team, player_number){
	var statArray = [team, player_number,0,0,0,0,0,0,0,0,1,0,0];
	drw.write_to_game_file(statArray, file_path);	
}

/*
function turnover(team, player_number){
	var statArray = [team, player_number,0,0,0,0,0,0,0,0,0,1,0];
	drw.write_to_game_file(statArray, file_path);	
}
*/

/*
 *	IPC EVENT HANDLER
 *
 */
 
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
		test_data = drw.read_game_file(file_path);
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
