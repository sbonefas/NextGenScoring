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
 */

ipc.on('send-data', function(event,keystrokes){ 
	try {
		drw.write_to_game_file(keystrokes, file_path);
		if(TESTING) console.log(keystrokes); 
	} catch (e) {
		//if failure
		console.log("An error occurred in file writing: " + e);
		event.sender.send('send-data-failure');
		return;
	}
	event.sender.send('send-data-success');
})

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
