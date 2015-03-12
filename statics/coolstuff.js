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
} );