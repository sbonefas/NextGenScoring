/*const Application = require('spectron').Application
const assert = require('assert')
const electron = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path');
//const app = electron.app
const BrowserWindow = electron.BrowserWindow;
//const main = require('../main')

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

  describe('login page', function() {
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
         })
     });
  });
})*/
