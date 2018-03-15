const electron = require("electron");
const fs = require("fs");	//node.js filesystem
const TESTING = true;

/** 
 * Reads the data in a given file and prints it to console. Data files
 * are temporarily stored in 'data/'.
 * --USED FOR TESTING--
 */
exports.readTestData = function(file_path) {
	
	var test_data = fs.readFileSync(file_path, 'utf8');
	if(TESTING) console.log(test_data);
	
	return test_data;
}

/** 
 * Writes the data in a given file and prints it to console. Data files
 * are temporarily stored in 'data/'.
 * --USED FOR TESTING--
 */
exports.writeTestData = function(file_path, data) {
	fs.writeFileSync(file_path, data, 'utf8');
	if(TESTING) console.log(test_data);

}

