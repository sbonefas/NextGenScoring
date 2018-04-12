const assert = require('assert');
var Player = require('../Player');
var Team = require('../Team');

function compareArrayEles(array1, array2) {
  let contents1, contents2;
  for (let ele in array1) {
     contents1 += ele;
  }
  for (let ele in array2) {
     contents2 += ele;
  }
  assert.strictEqual(contents1, contents2);
}
function verifyArrayInfo(array, flag) {
  let testArray;
  if (flag == 0) {
    testArray = ["Wisconsin", "WISC", "Bo Ryan", "Howard Moore", "Alliant Energy Center", []]
  }
  else {
    testArray = ["Wisconsin Badgers", "WIS", "Greg Gard", "Dean Oliver", "Kohl Center", []]
  }
  assert.strictEqual(array[0], testArray[0]);
  assert.strictEqual(array[1], testArray[1]);
  assert.strictEqual(array[2], testArray[2]);
  assert.strictEqual(array[3], testArray[3]);
  assert.strictEqual(array[4], testArray[4]);
  compareArrayEles(array[5], testArray[5]);
}
var t1 = new Team("Wisconsin", "WISC", "Bo Ryan", "Howard Moore", "Alliant Energy Center", null);
//TODO: With null active roster
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
  it('should return the active roster', function() {
    compareArrayEles(t1.get_active_roster(), []);
  });
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
  /*it('should test add/remove players', function() {
    assert.strictEqual(t1.get_active_roster(), []);
  });*/
  it('should return all new information as an array', function() {
    verifyArrayInfo(t1.to_array(), 1);
  });
});
