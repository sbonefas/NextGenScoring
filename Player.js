/*	PLAYER OBJECT FILE
*/

module.exports = function(name, number, position, year){
	this.name = name;
	this.number = number;
	this.position = position;
	this.year = year;
	
	this.get_name = function(){
		return this.name;
	}
	
	this.get_number = function(){
		return this.number;
	}
	
	this.get_position = function(){
		return this.position;
	}
	
	this.get_year = function(){
		return this.year;
	}
	
	this.to_array = function(){
		return [this.name, this.number, this.position, this.year];
	}
}
