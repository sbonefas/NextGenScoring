const Application = require("spectron").Application;
const assert = require("assert");
const electron = require("electron"); // Require Electron from the binaries included in node_modules.
const path = require("path");
const app = electron.app;
const ipc = require("electron").ipcRenderer;

let args = ["Wisconsin", "Ohio State", "796", "518", "100-0", "0-100", "3-12-19", "4pm", "Kohl Center", "Kohl-Center-code", "1", ["schedule notes"], "quarters", "15", "15", ["Official Names"], ["Box comments"],"attendance"];
//ipc.send('init-game', args);

let fieldgoal_off_rebound = "j 02 r 05 h";  //offensive rebound (shot made by home #2, rebound home #5)
let fieldgoal_def_rebound = "j 02 d 03 h";  //defensive rebound (shot made by home #2, rebound visit #3)
let fieldgoal_no_rebound = "j 02 g h";			//no rebound (good shot)
let fieldgoal_assist = "j 02 a 04 h";				//assist by home #4
let freethrow_off_rebound = "e 05 r 01 h";	//offensive rebound (shot made by home #5, rebound home #1)
let freethrow_def_rebound = "e 05 d 04 h";	//defensive rebound (shot made by home #5, rebound visit #4)
let freethrow_no_rebound = "e 05 e h";			//no rebound (good freethrow)
let steal = "s 03 v";												//steal
let block_off_rebound = "k 02 r 03 h";			//block, offensive rebound (blocked by home, recovered by away)
let block_def_rebound = "k 02 d 04 h"; 			//block, defensive rebound (blocked by home, recovered by home)
let block_no_rebound = "k 02 h";						//block, no rebound
let team_rebound = "r m d h";								//team rebound
let tech_foul = "f t10 h";									//technical foul
let pers_foul = "f 12 h";										//personal foul
let bench_foul = "f b h";										//bench foul
/*ipc.send('add-play', fieldgoal_off_rebound);
ipc.send('add-play', fieldgoal_def_rebound);
ipc.send('add-play', fieldgoal_no_rebound);
ipc.send('add-play', fieldgoal_assist);
ipc.send('add-play', freethrow_off_rebound);
ipc.send('add-play', freethrow_def_rebound);
ipc.send('add-play', freethrow_no_rebound);
ipc.send('add-play', steal);
ipc.send('add-play', block_off_rebound);
ipc.send('add-play', block_def_rebound);
ipc.send('add-play', block_no_rebound);
ipc.send('add-play', team_rebound);
ipc.send('add-play', tech_foul);
ipc.send('add-play', pers_foul);
ipc.send('add-play', bench_foul);
ipc.on('init-game-failure', function(event,args) {
	console.log("An error occurred in initializing game " + args + " to file : " + e);
});

ipc.on('init-game-success', function(event,args) {
	console.log("Successfully initialized game: " + args);
});*/
describe('Application launch', function () {
  this.timeout(10000)

  before(function () {
    this.app = new Application({
      // Your electron path can be any binary
      // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
      // But for the sake of the example we fetch it from our node_modules.
      path: electron,

      // Assuming you have the following directory structure

      //  |__ my project
      //     |__ ...
      //     |__ main.js
      //     |__ package.json
      //     |__ index.html
      //     |__ ...
      //     |__ test
      //        |__ spec.js  <- You are here! ~ Well you should be.

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '..')]
    })
    return this.app.start();
  })

  after(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.strictEqual(count, 1);
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
      // assert.equal(count, 2)
    })
  })
  /*describe('login page', function() {
     it('should render the HTML from the login page for the welcome id', function() {
       return this.app.client.getText('#welcome').then(function (welcome) {
          assert.strictEqual("Welcome to\nNextGen Scoring", welcome);
       })
     });
     it('should render the HTML from the login page for the menu id', function() {
       return this.app.client.getText('#menu').then(function (menu) {
         assert.strictEqual("Please enter the password to access this site.\nSubmit Forgot Password", menu);
       })
     });
     //TODO: Test for invalid password first
     it('should correctly enter the password and move onto the next screen', function() {
         this.app.client.waitForVisible('#pswrd', 20000, true);
         return this.app.client.elementIdText('pswrd')
           .then(function (pswrd) {
              pswrd.value.keys('123');
              return this.app.client.element('//*[@id="menu"]/div/button[1]').click();
           //this.app.client.setValue('#pswrd', 'fafds');
           //assert.strictEqual("Please enter the password to access this site.\nSubmit Forgot Password", pswrd);
         })*/
});
