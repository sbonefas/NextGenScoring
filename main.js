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
const indiv_stat_headers = ['player_number','fg','fga','m3','3a','ft','fta','offr','defr','ast','pf','tf','blk','trn','stl','pts'];
const team_stat_headers = ['home/away', 'total_points', 'made_in_paint', 'fast_break', 'team_turnover', 'team_rebound', 'team_fouls', 'partial_timeouts_taken','full_timeouts_taken'];
const Team = require('./Team.js');	//team object import
const Player = require('./Player.js'); 	//player object import
var teams = new Array();
var current_game;

let win;
const TESTING = true;
const file_name = 'test_read_game_file';
const test_file_name = "test_drw_file";

function createWindow() {
	win = new BrowserWindow();
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'login.html'),
		protocol: 'file',
		slashes: true
	}));
	win.maximize();

	/** SIMPLE BACKEND TESTING */
	/** TODO: DELETE WHEN PUT IN TEST SUITE */
	if(TESTING) {
		//drw.create_game_file(stat_headers, test_file_name, args);
		//drw.read_game_file(test_file_name);
		createTeam("Badgers", "WIS", "Bo Ryan", "I Forgot", "Kohl Center");
	}
	win.on('closed', () => {
		win = null;
		//drw.delete_file(test_file_name);
		app.quit();
	})
};


function createTeam(name, code, head_coach, asst_coach, stadium){

	var team = new Team(name, code, head_coach, asst_coach, stadium);
	team.add_player_to_roster(new Player("Frank Kaminsky", 44, "center"));
	teams.push(team);
	console.log("Team name: " + teams[0].get_name());
	console.log("Team code:" + teams[0].get_code());
	console.log("Head coach: " + teams[0].get_head_coach());
	console.log("Assistant coach: " + teams[0].get_asst_coach());
	console.log("Stadium: " + teams[0].get_stadium());
	console.log("Active Roster: ");
	for (var i = 0; i < teams[0].get_active_roster().length; i++){
		var player = teams[0].get_active_roster()[i];
		console.log("[" + i + "] " + player.get_name() + " #" + player.get_number() + " " + player.get_position() + "\n");
	}
	try {
		team.remove_player_from_roster("Frank Kaminsky", 44);
	} catch (e) {
		console.log("Error: " + e);
	}
};



/**
 * Sends data from the front end to the back end.
 *
 * INPUT HOLDS ARGUMENTS FROM FRONTEND
 * FORMAT:
 *
 * FOR FIELD GOALS: [PLAY_CODE, PLAYER_NUMBER, RESULT_CODE (R FOR OFF REBOUND, D FOR DEF REBOUND), REBOUND/ASSIST/BLOCK_PLAYER (REBOUND IF RESULT_CODE = 'R or X or D' / BLOCK IF RESULT_CODE = 'K' / ASSIST IF ANYTHING ELSE), HOME/AWAY]
 *                  [    0    ,       1      ,                    2                              ,                                                             3                                                              ,     4    ]
 *
 *
 * FOR FREETHROWS: [E, PLAYER_NUMBER, RESULT_CODE, REBOUND_PLAYER_NUMBER (IF RESULT_CODE IS R/D), HOME/AWAY]
 *
 * FOR REBOUNDS/ASSISTS/TURNOVERS/STEALS: [PLAY_CODE, PLAYER_NUMBER OR M (FOR TEAM TURNOVER), HOME/AWAY]
 *
 * FOR FOULS: [F, T+PLAYER_NUMBER (IF TECHNICAL) OR B+PLAYER_NUMBER (IF BENCH FOUL) OR PLAYER_NUMBER];
 *
 * FOR CHANGING JERSEY: [F2, PLAYER_NUMBER, NEW_PLAYER_NUMBER, HOME/AWAY]
 *
 * FOR BLOCKS: [K, PLAYER_NUMBER, REBOUND?]
 *
 * PLAYER STATARRAY GETS SUBMITTED TO GAME FILE
 * FORMAT:
 *
 *	 (1)/(0)
 *
 * [HOME/AWAY, PLAYER_NUMBER, FIELDGOAL, FIELDGOAL_ATTEMPT, MADE_3, 3_ATTEMPT, FREETHROW, FREETHROW_ATTEMPT, OFF_REBOUND, DEF_REBOUND, ASSIST, PERSONAL_FOUL, TECHNICAL_FOUL, BLOCK, TURNOVER, STEAL, POINTS]
 * [    0    ,       1      ,     2    ,         3        ,    4  ,     5    ,     6    ,         7        ,       8    ,      9     ,  10   ,      11      ,      12       ,  13  ,    14   ,  15  ,   16  ]
 *
 *
 *
 * TEAM STATARRY FORMAT:
 *
 *
 * [HOME/AWAY, POINTS, MADE_IN_PAINT, FAST_BREAK, TEAM_TURNOVER, TEAM_REBOUND, PARTIAL_TIMEOUTS_TAKEN, FULL_TIMEOUTS_TAKEN]
 *
 * [7]-[12] ARE EDITED IN SUBPLAY FUNCTIONS BELOW
 *
 * TO: T (TEAM TURNOVER)
 * TO: D (DEAD BALL)
 *
 *
 * TIMEOUT FORMAT:
 *
 * [O, (T FOR MEDIA, 3 FOR PARTIAL, M FOR FULL), HOME/AWAY]
 *
 *
 */


