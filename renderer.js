console.log('Renderer.js loaded');

const electron = require("electron");
const ipc = electron.ipcRenderer;
/*
let Data = {
	message: asdf
};

ipc.send('request-mainprocess-action', Data);
*/
const asyncBtn = document.getElementById('asyncBtn');

asyncBtn.addEventListener('click', function() {
	console.log('async msg 1');
	ipc.send('async-message');
	console.log('async msg 2');

})

ipc.on('async-reply', function(event, arg){
	console.log(arg);	
})