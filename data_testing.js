/** 
 * TESTING FILE FOR data_read_write.js 
 * run node data_testing.js to run script
 */

const drw = require('./data_read_write.js');
const fs = require('fs');

const file_name = "data_test";
const file_path = "data/data_test.txt";
const labels = ['number', 'fg', 'fga', 'pts'];
const footer = ['test', 1,'test2/test3/4', 'test5'];

/** UNIT TEST DATA */
const test_stats = "HOME\nnumber,fg,fga,pts\n30,2,4,6\n\
31,3,3,7\n44,5,7,12\n02,1,5,2\n;AWAY\nnumber,fg,fga,pts\n\
35,1,4,2\n36,2,3,6\n45,6,7,12\n03,4,5,8";
const test_stats_with_footer = test_stats + "\n;FOOTER\n" + footer.toString();
const test_team_stats = "HOME\nnumber,fg,fga,pts\n30,2,4,6\n\
31,3,3,7\n44,5,7,12\n02,1,5,2";
const test_stats_array = [ [ 
	[ 'number', 'fg', 'fga', 'pts' ],[ '30', '2', '4', '6' ],[ '31', '3', '3', '7' ],
	[ '44', '5', '7', '12' ],[ '02', '1', '5', '2' ] ],
  [ [ 'number', 'fg', 'fga', 'pts' ],[ '35', '1', '4', '2' ],
  [ '36', '2', '3', '6' ],[ '45', '6', '7', '12' ],[ '03', '4', '5', '8' ] ]
  ];
const test_team_stats_array = [ [ 'number', 'fg', 'fga', 'pts' ],
	[ '30', '2', '4', '6' ],
	[ '31', '3', '3', '7' ],
	[ '44', '5', '7', '12' ],
	[ '02', '1', '5', '2' ] ];
const test_stat_changes_exist = [1, '31', 1, 1, 2];
const test_stat_changes_no_exist = [0, '29', 0, 1, 0];
const test_empty_team_stats_array = [[ 'number', 'fg', 'fga', 'pts' ]];

/** ADDITIONAL INTEGRATION TEST DATA */
//data


test();

function test_success(test_name) {
	console.log("SUCCESS " + test_name);
}

function test_fail(test_name) {
	console.log("FAIL " + test_name);
}

function clean() {
	if(fs.existsSync(file_path)) drw.delete_file(file_name);
}

function test() {
	test_get_file_path();
	test_create_file();
	test_delete_file();
	test_create_game_file();
	test_initial_game_file_contents();
	test_get_game_file_contents();
	test_scrape_stats();
	test_create_2d_array();
	test_read_game_file_empty();
	test_edit_current_stats();
	test_game_array_to_string();
	test_get_game_information_string();
	test_overwrite_game_file();
	test_read_game_file_full();
	test_write_player_stats_to_game_file();

	clean();
}

function test_get_file_path() {
	if(drw.test_get_file_path(file_name) === file_path) test_success("test_get_file_path");
	else test_fail("test_get_file_path");
}

function test_create_file() {
	drw.create_game_file(labels, file_name, footer);
	if(fs.existsSync(file_path)) test_success("test_create_file");
	else test_fail("test_create_file");
}

function test_delete_file() {
	drw.delete_file(file_name);
	if(!fs.existsSync(file_path)) test_success("test_delete_file");
	else test_fail("test_delete_file");
}

function test_create_game_file() {
	var contents = "HOME\nnumber,fg,fga,pts\n;AWAY\nnumber,fg,fga,pts\n;FOOTER\n" + footer.toString();
	drw.create_game_file(labels, file_name, footer);
	if(fs.readFileSync(file_path, 'utf8') == contents) test_success("test_create_game_file");
	else test_fail("test_create_game_file");
}

function test_initial_game_file_contents() {
	var contents = "HOME\nnumber,fg,fga,pts\n;AWAY\nnumber,fg,fga,pts\n;FOOTER\n" + footer.toString();
	if(drw.test_get_initial_game_file_contents(labels, footer) == contents) test_success("test_initial_game_file_contents");
	else test_fail("test_initial_game_file_contents");
}