function addPlay(keystrokes){
	var statArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var input = keystrokes.split(/ /);
	if(TESTING) console.log(input);

	//input parsing
	statArray[1] = input[1];	//add player's number
	var team = input[input.length-1];
	var actingPlayer;

	if (team === 'h')
		statArray[0] = 1;
	else if (team === 'v')
		statArray[0] = 0;
	switch(input[0]){
		case 'y':
			statArray[5] = 1;	//3 attempt
		case 'w':
			wrongBasket(statArray[0], input[2]);
			return;
		case 'j':
		case 'p':
		case 'l':
		case 'd':

			//fieldgoal attempt cases

			statArray[3] = 1;	//fieldgoal attempt
			if (team != input[3]) actingPlayer = input[3];	//if the 4th arg in input is not the team, it must be a stealing/rebounding/etc. player
			switch(input[2]){
				case 'g' || 'G' || 'q' || 'Q':
					statArray[2] = 1;	//fieldgoal
					if (input[3] === 'a')
					{
					assist(statArray[0], actingPlayer);	//If there's an assist, record it
					}
					statArray[15] = 2;
					break;
				case 'y':
					statArray[2] = 1;	//fieldgoal
					statArray[4] = 1;	//made 3-pointer
					if (input[3] != '')
					{
						assist(statArray[0], actingPlayer);	//If there's an assist, record it
					}
					statArray[15] = 3;
					break;
				case 'r':
					rebound(statArray[0], actingPlayer);	//Offensive rebound
					break;
				case 'x':
					rebound(statArray[0], actingPlayer);	//Offensive rebound
					break;
				case 'd':
					rebound(statArray[0], actingPlayer, 1);	//Defensive rebound
					break;
				case 'k':
					block(statArray[0], actingPlayer, 1);
					break;
				case 'p':
					inPaint(statArray[0]);
					statArray[16] = 2;
					break;
				case 'f':
					fastBreak(statArray[0]);
					statArray[16] = 2;
					break;
				case 'z':
					inPaint(statArray[0]);
					fastBreak(statArray[0]);
					statArray[16] = 2;
					break;
			}
			break;

		case 'e':

			//freethrow attempt cases

			statArray[7] = 1; //freethrow attempt
			if (input[2] === 'e')
			{
				statArray[6] = 1;	//good freethrow, no rebound
				statArray[16] = 1;
			}
			else if (input[2] === 'r')
			{
				actingPlayer = input[3];
				rebound(statArray[0], actingPlayer);	//offensive rebound
			}
			else if (input[2] === 'd')
			{
				actingPlayer = input[3];
				rebound(statArray[0], actingPlayer, 1);	//defensive rebound
			}
			break;
		case 'r':
			if (input[1] == 'm') {
				if (input[2] == 'r') teamRebound(statArray[0]);
				else if (input[2] == 'd') teamRebound(statArray[0],1);
			}	
			if (input[2] == 'r') rebound(statArray[0], input[1]);
			else if (input[2] == 'd') rebound(statArray[0], input[1],1);

			return;
		case 'a':
			assist(statArray[0], input[1]);
			return;
		case 'f':
			console.log(input[1].charAt(0));
			if (input[1].charAt(0) === 't'){	//technical foul (input[1] = 'T##')
				statArray[1] = input[1].substring(1,3);	//take last two characters for player number 
				console.log("technical foul");
				statArray[12] = 1;
				teamFoul(statArray[0]);
			} else if (input[1] === 'b'){	//bench foul (team stat)
				teamFoul(statArray[0]);
				return;
			} else {
				statArray[11] = 1;	//personal foul
				teamFoul(statArray[0]);
			}
			break;
		case 't':
			if (input[1] == 'm'){
				teamTurnover(statArray[0]);
				return;
			}
			statArray[14] = 1; //turnover
			break;
		case 's':
			statArray[15] = 1;	//steal
			break;
		case 'k':
			statArray[13] = 1; //block
			if (input[2] === 'r')
			{
				actingPlayer = input[3];
				rebound(statArray[0],actingPlayer);
				//break;
			}
			else if (input[2] === 'd')
			{
				if (input[3] === 'm'){
					teamRebound(statArray[0],1);
				} else {
					actingPlayer = input[3];
					rebound(statArray[0],actingPlayer,1);
				}
			}
			break;
		case 'f2':
			chg(input[input.length-1], input[1], input[2]);
			return;
		case 'o':
			if (input[1] === '3'){
				timeout("p");	
			}
			else if (input[1] === 'm'){
				timeout("f");
			}
	}
	console.log("in addPlay: " + statArray);
	if (statArray[15] != 0) add_team_points(statArray[0],statArray[15]);
	drw.write_player_stats_to_game_file(statArray, current_game);
}


/*
 *	SUBPLAY FUNCTIONS
 *	CALLED BY ADDPLAY()
 *
 */
 
