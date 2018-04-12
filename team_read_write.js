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
 *		2. edit_team_data_location_path(new_path)					*
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

/** path to the folder where data is kept */
var team_data_location_path = "data/";

/** 
 * Returns the filepath of a file with a given name
 *
 * @param file_name Name of the file
 * @return Filepath of the file
 */
function get_file_path(file_name) {
	return team_data_location_path + file_name + '.txt';
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
exports.edit_team_data_location_path = function(new_path) {
	if(!fs.existsSync(new_path)) return false;
	team_data_location_path = new_path;
	return true;
}

/**
 * Creates a file to store information about a team.
 *
 * @param file_name Name of the file
 * @param content Array representation of the team to write to file
 */
exports.create_team = function(file_name, content) {
	//todo
	return;
}

/**
 * Reads a given team file and returns an array of the team information
 *
 * @param file_name Name of the file
 * @return array of team data as defined in Team.js
 */
exports.read_team = function(file_name) {
	//todo
	return [];
}

/**
 * Writes the given content to a team file. Replaces the old
 * contents of the file.
 *
 * @param file_name Name of the file
 * @param content Array represetnation of the team to write to file
 */
exports.overwrite_team = function(file_name, content) {
	//todo
	return;
}

/**
 * Returns an array of array representations of teams as defined in
 * the Team.js file
 *
 * @return array of teams as defined in Team.s
 */
exports.get_all_teams = function() {
	//todo
	return [];
}
