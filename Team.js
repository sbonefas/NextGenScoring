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

	this.add_player_to_roster = function(player){
		//var p = new Player(name, number, position);

		if (player.get_name() == null || player.get_number() == null || player.get_position() == null)
			throw "add_player_to_roster Error: object passed is not a player";

		this.active_roster.push(player);
	}

	this.remove_player_from_roster = function(name, number){
		if (name == null || number == null)
			throw "remove_player_to_roster Error: objects passed are not valid";

		for (var i = 0; i < this.active_roster.length; i++){
			var p = this.active_roster[i];
			if (p.get_name() == name && p.get_number() == number){
				this.active_roster.splice(this.active_roster.indexOf(p),1);
				//console.log("removed player: " + p.get_name());
				return;
			}
		}
		throw "remove_player_from_roster Error: player could not be found: (name: " + name + " number: " + number + ")\n";
	}

	this.get_active_roster = function(){
		return this.active_roster;
	}

	this.to_array = function(){
		return [this.name, this.code, this.head_coach, this.asst_coach, this.stadium, this.active_roster];
	}

}
