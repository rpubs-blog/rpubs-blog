var user = require("./models/user");
module.exports = function( app , passport , mongoose ) { // passport is expected to be fully configured
	app.all( "*" , function( req , res , next ) {
		res.scopedvars = { "user" : req.user , "message" : req.flash("loginerr") || req.flash("createmsg") || req.flash("error") , "post" : false , "posts" : false }
		next();
	} );
	app.all( "/admin/*" , function( req , res , next ) {
		if ( !req.isAuthenticated() ) {
			req.flash( "error" , "disgust shows in my face as you have not logged in.");
			return res.redirect("/");
		}
		next();
	} );
	app.get( "/" , function( req , res ) {
		res.render( "pages/index.ejs" , res.scopedvars );
	} );
	app.get( "/*" , function( req , res ) {
		//
	} );
	app.get( "/logout" , function( req , res ) {
		if ( !req.isAuthenticated() ) return;
		req.logout();
		res.redirect("/");
	} );
	app.all( "/login" , function( req , res , next ) {
		if ( req.isAuthenticated() ) return res.redirect("/");
		next();
	} );
	app.get( "/login" , function( req , res ) {
		res.render( "pages/login.ejs" , res.scopedvars );
	} );
	app.post( "/login" , passport.authenticate( "local-login" , {
		successRedirect : "/",
		failureRedirect : "/login",
		successFlash : true,
		failureFlash : true
	} ) );
	app.get( "/admin/" , function( req , res ) {
		res.render( "pages/adminindex.ejs" , res.scopedvars );
	} );
	app.get( "/admin/createuser" , function( req , res ) {
		res.render( "pages/createuser.ejs" , res.scopedvars );
	} );
	app.post( "/admin/createuser" , function( req , res ) {
		res.render( "pages/createuser.ejs" , res.scopedvars );
	} );
}