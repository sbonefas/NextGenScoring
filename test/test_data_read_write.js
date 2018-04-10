/**
 * TESTING FILE FOR data_read_write.js
 * type npm test to run script
 */
const assert = require('assert')
const drw = require('../data_read_write')
const fs = require('fs');

const file_name = "data_test";
const file_path = "data/data_test.txt";
const individual_stat_labels = ['number', 'fg', 'fga', 'pts'];
const team_stat_labels = ['team fouls', 'timeouts left'];
const footer = ['test', 1,'test2/test3/4', 'test5'];

/** UNIT TEST DATA */
const contents = "HOME\nnumber,fg,fga,pts\n"
        + ";AWAY\nnumber,fg,fga,pts\n"
        + ";TEAM\nteam fouls,timeouts left\n0,0\n0,0\n"
        + ";FOOTER\n" + footer.toString();
const test_stats = "HOME\nnumber,fg,fga,pts\n"
+ "30,2,4,6\n31,3,3,7\n44,5,7,12\n02,1,5,2\n"
+ ";AWAY\nnumber,fg,fga,pts\n"
+ "35,1,4,2\n36,2,3,6\n45,6,7,12\n03,4,5,8\n"
+ ";TEAM\nteam fouls,timeouts left\n"
+ "9,4\n"
+ "8,3";
const test_stats_with_footer = test_stats + "\n;FOOTER\n" + footer.toString();
const test_team_stats = "HOME\nnumber,fg,fga,pts\n30,2,4,6\n\
31,3,3,7\n44,5,7,12\n02,1,5,2";
const test_stats_array = [
  [ [ 'number', 'fg', 'fga', 'pts' ],[ '30', '2', '4', '6' ],[ '31', '3', '3', '7' ],
  	[ '44', '5', '7', '12' ],[ '02', '1', '5', '2' ] ],
  [ [ 'number', 'fg', 'fga', 'pts' ],[ '35', '1', '4', '2' ],
  	[ '36', '2', '3', '6' ],[ '45', '6', '7', '12' ],[ '03', '4', '5', '8' ] ],
  [ [ 'team fouls', 'timeouts left'],[ '9', '4'] ],
  [ [ 'team fouls', 'timeouts left'],[ '8', '3'] ],
  [ 'test', 1, 'test2/test3/4', 'test5']
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

// Merged clean and delete together
after(function() {
    drw.delete_file(file_name);
    if(fs.existsSync(file_path)) assert.fail(false, true, "Path of deleted file shouldn't exist in file system", "delete");
});

describe('data_read_write tests', function() {
   describe('get_file_path()', function() {
     it('should construct a valid file path given a file_name', function() {
       assert.strictEqual(drw.test_get_file_path(file_name), file_path);
     });
   });
   describe('create_game_file()', function() {
       assert.strictEqual(drw.create_game_file(individual_stat_labels, team_stat_labels, file_name, footer), true);
       it('should exist in the file path', function() {
          if(!fs.existsSync(file_path)) assert.fail(false, true, "Path of new file should exist in file system", "create");
       });
       it('should be able to be read', function() {
         assert.strictEqual(fs.readFileSync(file_path, 'utf8'), contents);
       });
       it('should return false if we try to recreate this file', function() {
         assert.strictEqual(drw.create_game_file(individual_stat_labels, team_stat_labels, file_name, footer), false);
       });
   });
   describe('get_initial_game_file_contents()', function() {
     it('should correctly display valid contents given stat labels', function() {
        assert.strictEqual(drw.test_get_initial_game_file_contents(individual_stat_labels, team_stat_labels, footer), contents);
     });
   });
   describe('get_game_file_contents()', function() {
     it('should have a string of the contents of a game file', function() {
        assert.strictEqual(drw.test_get_game_file_contents(file_path), contents);
     });
   });
   describe('scrape_player_stats()', function() {
     it('should properly transform a string of stats to a 2D array', function() {
        assert.strictEqual(drw.test_scrape_player_stats(test_team_stats).toString(), test_team_stats_array.toString());
     });
   });
   describe('create_2d_array()', function() {
     it('should correctly create a 2d array', function() {
       let result_array = [ [ 0, 0, 0, 0, 0, 0, 0 ],
       [ 0, 0, 0, 0, 0, 0, 0 ],
       [ 0, 0, 0, 0, 0, 0, 0 ],
       [ 0, 0, 0, 0, 0, 0, 0 ],
       [ 0, 0, 0, 0, 0, 0, 0 ] ];

       let num_rows = 5;
       let num_cols = 7;
       assert.strictEqual(drw.test_create_2d_array(num_rows, num_cols).toString(), result_array.toString());
    });
   });
   describe('read_game_file_empty()', function() {
     it('should properly read a file with labels but no stats', function() {
       let result_array = [
       [ [ 'number', 'fg', 'fga', 'pts' ] ],
         [ [ 'number', 'fg', 'fga', 'pts' ] ],
         [ [ 'team fouls', 'timeouts left' ], ['0', '0'] ],
         [ [ 'team fouls', 'timeouts left' ], ['0', '0'] ],
         [ 'test', '1', 'test2/test3/4', 'test5' ]
         ];
       assert.strictEqual(drw.read_game_file(file_name).toString(), result_array.toString());
     });
   });
   describe('edit_current_stats()', function() {
     let new_stats = drw.test_edit_current_stats(test_team_stats_array, test_stat_changes_exist);
     it('should correctly change stats if stat changes already exist and team stats are populated', function() {
        assert.strictEqual(new_stats[2].toString(), ['31', 4, 4, 9].toString());
     });
     it ('should correctly change stats if stat changes don\'t already exist and team stats are populated', function() {
       new_stats = drw.test_edit_current_stats(test_team_stats_array, test_stat_changes_no_exist);
       assert.strictEqual(new_stats.length, 6)
       assert.strictEqual(new_stats[5].toString(), ['29', 0, 1, 0].toString());
     });
     it ('should correctly change stats if stat changes don\'t already exist and team stats are empty', function() {
       new_stats = drw.test_edit_current_stats(test_empty_team_stats_array, test_stat_changes_no_exist);
       assert.strictEqual(new_stats.length, 2)
       assert.strictEqual(new_stats[1].toString(), ['29', 0, 1, 0].toString());
     });
   });
   describe('game_array_to_string()', function() {
     it('should convert the game\'s 3D array into a string', function() {
        assert.strictEqual(drw.test_game_array_to_string(test_stats_array), test_stats);
     });
   });
   describe('get_game_information_string()', function() {
      it('should get the game information from a footer and stringify it', function() {
        assert.strictEqual(drw.test_get_game_information_string(file_name), "FOOTER\n" + footer.toString(),);
      });
    });
   describe('overwrite_game_file()', function() {
      it('should overwrite the contents of a file with new contents', function() {
        let test_stats_with_footer = test_stats + "\n;FOOTER\n" + footer.toString();
        drw.test_overwrite_game_file(test_stats_with_footer, file_name);
        assert.strictEqual(drw.read_game_file(file_name).toString(), test_stats_array.toString());
      });
   });
   describe('read_game_file_full()', function() {
       it('should properly read the stats of a file that\'s been populated', function() {
         let result_array = [ [ ['number','fg','fga','pts'],
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
         [ 'test', '1', 'test2/test3/4', 'test5' ] ];
         assert.strictEqual(drw.read_game_file(file_name).toString(), result_array.toString())
      });
   });
   describe('write_player_stats_to_game_file()', function() {
       it('should write and update player stats in the game file', function() {
         let result_array = [ [ ['number','fg','fga','pts'],
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
         [ 'test', '1', 'test2/test3/4', 'test5' ] ];

         drw.write_player_stats_to_game_file(test_stat_changes_exist, file_name);
         drw.write_player_stats_to_game_file(test_stat_changes_exist, file_name);
         drw.write_player_stats_to_game_file(test_stat_changes_no_exist, file_name);
         assert.strictEqual(drw.read_game_file(file_name).toString(), result_array.toString());
      });
    });
    describe('write_team_stats_to_game_file()', function() {
        it('should write and update team stats in the game file', function() {
          let result_array = [ [ ['number','fg','fga','pts'],
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
          [ 'test', '1', 'test2/test3/4', 'test5' ] ];

          drw.write_team_stats_to_game_file([1, 1, 0], file_name);
          drw.write_team_stats_to_game_file([0, 0, -2], file_name);
          assert.strictEqual(drw.read_game_file(file_name).toString(), result_array.toString());
       });
     });
});
