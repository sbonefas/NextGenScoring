console.log('main process loaded');

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

	if(TESTING) readTestData('data/test_data.txt');

	win.on('closed', () => {
		win = null;
		app.quit();
	})
}

/** 
 * Reads the data in a given file and prints it to console. Data files
 * are temporarily stored in 'data/'.
 * --USED FOR TESTING--
 */
function readTestData(file_path) {
	
	var test_data = fs.readFileSync(file_path, 'utf8');
	if(TESTING) console.log(test_data);
	
	return test_data;
}

/** 
 * Writes the data in a given file and prints it to console. Data files
 * are temporarily stored in 'data/'.
 * --USED FOR TESTING--
 */
function writeTestData(file_path, data) {
	fs.writeFileSync(file_path, data, 'utf8');
	if(TESTING) console.log(test_data);

}


/**
 * Sends data from the front end to the back end. 
 * Dummy function for the front end. Temporary
 * --USED FOR TESTING--
 */

ipc.on('send-data', function(event,keystrokes){ 
	try {
		fs.writeFileSync(file_path, keystrokes, 'utf8');
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
		test_data = readTestData(file_path);
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
