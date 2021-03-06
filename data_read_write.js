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

/**
 * Returns the filepath of a file with a given name
 *
 * @param file_name Name of the file
 * @return Filepath of the file
 */
function get_file_path(file_name) {
	return game_directory + file_name + '.txt';
}

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
	if(individual_stat_labels == undefined) throw "No Individual Stat Labels Provided";
	if(team_stat_labels == undefined) throw "No Team Stat Labels Provided";
	if(file_name == undefined) throw "No File Name Provided";
	if(footer == undefined) throw "No Footer Provided";

	// Check if file exists
	var file_path = get_file_path(file_name);
	if(fs.existsSync(file_path)) return false;

	// Create file. Return false on errors
	var file_contents = get_initial_game_file_contents(individual_stat_labels, team_stat_labels, footer);
	try {
    	fs.writeFileSync(file_path, file_contents);
	} catch (e) {
		throw "File Creation Failed: " + e;
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
	if (file_name == undefined) throw "No File Name Provided";
	var file_path = get_file_path(file_name);
	//if (!fs.existsSync(file_path)) throw "File Name Doesn't Exist";
	var file_contents = get_game_file_contents(file_path);
	if(file_contents == null) {
		throw "File Read Error: File " + file_name + " does not exist!";
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
	if (num_rows <= 0 || num_cols <= 0) throw "Invalid Index Error";
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
	if(stat_changes == undefined) throw "No Stat Changes Provided";
	if(file_name == undefined) throw "No File Name Provided";
	if(!fs.existsSync(get_file_path(file_name))) throw "File Read Error: File " + file_name + " does not exist!";

	// Set player's team and player number for stat change
	var is_home = stat_changes[0];
	if(!(is_home == 1 || is_home == 0)) {
		throw "Index Error: The first index in any stat changes must be 0 or 1";
	}
	var player_number = stat_changes[1];

	// Read team's stats
	var current_game_stats;
	try {
		current_game_stats = exports.read_game_file(file_name);
	} catch(e) {
		console.log("READ ERROR: " + e);
		return false;
	}

	// Edit player's stats
	var current_team_stats = edit_current_stats(current_game_stats[1-is_home], stat_changes);
	current_game_stats[1-is_home] = current_team_stats;

	return overwrite_game_file(game_array_to_string(current_game_stats) + "\n" + semicolon_replacement +
							   get_game_information_string(file_name), file_name);
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
	if(stat_changes == undefined) throw "No Stat Changes Provided";
	if(file_name == undefined) throw "No File Name Provided";
	if(!fs.existsSync(get_file_path(file_name))) throw "File Read Error: File " + file_name + " does not exist!";
	var is_home = stat_changes[0];
	if(!(is_home == 1 || is_home == 0)) {
		throw "Index Error: The first index in any stat changes must be 0 or 1";
	}
	var player_number = stat_changes[1];

	// Read team's stats
	var current_game_stats;
	try {
		current_game_stats = exports.read_game_file(file_name);
	} catch(e) {
		console.log("READ ERROR: " + e);
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
							   get_game_information_string(file_name), file_name);

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
 * Converts the given 3D array of game stats into a string.
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
	if (file_name == undefined) throw "No File Name Provided";
	if(!fs.existsSync(get_file_path(file_name))) throw "File Read Error: File " + file_name + " does not exist!";

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
		throw "File Read Error: File " + file_name + " does not exist!";
	}

	// Get footer from stats_string_arr
	var stats_string_arr = file_contents.split(semicolon_replacement);
	var game_information = stats_string_arr[3];

	return game_information;
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
