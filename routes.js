var User = require("./models/user");
module.exports = function( app , passport , mongoose ) { // passport is expected to be fully configured
	app.all( "*" , function( req , res , next ) {
		res.scopedvars = { "user" : req.user , "errors" : req.flash("error") , "message" : req.flash("message") , "post" : false , "posts" : false }
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
		var f_RENDER = true;
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
						res.scopedvars.message.push( changed_fields + " field(s) modified." );
						user.save();
					}
				} else {
					res.scopedvars.error.push( "Wrong password; your changes were not saved." );
				}
			} else if ( req.body.apwd ) {
				if ( req.user.validateUser( req.body.apwd ) ) {
					var changed_fields = 0;
					var f_REDIRECT = false;
					if ( req.body.acnun && user.username !== req.body.acnun ) {
						changed_fields++;
						f_REDIRECT = true;
					}
					if ( req.body.acnan && req.body.acnan !== user.actualname ) {
						changed_fields++;
						user.actualname = req.body.acnan;
					}
					if ( req.body.acnpwd && !user.validateUser( req.body.acnpwd ) ) {
						changed_fields++;
						user.password = user.hash( req.body.acnpwd );
					}
					if ( !!req.body.acadm !== user.adminpriv ) {
						changed_fields++;
						user.adminpriv = !!req.body.acadm;
					}
					if ( !!req.body.acena !== user.enabled ) {
						changed_fields++;
						user.enabled = !!req.body.acena;
					}
					if ( changed_fields ) {
						if ( f_REDIRECT ) {
							f_RENDER = false;
							User.findOne( { username : req.body.acnun.toLowerCase() } , function( err , u ) {
								if ( err ) throw err;
								if ( u ) {
									res.scopedvars.error.push( "A user with that username already exists." );
									res.render( "pages/profile.ejs" , res.scopedvars );
								} else {
									user.username = req.body.acnun.toLowerCase();
									req.flash( "message" , changed_fields + " field(s) modified." );
									user.save();
									res.redirect( "/profile/" + req.body.acnun.toLowerCase() );
								}
							} );
						} else {
							res.scopedvars.message.push( changed_fields + " field(s) modified." );
							user.save();
						}
					}
				} else {
					res.scopedvars.message.push( "Wrong password; your changes were not saved." );
				}
			}
			if ( f_RENDER ) res.render( "pages/profile.ejs" , res.scopedvars );
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