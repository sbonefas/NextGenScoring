const trw = require('./team_read_write.js');
const fs = require('fs');

const directory = 'team/';
const file_names = ['test_team0', 'test_team1', 'test_team2', 'test_team3'];

// Team Arrays
const team0_content = ['name', 'code', 'stadium'];
const team1_content = ['name', 'code', ['player1', 'player2', 'player3'], 'stadium'];
const team2_content = ['new_name', 'new_code', 'new_stadium'];
const team3_content = ['new_name', 'new_code', 
							['new_player0','new_player1','new_player2'], 
					   'new_stadium'];

// Team Strings
const team0_string = "name,code,stadium";
const team1_string = "name,code,[[[player1/player2/player3]]],stadium";
const team2_string = "new_name,new_code,new_stadium";
const team3_string = "new_name,new_code,[[[new_player0/new_player1/new_player2]]],new_stadium";

test();

function get_file_path(fname) {
	return directory + fname + '.txt';
}

function test_success(test_name) {
	console.log("SUCCESS " + test_name);
}

function test_fail(test_name) {
	console.log("FAIL " + test_name);
}

function clean() {
	for(var file_no = 0; file_no < file_names.length; file_no++) {
		trw.delete_file(  file_names[file_no]  );
	}
}

function test() {
	try {
		trw.edit_team_directory(directory);
	
		test_string_to_team();
		test_team_to_string();

		test_delete_file();
		test_create_team();
		test_read_team();
		test_overwrite_team();
		test_get_all_teams();
	} catch (err) {
		console.log("   on error: '" + err + "'");
	}

	clean();
}

function test_delete_file() {
	trw.create_team(file_names[0], "test_content");
	trw.delete_file(file_names[0]);
	if(!fs.existsSync( get_file_path(file_names[0]) )) test_success("test_delete_file");
	else test_fail("test_delete_file");
}

function test_create_team() {
	trw.create_team(file_names[0], team0_content);
	trw.create_team(file_names[1], team1_content);
	if(!fs.existsSync( get_file_path(file_names[0]) )) {
		test_fail("test_create_team");
		return;
	}
	var contents0 = fs.readFileSync(get_file_path(file_names[0]), 'utf8');
	var contents1 = fs.readFileSync(get_file_path(file_names[1]), 'utf8');
	if(contents0 == team0_string && contents1 == team1_string) test_success("test_create_team");
	else test_fail("test_create_team");
}

function test_read_team() {
	var contents0 = trw.read_team(file_names[0]);
	var contents1 = trw.read_team(file_names[1]);
	if(contents0.toString() == team0_content.toString() && 
	   contents1.toString() == team1_content.toString()) test_success("test_read_team");
	else test_fail("test_read_team");
}

function test_overwrite_team() {
	trw.overwrite_team(file_names[0], team3_content);
	trw.overwrite_team(file_names[1], team2_content);
	var contents0 = trw.read_team(file_names[0]);
	var contents1 = trw.read_team(file_names[1]);
	if(contents0.toString() == team3_content.toString() && 
	   contents1.toString() == team2_content.toString()) test_success("test_overwrite_team");
	else test_fail("test_overwrite_team");
}

function test_get_all_teams() {
	var teams = trw.get_all_teams();
	if(teams[0].toString() == trw.read_team(file_names[0]).toString() && 
	   teams[1].toString() == trw.read_team(file_names[1]).toString()) test_success("test_get_all_teams");
	else test_fail("test_get_all_teams");
}

function test_string_to_team() {
	if(trw.test_string_to_team(team0_string).toString() == team0_content.toString() && 
	   trw.test_string_to_team(team1_string).toString() == team1_content.toString()) test_success("test_string_to_team");
	else test_fail("test_string_to_team"); 
}

function test_team_to_string() {
	if(trw.test_team_to_string(team0_content) == team0_string && 
	   trw.test_team_to_string(team1_content) == team1_string) test_success("test_team_to_string");
	else test_fail("test_team_to_string"); 
}