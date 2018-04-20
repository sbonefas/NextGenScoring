/*	PLAYER OBJECT FILE
*/

module.exports = function(name, number, position){
	this.name = name;
	this.number = number;
	this.position = position;
	
	this.get_name = function(){
		return this.name;
	}
	
	this.get_number = function(){
		return this.number;
	}
	
	this.get_position = function(){
		return this.position;
	}
	this.to_array = function(){
		return [this.name, this.number, this.position];
	}
}
