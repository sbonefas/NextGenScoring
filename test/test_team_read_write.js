const assert = require('assert');
const trw = require('../team_read_write.js');
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
const team0_string = "name%!_a)#$d#code%!_a)#$d#stadium";
const team1_string = "name%!_a)#$d#code%!_a)#$d#u^#q@3.>{player1@i+b&*-~rplayer2@i+b&*-~rplayer3:p2$%_1=*%!_a)#$d#stadium";
const team2_string = "new_name%!_a)#$d#new_code%!_a)#$d#new_stadium";
const team3_string = "new_name%!_a)#$d#new_code%!_a)#$d#u^#q@3.>{new_player0@i+b&*-~rnew_player1@i+b&*-~rnew_player2:p2$%_1=*%!_a)#$d#new_stadium";

function get_file_path(fname) {
	return directory + fname + '.txt';
}

after(function() {
	for(var file_no = 0; file_no < file_names.length; file_no++) {
		trw.delete_file(  file_names[file_no]  );
	}
});

describe("team_read_write", function() {
	describe("Edit team directory", function() {
		it("Should return true given valid directory", function() {
			assert.strictEqual(trw.edit_team_directory(directory), true);
		});
	});
	describe("test_team_to_string", function() {
		it("should convert a team to string", function() {
			try {
				assert.strictEqual(trw.test_team_to_string(team0_content), team0_string);
				assert.strictEqual(trw.test_team_to_string(team1_content), team1_string);
		   } catch(e) {
			   console.log("   on error: '" + e + "'");
		}
		});
	});
	describe("Test_string_to_team", function() {
		it("should convert a string to team", function() {
			try {
				assert.strictEqual(trw.test_string_to_team(team0_string).toString(), team0_content.toString());
				assert.strictEqual(trw.test_string_to_team(team1_string).toString(), team1_content.toString());
			} catch(e) {
				console.log("   on error: '" + e + "'");
		  }
		});
	});
	describe("Test_string_to_team", function() {
		it("should convert a string to team", function() {
			try {
				trw.create_team(file_names[0], "test_content");
				trw.delete_file(file_names[0]);
				assert.strictEqual(!fs.existsSync(get_file_path(file_names[0])))
				} catch(e) {
				console.log("   on error: '" + e + "'");
			}
		});
	});

	describe("Test_string_to_team", function() {
		it("should convert a string to team", function() {
			try {
				trw.create_team(file_names[0], team0_content);
				trw.create_team(file_names[1], team1_content);
				assert.strictEqual(fs.existsSync(get_file_path(file_names[0])), true)
				var contents0 = fs.readFileSync(get_file_path(file_names[0]), 'utf8');
				var contents1 = fs.readFileSync(get_file_path(file_names[1]), 'utf8');
				assert.strictEqual(contents0, team0_string);
				assert.strictEqual(contents1, team1_string);
			} catch(e) {
				console.log("   on error: '" + e + "'");
			}
		});
	});

	describe("Test_string_to_team", function() {
		it("should convert a string to team", function() {
			try {
				var contents0 = trw.read_team(file_names[0]);
				var contents1 = trw.read_team(file_names[1]);
				assert.strictEqual(contents0.toString(), team0_content.toString());
	 			assert.strictEqual(contents1.toString(), team1_content.toString());
			} catch(e) {
				console.log("   on error: '" + e + "'");
			}
		});
	});

	describe("Test_string_to_team", function() {
		it("should convert a string to team", function() {
			try {
				trw.overwrite_team(file_names[0], team3_content);
				trw.overwrite_team(file_names[1], team2_content);
				var contents0 = trw.read_team(file_names[0]);
				var contents1 = trw.read_team(file_names[1]);
				assert.strictEqual(contents0.toString(), team3_content.toString());
				assert.strictEqual(contents1.toString(), team2_content.toString());
			} catch(e) {
				console.log("   on error: '" + e + "'");
			}
		});
	});

	describe("Test_string_to_team", function() {
		it("should convert a string to team", function() {
			try {
				var teams = trw.get_all_teams();
				assert.strictEqual(teams[0].toString(), trw.read_team(file_names[0]).toString());
			  assert.strictEqual(teams[1].toString(), trw.read_team(file_names[1]).toString());
			} catch(e) {
				console.log("   on error: '" + e + "'");
			}
		});
	});
});
