/**
 * TESTING FILE FOR data_read_write.js
 * type npm test to run script
 */
const assert = require('assert');
const drw = require('../data_read_write');
const fs = require('fs');

const file_name = "data_test";
const file_path = "data/data_test.txt";
const individual_stat_labels = ['number', 'fg', 'fga', 'pts'];
const team_stat_labels = ['team fouls', 'timeouts left'];

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

var footer = ['test', 1,'test2/test3/4', 'test5'];
/** UNIT TEST DATA */
var contents = "HOME\nnumber,fg,fga,pts\n"
        + ";AWAY\nnumber,fg,fga,pts\n"
        + ";TEAM\nteam fouls,timeouts left\n0,0\n0,0\n"
        + ";FOOTER\n" + footer.toString();
contents = contents.replaceAll(",", "(&h#@d!`_");
contents = contents.replaceAll(";", "/Od@&?l#i");

var test_stats = "HOME\nnumber,fg,fga,pts\n"
+ "30,2,4,6\n31,3,3,7\n44,5,7,12\n02,1,5,2\n"
+ ";AWAY\nnumber,fg,fga,pts\n"
+ "35,1,4,2\n36,2,3,6\n45,6,7,12\n03,4,5,8\n"
+ ";TEAM\nteam fouls,timeouts left\n"
+ "9,4\n"
+ "8,3";
test_stats = test_stats.replaceAll(",", "(&h#@d!`_");
test_stats = test_stats.replaceAll(";", "/Od@&?l#i");

const test_stats_with_footer = test_stats + "\n;FOOTER\n" + footer.toString().replaceAll(",", "(&h#@d!`_");
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
    // Tests invoking program are creating these files. Remove when proper behavior is simulated
    drw.delete_file("test");
    drw.delete_file("undefined");
});

