var mongoose = require("mongoose");

var subforumSchema = mongoose.Schema( {
	identifier : String,
	textname : String
} );

module.exports = mongoose.model( "Subforum" , subforumSchema );