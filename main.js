console.log('main process loaded');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const fs = require("fs");
const ipc = electron.ipcMain;
const dialog = electron.dialog;

let win;

function createWindow() {
	win = new BrowserWindow();
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true		
	}));

	readTestData('data/test_data.txt');

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
	var testing = false;
	if(testing) console.log(test_data);
}

ipc.on('async-message', function(event){
	event.sender.send('async-reply', 'Main process opened the error dialog'); 
})

app.on('ready', createWindow);

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}	
})
