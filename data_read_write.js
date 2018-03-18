const fs = require("fs");	//node.js filesystem




/** path to the folder where data is kept */
var game_data_location_path = "./data/";

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
	var file_path = game_data_location_path + file_name + '.csv';
	if(fs.existsSync(file_path)) return false;

	try {
    	fs.writeFileSync(file_path, '');
	} catch (e) {
    	return false;
	}

	return true;
}

/**
 * Writes to the game file with the given filename and adds stats
 * corresponding to the given key inputs.
 *
 * @param key_inputs String of characters and numbers that correspond
 * to a play taken in by a statkeeper.
 * @param file_name Name of the file to write to. The file name should
 * not include the filetype or directory.
 */
exports.write_to_game_file = function(key_inputs, file_name) {
	var file_path = game_data_location_path + file_name + '.csv';
	if(!fs.existsSync(file_path)) return false;

	//TODO: parse key_inputs and write to given file.
	//	- use 'csv' module?
	//	- write specific line
	//	- maybe return something based on the error type because there will be a couple
	//		- couldn't find file
	//		- player doesn't exist in file
	//		- etc...
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
	if(data === "this is test data to read") return true;
	else return false;
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