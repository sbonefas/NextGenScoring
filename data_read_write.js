/********************************************************************
 *																	*
 *					GAME DATA READING AND WRITING 					*
 *																	*
 *	This js file controls all reading/writing to game data files	*													*
 *																	*
 *																	*
 * public functions: 												*
 * 		1. delete_file(file_name)									*
 *			- deletes the file with the given filename 				*
 *		2. edit_game_directory(new_path)							*
 *			- changes the directory that game files are stored		*
 *		3. create_game_file(individual_stat_labels, 				*
 *							team_stat_labels, file_name)			*
 *			- makes an empty game file 								*
 *		4. read_game_file(file_name)								*
 *			- gets a 3D array representation of a game file 		*
 *		5. write_player_stats_to_game_file(stat_changes, file_name)	*
 *			- writes given player stat changes to a game file 		*
 *		6. write_team_stats_to_game_file(stat_changes, file_name)	*
 *			- writes given team stat changes to a game file 		*
 *																	*
  *******************************************************************/


const fs = require("fs");	//node.js filesystem

/** path to the folder where data is kept */
var game_directory = "data/";

/** comma and semicolon replacements */
const comma_replacement		= "(&h#@d!`_";
const semicolon_replacement = "/Od@&?l#i";
const game_period_delimiter = "^3#!gx/?]"

/** version number of the software for xml creation purposes */
var version = "0.3.2";

/**
 * Returns the filepath of a file with a given name
 *
 * @param file_name Name of the file
 * @return Filepath of the file
 */
function get_file_path(file_name) {
	return game_directory + file_name + '.txt';
}

/** 
 * Deltes a file with a given filename from the game directory
 *
 * @param file_name Name of the file
 */
exports.delete_file = function(file_name) {
	if(fs.existsSync(get_file_path(file_name))) fs.unlinkSync(get_file_path(file_name));
}

/**
 * Edits the stored data location path where game files are held.
 *
 * @param new_path New file path to the directory where games are held. The
 * directory must exists before calling this function.
 * @return True if path is successfully edited. False if the directory path
 * does not exist.
 */
exports.edit_game_directory = function(new_path) {
	if(!fs.existsSync(new_path)) return false;
	game_directory = new_path;
	return true;
}

/**
 * Returns an array of array representations of games as defined in read_game
 *
 * @return array of games
 */
exports.get_all_games = function() {
	file_names = fs.readdirSync(game_directory);
	for(var i = 0; i < file_names.length; i++) {
		if(file_names[i].substring(0,1) == '.' || file_names[i].slice(-4) == '.xml') {
			file_names.splice(i, 1);
			i--;
		}
	}

	games = Array(file_names.length);

	// Convert file names in teams to contents
	for(var el_no = 0; el_no < file_names.length; el_no++) {
		games[el_no] = exports.read_game_file(file_names[el_no].replace(".txt",""));
	}

	return games;
}








/**
 * Creates an empty .txt game file with the given file_name.
 *
 * @param file_name Name of the file to create. The file name should
 * not include a filetype, and should follow standard naming procedures
 * for the user's operating system.
 * @param individual_stat_labels Array of individual stat labels to be
 * used in the stat file
 * @param team_stat_labels Array of team stat labels
 * @param footer Array of game information describing the given game
 * @return True if game successfully created, false if file_name exists
 * or if the path to the data folder is invalid.
 */
exports.create_game_file = function(individual_stat_labels, team_stat_labels, file_name, footer) {
	// Error Handling:
	if(individual_stat_labels == undefined) throw "create_game_file: No Individual Stat Labels Provided";
	if(team_stat_labels == undefined) throw "create_game_file: No Team Stat Labels Provided";
	if(file_name == undefined) throw "create_game_file: No File Name Provided";
	if(footer == undefined) throw "create_game_file: No Footer Provided";

	// Check if file exists
	var file_path = get_file_path(file_name);
	if(fs.existsSync(file_path)) return false;

	// Create file. Return false on errors
	var file_contents = get_initial_game_file_contents(individual_stat_labels, team_stat_labels, footer);
	try {
    	fs.writeFileSync(file_path, file_contents);
	} catch (e) {
		throw "create_game_file: File Creation Failed: " + e;
	}
	return true;
}

