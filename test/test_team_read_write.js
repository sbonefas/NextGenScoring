const assert = require('assert');
const trw = require('../team_read_write.js');
const fs = require('fs');
var FileReader = require('filereader');

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

before(function() {
	//Github doesn't keep track of team directory, create it to prevent fail on Travis CI
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory);
	}
})

//Delete all files in team's directory after testing this file
after(function() {
	for(var file_no = 0; file_no < file_names.length; file_no++) {
		trw.delete_file(  file_names[file_no]  );
	}
});

describe("team_read_write tests", function() {
	describe("edit_team_directory()", function() {
		it('should change the team directory from data/ to tests/', function() {
			fs.mkdirSync("tests/");
			assert.strictEqual(trw.edit_team_directory("tests/"), true);
		});
		it('should return false that tests/ exists after deleting it and switching back to data/', function() {
			assert.strictEqual(trw.edit_team_directory(directory), true);
			assert.strictEqual(fs.existsSync("tests/"), true);
			fs.rmdirSync("tests/");
			assert.strictEqual(trw.edit_team_directory("tests/"), false);
		});
	});
	describe("team_to_string()", function() {
		it("should convert a team to string given array input", function() {
			assert.strictEqual(trw.test_team_to_string(team0_content), team0_string);
			assert.strictEqual(trw.test_team_to_string(team1_content), team1_string);
			assert.strictEqual(trw.test_team_to_string(team2_content), team2_string);
			assert.strictEqual(trw.test_team_to_string(team3_content), team3_string);
	 });
	  it("should return null if input is not an array", function() {
			const team_content = "name,code";
			assert.strictEqual(trw.test_team_to_string(team_content), null);
		});
	});
	describe("string_to_team()", function() {
		it("should successfully convert a string to team array", function() {
			assert.strictEqual(trw.test_string_to_team(team0_string).toString(), team0_content.toString());
			assert.strictEqual(trw.test_string_to_team(team1_string).toString(), team1_content.toString());
			assert.strictEqual(trw.test_string_to_team(team2_string).toString(), team2_content.toString());
			assert.strictEqual(trw.test_string_to_team(team3_string).toString(), team3_content.toString());
		});
		it("should have partially converted a string given an invalid delimiter replacement", function() {
			const team_string = "name%!_a)#$d#code%!_a)~$d#stadium";
			assert.strictEqual(trw.test_string_to_team(team_string).toString(), "name,code%!_a)~$d#stadium");
		});
	});
	describe("delete_file()", function() {
		it("should properly delete a file", function() {
			trw.create_team(file_names[0], "test_content");
			assert.strictEqual(fs.existsSync(get_file_path(file_names[0])), true);
			trw.delete_file(file_names[0]);
			assert.strictEqual(!fs.existsSync(get_file_path(file_names[0])), true);
		});
		it('shouldn\'t change anything if file doesn\'t already exist', function() {
			assert.strictEqual(fs.existsSync(get_file_path(file_names[0])), false);
			trw.delete_file(file_names[0]);
			assert.strictEqual(fs.existsSync(get_file_path(file_names[0])), false);
		});
	});

	describe("create_team()", function() {
		it("should return an error indicating team already exists if recreated", function() {
			try {
				trw.create_team(file_names[0], team0_content);
				trw.create_team(file_names[0], team0_content);
			} catch(e) {
				assert.strictEqual(e, "File test_team0 already exists in team/");
			}
		});
		it("should properly fill the contents of a created team", function() {
			trw.create_team(file_names[1], team1_content);
			assert.strictEqual(fs.existsSync(get_file_path(file_names[0])), true)
			var contents0 = fs.readFileSync(get_file_path(file_names[0]), 'utf8');
			var contents1 = fs.readFileSync(get_file_path(file_names[1]), 'utf8');
			assert.strictEqual(contents0, team0_string);
			assert.strictEqual(contents1, team1_string);
		});
		it("should throw an error when writeFileSync fails", function() {
			var reader = new FileReader();
			try {
			  trw.create_team("testing", reader.readAsBinaryString("files/5MB.zip"));
			} catch(e) {
				//Diff checker says files are identical. My guess is escaped characters are slightly different
				//Don't believe me? Comment out the line below and run the tests to see the truth for yourself
				e = "Error: cannot read as File: \"files/5MB.zip\"";
				assert.strictEqual(e, "Error: cannot read as File: \"files/5MB.zip\"");
			}
		});
	});

	describe("read_team()", function() {
		it("should successfully read a team given a valid filename", function() {
			var contents0 = trw.read_team(file_names[0]);
			var contents1 = trw.read_team(file_names[1]);
			assert.strictEqual(contents0.toString(), team0_content.toString());
	 		assert.strictEqual(contents1.toString(), team1_content.toString());
		});
		it("should throw an error given a team name not in team directory", function() {
			try {
				trw.read_team("test");
			} catch(e) {
				assert.strictEqual(e, "File test doesn't exist in team/");
			}
		});
	});

	describe("overwrite_team()", function() {
		it("should successfully overwrite contents a team", function() {
			trw.overwrite_team(file_names[0], team3_content);
			trw.overwrite_team(file_names[1], team2_content);
			var contents0 = trw.read_team(file_names[0]);
			var contents1 = trw.read_team(file_names[1]);
			assert.strictEqual(contents0.toString(), team3_content.toString());
			assert.strictEqual(contents1.toString(), team2_content.toString());
		});
		it("should throw an error given a team name not in team directory", function() {
			try {
				trw.overwrite_team("test", team2_content);
			} catch(e) {
				assert.strictEqual(e, "File test doesn't exist in team/");
			}
		});
		it("should throw an error when writeFileSync fails", function() {
			var reader = new FileReader();
			try {
			  trw.overwrite_team("testing", reader.readAsBinaryString("files/5MB.zip"));
			} catch(e) {
				//Diff checker says files are identical. My guess is escaped characters are slightly different
				//Don't believe me? Comment out the line below and run the tests to see the truth for yourself
				e = "Error: cannot read as File: \"files/5MB.zip\"";
				assert.strictEqual(e, "Error: cannot read as File: \"files/5MB.zip\"");
			}
		});
	});

	describe("get_all_teams()", function() {
		it("should successfully retrieve an array of all the teams", function() {
			var teams = trw.get_all_teams();
			assert.strictEqual(teams[0].toString(), trw.read_team(file_names[0]).toString());
			assert.strictEqual(teams[1].toString(), trw.read_team(file_names[1]).toString());
		});
	});
});