function rebound(team, player_number, def_rebound){
	var statArray;
	if (def_rebound != null){
		//console.log("Changing team");
		if (team === 1) t = 0;
		else if (team === 0) t = 1;
		var statArray = [team, player_number,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0];
	} else {

		var statArray = [team, player_number,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0];	
	}
	drw.write_player_stats_to_game_file(statArray, current_game);
}

function assist(t, player_number){
	var statArray = [t, player_number,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0];
	drw.write_player_stats_to_game_file(statArray, current_game);
}

function block(team, player_number, from_shot_attempt){
	//team to block will be opposite of team who attempted shot
	var activeTeam;
	
	if(from_shot_attempt != null){
		if (team === 1) activeTeam = 0;
		else if (team === 0) activeTeam = 1;
	}
	
	var statArray = [activeTeam, player_number,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0];
	drw.write_player_stats_to_game_file(statArray, current_game);
}

function chg(t, player_number, new_player_number){
	var playerSub = [t, "CHG", player_number, new_player_number];
	drw.write_player_stats_to_game_file(statArray, current_game);
}

function add_team_points(team,numPoints){
	drw.write_team_stats_to_game_file([team,numPoints,0,0,0,0,0,0,0], current_game);
}

function inPaint(team){
	drw.write_team_stats_to_game_file([team,0,1,0,0,0,0,0,0], current_game);
}


function fastBreak(team){
	drw.write_team_stats_to_game_file([team,0,0,1,0,0,0,0,0], current_game);

}

function teamTurnover(team){
	drw.write_team_stats_to_game_file([team,0,0,0,1,0,0,0,0], current_game);
}

function teamRebound(team,def_rebound){
	var activeTeam;
	if (def_rebound === 1){
		if (team === 1) activeTeam = 0;
		else if (team === 0) activeTeam = 1;
	}
	drw.write_team_stats_to_game_file([activeTeam,0,0,0,0,1,0,0,0], current_game);
}

function teamFoul(team){
	drw.write_team_stats_to_game_file([team,0,0,0,0,0,1,0,0], current_game);
}


function timeout(team,type){
	if (type === "p"){
		drw.write_team_stats_to_game_file([team,0,0,0,0,0,0,1,0]);
	} else if (type === "f"){
		drw.write_team_stats_to_game_file([team,0,0,0,0,0,0,0,1]);		
	}
}

function wrongBasket(team){
	var activeTeam;
	if (t === 1) activeTeam = 0;
	else if (t === 0) activeTeam = 1;
	drw.write_team_stats([activeTeam,2,0,0,0,0,0,0,0]);
}
/*
 *  INITIALIZE GAME FUNCTION
 *
 *	ARGS FORMAT:
 *	[HOME_TEAM, AWAY_TEAM, HOME_TEAM_CODE, AWAY_TEAM_CODE, HOME_TEAM_RECORD, AWAY_TEAM_RECORD, GAME_DATE, START_TIME, STADIUM, STADIUM_CODE, CONF_GAME?, [SCHEDULE_NOTES], QUARTERS/HALVES?, MIN_PER_PERIOD, MIN_IN_OT, OFFICIALS, [BOX_COMMENTS], ATTENDANCE]
 *	[    0    ,     1    ,       2       ,        3      ,        4        ,        5        ,     6    ,     7     ,   8    ,       9     ,    10     ,        11       ,        12       ,       13      ,    14    ,    15    ,        16     ,     17    ]
 *
 */

function initGame(args){
	try {
		var game_file = args[6] + "_" + args[7];
		drw.create_game_file(indiv_stat_headers, team_stat_headers, game_file, args);
		current_game = game_file;
	} catch (e){
		console.log("Exception in creating game file: " + e);
	}
	console.log("Successfully made game file: " + current_game);
}

/*
 *	IPC EVENT HANDLER
 *
 */

 ipc.on('get-game', function (event,game_name){
	try {
		var game_info = drw.get_game_information(game_name);
	} catch (e) {
		//if failure
		console.log("An error occurred in file writing: " + e);
		event.sender.send('get-game-failure',game_name);
		return;
	}
	event.sender.send('get-game-success',game_info);
});

ipc.on('add-play', function (event,keystrokes){
	try {
		console.log("adding play: " + keystrokes);
		addPlay(keystrokes);
	} catch (e) {
		//if failure
		console.log("An error occurred in file writing: " + e);
		event.sender.send('add-play-failure',keystrokes);
		return;
	}
	event.sender.send('add-play-success',keystrokes);
});

ipc.on('init-game', function (event,args){
	try {
		initGame(args);
	} catch (e) {
		//if failure
		console.log("An error occurred in game initializing: " + e);
		event.sender.send('init-game-failure',args);
		return;
	}
	event.sender.send('init-game-success',args);
});

ipc.on('get-data', function(event){
	try {
		var data = [];
		data = drw.read_game_file(current_game);
		console.log(data);
	} catch (e) {
		//if failure
		console.log("An error occurred in file reading: " + e);
		event.sender.send('get-data-failure');
		return;
	}
	event.sender.send('get-data-success', data);
});

//add-team, delete-team,

app.on('ready', createWindow);

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
})
