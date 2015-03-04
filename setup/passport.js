console.log("Setting up Passport . . .");

var LocalStrat = require("passport-local").Strategy;
var User = require("../models/user");

module.exports = function( app , passport ) {
	passport.serializeUser( function( user , done ) {
		done( null , user.id );
	} );
	passport.deserializeUser( function( id , done ) {
		User.findById( id , function( err , user ) {
			done( err , user );
		} );
	} );
	passport.use( "local-login" , new LocalStrat( {
		usernameField : "username",
		passwordField : "password",
		passReqToCallback : true
	} , function( req , username , password , done ) {
		if ( username ) username = username.toLowerCase();
		console.log( username + " has tried to login with password " + password );
		User.findOne( { username : username } , function ( err , user ) {
			if ( err ) return done( err );
			if ( !user || !user.validateUser( password ) ) return done( null , false , req.flash( "loginerr" , "Invalid username or password." ) );
			return done( null , user );
		} );
	} ) );/*
	passport.use( "local-signup" , new LocalStrat( {
		usernameField : "username",
		passwordField : "password",
		passReqToCallback : true
	} , function( req , username , password , done ) {
		if ( username ) username = username.toLowerCase();
		if ( req.user ) return done( null , req.user );
		User.findOne( { username : username } , function( err , user ) {
			if ( err ) return done( err );
			if ( user ) return done( null , false , req.flash( "signuperr" , "Username already taken." ) );
			User.findOne( { email : req.post.email } , function( err , user ) {
				if ( err ) return done( err );
				if ( user ) return done( null , false , req.flash( "signuperr" , "Email already used." ) );
				var newuser = new User();
				newuser.username = username;
				newuser.email = req.post.email;
				newuser.password = newuser.hash( password );
				newuser.save( function( err ) {
					if ( err ) return done( err );
					req.login( newuser , function( err ) {
						if ( err ) return done( err );
					} );
					return done( null , newuser );
				} );
			} );
		} );
	} ) );*/
}
console.log("Done.");