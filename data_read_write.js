const fs = require("fs");	//node.js filesystem




/** path to the folder where data is kept */
var game_data_location_path = "data/";

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
 * @return True if game successfully created, false if file_name exists
 * or if the path to the data folder is invalid.
 */
exports.create_game_file = function(file_name) {
	// Check if file exists
	var file_path = get_file_path(file_name);
	if(fs.existsSync(file_path)) return false;

	// Create file. Return false on errors
	try {
    	fs.writeFileSync(file_path, '');
	} catch (e) {
    	return false;
	}
	return true;
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
 * corresponding to the given key inputs.
 *
 * @param key_inputs String of characters and numbers that correspond
 * to a play taken in by a statkeeper.
 * @param file_name Name of the file to write to. The file name should
 * not include the filetype or directory.
 * @return True if write is successful, false otherwise.
 */
exports.write_to_game_file = function(key_inputs, file_name) {
	var file_path = get_file_path(file_name);
	if(!fs.existsSync(file_path)) return false;

	switch(key_inputs.charAt(0)) {
		// Shot:
		case 'J':
		case 'D':
		case 'L':
		case 'P':
		case 'Y':
		case 'W':
			write_shot(key_inputs, file_path);
			break;

		// Free Throw:
		case 'E':
			write_freethrow(key_inputs, file_path);
			break;

		// Turnover:
		case 'T':
			write_turnover(key_inputs, file_path);
			break;

		// Rebound:
		case 'R':
			write_rebound(key_inputs, file_path);
			break;

		// Assist:
		case 'A':
			write_assist(key_inputs, file_path);
			break;

		// Steal:
		case 'S':
			write_steal(key_inputs, file_path);
			break;

		// Block:
		case 'B':
			write_block(key_inputs, file_path);
			break;

		default:
			return false;

	}

	return true;
}

function write_shot(key_inputs, file_path) {
	
}

function write_freethrow(key_inputs, file_path) {

}

function write_turnover(key_inputs, file_path) {

}

function write_rebound(key_inputs, file_path) {

}

function write_assist(key_inputs, file_path) {
	
}

function write_steal(key_inputs, file_path) {
	
}

function write_block(key_inputs, file_path) {
	
}












/** TEST FUNCTIONS. NOT PRODUCTION CODE */

/** 
 * Reads the data in a given file and prints it to console. Data files
 * are temporarily stored in 'data/'.
 * --USED FOR TESTING--
 */
exports.readTestData = function(file_path) {	
	var test_data = fs.readFileSync(file_path, 'utf8');
	return test_data;
}

/** 
 * Writes the data in a given file and prints it to console. Data files
 * are temporarily stored in 'data/'.
 * --USED FOR TESTING--
 */
exports.writeTestData = function(file_path, data) {
	fs.writeFileSync(file_path, data, 'utf8');
}


/** 
 * Tests readTestData kinda poorly. Delete once readTestData is gone
 */
exports.test_read = function() {
	var file_path = './data/test_read_data.txt';
	var data = exports.readTestData(file_path);
	if(data === "this is test data") return true;
	else {
		console.log(data);
		return false;
	}
}

/** 
 * Tests writeTestData kinda poorly. Delete once writeTestData is gone
 */
exports.test_write = function() {
	var file_path = './data/test_write_data.txt';
	var write_me = "this is test data to write";
	exports.writeTestData(file_path, write_me);
	if(exports.readTestData(file_path) === write_me) return true;
	else return false;
}

/** END TEST FUNCTIONS */