/**
 * Creates the content of the game file when initially created.
 * Game files are organized as follows:
 *
 * HOME
 * [individual stat labels]
 * [home player stats]
 * ;AWAY
 * [individual stat labels]
 * [home player stats]
 * ;TEAM
 * [team stat labels]
 * [home team stats]
 * [away team stats]
 * ;FOOTER
 * [game information]
 * ;PBP
 * [pbp string]
 *
 * @param labels Array of stat labels to be used in the stat file
 * @return String of initial file contents.
 */
function get_initial_game_file_contents(individual_stat_labels, team_stat_labels, footer) {
	var contents = "HOME\n";
	for(var label_idx = 0; label_idx < individual_stat_labels.length; label_idx++) {
		if(label_idx != 0) contents += comma_replacement;
		contents += individual_stat_labels[label_idx];
	}
	contents += "\n" + semicolon_replacement + "AWAY\n";
	for(var label_idx = 0; label_idx < individual_stat_labels.length; label_idx++) {
		if(label_idx != 0) contents += comma_replacement;
		contents += individual_stat_labels[label_idx];
	}
	contents += "\n" + semicolon_replacement + "TEAM\n";
	for(var label_idx = 0; label_idx < team_stat_labels.length; label_idx++) {
		if(label_idx != 0) contents += comma_replacement;
		contents += team_stat_labels[label_idx];
	}
	for(var team = 0; team < 2; team++) {
		contents += '\n';
		for(var label_idx = 0; label_idx < team_stat_labels.length; label_idx++) {
			if(label_idx != 0) contents += comma_replacement;
			contents += '0';
		}
	}
	contents += "\n" + semicolon_replacement + "FOOTER\n";
	contents += footer.toString().replace(/,/g, comma_replacement);

	contents += "\n" + semicolon_replacement + "PBP";

	return contents;
}









/**
 * Reads the given game file and returns a 3D array, where index 0
 * contains a 2D array with the stats for the home team, index 1
 * has a 2D array with the stats for the away team, index 2 has a 2D
 * array with team statistics for the home team, index 3 has a 2D array
 * of team statistics for the away team, and index 4 has game information.
 * Indices 0-3 have at the first line the labels of the stats.
 *
 * @param file_name Name of the file to read from. The file name should
 * not include the filetype or directory.
 * @throws error if the given file isn't found.
 * @return 3D array as described above.
 */
exports.read_game_file = function(file_name) {
	// Get string version of file contents
	if (file_name == undefined) throw "read_game_file: No File Name Provided";
	var file_path = get_file_path(file_name);
	//if (!fs.existsSync(file_path)) throw "File Name Doesn't Exist";
	var file_contents = get_game_file_contents(file_path);
	if(file_contents == null) {
		throw "read_game_file: File Read Error: File " + file_name + " does not exist!";
	}

	// Convert to three separate strings. Cut off last newline.
	var stats_string_arr = file_contents.split(semicolon_replacement);
	stats_string_arr[0] = stats_string_arr[0].substring(0, stats_string_arr[0].length-1);
	stats_string_arr[1] = stats_string_arr[1].substring(0, stats_string_arr[1].length-1);
	stats_string_arr[2] = stats_string_arr[2].substring(0, stats_string_arr[2].length-1);

	// Create unitialized 2d arrays for player stats
	var home_player_stats = scrape_player_stats(stats_string_arr[0]);
	var away_player_stats = scrape_player_stats(stats_string_arr[1]);

	// Same for team stats
	var home_team_stats = scrape_team_stats(stats_string_arr[2], 1);
	var away_team_stats = scrape_team_stats(stats_string_arr[2], 2);

	// Combine stats and return
	var arr_3d = new Array(5);
	arr_3d[0] = home_player_stats;
	arr_3d[1] = away_player_stats;
	arr_3d[2] = home_team_stats;
	arr_3d[3] = away_team_stats;
	arr_3d[4] = stats_string_arr[3].split('\n')[1].split(comma_replacement);

	return arr_3d;
}

/**
 * Gets the contents of the game file with the given filename and
 * returns it as a string containing the entire contents of the file.
 * Returns null if the given file is not found.
 *
 * Warning: will not work on very large files. If this becomes an issue,
 * we will have to change the way that we read files.
 *
 * @param file_path Path to the file to read from
 * @return String containing contents of the file, or null if file not found.
 */
function get_game_file_contents(file_path) {
	if(!fs.existsSync(file_path)) return null;

	var contents = fs.readFileSync(file_path, 'utf8');
	return contents;
}

