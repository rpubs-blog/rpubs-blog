var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var userSchema = mongoose.Schema( {
	username : String,
	password : String,
	actualname : String,
	adminpriv : Boolean,
	enabled : Boolean,
	dev : Boolean,
	uuid : Number
} );
userSchema.methods.hash = function( pw ) {
	return bcrypt.hashSync( pw , bcrypt.genSaltSync( 8 ) , null );
}
userSchema.methods.validateUser = function( pw ) {
	return bcrypt.compareSync( pw , this.password );
}
userSchema.methods.getUUID = function() {
	return Date.now();
}

module.exports = mongoose.model( "User" , userSchema );