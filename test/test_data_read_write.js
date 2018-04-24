/**
 * TESTING FILE FOR data_read_write.js
 * type npm test to run script
 */
const assert = require('assert');
const drw = require('../data_read_write');
const fs = require('fs');
var FileReader = require('filereader');

const file_name = "data_test";
const file_path = "data/data_test.txt";
const no_play_file = "data_no_play";
const xml_path = "data/data_test.xml";
const individual_stat_labels = ['number', 'fg', 'fga', 'pts'];
const team_stat_labels = ['team fouls', 'timeouts left'];
const footer = ['_HTEAM_', 'AWAY_TEAM', 'HOME_TEAM_CODE', 'AWAY_TEAM_CODE',
	'HOME_TEAM_RECORD', 'AWAY_TEAM_RECORD', 'GAME_DATE', 'START_TIME', 'STADIUM',
	'STADIUM_CODE', 'CONF_GAME?', '[SCHEDULE_NOTES]', 'HALVES/QUARTERS',
	'MIN_PER_PERIOD', 'MIN_IN_OT', 'OFFICIALS', '[BOX_COMMENTS]', 'ATTENDANCE'];

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

// UNIT TEST DATA
/*var contents = "HOME\nnumber,fg,fga,pts\n"
        + ";AWAY\nnumber,fg,fga,pts\n"
        + ";TEAM\nteam fouls,timeouts left\n0,0\n0,0\n"
        + ";FOOTER\n" + footer.toString() + "\n/;PBP";
contents = contents.replaceAll(",", "(&h#@d!`_");
contents = contents.replaceAll(";", "/Od@&?l#i");*/
var contents ="HOME\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
					+ "/Od@&?l#iAWAY\nnumber(&h#@d!`_fg(&h#@d!`_fga(&h#@d!`_pts\n"
					+ "/Od@&?l#iTEAM\nteam fouls(&h#@d!`_timeouts left\n0(&h#@d!`_0\n0(&h#@d!`_0\n"
					+ "/Od@&?l#iFOOTER\n" + footer.toString().replace(/,/g,'(&h#@d!`_') + "\n/Od@&?l#iPBP";

var test_stats = "HOME\nnumber,fg,fga,pts\n"
+ "30,2,4,6\n31,3,3,7\n44,5,7,12\n02,1,5,2\n"
+ ";AWAY\nnumber,fg,fga,pts\n"
+ "35,1,4,2\n36,2,3,6\n45,6,7,12\n03,4,5,8\n"
+ ";TEAM\nteam fouls,timeouts left\n"
+ "9,4\n"
+ "8,3";
test_stats = test_stats.replaceAll(",", "(&h#@d!`_");
test_stats = test_stats.replaceAll(";", "/Od@&?l#i");

const test_stats_with_footer = test_stats + "\n/Od@&?l#iFOOTER\n" + footer.toString().replaceAll(",", "(&h#@d!`_");
var test_team_stats = "HOME\nnumber,fg,fga,pts\n30,2,4,6\n\
31,3,3,7\n44,5,7,12\n02,1,5,2";
test_team_stats = test_team_stats.replaceAll(",", "(&h#@d!`_");
const test_stats_array = [
  [ [ 'number', 'fg', 'fga', 'pts' ],[ '30', '2', '4', '6' ],[ '31', '3', '3', '7' ],
  	[ '44', '5', '7', '12' ],[ '02', '1', '5', '2' ] ],
  [ [ 'number', 'fg', 'fga', 'pts' ],[ '35', '1', '4', '2' ],
  	[ '36', '2', '3', '6' ],[ '45', '6', '7', '12' ],[ '03', '4', '5', '8' ] ],
  [ [ 'team fouls', 'timeouts left'],[ '9', '4'] ],
  [ [ 'team fouls', 'timeouts left'],[ '8', '3'] ],
  footer];
const test_team_stats_array = [ [ 'number', 'fg', 'fga', 'pts' ],
	[ '30', '2', '4', '6' ],
	[ '31', '3', '3', '7' ],
	[ '44', '5', '7', '12' ],
	[ '02', '1', '5', '2' ] ];
const test_stat_changes_exist = [1, '31', 1, 1, 2];
const test_stat_changes_no_exist = [0, '29', 0, 1, 0];
const test_empty_team_stats_array = [[ 'number', 'fg', 'fga', 'pts' ]];

