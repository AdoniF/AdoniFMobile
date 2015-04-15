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