/**
 * Takes the player stats in a given string of comma-separated stats and organizes
 * them into a 2d array of stats to return.
 *
 * @param stats_string_arr String containing comma-separated stats including HOME/AWAY
 * on line 1 and labels on line 2.
 * @return 2d array of stats, including labels.
 */
function scrape_player_stats(stats_string_arr) {
	// Get number of stats and players (including labels) to set 2D array sizes
	var num_stats = stats_string_arr.split('\n')[1].split(comma_replacement).length;
	var num_players = stats_string_arr.split('\n').length-1;

	// Create empty 2d array
	var arr_stats = create_2d_array(num_players, num_stats);

	// Get stats
	for(var player = 0; player < num_players; player++) {
		for(var stat = 0; stat < num_stats; stat++) {
			//console.log("el: " + stats_string_arr.split('\n')[player+1].split(',')[stat]);
			arr_stats[player][stat] = stats_string_arr.split('\n')[player+1].split(comma_replacement)[stat].trim();
		}
	}

	return arr_stats
}

/**
 * Takes the team stats in a given string of comma-separated stats and organizes
 * them into a 2d array of stats to return.
 *
 * @param stats_string_arr String containing comma-separated home and away
 * stats including TEAM on line 1 and labels on line 2.
 * @param team_no 1 if scraping home, 2 if scraping away.
 * @return 2d array of stats, including labels.
 */
function scrape_team_stats(stats_string_arr, team_no) {
	var num_stats = stats_string_arr.split('\n')[1].split(comma_replacement).length;

	var arr_stats = create_2d_array(2, num_stats);
	for(var stat = 0; stat < num_stats; stat++) {
		arr_stats[0][stat] = stats_string_arr.split('\n')[1].split(comma_replacement)[stat].trim();
	}
	for(var stat = 0; stat < num_stats; stat++) {
		arr_stats[1][stat] = stats_string_arr.split('\n')[team_no + 1].split(comma_replacement)[stat].trim();
	}

	return arr_stats;
}

/**
 * Creates an empty 2d array and returns it.
 *
 * @param num_rows Number of rows in the array
 * @param num_cols Number of columns in the array
 * @return 2d array with unitialized elements.
 */
function create_2d_array(num_rows, num_cols) {
	if (num_rows <= 0 || num_cols <= 0) throw "create_2d_array: Invalid Index Error";
	var arr = [];
	for(var row = 0; row < num_rows; row++) {
		arr[row] = [];
		for(var col = 0; col < num_cols; col++) {
			arr[row][col] = 0;
		}
	}
	return arr;
}










/**
 * Writes to the game file with the given filename and adds stats
 * corresponding to the given player stat changes.
 *
 * @param stat_changes Array of changes to stats as defined in main.js
 * addPlay() function
 * @param file_name Name of the file we're writing to
 * @throws error if the first index of the stat changes isn't 0 or 1
 * @return True if write is successful, false otherwise.
 */
exports.write_player_stats_to_game_file = function(stat_changes, file_name) {
	if(stat_changes == undefined) throw "write_player_stats_to_game_file: No Stat Changes Provided";
	if(file_name == undefined) throw "write_player_stats_to_game_file: No File Name Provided";
	if(!fs.existsSync(get_file_path(file_name))) throw "write_player_stats_to_game_file: File Read Error: File " + file_name + " does not exist!";

	// Set player's team and player number for stat change
	var is_home = stat_changes[0];
	if(!(is_home == 1 || is_home == 0)) {
		throw "write_player_stats_to_game_file: Index Error: The first index in any stat changes must be 0 or 1";
	}
	var player_number = stat_changes[1];

	// Read team's stats
	var current_game_stats;
	try {
		current_game_stats = exports.read_game_file(file_name);
	} catch(e) {
		console.log("write_player_stats_to_game_file: READ ERROR: " + e);
		return false;
	}

	// Edit player's stats
	var current_team_stats = edit_current_stats(current_game_stats[1-is_home], stat_changes);
	current_game_stats[1-is_home] = current_team_stats;

	return overwrite_game_file(game_array_to_string(current_game_stats) + "\n" + semicolon_replacement +
							   get_game_information_string(file_name) + "\n" + semicolon_replacement +
							   read_pbp(file_name), file_name);
}