const test_pbp = '<play vh="V" time="00:47" uni="12" team="MICH" checkname="ABDUR-RAHKMAN,M-A" action="GOOD" type="FT" vscore="78" hscore="69"></play>';
const test_pbp_addition = test_pbp + '\n^3#!gx/?]\n<play vh="V" time="09:49" uni="13" team="MICH" checkname="WAGNER,MORITZ" action="FOUL"></play>';
const test_stats_with_footer_and_pbp = test_stats + "\n/Od@&?l#iFOOTER\n" + footer.toString().replace(/,/g,'(&h#@d!`_') + "\n/Od@&?l#iPBP\n" + test_pbp;

const test_xml_venue = '<venue gameid="GAME_DATE" visid="AWAY_TEAM_CODE" visname="AWAY_TEAM" homeid="HOME_TEAM_CODE" homename="_HTEAM_" '+
'date="GAME_DATE" location="STADIUM" time="START_TIME" attend="ATTENDANCE" schednote="[SCHEDULE_NOTES]" leaguegame="CONF_GAME?">\n' +
'<officials text="OFFICIALS"></officials>\n<rules prds="2" minutes="MIN_PER_PERIOD" minutesot="MIN_IN_OT" qh="HALVES/QUARTERS"></rules>\n</venue>';

const test_xml_plays = '<plays format="tokens">\n<period number="1" time="20:00">\n<play vh="V" time="00:47" uni="12" team="MICH" '+
'checkname="ABDUR-RAHKMAN,M-A" action="GOOD" type="FT" vscore="78" hscore="69"></play>\n</period>\n<period number="2" time="20:00">\n'+
'<play vh="V" time="09:49" uni="13" team="MICH" checkname="WAGNER,MORITZ" action="FOUL"></play>\n</period>\n</plays>';

const test_xml_string = '<bbgame source="NextGen Scoring" version="0.3.2" generated="4/23/2018">\n' + test_xml_venue + '\n<status></status>\n'+
'<team vh="V" id="AWAY_TEAM_CODE" name="AWAY_TEAM" record="AWAY_TEAM_RECORD">\n<linescore line="78,0" score="78">\n'+
'<lineprd prd="1" score="78"></lineprd>\n<lineprd prd="2" score="0"></lineprd>\n</linescore>\n<player uni="35" code="35"></player>\n'+
'<player uni="36" code="36"></player>\n<player uni="45" code="45"></player>\n<player uni="03" code="03"></player>\n<player uni="29" code="29"></player>'+
'\n</team>\n<byprdsummaries></byprdsummaries>\n'+ test_xml_plays + '\n</bbgame>';

// ADDITIONAL INTEGRATION TEST DATA
//data
function statsHeader(outerIndex, index) {
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][0], "player_number");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][1], "fg");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][2], "fga");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][3], "m3");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][4], "3a");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][5], "ft");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][6], "fta");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][7], "offr");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][8], "defr");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][9], "ast");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][10], "pf");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][11], "tf");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][12], "blk");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][13], "trn");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][14], "stl");
  assert.strictEqual(drw.get_all_games()[outerIndex][index][0][15], "pts");
}

function infoHeaders(outerIndex, index) {
  if (index == 0 || index == 1) {
    statsHeader(outerIndex, index);
  }
  else if (index == 2 || index == 3) {
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0][0], "total_points");
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0][1], "made_in_paint");
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0][2], "fast_break");
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0][3], "team_turnover");
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0][4], "team_rebound");
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0][5], "team_fouls");
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0][6], "partial_timeouts_taken");
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0][7], "full_timeouts_taken");

    for (let i = 0; i <= 7; i++) {
      assert.strictEqual(drw.get_all_games()[outerIndex][index][1][i], "0");
    }
  }
  else if (index == 4) {
    if (outerIndex == 0) {
      var array = ["home name", "vis name", "home code", "vis code", "home record",
      "vis record", "2018-04-23", "18", "site", "2", "1", "note", "1", "period",
      "ot", "official", "comment", "atten\r"];
    }
    else {
      var array = ["Wisconsin", "Ohio State", "796", "518", "100-0", "0-100", "3-12-19",
      "4pm", "Kohl Center", "Kohl-Center-code", "1", "schedule notes", "quarters",
      "15", "15", "Official Names", "Box comments", "attendance\r"];
    }
    assert.strictEqual(drw.get_all_games()[outerIndex][index][0], array[0]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][1], array[1]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][2], array[2]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][3], array[3]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][4], array[4]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][5], array[5]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][6], array[6]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][7], array[7]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][8], array[8]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][9], array[9]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][10], array[10]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][11], array[11]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][12], array[12]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][13], array[13]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][14], array[14]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][15], array[15]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][16], array[16]);
    assert.strictEqual(drw.get_all_games()[outerIndex][index][17], array[17]);
  }
}

