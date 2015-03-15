var User = require("./models/user");
module.exports = function( app , passport , mongoose ) { // passport is expected to be fully configured
	app.all( "*" , function( req , res , next ) {
		res.scopedvars = { "user" : req.user , "error" : req.flash("error") , "message" : req.flash("message") , "post" : false , "posts" : false }
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
	app.get( "/profile/*" , function( req , res ) {
		User.findOne( { username : req.url.slice( req.url.indexOf( "/" , 2 ) + 1 ).toLowerCase() } , function( err , user ) {
			if ( err ) throw err;
			if ( !user ) res.scopedvars.uiq = false;
			else res.scopedvars.uiq = user;
			res.render( "pages/profile.ejs" , res.scopedvars );
		} );
	} );
	app.post( "/profile/*" , function( req , res ) {
		User.findOne( { username : req.url.slice( req.url.indexOf( "/" , 2 ) + 1 ).toLowerCase() } , function( err , user ) {
			if ( err ) throw err;
			if ( !user ) res.scopedvars.uiq = false;
			else res.scopedvars.uiq = user;
			if ( req.body.cpwd ) {
				if ( user.validateUser( req.body.cpwd ) ) {
					var changed_fields = 0;
					var f_ERROR = false;
					if ( req.body.npwd ) {
						if ( req.body.npwd == req.body.cnpwd ) {
							changed_fields++;
							user.password = user.hash( req.body.npwd );
						} else {
							f_ERROR = true;
							res.scopedvars.error.push( "New passwords do not match." );
						}
					}
					if ( !f_ERROR ) {
						req.scopedvars.message.push( changed_fields + " fields modified." );
						user.save();
					}
				} else {
					req.scopedvars.error.push( "Wrong password; your information was not changed." );
				}
			}
			res.render( "pages/profile.ejs" , res.scopedvars );
		} );
	} );
	app.get( "/logout" , function( req , res ) {
		if ( !req.isAuthenticated() ) return res.redirect("/");
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