/**
 * Writes to the game file with the given filename and adds stats
 * corresponding to the given team stat changes.
 *
 * @param stat_changes Array of changes to stats as defined in main.js
 * addPlay() function
 * @param file_name Name of the file we're writing to
 * @throws error if the first index of the stat changes isn't 0 or 1
 * @return True if write is successful, false otherwise.
 */
exports.write_team_stats_to_game_file = function(stat_changes, file_name) {
	if(stat_changes == undefined) throw "write_team_stats_to_game_file: No Stat Changes Provided";
	if(file_name == undefined) throw "write_team_stats_to_game_file: No File Name Provided";
	if(!fs.existsSync(get_file_path(file_name))) throw "write_team_stats_to_game_file: File Read Error: File " + file_name + " does not exist!";
	var is_home = stat_changes[0];
	if(!(is_home == 1 || is_home == 0)) {
		throw "write_team_stats_to_game_file: Index Error: The first index in any stat changes must be 0 or 1";
	}
	var player_number = stat_changes[1];

	// Read team's stats
	var current_game_stats;
	try {
		current_game_stats = exports.read_game_file(file_name);
	} catch(e) {
		console.log("write_team_stats_to_game_file: READ ERROR: " + e);
		return false;
	}

	// Edit team's stats
	var team_stats = current_game_stats[3 - is_home][1];
	for(var stat = 0; stat < team_stats.length; stat++) {
		team_stats[stat] =
			(Number(team_stats[stat]) + Number(stat_changes[stat+1])).toString();
	}
	current_game_stats[3 - is_home][1] = team_stats;

	return overwrite_game_file(game_array_to_string(current_game_stats) + "\n" + semicolon_replacement+
							   get_game_information_string(file_name) + "\n" + semicolon_replacement +
							   read_pbp(file_name), file_name);

}

/**
 * Takes the current stats of a team and edits them based on given changes.
 *
 * @param current_stats 2D array with the current stats of players on one of the teams.
 * First line is stat labels.
 * @param stat_changes 1D array with stat changes for a given player. Index 0 will always
 * be indicating whether they're home/away, and index 1 will always be the player number.
 * @return 2D array of the team's edited statistics
 */
function edit_current_stats(current_stats, stat_changes) {
	// Get the index of the player that we're editing. If the player doesn't exist
	// in the file yet, we'll create a new line, so set idx to -1;
	var edited_player_idx = -1;
	for(var curr_player = 1; curr_player < current_stats.length; curr_player++) {
		if(current_stats[curr_player][0] == stat_changes[1]) {
			edited_player_idx = curr_player;
		}
	}

	// Player doesn't exist
	if(edited_player_idx == -1) {
		var added_row = stat_changes.slice(1);
		for(var stat_idx = 0; stat_idx < added_row.length; stat_idx++) {
			added_row[stat_idx] = added_row[stat_idx].toString();
		}
		current_stats[current_stats.length] = added_row;
	}
	// Player exists
	else {
		for(var stat_idx = 2; stat_idx < stat_changes.length; stat_idx++) {
			current_stats[edited_player_idx][stat_idx-1] =
				(Number(current_stats[edited_player_idx][stat_idx-1]) + Number(stat_changes[stat_idx])).toString();
		}
	}

	return current_stats;
}

/**
 * Converts the given 3D array of game stats into a string. Does not include
 * footer or play-by-play
 *
 * @param game_array 3D array of game stats
 * @return string representation of the game to be stored in the game file.
 */
function game_array_to_string(game_array) {
	var content = "HOME\n";
	for(var team_idx = 0; team_idx <= 1; team_idx++) {
		for(var player_idx = 0; player_idx < game_array[team_idx].length; player_idx++) {
			for(var stat_idx = 0; stat_idx < game_array[team_idx][player_idx].length; stat_idx++) {
				if(stat_idx != 0) content += comma_replacement;
				content += game_array[team_idx][player_idx][stat_idx];
			}
			if(player_idx != game_array[team_idx].length-1) content += "\n";
		}
		if(team_idx == 0) content += "\n" + semicolon_replacement + "AWAY\n";
	}

	content += "\n" + semicolon_replacement + "TEAM\n";
	for(var stat_idx = 0; stat_idx < game_array[2][0].length; stat_idx++) {
		if(stat_idx != 0) content += comma_replacement;
		content += game_array[2][0][stat_idx];
	}
	content += "\n";
	for(var team_idx = 0; team_idx < 2; team_idx++) {
		for(var stat_idx = 0; stat_idx < game_array[team_idx + 2][1].length; stat_idx++) {
			if(stat_idx != 0) content += comma_replacement;
			content += game_array[team_idx + 2][1][stat_idx];
		}
		if(team_idx == 0) content += "\n";
	}

	return content;
}

