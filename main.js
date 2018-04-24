console.log('main process loaded');

var drw = require('./data_read_write.js');
var trw = require('./team_read_write.js');

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const fs = require("fs");	//node.js filesystem
const ipc = electron.ipcMain;
const dialog = electron.dialog;
const indiv_stat_headers = ['player_number','fg','fga','m3','3a','ft','fta','offr','defr','ast','pf','tf','blk','trn','stl','pts'];
const team_stat_headers = ['total_points', 'made_in_paint', 'fast_break', 'team_turnover', 'team_rebound', 'team_fouls', 'partial_timeouts_taken','full_timeouts_taken'];
const Team = require('./Team.js');	//team object import
const Player = require('./Player.js'); 	//player object import
var current_game;

let win;
const TESTING = false;

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
		createTeam("Badgers", "WIS", "Bo Ryan", "I Forgot", "Kohl Center");
		
	}
	win.on('closed', () => {
		win = null;
		app.quit();
	})
};

//create team test stub
function createTeam(name, code, head_coach, asst_coach, stadium){

	var team = new Team(name, code, head_coach, asst_coach, stadium);
	team.add_player_to_roster(new Player("Frank Kaminsky", 44, "center", "super senior"));
	console.log("Adding team " + name + "...");
	try {
		trw.create_team(team.get_code(), team.to_array());
	} catch (e){
		console.log("Unable to add team " + name + ": " + e);
		return;
	}
	console.log("Successfully added team " + name);
	console.log("Team name: " + team.get_name());
	console.log("Team code:" + team.get_code());
	console.log("Head coach: " + team.get_head_coach());
	console.log("Assistant coach: " + team.get_asst_coach());
	console.log("Stadium: " + team.get_stadium());
	console.log("Active Roster: ");
	for (var i = 0; i < team.get_active_roster().length; i++){
		var player = team.get_active_roster()[i];
		console.log("[" + i + "] " + player[0] + " #" + player[1] + " " + player[2] + "\n");
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
 * FOR FIELD GOALS: [PLAY_CODE, PLAYER_NUMBER, RESULT_CODE (R FOR OFF REBOUND, D FOR DEF REBOUND), REBOUND/ASSIST/BLOCK_PLAYER (REBOUND IF RESULT_CODE = 'R or X or D' / BLOCK IF RESULT_CODE = 'K' / ASSIST IF ANYTHING ELSE), HOME/AWAY, TIME_OF_PLAY, PRIMARY_PLAYER_NAME, SECONDARY_PLAYER_NAME (IF ASSIST OR REBOUND), VISITOR_SCORE, HOME_SCORE, PRIMARY_TEAM_CODE, SECONDARY_TEAM_CODE]
 *                  [    0    ,       1      ,                    2                              ,                                                             3                                                              ,     4    ,      5      ,           6        ,                  7                          ,       8      ,     9     ,         10       ,         11         ]          

 *
 *
 * FOR FREETHROWS: [E, PLAYER_NUMBER, RESULT_CODE, REBOUND_PLAYER_NUMBER (IF RESULT_CODE IS R/D), HOME/AWAY, TIME_OF_PLAY, PRIMARY_PLAYER_NAME, SECONDARY_PLAYER_NAME (IF REBOUND), VISITOR_SCORE, HOME_SCORE, PRIMARY_TEAM_CODE, SECONDARY_TEAM_CODE]
 *
 *
 *
 * FOR REBOUNDS/ASSISTS/TURNOVERS/STEALS: [PLAY_CODE, PLAYER_NUMBER OR M (FOR TEAM TURNOVER), HOME/AWAY, TIME_OF_PLAY, PRIMARY_PLAYER_NAME, SECONDARY_PLAYER_NAME, VISITOR_SCORE, HOME_SCORE, PRIMARY_TEAM_CODE, SECONDARY_TEAM_CODE]
 *
 *
 *
 *
 * FOR FOULS: [F, T+PLAYER_NUMBER (IF TECHNICAL) OR B+PLAYER_NUMBER (IF BENCH FOUL) OR PLAYER_NUMBER, HOME/AWAY, TIME_OF_PLAY, PRIMARY_PLAYER_NAME, SECONDARY_PLAYER_NAME (IF ASSIST OR REBOUND), VISITOR_SCORE, HOME_SCORE, PRIMARY_TEAM_CODE, SECONDARY_TEAM_CODE]
 *
 *
 *
 *
 * FOR CHANGING JERSEY: [F2, PLAYER_NUMBER, NEW_PLAYER_NUMBER, HOME/AWAY, TIME_OF_PLAY, PRIMARY_PLAYER_NAME, SECONDARY_PLAYER_NAME (IF ASSIST OR REBOUND), VISITOR_SCORE, HOME_SCORE, PRIMARY_TEAM_CODE, SECONDARY_TEAM_CODE]
 *
 *
 * FOR TIMEOUTS: [O, T (MEDIA)/3 (30 SEC)/M (MINUTE), HOME/AWAY, TIME_OF_PLAY, PRIMARY_PLAYER_NAME, SECONDARY_PLAYER_NAME (IF ASSIST OR REBOUND), VISITOR_SCORE, HOME_SCORE, PRIMARY_TEAM_CODE, SECONDARY_TEAM_CODE]
 *
 * FOR BLOCKS: [K, PLAYER_NUMBER, REBOUND?, HOME/AWAY, TIME_OF_PLAY, PRIMARY_PLAYER_NAME, SECONDARY_PLAYER_NAME (IF ASSIST OR REBOUND), VISITOR_SCORE, HOME_SCORE, PRIMARY_TEAM_CODE, SECONDARY_TEAM_CODE]
 *
 * PLAY-BY-PLAY PARAMETERS GUIDE: 
 * input.length-8 = home/away
 * input.length-7 = time of play
 * input.length-6 = primary player name
 * input.length-5 = secondary player name
 * input.length-4 = visitor score
 * input.length-3 = home score
 * input.length-2 = primary team code 
 * input.length-1 = secondary team code
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
 * [HOME/AWAY, POINTS, MADE_IN_PAINT, FAST_BREAK, TEAM_TURNOVERS, TEAM_REBOUNDS, TEAM_FOULS, PARTIAL_TIMEOUTS_TAKEN, FULL_TIMEOUTS_TAKEN]
 *
 *
 * TO: T (TEAM TURNOVER)
 * TO: D (DEAD BALL)
 *
 *
 */


function addPlay(keystrokes){
	var statArray = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var input = keystrokes.split(/ /);
	if(TESTING) console.log(input);

	//input parsing
	statArray[1] = input[1];	//add player's number
	var team = input[input.length-8];	//home or away always before [time_of_play, primary_player_name, secondary_player_name, visitor_score, home_score, primary_team_code, secondary_team_code]
	var time_of_play = input[input.length-7];
	var primary_player_name = input[input.length-6];
	var secondary_player_name = input[input.length-5];
	var visit_score = input[input.length-4];
	var home_score = input[input.length-3];
	var primary_team_code = input[input.length-2];
	var secondary_team_code = input[input.length-1];
	var actingPlayer;
	
	var action;
	var type;

	if (team === 'H')
		statArray[0] = 1;
	else if (team === 'V')
		statArray[0] = 0;
	team = team.toUpperCase();
	//console.log("Primary team code: " + primary_team_code);
	console.log("input[0]: " + input[0]);
	//console.log("input[0] == ''E''?" + (input[0] == "E"));
	switch(input[0]){
		case 'Y':
			statArray[5] = 1;	//3 attempt
		case 'W':
			wrongBasket(statArray[0]);
			return;
		case 'J':
		case 'P':
		case 'L':
		case 'D':

			//fieldgoal attempt cases
			var paint;
			var fastb;
			
			if (input[0] == 'Y') type="3PTR";
			else if (input[0] == 'W') type = "WRONGB";
			else if (input[0] == 'J') type = "JUMPER";
			else if (input[0] == 'P') type = "TIPIN";
			else if (input[0] == 'L') type = "LAYUP";
			else if (input[0] == 'D') type = "DUNK";
			
			statArray[3] = 1;	//fieldgoal attempt
			if (team != input[3]) actingPlayer = input[3];	//if the 4th arg in input is not the team, it must be a stealing/rebounding/etc. player
			switch(input[2]){
				case 'G':
				case 'Q':
					statArray[2] = 1;	//fieldgoal
					action = "GOOD";
					statArray[16] = 2;
					console.log("Action: " + action);
					break;
				case 'A':	
					action = "GOOD";
					if (input[0] == 'y' || input[0] == 'Y')
					{
						statArray[16] = 3;
						statArray[2] = 1;	//fieldgoal
						statArray[4] = 1;	//made 3-pointer
					}
					else 
					{	
						statArray[16] = 2;
					}
					assist(statArray[0], actingPlayer, time_of_play, secondary_player_name, visit_score, home_score, primary_team_code);	//If there's an assist, record it
					break;
				case 'Y':
					statArray[2] = 1;	//fieldgoal
					statArray[4] = 1;	//made 3-pointer
					action = "GOOD";
					statArray[16] = 3;
					break;
				case 'R':
					action = "MISS";
					rebound(statArray[0], actingPlayer, time_of_play, secondary_player_name, visit_score, home_score, primary_team_code);	//Offensive rebound
					break;
				case 'X':
					action = "MISS";
					rebound(statArray[0], actingPlayer, time_of_play, secondary_player_name, visit_score, home_score, primary_team_code);	//Offensive rebound
					break;
				case 'D':
					action = "MISS";
					rebound(statArray[0], actingPlayer, time_of_play, secondary_player_name, visit_score, home_score, secondary_team_code, 1);	//Defensive rebound
					break;
				case 'K':
					action = "MISS";
					block(statArray[0], actingPlayer, time_of_play, secondary_player_name, visit_score, home_score, secondary_team_code, 1);		//Block
					break;
				case 'P':
					paint = "Y";
					inPaint(statArray[0]);
					statArray[16] = 2;
					break;
				case 'F':
					fastb = "Y";
					fastBreak(statArray[0]);
					statArray[16] = 2;
					break;
				case 'Z':
					paint = "Y";
					fastb = "Y";
					fastBreak(statArray[0]);
					inPaint(statArray[0]);
					statArray[16] = 2;
					break;
			}
			break;

		case "E":
			//freethrow attempt cases
			console.log("FT attempt");	
			statArray[7] = 1; 	//freethrow attempt
			type = "FT";
			console.log("input[2]: " + input[2]);
			if (input[2] === 'E' || input[2] === 'e')
			{
				action = "GOOD";
				console.log("Good FG");
				statArray[6] = 1;		//good freethrow, no rebound
				statArray[16] = 1;
			}
			else if (input[2] === 'R')		//missed freethrow, rebound
			{
				action = "MISS";
				actingPlayer = input[3];
				rebound(statArray[0], actingPlayer, time_of_play, secondary_player_name, visit_score, home_score, primary_team_code);		//offensive rebound
			}
			else if (input[2] === 'D')
			{
				action = "MISS";
				actingPlayer = input[3];
				rebound(statArray[0], actingPlayer, time_of_play, secondary_player_name, visit_score, home_score, secondary_team_code, 1);		//defensive rebound
			}
			break; 
		case "R":
			if (input[1] == 'M') 
			{
				primary_player_name = "TEAM";
				if (input[2] == 'R')
				{
					teamRebound(statArray[0], time_of_play, primary_player_name, visit_score, home_score, primary_team_code);		//offensive team rebound
				}					
				else if (input[2] == 'D') 
				{	
					teamRebound(statArray[0], time_of_play, primary_player_name, visit_score, home_score, primary_team_code);		//defensive team rebound
				}
				else if (input[2] == 'B')
				{
					teamRebound(statArray[0], time_of_play, primary_player_name, visit_score, home_score, primary_team_code, null, 1);		//dead ball rebound
				}
			}
			else 
			{	
				if (input[2] == 'R')
				{
					rebound(statArray[0], input[1], time_of_play, primary_player_name, visit_score, home_score, primary_team_code);		//offensive rebound
				}
				else if (input[2] == 'D') 
				{	
					rebound(statArray[0], input[1], time_of_play, primary_player_name, visit_score, home_score, primary_team_code, 1);		//defensive rebound
				}
			}	
			return;
		case 'A':
			assist(statArray[0], input[1], time_of_play, primary_player_name, visit_score, home_score, primary_team_code);		//assist by player. Literally the simplest thing this function does
			return;
		case 'F':
			console.log("Foul: " + input[2]);
			if (input[2] == 'H'){
				statArray[0] = 0;
			} else if (input[2] == 'V'){
				statArray[0] = 1;
			}
			action = "FOUL";
			if (input[1].charAt(0) === 'T')		//technical foul (input[1] = 'T##')
			{	
				type = "TECH";
				statArray[1] = input[1].substring(1,3);		//take last two characters for player number
				
				statArray[12] = 1;		//technical foul
				statArray[11] = 1; 		//tech fouls are also personal fouls
				teamFoul(statArray[0]);
			} 
			else if (input[1] === 'B')	//bench foul (team stat)
			{	
				drw.add_pbp(current_game, team, time_of_play, "TM", primary_team_code, "TEAM", "FOUL", "BENCH", visit_score, home_score);
				teamFoul(statArray[0]);
				return;
			} 
			else 
			{
				type = "PERSONAL";
				statArray[11] = 1;	//personal foul
				teamFoul(statArray[0]);
			}
			break;
		case 'T':
			action = "TURNOVER";
			if (input[1] == 'm')
			{
				teamTurnover(statArray[0], time_of_play, primary_player_name, visit_score, home_score, primary_team_code);
				return;
			}
			statArray[14] = 1; //turnover
			break;
		case 'S':
			action = "STEAL";
			statArray[15] = 1;	//steal
			break;
		case 'K':
			action = "BLOCK";
			statArray[13] = 1; //block
			if (input[2] === 'r')
			{
				actingPlayer = input[3];
				rebound(statArray[0], actingPlayer, time_of_play, primary_player_name, visit_score, home_score, primary_team_code);
				//break;
			}
			else if (input[2] === 'd')
			{
				if (input[3] === 'm')
				{
					teamRebound(statArray[0], time_of_play, primary_player_name, visit_score, home_score, secondary_team_code, 1);
				}
				else 
				{	
					actingPlayer = input[3];
					rebound(statArray[0], actingPlayer, time_of_play, primary_player_name, visit_score, home_score, secondary_team_code, 1);
				}
			}
			break;
		case 'f2':		//jersey change
			chg(statArray[0], input[1], input[2]);
			return;
		case 'O':		//timeout
			
			if (input[1] == "3")
			{
				type = "30SEC";
			}
			else if (input[1] == "m")
			{
				type = "TEAM";
			}	
			else 
			{
				type = "media";
			}
			timeout(statArray[0], input[1]);
			drw.add_pbp(current_game, team, time_of_play, "TM", primary_team_code, "TEAM", "TIMEOUT", type, visit_score, home_score);
			return;
	}
	console.log("in addPlay: " + statArray);
	if (statArray[16] != 0) add_team_points(statArray[0],statArray[16]);
	console.log("Primary team code: " + primary_team_code);
	console.log("Type: " + type);
	drw.add_pbp(current_game, team, time_of_play, statArray[1], primary_team_code, primary_player_name, action, type, visit_score, home_score);
	drw.write_player_stats_to_game_file(statArray, current_game);
}


/*
 *	SUBPLAY FUNCTIONS
 *	CALLED BY ADDPLAY()
 *
 */

/*
	Rebound made by player
	-If it was a defensive rebound, the rebounding player is on the opposite team
	as the one who attempted the shot, so switch teams before registering rebound
	-Otherwise, just register rebound on current team
*/ 
function rebound(team, player_number, time_of_play, primary_player_name, visit_score, home_score, primary_team_code, def_rebound){
	var altTeam;
	var statArray;
	if (def_rebound != null)
	{
		if (team === 1) altTeam = 0;
		else if (team === 0) altTeam = 1;
		statArray = [altTeam, player_number,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0];
		
		if (altTeam === 0) team = 'V';
		else if (altTeam === 1) team = 'H';
		console.log("Primary team code: " + primary_team_code);
		drw.add_pbp(current_game, team, time_of_play, player_number, primary_team_code, primary_player_name, "REBOUND", "DEF", visit_score, home_score);
	} 
	else 
	{
		statArray = [team, player_number,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0];
		if (team === 0) team = 'V';
		else if (team === 1) team = 'H';
		console.log("Primary team code: " + primary_team_code);
		drw.add_pbp(current_game, team, time_of_play, player_number, primary_team_code, primary_player_name, "REBOUND", "OFF", visit_score, home_score);
	}	
	drw.write_player_stats_to_game_file(statArray, current_game);
}

/*
	Assist made by player
*/
function assist(team, player_number, time_of_play, primary_player_name, visit_score, home_score, primary_team_code)
{
	var statArray = [team, player_number,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0];
	drw.write_player_stats_to_game_file(statArray, current_game);
	if (team === 0) team = 'V';
	else if (team === 1) team = 'H';
	drw.add_pbp(current_game, team, time_of_play, player_number, primary_team_code, primary_player_name, "ASSIST", null, visit_score, home_score);

}


/*
	Block credited to player
	-If it was from a shot attempt, the blocking player is on the opposite team
	as the one who attempted the shot, so switch teams before registering block
	-Otherwise, just register block on current team
*/
function block(team, player_number, time_of_play, primary_player_name, visit_score, home_score, primary_team_code, from_shot_attempt)
{
	//team to block will be opposite of team who attempted shot
	var activeTeam;
	if (from_shot_attempt != null)
	{
		if (team === 1) activeTeam = 0;
		else if (team === 0) activeTeam = 1;
	}
	
	var statArray = [activeTeam, player_number,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0];
	if (team === 0) team = 'V';
	else if (team === 1) team = 'H';
	drw.add_pbp(current_game, team, time_of_play, player_number, primary_team_code, primary_player_name, "BLOCK", null, visit_score, home_score);
	drw.write_player_stats_to_game_file(statArray, current_game);
}


/*
	Changes jersey number
*/
function chg(t, player_number, new_player_number)
{
	var playerSub = [t, "CHG", player_number, new_player_number];
	drw.write_player_stats_to_game_file(statArray, current_game);
}


/*
	Increments team point counter
*/
function add_team_points(team,numPoints)
{
	drw.write_team_stats_to_game_file([team,numPoints,0,0,0,0,0,0,0], current_game);
}


/*
	Shot made in paint
	Increments team in paint counter
*/
function inPaint(team)
{
	drw.write_team_stats_to_game_file([team,0,1,0,0,0,0,0,0], current_game);
}


/*
	Fast break shot made
	Increments team fast break counter
*/
function fastBreak(team)
{
	drw.write_team_stats_to_game_file([team,0,0,1,0,0,0,0,0], current_game);

}


/*
	Turnover credited to the team, not a single player
	Increments team turnover counter
*/
function teamTurnover(team, time_of_play, primary_player_name, visit_score, home_score, primary_team_code)
{
	drw.write_team_stats_to_game_file([team,0,0,0,1,0,0,0,0], current_game);
	if (team === 0) team = 'V';
	else if (team === 1) team = 'H';
	drw.add_pbp(current_game, team, time_of_play, "TM", primary_team_code, "TEAM", "TURNOVER", "TEAM", visit_score, home_score);
}


/*
	Rebound credited to the team, not a single player
	Increments team rebound counter
*/
function teamRebound(team, time_of_play, primary_player_name, visit_score, home_score, primary_team_code, def_rebound, dead_ball)
{
	var type = null;
	if (dead_ball === 1) type = "DEADB";
	else if (def_rebound === 1){
		if (team === 1) team = 0;
		else if (team === 0) team = 1;
		type = "DEF";
	} 
	drw.write_team_stats_to_game_file([team,0,0,0,0,1,0,0,0], current_game);
	if (team === 0) team = 'V';
	else if (team === 1) team = 'H';
	drw.add_pbp(current_game, team, time_of_play, "TM", primary_team_code, "TEAM", "REBOUND", type, visit_score, home_score);

}


/*
	All fouls committed by team
	Increments team foul counter
*/
function teamFoul(team)
{
	drw.write_team_stats_to_game_file([team,0,0,0,0,0,1,0,0], current_game);
}


/*
	Timeout taken by current team
	Increments either partial or full timeouts taken by team
*/
function timeout(team,type)
{
	if (type === "3"){
		drw.write_team_stats_to_game_file([team,0,0,0,0,0,0,1,0], current_game);
	} else if (type === "m"){
		console.log("Full min");
		drw.write_team_stats_to_game_file([team,0,0,0,0,0,0,0,1], current_game);
	}
}

/*
	Dude, what are you doing?
	Scores 2 pts for other team
*/
function wrongBasket(team)
{
	var activeTeam;
	if (team === 1) activeTeam = 0;
	else if (team === 0) activeTeam = 1;
	drw.write_team_stats([activeTeam,2,0,0,0,0,0,0,0], current_game);
}


/*
 *  INITIALIZE GAME FUNCTION
 *
 *	ARGS FORMAT:
 *	[HOME_TEAM, AWAY_TEAM, HOME_TEAM_CODE, AWAY_TEAM_CODE, HOME_TEAM_RECORD, AWAY_TEAM_RECORD, GAME_DATE, START_TIME, STADIUM, STADIUM_CODE, CONF_GAME?, [SCHEDULE_NOTES], QUARTERS/HALVES?, MIN_PER_PERIOD, MIN_IN_OT, OFFICIALS, [BOX_COMMENTS], ATTENDANCE]
 *	[    0    ,     1    ,       2       ,        3      ,        4        ,        5        ,     6    ,     7     ,   8    ,       9     ,    10     ,        11       ,        12       ,       13      ,    14    ,    15    ,        16     ,     17    ]
 *
 *  throws: "File already exists" if game args date_time passed in are not unique
 */
function initGame(args)
{
	var game_file = args[6] + "_" + args[7].split(/:/)[0];
	if (drw.create_game_file(indiv_stat_headers, team_stat_headers, game_file, args) == false)
	{
		throw "File already exists";
	}
	else
	{
		current_game = game_file;
		console.log("Successfully made game file: " + current_game);
	}
}

/*
 *	IPC EVENT HANDLERS
 *
 */



/*
Call: signal to send list of all existing games
Response:
	Success + array of all games, or
	Failure
*/
ipc.on('get-all-games', function(event)
{
	var gameArray;
	try
	{
		gameArray = drw.get_all_games();
	}
	catch (e)
	{
		console.log("Could not retrieve all games: " + e);
		event.sender.send('get-all-games-failure');
		return;
	}
	event.sender.send('get-all-games-success', gameArray);
});



/*
Call: signal to delete a team, code of unwanted team
Response:
	Success + code of team deleted, or
	Failure + code of team requested
*/
ipc.on('delete-team', function(event,team_code)
{
	try
	{
		trw.delete_file(team_code);
	}
	catch (e)
	{
		console.log("Could not delete team " + team_code + ": "+ e);
		event.sender.send('delete-team-failure', team_code);
		return;
	}
	event.sender.send('delete-team-success', team_code);
});


/*
Call: signal to create a team, team object
Response:
	Success + code of team created, or
	Failure + code of team requested
*/
ipc.on('add-team', function(event,team)
{
	try
	{
		trw.create_team(team.get_name(), team.to_array());
	}
	catch (e)
	{
		console.log("Could not create team " + team.get_code() + ": "+ e);
		event.sender.send('create-team-failure', team.get_code());
		return;
	}
	console.log("Successfully created team " + team.get_name());
	event.sender.send('create-team-success', team.get_code());
});



/*
Call: signal to send game info array, game name (date_time)
Response:
	Success + game info array, or
	Failure + game name requested
*/
ipc.on('get-game', function (event,game_name)
{
	try
	{
		var game_info = drw.read_game_file(game_name);
	}
	catch (e)
	{
		//if failure
		console.log("An error occurred in file reading: " + e);
		event.sender.send('get-game-failure',game_name);
		return;
	}
	current_game = game_name;
	event.sender.send('get-game-success',game_info[4]);
});



/*
Call: signal to add play to current game, keystrokes
Response:
	Success + keystrokes of new play
	Failure + keystrokes of play desired
*/
ipc.on('add-play', function (event,keystrokes)
{
	try
	{
		console.log("adding play: " + keystrokes);
		addPlay(keystrokes);
	}
	catch (e)
	{
		//if failure
		console.log("An error occurred in file writing: " + e);
		event.sender.send('add-play-failure',e);
		e.stack;
		return;
	}
	event.sender.send('add-play-success',keystrokes);
});



/*
Call: signal to create a game file
Response:
	Success + footer info for new game
	Failure + args passed in
*/
ipc.on('init-game', function (event,args)
{
	try
	{
		initGame(args);
	}
	catch (e)
	{
		//if failure
		console.log("An error occurred in game initializing: " + e);
		event.sender.send('init-game-failure',args);
		return;
	}
	event.sender.send('init-game-success',args);
});



/*
Call: signal to send array of current game data
Response:
	Success + array of current game data
	Failure
*/
ipc.on('get-data', function(event, file_name)
{
	try
	{
		var data = [];
		data = drw.read_game_file(file_name);
		console.log(data);
	}
	catch (e)
	{
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
