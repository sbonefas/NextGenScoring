const fs = require("fs");	//node.js filesystem

/** path to the folder where data is kept */
var game_data_location_path = "data/";

/** 
 * Returns the filepath of a file with a given name
 *
 * @param file_name Name of the file
 * @return Filepath of the file
 */
function get_file_path(file_name) {
	return game_data_location_path + file_name + '.txt';
}

/**
 * Edits the stored data location path where game files are held.
 *
 * @param new_path New file path to the directory where games are held. The
 * directory must exists before calling this function.
 * @return True if path is successfully edited. False if the directory path
 * does not exist.
 */
exports.edit_game_data_location_path = function(new_path) {
	if(!fs.existsSync(new_path)) return false;
	game_data_location_path = new_path;
	return true;
}

/** 
 * Creates an empty .csv game file with the given file_name.
 * 
 * @param file_name Name of the file to create. The file name should
 * not include a filetype, and should follow standard naming procedures
 * for the user's operating system.
 * @param labels Array of labels to be used in the stat file
 * @return True if game successfully created, false if file_name exists
 * or if the path to the data folder is invalid.
 */
exports.create_game_file = function(labels, file_name) {
	// Check if file exists
	var file_path = get_file_path(file_name);
	if(fs.existsSync(file_path)) return false;

	// Create file. Return false on errors
	var file_contents = get_initial_game_file_contents(labels);
	try {
    	fs.writeFileSync(file_path, file_contents);
	} catch (e) {
    	return false;
	}
	return true;
}

/** 
 * Creates the content of the game file when initially created.
 * Game files are organized as follows:
 *
 * HOME
 * [stat labels]
 * [home player stats]
 * ;AWAY
 * [stat labels]
 * [home player stats]
 *
 * @param labels Array of stat labels to be used in the stat file
 * @return String of initial file contents.
 */
function get_initial_game_file_contents(labels) {
	var contents = "HOME\n";
	for(var label_idx = 0; label_idx < labels.length; label_idx++) {
		if(label_idx != 0) contents += ",";
		contents += labels[label_idx];
	}
	contents += "\n;AWAY\n";
	for(var label_idx = 0; label_idx < labels.length; label_idx++) {
		if(label_idx != 0) contents += ",";
		contents += labels[label_idx];
	}
	return contents;
}

/** 
 * Reads the given game file and returns a 3D array, where index 0
 * contains a 2D array with the stats for the home team, and index 1
 * has a 2D array with the stats for the away team.
 *
 * @param file_name Name of the file to read from. The file name should
 * not include the filetype or directory.
 * @return 3D array containing two 2D arrays with home/away stats.
 */
exports.read_game_file = function(file_name) {
	//TODO: throw error if file doesn't exist
	//
	//
	//

	// Get string version of file contents
	var file_path = get_file_path(file_name);
	var file_contents = get_game_file_contents(file_path);

	// Convert to two separate strings. Cut off last newline in home stats.
	var stats_string_arr = file_contents.split(';');
	stats_string_arr[0] = stats_string_arr[0].substring(0, stats_string_arr[0].length-1);

	// Create unitialized 2d arrays for stats
	var home_stats = scrape_stats(stats_string_arr[0]);
	var away_stats = scrape_stats(stats_string_arr[1]);

	// Combine home and away stats and return
	var arr_3d = new Array(2);
	arr_3d[0] = home_stats;
	arr_3d[1] = away_stats;

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
 * Takes the stats in a given string of comma-separated stats and organizes
 * them into a 2d array of stats to return.
 * 
 * @param num_players Number of players in the 
 */
function scrape_stats(stats_string_arr) {
	// Get number of stats and players to set 2D array sizes
	var num_stats = stats_string_arr.split('\n')[1].split(',').length;
	var num_players = stats_string_arr.split('\n').length-2;

	// Create empty 2d array
	var arr_stats = create_2d_array(num_players, num_stats);

	// Get stats
	for(var player = 0; player < num_players; player++) {
		for(var stat = 0; stat < num_stats; stat++) {
			arr_stats[player][stat] = stats_string_arr.split('\n')[player+2].split(',')[stat].trim();
		}
	}

	return arr_stats
}

/**
 * Creates an empty 2d array and returns it.
 *
 * @param num_rows Number of rows in the array
 * @param num_cols Number of columns in the array
 * @return 2d array with unitialized elements.
 */
function create_2d_array(num_rows, num_cols) {
	var arr = new Array(num_rows);
	for(var row = 0; row < num_rows; row++) {
		arr[row] = new Array(num_cols);
	}
	return arr;
}

/**
 * Writes to the game file with the given filename and adds stats
 * corresponding to the given stat changes.
 *
 * @param stat_changes Array of changes to stats as defined in main.js 
 * addPlay() function
 * @param file_name Name of the file we're writing to
 * @return True if write is successful, false otherwise.
 */
exports.write_to_game_file = function(stat_changes, file_name) {
	var file_path = get_file_path(file_name);
	if(!fs.existsSync(file_path)) return false;

	var is_home = stat_changes[0];

	//TODO

	return true;
}