describe('data_read_write tests', function() {
   describe('get_file_path()', function() {
     it('should construct a valid file path given a file_name', function() {
       assert.strictEqual(drw.test_get_file_path(file_name), file_path);
     });
     // A strange edge case I still wanted to add
     it ('should construct a valid file path given a file_name with 2 .txts', function() {
       assert.strictEqual(drw.test_get_file_path(file_name+".txt"), file_path+".txt");
     });
   });
   describe('create_game_file()', function() {
       it ('should return true after creating the file', function() {
         assert.strictEqual(drw.create_game_file(individual_stat_labels, team_stat_labels, file_name, footer), true);
       });
       it('after creation, file path should exist in the file system', function() {
          if(!fs.existsSync(file_path)) assert.fail(false, true);
       });
       it('should be able to be read', function() {
         assert.strictEqual(fs.readFileSync(file_path, 'utf8'), contents);
       });
       it('should return false if we try to recreate this file', function() {
         assert.strictEqual(drw.create_game_file(individual_stat_labels, team_stat_labels, file_name, footer), false);
       });
       describe('Error handling', function() {
         it('should catch No Individual Stats Labels Provided error when individual_stat_labels is undefined', function() {
           try {
             drw.create_game_file(undefined, team_stat_labels, file_name, footer)
             assert.fail("No individual stats error should be caught");
           } catch (e) {
             assert.strictEqual(e, "No Individual Stat Labels Provided");
           }
         });
         it('should catch No Team Stats Labels Provided error when team_stat_labels is undefined', function() {
           try {
             drw.create_game_file(individual_stat_labels, undefined, file_name, footer);
             assert.fail("No team stats error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "No Team Stat Labels Provided");
           }
         });
         it('should catch No Footer Provided error when footer is undefined', function() {
           try {
             drw.create_game_file(individual_stat_labels, team_stat_labels, file_name, undefined);
             assert.fail("No footer error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "No Footer Provided");
           }
         });
         it('should catch No File Name Provided error when file_name is undefined', function() {
           try {
             drw.create_game_file(individual_stat_labels, team_stat_labels, undefined, footer);
             assert.fail("No File Name error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "No File Name Provided");
           }
         });
         it('should catch No Individual Stats Labels Provided error when all arguments are undefined', function() {
           try {
             drw.create_game_file(undefined, undefined, undefined, undefined);
             assert.fail("No individual stats error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "No Individual Stat Labels Provided");
           }
         });
         //TODO - Test if .txt?
         it('should return false when writeSync fails', function() {
           //TODO - Somehow cause writeSync to fail with a newly created file
           assert.fail("Don't know how to test this as of now!");
         });
       });
   });
   describe('get_initial_game_file_contents()', function() {
     it('should correctly display valid contents given stat labels', function() {
        assert.strictEqual(drw.test_get_initial_game_file_contents(individual_stat_labels, team_stat_labels, footer), contents);
     });
   });
   describe('get_game_file_contents()', function() {
     it('should return a string of the contents given a valid file path', function() {
        assert.strictEqual(drw.test_get_game_file_contents(file_path), contents);
     });
     it('should return null given an invalid file path', function() {
        assert.strictEqual(drw.test_get_game_file_contents("data/data"), null);
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
    it('should throw an Invalid Index error if given a negative row', function() {
      try {
        assert.strictEqual(drw.test_create_2d_array(-1, 9).toString(), result_array.toString());
        assert.fail("Invalid index error should be thrown and caught");
      } catch (e) {
        assert.strictEqual(e, "Invalid Index Error");
      }
    });
    it('should throw an Invalid Index error if given a negative col', function() {
      try {
        assert.strictEqual(drw.test_create_2d_array(1, -9).toString(), result_array.toString());
        assert.fail("Invalid index error should be thrown and caught");
      } catch (e) {
        assert.strictEqual(e, "Invalid Index Error");
      }
    });
    it('should throw an Invalid Index error if given a row or col of size zero', function() {
      try {
        assert.strictEqual(drw.test_create_2d_array(0, 1).toString(), result_array.toString());
        assert.fail("Invalid index error should be thrown and caught");
      } catch (e) {
        assert.strictEqual(e, "Invalid Index Error");
      }
    });
   });
   describe('read_game_file (empty)', function() {
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
     it('should return a No File Name Error given an invalid file_name', function() {
       try {
         drw.read_game_file("test");
         assert.fail("No File Name Error should be thrown and caught");
       } catch (e) {
         assert.strictEqual(e, "No File Name Error: File test does not exist!");
       }
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
        assert.strictEqual(drw.test_get_game_information_string(file_name), "FOOTER\n" + footer.toString().replaceAll(",", "(&h#@d!`_"));
      });
    });
   describe('overwrite_game_file()', function() {
      it('should overwrite the contents of a file with new contents', function() {
        assert.strictEqual(drw.test_overwrite_game_file(test_stats_with_footer, file_name), true);
        assert.strictEqual(drw.read_game_file(file_name).toString(), test_stats_array.toString());
      });
      it ("should return false if file_name doesn't exist", function() {
        try {
          assert.strictEqual(drw.test_overwrite_game_file(test_stats_with_footer, "test"), false);
          assert.fail("File Doesn't Exist Error should be thrown and caught");
        } catch (e) {
          assert.strictEqual(e, "File Doesn't Exist Error: File test does not exist!");
        }
      });
   });
   describe('read_game_file (full)', function() {
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
      describe('Error handling', function() {
         it('should throw a No Stat Changes Error if stat_changes is undefined', function() {
           try {
             drw.write_player_stats_to_game_file(undefined, file_name);
             assert.fail("No Stat Changes Error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "No Stat Changes Provided");
           }
         });
         it('should throw a No File Name Error if stat_changes is undefined', function() {
           try {
            drw.write_player_stats_to_game_file(test_stat_changes_exist, undefined);
            assert.fail("No File Name Error should be thrown and caught");
          } catch (e) {
             assert.strictEqual(e, "No File Name Provided");
           }
         });
         it('should throw a No Stat Changes Error if both arguments are undefined', function() {
           try {
             drw.write_player_stats_to_game_file(undefined, undefined);
             assert.fail("No Stat Changes Error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "No Stat Changes Provided");
           }
         });
         it('should throw a First Index Error if is_home isn\'t 0 or 1', function() {
           assert.fail("Don't know how to do this")
         });
         it('should throw a No File Name Error if an invalid file name is passed', function() {
           try {
             drw.write_player_stats_to_game_file(test_stat_changes_exist, "test");
             assert.fail("No File Name Error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "No File Name Provided");
           }
         });
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
       describe('Error handling', function() {
          it('should throw a No Stat Changes Error if stat_changes is undefined', function() {
            try {
              drw.write_team_stats_to_game_file(undefined, file_name);
              assert.fail("No Stat Changes Error should be thrown and caught");
            } catch (e) {
              assert.strictEqual(e, "No Stat Changes Provided");
            }
          });
          it('should throw a No File Name Error if stat_changes is undefined', function() {
            try {
             drw.write_team_stats_to_game_file([1, 1, 0], undefined);
             assert.fail("No File Name Error should be thrown and caught");
           } catch (e) {
              assert.strictEqual(e, "No File Name Provided");
            }
          });
          it('should throw a No Stat Changes Error if both arguments are undefined', function() {
            try {
              drw.write_team_stats_to_game_file(undefined, undefined);
              assert.fail("No Stat Changes Error should be thrown and caught");
            } catch (e) {
              assert.strictEqual(e, "No Stat Changes Provided");
            }
          });
          it('should throw a First Index Error if is_home isn\'t 0 or 1', function() {
            assert.fail("Don't know how to do this")
          });
          it('should throw a No File Name Error if an invalid file name is passed', function() {
            try {
              drw.write_team_stats_to_game_file(test_stat_changes_exist, "test");
              assert.fail("No File Name Error should be thrown and caught");
            } catch (e) {
              assert.strictEqual(e, "No File Name Provided");
            }
          });
      });
   });
});
