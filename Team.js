/****TEAM OBJECT FILE
 *
 *
 */

var Player = require('./Player.js');	//Player object import

module.exports = function (name, code, head_coach, asst_coach, stadium, roster){
	this.name = name;
	this.code = code;
	this.head_coach = head_coach;
	this.asst_coach = asst_coach;
	this.stadium = stadium;
	this.active_roster = [];

	if (roster != null) this.active_roster = roster;

	this.get_name = function(){
		return this.name;
	}

	this.get_code = function(){
		return this.code;
	}

	this.get_head_coach = function(){
		return this.head_coach;
	}

	this.get_asst_coach = function(){
		return this.asst_coach;
	}

	this.get_stadium = function(){
		return this.stadium;
	}

  this.edit_name = function(name) {
    this.name = name;
  }

	this.edit_code = function(code){
		this.code = code;
	}

	this.set_head_coach = function(head_coach){
		this.head_coach = head_coach;
	}

	this.set_asst_coach = function(asst_coach){
		this.asst_coach = asst_coach;
	}

	this.set_stadium = function(stadium){
		this.stadium = stadium;
	}

	this.add_player_to_roster = function(name, number, position){
		var p = new Player(name, number, position);
		this.active_roster.push(p);
	}

	this.remove_player_from_roster = function(name, number, position){
		var p = new Player(name, number, position);
		var index = this.active_roster.indexOf(p);
		if (index > -1){
			this.active_roster.splice(p,1);
		}
	}

	this.get_active_roster = function(){
		return this.active_roster;
	}

	this.to_array = function(){
		return [this.name, this.code, this.head_coach, this.asst_coach, this.stadium, this.active_roster];
	}

}
