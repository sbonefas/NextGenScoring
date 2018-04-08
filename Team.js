/****TEAM OBJECT FILE
 *
 *
 */

this.active_roster = Array();
 
function Team (name, code, head_coach, asst_coach, stadium){
	this.name = name;
	this.code = code;
	this.head_coach = head_coach;
	this.asst_coach = asst_coach;
	this.stadium = stadium;

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

this.add_player_to_roster(Player p){
	this.active_roster.push(p);
}

this.remove_player_from_roster(Player p){
	var index = active_roster.indexOf(p);
	if (index > -1){
		active_roster.splice(p,1);
	}
}

