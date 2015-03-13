var mongoose = require("mongoose");

var postSchema = mongoose.Schema( {
	subforum : String,
	title : String,
	postedtime: Number,
	author: String,
	content : String
} );

module.exports = mongoose.model( "Post" , postSchema );