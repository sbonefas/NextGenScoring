const Application = require('spectron').Application
const assert = require('assert')
const drw = require('../data_read_write')
const fs = require('fs')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
/*	test_get_file_path();
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
	test_overwrite_game_file();
	test_read_game_file_full();
	test_write_to_game_file();*/

const file_name = "data_test";
const file_path = "data/data_test.txt";

describe('data_read_write tests', function() {
   let labels = ['number', 'fg', 'fga', 'pts'];
   let contents = "HOME\nnumber,fg,fga,pts\n;AWAY\nnumber,fg,fga,pts";
   describe('get_file_path()', function() {
     it('should construct a valid file path given a file_name', function() {
       assert.equal(drw.test_get_file_path(file_name), file_path);
     });
   });
   describe('create_file()', function() {
     /*it('should construct a new file with initial game contents', function() {
       assert.equal(drw.create_game_file(labels, file_name), true);
       let result = drw.create_game_file(labels, file_name);
       assert.fail(result, false)
     });*/
   });
});
