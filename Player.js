/*	PLAYER OBJECT FILE
*/

module.exports = function(name, number){
	this.name = name;
	this.number = number;
	
	this.get_name = function(){
		return this.name;
	}
	
	this.get_number = function(){
		return this.number;
	}
}
