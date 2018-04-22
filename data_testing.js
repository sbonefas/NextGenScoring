/**
 * TESTING FILE FOR data_read_write.js
 * run node data_testing.js to run script
 */

const drw = require('./data_read_write.js');
const fs = require('fs');

const file_name = "data_test";
const file_path = "data/data_test.txt";
const individual_stat_labels = ['number', 'fg', 'fga', 'pts'];
const team_stat_labels = ['team fouls', 'timeouts left'];
const footer = ['test', 1,'test2/test3/test4', 'test5'];

/** UNIT TEST DATA */
const test_stats = "HOME\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
+ "30(&h#@d!`_2(&h#@d!`_4(&h#@d!`_6\n31(&h#@d!`_3(&h#@d!`_3(&h#@d!`_7\n44(&h#@d!`_5(&h#@d!`_7(&h#@d!`_12\n02(&h#@d!`_1(&h#@d!`_5(&h#@d!`_2\n"
+ "/Od@&?l#iAWAY\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
+ "35(&h#@d!`_1(&h#@d!`_4(&h#@d!`_2\n36(&h#@d!`_2(&h#@d!`_3(&h#@d!`_6\n45(&h#@d!`_6(&h#@d!`_7(&h#@d!`_12\n03(&h#@d!`_4(&h#@d!`_5(&h#@d!`_8\n"
+ "/Od@&?l#iTEAM\nteam fouls(&h#@d!`_timeouts left\n"
+ "9(&h#@d!`_4\n"
+ "8(&h#@d!`_3";
const test_pbp = '<play vh="V" time="00:47" uni="12" team="MICH" checkname="ABDUR-RAHKMAN,M-A" action="GOOD" type="FT" vscore="78" hscore="69"></play>';
const test_pbp_addition = test_pbp + '\n<play vh="V" time="09:49" uni="13" team="MICH" checkname="WAGNER,MORITZ" action="FOUL"></play>';
const test_stats_with_footer_and_pbp = test_stats + "\n/Od@&?l#iFOOTER\n" + footer.toString().replace(/,/g,'(&h#@d!`_') + "\n/Od@&?l#iPBP\n" + test_pbp;
const test_team_stats = "HOME\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n30(&h#@d!`_2(&h#@d!`_4(&h#@d!`_6\n\
31(&h#@d!`_3(&h#@d!`_3(&h#@d!`_7\n44(&h#@d!`_5(&h#@d!`_7(&h#@d!`_12\n02(&h#@d!`_1(&h#@d!`_5(&h#@d!`_2";
const test_stats_array = [
  [ [ 'number', 'fg', 'fga', 'pts' ],[ '30', '2', '4', '6' ],[ '31', '3', '3', '7' ],
  	[ '44', '5', '7', '12' ],[ '02', '1', '5', '2' ] ],
  [ [ 'number', 'fg', 'fga', 'pts' ],[ '35', '1', '4', '2' ],
  	[ '36', '2', '3', '6' ],[ '45', '6', '7', '12' ],[ '03', '4', '5', '8' ] ],
  [ [ 'team fouls', 'timeouts left'],[ '9', '4'] ],
  [ [ 'team fouls', 'timeouts left'],[ '8', '3'] ],
  [ 'test', 1, 'test2/test3/test4', 'test5']
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
	test_scrape_player_stats();
	test_create_2d_array();
	test_read_game_file_empty();
	test_edit_current_stats();
	test_game_array_to_string();
	test_get_game_information_string();
	test_overwrite_game_file();
	test_read_game_file_full();
	test_write_player_stats_to_game_file();
	test_write_team_stats_to_game_file();
	test_get_string_play_for_xml();
	test_read_pbp();
	test_add_pbp();

	clean();
}

//done
function test_get_file_path() {
	if(drw.test_get_file_path(file_name) === file_path) test_success("test_get_file_path");
	else test_fail("test_get_file_path");
}

//done
function test_create_file() {
	drw.create_game_file(individual_stat_labels, team_stat_labels, file_name, footer);
	if(fs.existsSync(file_path)) test_success("test_create_file");
	else test_fail("test_create_file");
}

//done
function test_delete_file() {
	drw.delete_file(file_name);
	if(!fs.existsSync(file_path)) test_success("test_delete_file");
	else test_fail("test_delete_file");
}

//done
function test_create_game_file() {
	var contents = "HOME\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
					+ "/Od@&?l#iAWAY\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
					+ "/Od@&?l#iTEAM\nteam fouls(&h#@d!`_timeouts left\n0(&h#@d!`_0\n0(&h#@d!`_0\n"
					+ "/Od@&?l#iFOOTER\n" + footer.toString().replace(/,/g,'(&h#@d!`_') + "\n/Od@&?l#iPBP";
	drw.create_game_file(individual_stat_labels, team_stat_labels, file_name, footer);
	if(fs.readFileSync(file_path, 'utf8') == contents) test_success("test_create_game_file");
	else test_fail("test_create_game_file");
}

//done
function test_initial_game_file_contents() {
	var contents = "HOME\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
					+ "/Od@&?l#iAWAY\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
					+ "/Od@&?l#iTEAM\nteam fouls(&h#@d!`_timeouts left\n0(&h#@d!`_0\n0(&h#@d!`_0\n"
					+ "/Od@&?l#iFOOTER\n" + footer.toString().replace(/,/g,'(&h#@d!`_') + "\n/Od@&?l#iPBP";
	if(drw.test_get_initial_game_file_contents(individual_stat_labels, team_stat_labels, footer) == contents) test_success("test_initial_game_file_contents");
	else test_fail("test_initial_game_file_contents");
}