/**
 * Overwrites a given game file with the given new content.
 *
 * @param new_content New content to be put in the given game file. This
 * will be an edited old game file.
 * @param file_name Name of the file to overwrite
 * @return True if overwrite is successful, false otherwise.
 */
function overwrite_game_file(new_content, file_name) {
	if (file_name == undefined) throw "overwrite_game_file: No File Name Provided";
	if(!fs.existsSync(get_file_path(file_name))) throw "overwrite_game_file: File Read Error: File " + file_name + " does not exist!";

	try {
    	fs.writeFileSync(get_file_path(file_name), new_content);
	} catch (e) {
		console.log("OVERWRITE ERROR: " + e);
    	return false;
	}
	return true;
}

/**
 * Gets the game information from the footer of a given file. Returns it in
 * string form to rewrite when overwriting the file.
 *
 * @param file_name Name of the file to overwrite
 * @return string representation of game information
 */
function get_game_information_string(file_name) {
	// Get string version of file contents
	var file_path = get_file_path(file_name);
	var file_contents = get_game_file_contents(file_path);
	if(file_contents == null) {
		throw "get_game_information_string: File Read Error: File " + file_name + " does not exist!";
	}

	// Get footer from stats_string_arr
	var stats_string_arr = file_contents.split(semicolon_replacement);
	var game_information = stats_string_arr[3];
	if(game_information.slice(-1) == '\n') game_information = game_information.substring(0, game_information.length-1);

	return game_information;
}

/** 
 * Overwrites the footer in a given file with a new footer.
 *
 * @param file_name Name of the file to overwrite
 * @param new_footer Footer to write over the old one
 * @return True if overwrite is successful, false otherwise
 */
exports.overwrite_footer = function(file_name, new_footer) {
	// Read team's stats
	var current_game_stats;
	try {
		current_game_stats = exports.read_game_file(file_name);
	} catch(e) {
		console.log("overwrite_footer: READ ERROR: " + e);
		return false;
	}

	return overwrite_game_file(game_array_to_string(current_game_stats) + "\n" + semicolon_replacement +
							   "FOOTER\n" + new_footer.toString().replace(/,/g, comma_replacement) + 
							   "\n" + semicolon_replacement + read_pbp(file_name), file_name);
}










/** 
 * Adds a play to the gamefile. This is for the XML file.
 *
 * @param file_name name of the file with the pbps
 * @params vh "V" for visitor and "H" for home play
 * @param time Time that the play happened
 * @param uni Jersey number of the player that did the play
 * @param team Team abbrev of the player that did the action (e.g. "WISC")
 * @param checkname Name of the player that did the play
 * @param action Kind of play that was performed (e.g. "BLOCK")
 * @param type Additional information regarding the play (e.g. "DEFENSIVE")
 * @param vscore Visitor's score after the play
 * @param hscore Home score after the play
 */
exports.add_pbp = function(file_name, vh, time, uni, team, checkname, 
								action, type, vscore, hscore) {
	// Check that all required fields are there
	if(vh == null) throw "add_pbp: vh is null";
	if(time == null) throw "add_pbp: time is null";
	if(uni == null) throw "add_pbp: uni is null";
	if(team == null) throw "add_pbp: team is null";
	if(checkname == null) throw "add_pbp: checkname is null";
	if(action == null) throw "add_pbp: action is null";

	// get new pbp to add
	var xml_play = get_string_play_for_xml(vh, time, uni, team, checkname, 
										   action, type, vscore, hscore);

	// get current pbp string and add new pbp. add period delimiter if period ended.
	var curr_pbp = read_pbp(file_name);
	if(get_last_pbp_timestamp(file_name) < mmss_to_seconds(time)) {
		curr_pbp += "\n" + game_period_delimiter;
	}
	curr_pbp += "\n" + xml_play;

	// get current game array
	current_game_stats = exports.read_game_file(file_name);

	// overwrite
	overwrite_game_file(game_array_to_string(current_game_stats) + "\n" + semicolon_replacement +
							   get_game_information_string(file_name) + "\n" + semicolon_replacement +
							   curr_pbp, file_name);

	// update the xml file
	exports.create_xml_file(file_name);
}

