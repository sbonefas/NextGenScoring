# NextGenScoring
The Stat Crew System for Basketball, the current software used by the UW Athletic Department to score basketball games, is extremely outdated and obsolete (it cannot run on Window operating systems past XP). The purpose of this project is to develop a modern replacement to the software which can be used via a web application. Our program allows scorekeepers to document all relevant statistics related to the game being played, and then export it to both a file which the stadium’s scoreboards reference, as well as any external media sources which are following the game. 
(ITERATION no2)

# Installation
To run NextGenScoring, you must first download Node.js and install Electron. Download Node.js [here](https://nodejs.org/en/). To make sure it is installed, run

> node -v

Once you have Node downloaded, install Electron using npm by running

> npm install electron

# Usage and Testing
On Iteration 2, our front end and back end are partially integrated. Because of a an oversight regarding Vue.js default prompts being incompatible with Electron (that we didn't become aware of until late in Iteration 1), our front and back ends were disconnected. They are now partially connected, except for generating teams.

So, to run our backend tests, run

> node data_testing.js

This will run a rough automated test script that tests all data reading and writing.

To see some hardcoded interactions between the front and back ends, run

> npm start

You will see an old version of the front end that runs some data reading and writing, confirming that this interaction is ready for implementation.

To view the front end, run (Unix/Linux)

> open login.html

or (Windows)

> explorer "login.html"

This will open the login screen without running electron. Because electron is not running, the Vue data will not populate (it will show as {{variable_name}} instead). Note: This may also misconstrue the CSS styling. After entering the password, the user can navigate to view teams, games, and scoring. The in-game scoring interface we created in Iteration 1 can be reached through "G-Gametime Scoring" -> "Create New Game" -> "Submit and Go to Scoring" 

The password to enter the frontend application is:

>123

To run our frontend tests, download Python 3.6.4 [here](https://www.python.org/downloads/). You also need to download Mozilla Firefox 57.0 [here](https://filehippo.com/download_firefox/79535/). Finally, you need to install geckodriver 0.20.0 [here](https://github.com/mozilla/geckodriver/releases) and edit your environmental variables to ensure that your computer can find the geckodriver. Also be sure to set the testing variable in app.js to be true.

In the terminal run

> pip install selenium

to install Selenium. Go to the tests/frontend tests and run the Python scripts with python name_of_file.py 
