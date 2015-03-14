document.addEventListener( "DOMContentLoaded" , function() {
	var navbar = document.getElementById("navbar");
	document.onscroll = function() {
		if ( document.body.scrollTop === 0 ) {
			navbar.classList.remove("small-navbar");
			navbar.classList.add("large-navbar");
		} else {
			navbar.classList.add("small-navbar");
			navbar.classList.remove("large-navbar");
		}
	}
	var ats = document.getElementsByClassName( "navbarlink" );
	document.onclick = function() {
		for ( var j = 0 ; j < ats.length ; j++ ) {
			console.log("blah");
			ats[j].classList.remove("active");
		}
	}
	for ( var i = 0 ; i < ats.length ; i++ ) {
		ats[i].onclick = function( e ) {
			console.log("blah blah");
			this.classList.toggle("active");
			e.stopPropagation();
		}
	}
} );