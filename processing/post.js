var qs = require("querystring");

module.exports = function( req , res ) {
	if ( req.method == "POST" ) {
		var body = "";
		var f_CRASH = false;
		req.on( "data" , function( d ) {
			body += d;
			if ( body.length > 1e6 ) {
				f_CRASH = true;
				res.writeHead( 413 , { "Content-Type":"text/plain" } ).end();
				req.connection.destroy();
			}
		} );
		req.on( "end" , function() {
			req.post = qs.parse( body );
		} );
	}
}