//done
function test_get_game_file_contents() {
	var contents = "HOME\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
					+ "/Od@&?l#iAWAY\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
					+ "/Od@&?l#iTEAM\nteam fouls(&h#@d!`_timeouts left\n0(&h#@d!`_0\n0(&h#@d!`_0\n"
					+ "/Od@&?l#iFOOTER\n" + footer.toString().replace(/,/g,'(&h#@d!`_') + "\n/Od@&?l#iPBP";;
	if(drw.test_get_game_file_contents(file_path) == contents) test_success("test_get_game_file_contents");
	else test_fail("test_get_game_file_contents");
}

//done
function test_scrape_player_stats() {
	if(drw.test_scrape_player_stats(test_team_stats).toString() == test_team_stats_array.toString()) test_success("test_scrape_player_stats");
	else test_fail("test_scrape_player_stats");
}

//done
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

//done
function test_read_game_file_empty() {
	var result_array = [
	[ [ 'number', 'fg', 'fga', 'pts' ] ],
  	[ [ 'number', 'fg', 'fga', 'pts' ] ],
  	[ [ 'team fouls', 'timeouts left' ], ['0', '0'] ],
  	[ [ 'team fouls', 'timeouts left' ], ['0', '0'] ],
  	[ 'test', '1', 'test2/test3/test4', 'test5' ]
  	];

	if(drw.read_game_file(file_name).toString() == result_array.toString()) test_success("test_read_game_file (empty)");
	else test_fail("test_read_game_file (empty)");
}

//done
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

//done
function test_game_array_to_string() {
	if(drw.test_game_array_to_string(test_stats_array) == test_stats) test_success("test_game_array_to_string");
	else test_fail("test_game_array_to_string");
}

//done
function test_get_game_information_string() {
	if(drw.test_get_game_information_string(file_name) == "FOOTER\n" + footer.toString().replace(/,/g,'(&h#@d!`_')) test_success("test_get_game_information_string");
	else test_fail("test_get_game_information_string");
}

function test_overwrite_game_file() {
	drw.test_overwrite_game_file(test_stats_with_footer_and_pbp, file_name);
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
['29',0,1,0] ],
[ [ 'team fouls', 'timeouts left' ], [ '9', '4' ] ],
[ [ 'team fouls', 'timeouts left' ], [ '8', '3' ] ],
[ 'test', '1', 'test2/test3/test4', 'test5' ] ];

	drw.write_player_stats_to_game_file(test_stat_changes_exist, file_name);
	drw.write_player_stats_to_game_file(test_stat_changes_exist, file_name);
	drw.write_player_stats_to_game_file(test_stat_changes_no_exist, file_name);

	if(drw.read_game_file(file_name).toString() == result_array.toString()) test_success("test_write_player_stats_to_game_file");
	else test_fail("test_write_player_stats_to_game_file");
}

function test_write_team_stats_to_game_file() {
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
['29',0,1,0] ],
[ [ 'team fouls', 'timeouts left' ], [ '10', '4' ] ],
[ [ 'team fouls', 'timeouts left' ], [ '8', '1' ] ],
[ 'test', '1', 'test2/test3/test4', 'test5' ] ];

	drw.write_team_stats_to_game_file([1, 1, 0], file_name);
	drw.write_team_stats_to_game_file([0, 0, -2], file_name);

	if(drw.read_game_file(file_name).toString() == result_array.toString()) test_success("test_write_team_stats_to_game_file");
	else test_fail("test_write_team_stats_to_game_file");

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
['03',4,5,8] ],
[ [ 'team fouls', 'timeouts left' ], [ '9', '4' ] ],
[ [ 'team fouls', 'timeouts left' ], [ '8', '3' ] ],
[ 'test', '1', 'test2/test3/test4', 'test5' ] ];

	if(drw.read_game_file(file_name).toString() == result_array.toString()) test_success("test_read_game_file (full)");
	else test_fail("test_read_game_file (full)");
}

function test_get_string_play_for_xml() {
	var vh = 'V';
	var time = '00:47';
	var uni = '12';
	var team = 'MICH';
	var checkname = 'ABDUR-RAHKMAN,M-A';
	var action = 'GOOD';
	var type = 'FT';
	var vscore = '78';
	var hscore = '69';

	var xml = drw.test_get_string_play_for_xml(vh, time, uni, team, checkname, action, type, vscore, hscore);

	if(xml == test_pbp) test_success("test_get_string_play_for_xml");
	else test_fail("test_get_string_play_for_xml");
}

function test_read_pbp() {
	var pbp_string = drw.test_read_pbp(file_name);
	if(pbp_string == "PBP\n" + test_pbp) test_success("test_read_pbp");
	else test_fail("test_read_pbp");
}

function test_add_pbp() {
	'<play vh="V" time="09:49" uni="13" team="MICH" checkname="WAGNER,MORITZ" action="FOUL"></play>'
	var vh = 'V';
	var time = '09:49';
	var uni = '13';
	var team = 'MICH';
	var checkname = 'WAGNER,MORITZ';
	var action = 'FOUL';

	drw.add_pbp(file_name, vh, time, uni, team, checkname, action, null, null, null);
	if(drw.test_read_pbp(file_name) == "PBP\n" + test_pbp_addition) test_success("test_add_pbp");
	else test_fail("test_add_pbp");
}
