const assert = require('assert');
var Player = require('../Player');

var p1 = new Player("Random Player", 04, "PG", "freshman");
describe('Player tests', function() {
  describe('Player getters', function() {
    it('should return the name', function() {
      assert.strictEqual(p1.get_name(), "Random Player");
    });
    it('should return the number', function() {
      assert.strictEqual(p1.get_number(), 04);
    });
    it('should return the position', function() {
      assert.strictEqual(p1.get_position(), "PG");
    });
    it('should return the year', function() {
      assert.strictEqual(p1.get_year(), "freshman");
    });
    it('should return the Player as an array', function() {
      assert.strictEqual(p1.to_array()[0], "Random Player");
      assert.strictEqual(p1.to_array()[1], 04);
      assert.strictEqual(p1.to_array()[2], "PG");
      assert.strictEqual(p1.to_array()[3], "freshman");
    });
  });
});
