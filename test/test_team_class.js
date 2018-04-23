const assert = require('assert');
var Team = require('../Team');
var Player = require('../Player');

function verifyArrayInfo(array, flag) {
  let testArray;
  if (flag == 0) {
    testArray = ["Wisconsin", "WISC", "Bo Ryan", "Howard Moore", "Alliant Energy Center", []]
  }
  else {
    testArray = ["Wisconsin Badgers", "WIS", "Greg Gard", "Dean Oliver", "Kohl Center", ["Ethan Happ",
    22, "F", "junior"]]
  }
  assert.strictEqual(array[0], testArray[0]);
  assert.strictEqual(array[1], testArray[1]);
  assert.strictEqual(array[2], testArray[2]);
  assert.strictEqual(array[3], testArray[3]);
  assert.strictEqual(array[4], testArray[4]);
  if (array[5][0] && testArray[5][0]) {
    assert.strictEqual(array[5][0][0], testArray[5][0]);
    assert.strictEqual(array[5][0][1], testArray[5][1]);
    assert.strictEqual(array[5][0][2], testArray[5][2]);
    assert.strictEqual(array[5][0][3], testArray[5][3]);
  }
  //Implicit pass if both arrays are undefined
}

var t2Roster = [{name: "Amir Coffey", number: 5, position: "G"}];
var t1 = new Team("Wisconsin", "WISC", "Bo Ryan", "Howard Moore", "Alliant Energy Center", null);
var t2 = new Team("Minnesota", "MINN", "Richard Pitino", "Ed Conroy", "Williams Arena", t2Roster);

describe('Team tests', function() {
  describe('Team getters', function() {
    it('should return the team name', function() {
      assert.strictEqual(t1.get_name(), "Wisconsin");
    });
    it('should return the team code', function() {
      assert.strictEqual(t1.get_code(), "WISC");
    });
    it('should return the head coach\'s name', function() {
      assert.strictEqual(t1.get_head_coach(), "Bo Ryan");
    });
    it('should return the assistant coach\'s name', function() {
      assert.strictEqual(t1.get_asst_coach(), "Howard Moore");
    });
    it('should return the name of the team\'s arena', function() {
      assert.strictEqual(t1.get_stadium(), "Alliant Energy Center");
    });
    it('should return the active roster of a null active roster', function() {
      assert.strictEqual(t1.get_active_roster(), t1.to_array()[5]);
    });
    it("should return the active roster of an active roster with a player", function() {
      assert.strictEqual(t2.get_active_roster(), t2Roster);
      assert.strictEqual(t2.get_active_roster(), t2.to_array()[5]);
    })
    it('should return all getter information as an array', function() {
      verifyArrayInfo(t1.to_array(), 0);
    });
  });
  describe('Team setters', function() {
    it('should return the new team name', function() {
      t1.edit_name("Wisconsin Badgers");
      assert.strictEqual(t1.get_name(), "Wisconsin Badgers");
    });
    it('should return the team\'s new code', function() {
      t1.edit_code("WIS");
      assert.strictEqual(t1.get_code(), "WIS");
    });
    it('should return the new head coach\'s name', function() {
      t1.set_head_coach("Greg Gard");
      assert.strictEqual(t1.get_head_coach(), "Greg Gard");
    });
    it('should return the new assistant coach\'s name', function() {
      t1.set_asst_coach("Dean Oliver");
      assert.strictEqual(t1.get_asst_coach(), "Dean Oliver");
    });
    it('should return the name of the team\'s new arena', function() {
      t1.set_stadium("Kohl Center");
      assert.strictEqual(t1.get_stadium(), "Kohl Center");
    });
    it('should add a player to the roster', function() {
      var p1 = new Player("Ethan Happ", 22, "F", "junior");
      t1.add_player_to_roster(p1);
      assert.strictEqual(t1.get_active_roster()[0][0], "Ethan Happ");
      assert.strictEqual(t1.get_active_roster()[0][1], 22);
      assert.strictEqual(t1.get_active_roster()[0][2], "F");
      assert.strictEqual(t1.get_active_roster()[0][3], "junior");
    });
    it('should add another player to the roster', function() {
       var p2 = new Player("Khalil Iverson", 21, "G", "junior");
       t1.add_player_to_roster(p2);
       assert.strictEqual(t1.get_active_roster()[1][0], "Khalil Iverson");
       assert.strictEqual(t1.get_active_roster()[1][1], 21);
       assert.strictEqual(t1.get_active_roster()[1][2], "G");
       assert.strictEqual(t1.get_active_roster()[1][3], "junior");
    });
    it('should remove a player from the roster', function() {
       t1.remove_player_from_roster("Khalil Iverson", 21);
       assert.strictEqual(t1.get_active_roster()[1], undefined);
    });
    it('shouldn\'t remove a player from the roster given invalid parameters', function() {
       try {
         t1.remove_player_from_roster("Ethan Hap", 22, "F");
       } catch(e) {
         assert.strictEqual(e, "remove_player_from_roster Error: player could not be found: (name: Ethan Hap number: 22)\n");
       }
       assert.strictEqual(t1.get_active_roster()[0][0], "Ethan Happ");
       assert.strictEqual(t1.get_active_roster()[0][1], 22);
       assert.strictEqual(t1.get_active_roster()[0][2], "F");
       assert.strictEqual(t1.get_active_roster()[0][3], "junior");
    });
    it('should return all new information as an array', function() {
      verifyArrayInfo(t1.to_array(), 1);
    });
    it('should throw an error if passed in a null argument when adding a new player', function() {
      var p3 = new Player(null, 22, "F", "senior");
      try {
        t1.add_player_to_roster(p3);
        assert.fail("Should've thrown an error if given a null argument")
      } catch (e) {
        assert.strictEqual(e, "add_player_to_roster Error: object passed is not a player");
      }
    });
    it('should throw an error if passed in a null argument when removing a player', function() {
      try {
        t1.remove_player_from_roster(null, 22);
      } catch (e) {
        assert.strictEqual(e, "remove_player_to_roster Error: objects passed are not valid");
      }
    });
  });
});
