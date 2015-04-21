var previousPages = [];
var currentPage;

function showModal(id, show) {
	if (show)
		$("#" + id).modal("show");
	else
		$("#" + id).modal("hide");
}

//	Fonction appelée quand la connexion est coupée
function onOffline() {
	online = false;
}

// Fonction appelée quand la connexion est établie
function onOnline() {
	online = true;
}

var clicked = false;
function showPopover(show) {
	if (show === true) {
		$("#popoverButton").popover();
	} else if (show === false) {
		if (clicked)
			clicked = false;
		else 
			$("#popoverButton").popover("hide");		
	} else
		$("#popoverButton").popover();
}