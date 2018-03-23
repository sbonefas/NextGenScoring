# NextGenScoring
The Stat Crew System for Basketball, the current software used by the UW Athletic Department to score basketball games, is extremely outdated and obsolete (it cannot run on Window operating systems past XP). The purpose of this project is to develop a modern replacement to the software which can be used via a web application. Our program allows scorekeepers to document all relevant statistics related to the game being played, and then export it to both a file which the stadium’s scoreboards reference, as well as any external media sources which are following the game. 
(ITERATION no1)

# Installation
To run NextGenScoring, you must first download Node.js and install Electron. Download Node.js [here](https://nodejs.org/en/). To make sure it is installed, run

> node -v

Once you have Node downloaded, install Electron using npm by running

> npm install Electron

# Usage and Testing
On Iteration 1, our front end and back end are disconnected. This is because of a an oversight regarding Vue.js default prompts being incompatible with Electron that we didn't become aware of until late in Iteration 1. This means that we are unable to string a complete command from the user to the data and back.

So, to run our backend tests, run

> node data_testing.js

This will run a rough automated test script that tests all data reading and writing.

To see some hardcoded interactions between the front and back ends, run

> npm start

You will see an old version of the front end that runs some data reading and writing, confirming that this interaction is ready for implementation.

To view the front end, run (Unix/Linux)

> open index.html

or (Windows)

> explorer "index.html"

This will open the in-game scoring interface, which hard edits the scoreboard on the screen. By Iteration 2, this will instead edit the data through the backend, and then send the edited data from the backend to the scoreboard.

To run our frontend tests, download Python 3.6.4 [here](https://www.python.org/downloads/). You also need to download Mozilla Firefox 57.0 [here](https://filehippo.com/download_firefox/79535/). Finally, you need to install geckodriver 0.20.0 [here](https://github.com/mozilla/geckodriver/releases) and edit your environmental variables to ensure that your computer can find the geckodriver.

In the terminal run

> pip install selenium

to install Selenium. Go to the tests/frontend tests and run the Python scripts with python name_of_file.py 