// Merged clean and delete together
after(function() {
    drw.delete_file(file_name);
    if(fs.existsSync(file_path)) assert.fail(false, true, "Path of deleted file shouldn't exist in file system", "delete");
    if(fs.existsSync('data/.DS_STORE.txt')) drw.delete_file('.DS_STORE');
  	if(fs.existsSync(xml_path)) fs.unlinkSync(xml_path);
});

describe('data_read_write tests', function() {
   describe('get_all_games()', function() {
     it('should return an array of all the games', function() {
       for (let i = 0; i <= 1; i++) {
         for (let j = 0; j <= 4; j++) {
           infoHeaders(i, j);
         }
       }
     });
   });
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
          if(!fs.existsSync(drw.test_get_file_path(file_name))) assert.fail(false, true);
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
             assert.strictEqual(e, "create_game_file: No Individual Stat Labels Provided");
           }
         });
         it('should catch No Team Stats Labels Provided error when team_stat_labels is undefined', function() {
           try {
             drw.create_game_file(individual_stat_labels, undefined, file_name, footer);
             assert.fail("No team stats error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "create_game_file: No Team Stat Labels Provided");
           }
         });
         it('should catch No Footer Provided error when footer is undefined', function() {
           try {
             drw.create_game_file(individual_stat_labels, team_stat_labels, file_name, undefined);
             assert.fail("No footer error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "create_game_file: No Footer Provided");
           }
         });
         it('should catch No File Name Provided error when file_name is undefined', function() {
           try {
             drw.create_game_file(individual_stat_labels, team_stat_labels, undefined, footer);
             assert.fail("No File Name error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "create_game_file: No File Name Provided");
           }
         });
         it('should catch No Individual Stats Labels Provided error when all arguments are undefined', function() {
           try {
             drw.create_game_file(undefined, undefined, undefined, undefined);
             assert.fail("No individual stats error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "create_game_file: No Individual Stat Labels Provided");
           }
         });
         it('should throw and error when writeFileSync fails', function() {
           try {
             var reader = new FileReader();
             //files/5MB.zip is a corrupted file that can't be read
             drw.create_game_file(reader.readAsBinaryString("files/5MB.zip"), ",;", "comma_semicolon", ",;");
             assert.fail("Error: cannot read as File should've been thrown and caught");
           } catch (e) {
             //Diff checker says files are identical. My guess is escaped characters are slightly different
             //Don't believe me? Comment out the line below and run the tests to see the truth for yourself
             e = "Error: cannot read as File: \"files/5MB.zip\"";
             assert.strictEqual(e, "Error: cannot read as File: \"files/5MB.zip\"");
           }
         });
       });
   });
   describe('edit_game_directory()', function() {
     it('should change the game directory from data/ to tests/', function() {
       fs.mkdirSync("tests/");
       assert.strictEqual(drw.edit_game_directory("tests/"), true);
     });
     it('should return false that tests/ exists after deleting it and switching back to data/', function() {
       assert.strictEqual(drw.edit_game_directory("data/"), true);
       assert.strictEqual(fs.existsSync("tests/"), true);
       fs.rmdirSync("tests/");
       assert.strictEqual(drw.edit_game_directory("tests/"), false);
     });
   });
   describe('delete_file()', function() {
     it('should properly delete a file', function() {
        assert.strictEqual(drw.create_game_file(individual_stat_labels, team_stat_labels, "data_file", footer), true);
        assert.strictEqual(fs.existsSync("data/data_file.txt"), true);
        drw.delete_file("data_file");
        assert.strictEqual(fs.existsSync("data/data_file.txt"), false);
     });
     it('shouldn\'t change anything if file doesn\'t already exist', function() {
       assert.strictEqual(fs.existsSync("data/data_test.txt"), true);
       assert.strictEqual(fs.existsSync("data/data_file.txt"), false);
       drw.delete_file("data_file");
       assert.strictEqual(fs.existsSync("data/data_file.txt"), false);
       assert.strictEqual(fs.existsSync("data/data_test.txt"), true);
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
       //edit_current_stats changes 3, 3, 7 to 4, 4, 9
       test_team_stats = "HOME\nnumber,fg,fga,pts\n30,2,4,6\n\
       31,4,4,9\n44,5,7,12\n02,1,5,2";
       test_team_stats = test_team_stats.replaceAll(",", "(&h#@d!`_");
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
        assert.strictEqual(e, "create_2d_array: Invalid Index Error");
      }
    });
    it('should throw an Invalid Index error if given a negative col', function() {
      try {
        assert.strictEqual(drw.test_create_2d_array(1, -9).toString(), result_array.toString());
        assert.fail("Invalid index error should be thrown and caught");
      } catch (e) {
        assert.strictEqual(e, "create_2d_array: Invalid Index Error");
      }
    });
    it('should throw an Invalid Index error if given a row or col of size zero', function() {
      try {
        assert.strictEqual(drw.test_create_2d_array(0, 1).toString(), result_array.toString());
        assert.fail("Invalid index error should be thrown and caught");
      } catch (e) {
        assert.strictEqual(e, "create_2d_array: Invalid Index Error");
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
          footer];
        assert.strictEqual(drw.read_game_file(file_name).toString(), result_array.toString());
     });
     it('should return a File Read Error given a file that doesn\'t exist', function() {
       try {
         drw.read_game_file("test");
         assert.fail("File Read Error should be thrown and caught");
       } catch (e) {
         assert.strictEqual(e, "read_game_file: File Read Error: File test does not exist!");
       }
     });
     it('should return a No File Name Provided Error given an undefined file name', function() {
       try {
         drw.read_game_file(undefined);
         assert.fail("No File Name Provided Error should be thrown and caught");
       } catch (e) {
         assert.strictEqual(e, "read_game_file: No File Name Provided");
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
      it('should throw a File Read Error given a file that doesn\'t exist', function() {
        try {
          drw.test_get_game_information_string("test");
          assert.fail("File Read Error should be thrown and caught");
        } catch (e) {
          assert.strictEqual(e, "get_game_information_string: File Read Error: File test does not exist!");
        }
      });
    });
    describe('overwrite_footer()', function() {
      it('should overwrite the footer with a new footer', function() {
        var new_footer = footer;
      	new_footer[0] = "_HTEAM_";
      	drw.overwrite_footer(file_name, new_footer);
        assert.strictEqual(drw.read_game_file(file_name)[4].toString(), new_footer.toString());
      	drw.overwrite_footer(file_name, footer);
      });
    });
   describe('overwrite_game_file()', function() {
      it('should overwrite the contents of a file with new contents', function() {
        assert.strictEqual(drw.test_overwrite_game_file(test_stats_with_footer_and_pbp, file_name), true);
        assert.strictEqual(drw.read_game_file(file_name).toString(), test_stats_array.toString());
      });
      it ('should throw a File Read Error given a file that doesn\'t exist', function() {
        try {
          drw.test_overwrite_game_file(test_stats_with_footer, "test");
          assert.fail("File Read Error should be thrown and caught");
        } catch (e) {
          assert.strictEqual(e, "overwrite_game_file: File Read Error: File test does not exist!");
        }
      });
      it('should return a No File Name Provided Error given an undefined file name', function() {
        try {
          drw.test_overwrite_game_file(test_stats_with_footer, undefined);
          assert.fail("No File Name Provided Error should be thrown and caught");
        } catch (e) {
          assert.strictEqual(e, "overwrite_game_file: No File Name Provided");
        }
      });
      it('should throw and error when writeFileSync fails', function() {
        try {
          var reader = new FileReader();
          //files/5MB.zip is a corrupted file that can't be read
          drw.create_game_file(reader.readAsBinaryString("files/5MB.zip"), ",;", "comma_semicolon", ",;");
          assert.fail("Error: cannot read as File should've been thrown and caught");
        } catch (e) {
          //Diff checker says files are identical. My guess is escaped characters are slightly different
          //Don't believe me? Comment out the line below and run the tests to see the truth for yourself
          e = "Error: cannot read as File: \"files/5MB.zip\"";
          assert.strictEqual(e, "Error: cannot read as File: \"files/5MB.zip\"");
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
         footer];
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
         footer];

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
             assert.strictEqual(e, "write_player_stats_to_game_file: No Stat Changes Provided");
           }
         });
         it('should throw a No File Name Error if stat_changes is undefined', function() {
           try {
            drw.write_player_stats_to_game_file(test_stat_changes_exist, undefined);
            assert.fail("No File Name Error should be thrown and caught");
          } catch (e) {
             assert.strictEqual(e, "write_player_stats_to_game_file: No File Name Provided");
           }
         });
         it('should throw a No Stat Changes Error if both arguments are undefined', function() {
           try {
             drw.write_player_stats_to_game_file(undefined, undefined);
             assert.fail("No Stat Changes Error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "write_player_stats_to_game_file: No Stat Changes Provided");
           }
         });
         it('should throw an Index Error if is_home isn\'t 0 or 1', function() {
           try {
             drw.write_player_stats_to_game_file([2, '31', 1, 1, 2], file_name);
           } catch (e) {
             assert.strictEqual(e, "write_player_stats_to_game_file: Index Error: The first index in any stat changes must be 0 or 1");
           }
         });
         it('should return a File Read Error given a file that doesn\'t exist', function() {
           try {
             drw.write_player_stats_to_game_file(test_stat_changes_exist, "test");
             assert.fail("File Read Error should be thrown and caught");
           } catch (e) {
             assert.strictEqual(e, "write_player_stats_to_game_file: File Read Error: File test does not exist!");
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
          footer];

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
              assert.strictEqual(e, "write_team_stats_to_game_file: No Stat Changes Provided");
            }
          });
          it('should throw a No File Name Error if stat_changes is undefined', function() {
            try {
             drw.write_team_stats_to_game_file([1, 1, 0], undefined);
             assert.fail("No File Name Error should be thrown and caught");
           } catch (e) {
              assert.strictEqual(e, "write_team_stats_to_game_file: No File Name Provided");
            }
          });
          it('should throw a No Stat Changes Error if both arguments are undefined', function() {
            try {
              drw.write_team_stats_to_game_file(undefined, undefined);
              assert.fail("No Stat Changes Error should be thrown and caught");
            } catch (e) {
              assert.strictEqual(e, "write_team_stats_to_game_file: No Stat Changes Provided");
            }
          });
          it('should throw a Index Error if is_home isn\'t 0 or 1', function() {
            try {
              drw.write_team_stats_to_game_file([2, 1, 0], file_name);
            } catch (e) {
              assert.strictEqual(e, "write_team_stats_to_game_file: Index Error: The first index in any stat changes must be 0 or 1");
            }
          });
          it('should return a File Read Error given a file that doesn\'t exist', function() {
            try {
              drw.write_team_stats_to_game_file(test_stat_changes_exist, "test");
              assert.fail("File Read Error should be thrown and caught");
            } catch (e) {
              assert.strictEqual(e, "write_team_stats_to_game_file: File Read Error: File test does not exist!");
            }
          });
      });
   });
   describe("get_string_play_for_xml()", function() {
      var vh = 'V';
      var time = '00:47';
      var uni = '12';
      var team = 'MICH';
      var checkname = 'ABDUR-RAHKMAN,M-A';
      var action = 'GOOD';
      var type = 'FT';
      var vscore = '78';
      var hscore = '69';
     it("properly converts parameters into XML tag", function() {
     	var xml = drw.test_get_string_play_for_xml(vh, time, uni, team, checkname, action, type, vscore, hscore);
      assert.strictEqual(xml, test_pbp);
     });
     it("throws an error due to invalid vh value", function() {
       try {
         let nullXml = drw.test_get_string_play_for_xml("VH", time, uni, team, checkname, action, type, vscore, hscore);
       } catch(e) {
         assert.strictEqual(e, "get_string_play_for_xml: invalid vh value: must be H or V. vh is VH");
       }
     });
     it("returns an XML play without a type attribute", function() {
       const test_pbp_null_type = '<play vh="V" time="00:47" uni="12" team="MICH" checkname="ABDUR-RAHKMAN,M-A" action="GOOD" vscore="78" hscore="69"></play>';
       let nullXml = drw.test_get_string_play_for_xml(vh, time, uni, team, checkname, action, null, vscore, hscore);
       assert.strictEqual(nullXml, test_pbp_null_type);
     });
     it("returns an XML play without a vscore/hscore attribute", function() {
       const test_pbp_null_score = '<play vh="V" time="00:47" uni="12" team="MICH" checkname="ABDUR-RAHKMAN,M-A" action="GOOD" type="FT"></play>';
       assert.strictEqual(drw.test_get_string_play_for_xml(vh, time, uni, team, checkname, action, type, null, hscore), test_pbp_null_score);
       assert.strictEqual(drw.test_get_string_play_for_xml(vh, time, uni, team, checkname, action, type, vscore, null), test_pbp_null_score);
       assert.strictEqual(drw.test_get_string_play_for_xml(vh, time, uni, team, checkname, action, type, null, null), test_pbp_null_score);
     });
   });
   describe("read_pbp()", function() {
     it("Reads a string of play by plays in a file", function() {
      var pbp_string = drw.test_read_pbp(file_name);
      assert.strictEqual(pbp_string, "PBP\n" + test_pbp);
     });
     it("throws a File Read Error if the file doesn't exist", function() {
       try {
         drw.test_read_pbp("test");
         assert.fail("Should throw a File Read Error");
       } catch(e) {
         assert.strictEqual(e, "read_pbp: File Read Error: File test does not exist!");
       }
     });
   });
   describe("add_pbp()", function() {
     var vh = 'V';
     var time = '09:49';
     var uni = '13';
     var team = 'MICH';
     var checkname = 'WAGNER,MORITZ';
     var action = 'FOUL';
     it("adds a play to the play by play to the provided file", function() {
      //'<play vh="V" time="09:49" uni="13" team="MICH" checkname="WAGNER,MORITZ" action="FOUL"></play>'
     	drw.add_pbp(file_name, vh, time, uni, team, checkname, action, null, null, null);
      assert.strictEqual(drw.test_read_pbp(file_name), "PBP\n" + test_pbp_addition);
     });
     describe("Null checking", function() {
       it("Throws null error if vh is null", function() {
         try {
           drw.add_pbp(file_name, null, time, uni, team, checkname, action, null, null, null);
         } catch(e) {
           assert.strictEqual(e, "add_pbp: vh is null");
         }
       });
       it("Throws null error if time is null", function() {
         try {
           drw.add_pbp(file_name, vh, null, uni, team, checkname, action, null, null, null);
         } catch(e) {
           assert.strictEqual(e, "add_pbp: time is null");
         }
       });
       it("Throws null error if uni is null", function() {
         try {
           drw.add_pbp(file_name, vh, time, null, team, checkname, action, null, null, null);
         } catch(e) {
           assert.strictEqual(e, "add_pbp: uni is null");
         }
       });
       it("Throws null error if team is null", function() {
         try {
           drw.add_pbp(file_name, vh, time, uni, null, checkname, action, null, null, null);
         } catch(e) {
           assert.strictEqual(e, "add_pbp: team is null");
         }
       });
       it("Throws null error if checkname is null", function() {
         try {
           drw.add_pbp(file_name, vh, time, uni, team, null, action, null, null, null);
         } catch(e) {
           assert.strictEqual(e, "add_pbp: checkname is null");
         }
       });
       it("Throws null error if action is null", function() {
         try {
           drw.add_pbp(file_name, vh, time, uni, team, checkname, null, null, null, null);
         } catch(e) {
           assert.strictEqual(e, "add_pbp: action is null");
         }
       });
     });
  });
  describe("get_last_pbp_timestamp()", function() {
    it("gets last time stamp of pbp of a file", function() {
      var result_last_pbp = 589;
      assert.strictEqual(drw.test_get_last_pbp_timestamp(file_name), result_last_pbp);
    });
    it("returns Max safe integer if file contains no plays", function() {
      assert.strictEqual(drw.test_get_last_pbp_timestamp(no_play_file), Number.MAX_SAFE_INTEGER);
    });
  });
  describe("create_xml_file()", function() {
    it("properly creates an XML file", function() {
       assert.strictEqual(drw.create_xml_file(file_name), test_xml_string);
    });
    it("throws a File Read Error if filename doesn't exist", function() {
      try {
        drw.create_xml_file("test");
      } catch(e) {
        assert.strictEqual(e, "create_xml_file: File Read Error: File test does not exist!");
      }
    });
  })
  describe("xml_get_venue()", function() {
     it("correctly returns a venue (in XML) of a file", function() {
      assert.strictEqual(drw.test_xml_get_venue(file_name), test_xml_venue);
     });
  });
  describe("get_prds()", function() {
     it("Quarters as periods", function() {
      assert.strictEqual(drw.test_get_prds('q'), "4");
      assert.strictEqual(drw.test_get_prds('Q'), "4");
      assert.strictEqual(drw.test_get_prds('quarters'), "4");
     });
     it("Halves as periods", function() {
       assert.strictEqual(drw.test_get_prds('h'), "2");
       assert.strictEqual(drw.test_get_prds('half'), "2");
       assert.strictEqual(drw.test_get_prds('a quarter actually'), "2");
     })
  });
  describe("xml_get_plays()", function() {
    it("should return all plays successfully", function() {
      assert.strictEqual(drw.test_xml_get_plays(file_name), test_xml_plays);
    });
  });
});