/** 
 * Converts the given parameters into a valid xml tag that represents
 * a play in the media printout of play-by-plays.
 *
 * @param file_name name of the file with the pbps
 * @params vh "V" for visitor and "H" for home play
 * @param time Time that the play happened
 * @param uni Jersey number of the player that did the play
 * @param team Team abbrev of the player that did the action (e.g. "WISC")
 * @param checkname Name of the player that did the play
 * @param action Kind of play that was performed (e.g. "BLOCK")
 * @param type Additional information regarding the play (e.g. "DEFENSIVE")
 * @param vscore Visitor's score after the play
 * @param hscore Home score after the play
 */
function get_string_play_for_xml(vh, time, uni, team, checkname, 
								action, type, vscore, hscore) {

	// Init xml play tag
	var play = "<play";

	/** Add required sections */
	//vh
	if(vh != "H" && vh != "V") throw "get_string_play_for_xml: invalid vh value: must be H or V. vh is " + vh;
	play += ' vh="' + vh + '"';
	//time
	play += ' time="' + time + '"';
	//uni
	play += ' uni="' + uni + '"';
	//team
	play += ' team="' + team + '"';
	//checkname
	play += ' checkname="' + checkname + '"';
	//action
	play += ' action="' + action + '"';
	//type
	if(type != null) play += ' type="' + type + '"';
	//vscore & hscore
	if(vscore != null && hscore != null) {
		play += ' vscore="' + vscore + '"';
		play += ' hscore="' + hscore + '"';
	}

	// Close xml play tag
	play += '></play>';

	return play;
}

/** 
 * Reads the file with the given file_name and returns a string of the
 * play-by-play list in that file. Includes the first line PBP\n.
 * 
 * @param file_name name of the file
 * @return string representation of the play-by-plays
 */
function read_pbp(file_name) {
	// Get string version of file contents
	var file_path = get_file_path(file_name);
	var file_contents = get_game_file_contents(file_path);
	if(file_contents == null) {
		throw "read_pbp: File Read Error: File " + file_name + " does not exist!";
	}

	// Get footer from stats_string_arr
	var stats_string_arr = file_contents.split(semicolon_replacement);
	var pbp = stats_string_arr[4];

	return pbp;
}

/**
 * Gets the number of seconds until 00:00 of the time of the last play in the given file.
 */
function get_last_pbp_timestamp(file_name) {
	// split pbp into array of plays
	var pbp_split = read_pbp(file_name).replace(/><\/play>/g,'').replace('PBP\n<play','').split('<play');
	// if there are no plays, set timestamp to max integer value
	if(pbp_split[0] == 'PBP') return Number.MAX_SAFE_INTEGER;

	// get last pbp and index of time attribute
	var last_pbp = pbp_split[pbp_split.length-1];
	var index_of_time = last_pbp.indexOf('time="');
	// get timestamp of last pbp. overstretch substring in case time is sent incorrectly to drw
	var timestamp = last_pbp.substring(index_of_time + 6, index_of_time + 12).replace('"','').replace(' ','');

	// convert timestamp to seconds count and return
	return mmss_to_seconds(timestamp);
}

/**
 * Converts a string formatted as mm:ss into the number of seconds until 00:00.
 */
function mmss_to_seconds(mmss) {
	var ms = mmss.split(':');
	var seconds = Number(ms[0])*60 + Number(ms[1])*1;

	return seconds;
}











/** 
 * Creates an XML file from a game file with the given file name. Stores it at
 * the file path defined in xml_file_path defined at the top of this file.
 *
 * @param game_file_name name of the game file to generate xml file from
 */
