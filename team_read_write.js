/********************************************************************
 *																	*		
 *					TEAM DATA READING AND WRITING 					*
 *																	*
 *	This js file controls all reading/writing to team data files	*													*
 *																	*
 *																	*
 * public functions: 												*
 * 		1. delete_file(file_name)									*
 *			- deletes the file with the given filename 				*
 *		2. edit_team_directory(new_path)							*
 *			- changes the directory that team files are stored		*
 *		3. create_team(file_name, content)							*
 *			- creates a team file and fills it with 				*
 			  the given content										* 
 *		4. read_team(file_name)										*
 *			- gets the contents of a given team file 		 		*
 *		5. overwrite_team(file_name, content)						*
 *			- writes the given content to the given team file 		*
 *		6. get_all_teams()											*
 *			- returns an array of the contents in all of the 		*
 *			  team files 									 		*
 *																	*	
  *******************************************************************/


const fs = require("fs");	//node.js filesystem
const util = require("util");	//node.js utility module

/** path to the folder where team data is kept */
var team_directory = "team/";

/** 
 * Returns the filepath of a file with a given name
 *
 * @param file_name Name of the file
 * @return Filepath of the file
 */
function get_file_path(file_name) {
	return team_directory + file_name + '.txt';
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
exports.edit_team_directory = function(new_path) {
	if(!fs.existsSync(new_path)) return false;
	team_directory = new_path;
	return true;
}

/**
 * Creates a file to store information about a team.
 *
 * @param file_name Name of the file
 * @param content Array representation of the team to write to file
 * @throw error if file already exists
 */
exports.create_team = function(file_name, content) {
	var file_path = get_file_path(file_name);

	if(fs.existsSync(file_path)) throw "File " + file_name + " already exists in " + team_directory;
	fs.writeFileSync(file_path, team_to_string(content));
}

/**
 * Reads a given team file and returns an array of the team information
 *
 * @param file_name Name of the file
 * @throw error if file doesn't exist
 * @return array of team data as defined in Team.js
 */
exports.read_team = function(file_name) {
	var file_path = get_file_path(file_name);
	if(!fs.existsSync(file_path)) throw "File " + file_name + " doesn't exist in " + team_directory;

	var contents = fs.readFileSync(file_path, 'utf8');

	return string_to_team(contents);
}

/**
 * Writes the given content to a team file. Replaces the old
 * contents of the file.
 *
 * @param file_name Name of the file
 * @param content Array represetnation of the team to write to file
 * @throw error if file doesn't exist
 */
exports.overwrite_team = function(file_name, content) {
	var file_path = get_file_path(file_name);

	if(!fs.existsSync(file_path)) throw "File " + file_name + " doesn't exist in " + team_directory;
	fs.writeFileSync(file_path, team_to_string(content));
}

/**
 * Returns an array of array representations of teams as defined in
 * the Team.js file
 *
 * @return array of teams as defined in Team.js
 */
exports.get_all_teams = function() {
	file_names = fs.readdirSync(team_directory);
	teams = Array(file_names.length);

	for(var el_no = 0; el_no < file_names.length; el_no++) {
		teams[el_no] = exports.read_team(file_names[el_no].replace(".txt",""));
	}

	return teams;
}

function team_to_string(team_arr) {
	var team_str = "";

	for(var el_no = 0; el_no < team_arr.length; el_no++) {
		if(util.isArray(team_arr[el_no])) {
			// Sub Array -> String
			team_str += "[[[" + team_arr[el_no].toString()
											   .replace(/,/g,"/") + "]]]";
		}
		else {
			// Field -> String
			team_str += String(team_arr[el_no]);
		}
		if(el_no != team_arr.length - 1) team_str += ",";
	}

	return team_str;
}

function string_to_team(team_str) {
	var team_arr = team_str.split(",");

	for(el_no = 0; el_no < team_arr.length; el_no++) {
		if(team_arr[el_no].substring(0,3) == "[[[") {
			team_arr[el_no] = team_arr[el_no].replace('[[[','')
											 .replace(']]]','')
											 .split("/");
		}
	}

	return team_arr;
}



exports.test_team_to_string = function(team_array) {
	return team_to_string(team_array);
}

exports.test_string_to_team = function(team_string) {
	return string_to_team(team_string);
}