function test_get_game_file_contents() {
	var contents = "HOME\nnumber,fg,fga,pts\n;AWAY\nnumber,fg,fga,pts\n;FOOTER\n" + footer.toString();
	if(drw.test_get_game_file_contents(file_path) == contents) test_success("test_get_game_file_contents");
	else test_fail("test_get_game_file_contents");
}

function test_scrape_stats() {
	if(drw.test_scrape_stats(test_team_stats).toString() == test_team_stats_array.toString()) test_success("test_scrape_stats");
	else test_fail("test_scrape_stats");
}

function test_create_2d_array() {
	var result_array = [ [ 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ] ];

	var num_rows = 5;
	var num_cols = 7;
	
	if(drw.test_create_2d_array(num_rows, num_cols).toString() == result_array.toString()) test_success("test_create_2d_array");
	else test_fail("test_create_2d_array");
}

function test_read_game_file_empty() {
	var result_array = [ [ [ 'number', 'fg', 'fga', 'pts' ] ],
  [ [ 'number', 'fg', 'fga', 'pts' ] ] ];

	if(drw.read_game_file(file_name).toString() == result_array.toString()) test_success("test_read_game_file (empty)");
	else test_fail("test_read_game_file (empty)");
}

function test_edit_current_stats() {
	var new_stats = drw.test_edit_current_stats(test_team_stats_array, test_stat_changes_exist);
	if(new_stats[2].toString() == ['31', 4, 4, 9].toString()) test_success("test_edit_current_stats (player exists)");
	else test_fail("test_edit_current_stats (player exists)");

	new_stats = drw.test_edit_current_stats(test_team_stats_array, test_stat_changes_no_exist);
	if(new_stats.length == 6 && new_stats[5].toString() == ['29', 0, 1, 0].toString()) test_success("test_edit_current_stats (player doesn't exist)");
	else test_fail("test_edit_current_stats (player doesn't exist)");

	new_stats = drw.test_edit_current_stats(test_empty_team_stats_array, test_stat_changes_no_exist);
	if(new_stats.length == 2 && new_stats[1].toString() == ['29', 0, 1, 0].toString()) test_success("test_edit_current_stats (empty)");
	else test_fail("test_edit_current_stats (empty)");

}

function test_game_array_to_string() {
	if(drw.test_game_array_to_string(test_stats_array) == test_stats) test_success("test_game_array_to_string");
	else test_fail("test_game_array_to_string");
}

function test_get_game_information_string() {
	if(drw.test_get_game_information_string(file_name) == "FOOTER\n" + footer.toString()) test_success("test_get_game_information_string");
	else test_fail("test_get_game_information_string");
}

function test_overwrite_game_file() {
	drw.test_overwrite_game_file(test_stats_with_footer, file_name);
	if(drw.read_game_file(file_name).toString() == test_stats_array.toString()) test_success("test_overwrite_game_file");
	else test_fail("test_overwrite_game_file");
}

function test_write_player_stats_to_game_file() {
	var result_array = [ [ ['number','fg','fga','pts'],
['30',2,4,6],
['31',5,5,11],
['44',5,7,12],
['02',1,5,2] ],
[ ['number','fg','fga','pts'],
['35',1,4,2],
['36',2,3,6],
['45',6,7,12],
['03',4,5,8],
['29',0,1,0]] ];

	drw.write_player_stats_to_game_file(test_stat_changes_exist, file_name);
	drw.write_player_stats_to_game_file(test_stat_changes_exist, file_name);
	drw.write_player_stats_to_game_file(test_stat_changes_no_exist, file_name);

	if(drw.read_game_file(file_name).toString() == result_array.toString()) test_success("test_write_player_stats_to_game_file");
	else test_fail("test_write_player_stats_to_game_file");
}

function test_read_game_file_full() {
	var result_array = [ [ ['number','fg','fga','pts'],
['30',2,4,6],
['31',3,3,7],
['44',5,7,12],
['02',1,5,2] ],
[ ['number','fg','fga','pts'],
['35',1,4,2],
['36',2,3,6],
['45',6,7,12],
['03',4,5,8]] ] ;

	if(drw.read_game_file(file_name).toString() == result_array.toString()) test_success("test_read_game_file (full)");
	else test_fail("test_read_game_file (full)");
}