exports.create_xml_file = function(game_file_name) {
	// test if game_file_name is valid
	if(!fs.existsSync(get_file_path(game_file_name))) throw "create_xml_file: File Read Error: File " + game_file_name + " does not exist!";
	var xml_file_path = get_file_path(game_file_name).slice(0,-4) + ".xml";

	// test if xml_file_path is valid
	/**if(!fs.existsSync(xml_file_path)) {
		//throw "create_xml_file: XML File " + xml_file_path + " does not exist!";
		try {
			fs.writeFileSync("", xml_file_path);
		} catch(e) {
			console.log("create_xml_file: File writing error: " + e);
		}
	}*/

	// create xml file from pbp and game information
	var xml_string = '<bbgame source="NextGen Scoring" version="' + version + '" generated="' + xml_get_date() + '">\n';
	xml_string += xml_get_venue(game_file_name) + "\n";
	xml_string += xml_get_status(game_file_name) + "\n";
	xml_string += xml_get_teams(game_file_name) + "\n";
	xml_string += xml_get_byprdsummaries(game_file_name) + "\n";
	xml_string += xml_get_plays(game_file_name) + "\n";
	xml_string += "</bbgame>";

	// store file in xml_file_path
	try {
		fs.writeFileSync(xml_file_path, xml_string);
	} catch(e) {
		console.log("create_xml_file: File writing error: " + e);
	}
}

function xml_get_date() {
	var today = new Date();
	var date_string = "";

	date_string += today.getMonth()+1 + "/";
	date_string += today.getDate() + "/";
	date_string += today.getFullYear();

	return date_string;
}

