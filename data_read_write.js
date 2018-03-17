const fs = require("fs");	//node.js filesystem

const TESTING = true;
var data_location_path = "./data/";

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
	var file_path = data_location_path + file_name + '.csv';

	if(fs.existsSync(file_path)) return false;

	try {
    	fs.writeFileSync(file_path, '');
	} catch (e) {
    	return false;
	}

	return true;
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