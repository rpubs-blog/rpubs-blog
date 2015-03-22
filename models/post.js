var mongoose = require("mongoose");

var postSchema = mongoose.Schema( {
	subforum : String,
	title : String,
	postedtime: Number,
	authoruuid: String,
	content : String
} );

module.exports = mongoose.model( "Post" , postSchema );