function xml_get_venue(game_file_name) {
	var footer = exports.read_game_file(game_file_name)[4];
	var venue_string = '<venue';

	venue_string += ' gameid="' + footer[6].replace(/\//g, '-') + '"';
	venue_string += ' visid="' + footer[3] + '"';
	venue_string += ' visname="' + footer[1] + '"';
	venue_string += ' homeid="' + footer[2] + '"';
	venue_string += ' homenanme="' + footer[0] + '"';
	venue_string += ' date="' + footer[6] + '"';
	venue_string += ' location="' + footer[8] + '"';
	venue_string += ' time="' + footer[7] + '"';
	venue_string += ' attend="' + footer[17] + '"';
	venue_string += ' schednote="' + footer[11] + '"';
	venue_string += ' leaguegame="' + footer[10] + '"';

	venue_string += '>\n<officials text="' + footer[15] + '"></officials>\n';

	venue_string += '<rules';
	venue_string += ' prds="' + get_prds(footer[12]) + '"';
	venue_string += ' minutes="' + footer[13] + '"';
	venue_string += ' minutesot="' + footer[14] + '"';
	venue_string += ' qh="' + footer[12] + '"></rules>\n';
	venue_string += '</venue>';

	return venue_string;
}

function get_prds(qh) {
	if(qh.toUpperCase() == 'Q' || qh.toUpperCase() == 'QUARTERS') return '4';
	else return '2';
}

function xml_get_status(game_file_name) {
	// TODO: do the whole function but it's short so nbd
	// ...

	return '<status></status>';
}

function xml_get_teams(game_file_name) {
	var game = exports.read_game_file(game_file_name);
	var teams_string = '<team';

	teams_string += ' vh="V"';
	teams_string += ' id="' + game[4][3] + '"';
	teams_string += ' name="' + game[4][1] + '"';
	teams_string += ' record="' + game[4][5] + '">\n';

	var scores = get_scoreline(game_file_name);
	teams_string += xml_get_linescores(scores[1]) + "\n";
	teams_string += xml_get_totals(game[1]);
	teams_string += xml_get_playerstats(game[1]) + "\n";
	teams_string += '</team>';

	return teams_string;
}

function xml_get_linescores(scores) {
	var linescores_string = '<linescore';
	linescores_string += ' line="';
	for(var period = 0; period < scores.length-1; period++) {
		linescores_string += scores[period] + ',';
	}
	linescores_string += scores[scores.length-1] + '"';
	linescores_string += ' score="' + sum(scores) + '">\n';
	
	for(var period = 0; period < scores.length; period++) {
		linescores_string += '<lineprd prd="' + (period+1) + '"';
		linescores_string += ' score="' + scores[period] + '"></lineprd>\n';
	}

	linescores_string += '</linescore>';
	return linescores_string;
}

function xml_get_totals(team_array) {
	// TODO: implement total stats
	// ...

	return "";
}

function xml_get_playerstats(team_array) {
	var playerstats_string = '';
	for(player = 1; player < team_array.length; player++) {
		playerstats_string += '<player';
		playerstats_string += ' uni="' + team_array[player][0] + '"';
		playerstats_string += ' code="' + team_array[player][0] + '"';

		// TODO: do the rest of the stats
		// ...

		playerstats_string += '></player>\n';
	}
	playerstats_string = playerstats_string.substring(0, playerstats_string.length-1);
	return playerstats_string;
}

function sum(array) {
	var total = 0;
	for(var i = 0; i < array.length; i++) {
		total += array[i];
	} 
	return total;
}

function get_scoreline(file_name) {
	// split pbp into array of periods which are arrays of plays
	var pbp_split = read_pbp(file_name).replace('PBP\n','').split(game_period_delimiter);
	for(var i = 0; i < pbp_split.length; i++) {
		pbp_split[i] = pbp_split[i].replace(/><\/play>/g,'').split('<play');
	}

	var scoreline = new Array(2); // two teams
	scoreline[0] = new Array(pbp_split.length);  // num periods
	scoreline[1] = new Array(pbp_split.length);  // num periods

	for(var period = 0; period < pbp_split.length; period++) {
		for(var play = pbp_split.length-1; play >= 0; play--) {
			if(pbp_split[period][play].includes('hscore')) {
				var hscore_idx = pbp_split[period][play].indexOf('hscore') + 8;
				var vscore_idx = pbp_split[period][play].indexOf('vscore') + 8;
				scoreline[0][period] = Number(pbp_split[period][play].substring(hscore_idx, hscore_idx+3).replace('"','').replace(' ',''));
				scoreline[1][period] = Number(pbp_split[period][play].substring(vscore_idx, vscore_idx+3).replace('"','').replace(' ',''));
			}
		}
	}

	// correct total score to score per period
	for(var team = 0; team < 2; team++) {
		for(var period = 1; period < pbp_split.length; period++) {
			if(scoreline[team][period] == undefined) scoreline[team][period] = scoreline[team][period-1];
		} 
	}
	for(var team = 0; team < 2; team++) {
		for(var period = pbp_split.length-1; period >= 1; period--) {
			scoreline[team][period] -= scoreline[team][period-1];
		}
	}

	return scoreline;
}

function xml_get_byprdsummaries(game_file_name) {
	// TODO: do the whole thing lol
	// ...

	return '<byprdsummaries></byprdsummaries>';
}

const HARDCODED_TIME_PER_PERIOD = "20:00";
function xml_get_plays(game_file_name) {
	// split pbp array of periods
	var pbp_split = read_pbp(game_file_name).replace('PBP\n','').split('\n' + game_period_delimiter + '\n');

	// create plays_string
	var plays_string = '<plays format="tokens">\n';
	for(var i = 1; i <= pbp_split.length; i++) {
		plays_string += '<period number="' + i + '" time="' + HARDCODED_TIME_PER_PERIOD + '">\n';
		
		// TODO: include special stats and summary stats
		// ...
		
		plays_string += pbp_split[i-1];
		plays_string += '\n</period>\n';
	}
	plays_string += '</plays>';

	return plays_string;
}











/** These functions make private functions public for data_testing.js */

exports.test_get_file_path = function(file_name) {
	return get_file_path(file_name);
}

exports.test_delete_file = function(file_name) {
	return delete_file(file_name);
}

exports.test_get_initial_game_file_contents = function(individual_stat_labels, team_stat_labels, footer) {
	return get_initial_game_file_contents(individual_stat_labels, team_stat_labels, footer);
}

exports.test_get_game_file_contents = function(file_path) {
	return get_game_file_contents(file_path);
}

exports.test_scrape_player_stats = function(stats_string_arr) {
	return scrape_player_stats(stats_string_arr);
}

exports.test_create_2d_array = function(num_rows, num_cols) {
	return create_2d_array(num_rows, num_cols);
}

exports.test_edit_current_stats = function(current_stats, stat_changes) {
	return edit_current_stats(current_stats, stat_changes);
}

exports.test_game_array_to_string = function(game_array) {
	return game_array_to_string(game_array);
}

exports.test_overwrite_game_file = function(new_content, file_name) {
	return overwrite_game_file(new_content, file_name);
}

exports.test_get_game_information_string = function(file_name) {
	return get_game_information_string(file_name);
}

exports.test_get_string_play_for_xml = function(vh, time, uni, team, checkname, 
								action, type, vscore, hscore) {
	return get_string_play_for_xml(vh, time, uni, team, checkname, 
								action, type, vscore, hscore);
}

exports.test_read_pbp = function(file_name) {
	return read_pbp(file_name);
}

exports.test_get_last_pbp_timestamp = function(file_name) {
	return get_last_pbp_timestamp(file_name);
}