var PORT = process.env.PORT || 3000

var express = require("express");
var app = express();
var server = require("http").createServer( app );

var mongoose = require("mongoose");
mongoose.connect( "mongodb://127.0.0.1:27017/test" );
var db = mongoose.connection;
db.on( "error" , console.error.bind( console , "MongoDB Connection Error: ") );
db.once( "open" , function( cb ) {
	console.log("MongoDB connected.");
	// root:helloworld@test
	console.log("Setting up root account . . .");
	User = require("./models/user");
	var root = new User();
	root.username = "root";
	root.password = root.hash("helloworld");
	/**/
	console.log( root );
	root.save( function( err , user ) {
		console.log("Server has our results. Scary.");
		if ( err ) return done( err );
		console.log("Root user created successfully.");
	} );
	console.log("xx")
} );

var cookieparser = require("cookie-parser");
var bodyparser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");

require( "./setup/passport" )( app , passport , mongoose );
//var parsepost = require( "./processing/post" );
app.use( cookieparser() );
app.use( bodyparser.json() );
app.use( bodyparser.urlencoded( { extended : true } ) );
app.set( "view engine" , "ejs" );
app.use( session( { secret : "nodejs server-ish ninja leaf o/" , resave : false , saveUninitialized : false } ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( flash() );

app.use( express.static( __dirname + "/statics" ) );

require( "./routes" )( app , passport );
server.listen( PORT );
/*
db.on( "error" , function() { f_CONNECTFAIL = true } );
db.once( "open" , function( cb ) {
	//
} );
var User = require("models/user");

var passport = require("passport");
var LocalStrat = require("passport-local").Strategy;

function randint( nimax ) {
	return Math.floor( Math.random() * nimax );
}
passport.use( new LocalStrategy( {
	usernameField: "user",
	passwordField: "pass"
}, function( user , pass , done ) {
	//
} ) );
/*

var express = require("express");
var app = express();
var http = require("http");

var server = http.createServer( app );

app.use(express.static(__dirname+"/statics"));

server.listen( 3000 );


/**/

app.use( function( req , res ) {
	res.status( 404 ).render( "errors/404.ejs" );
} );
app.use( function( err , req , res , next ) {
	res.status( 500 ).render( "errors/500.ejs" );
} );