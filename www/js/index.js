/*
Fonction permettant d'initialiser un listener détectant
le moment où les fonctionnalités de phonegap sont prêtes
*/
function init() {
	document.addEventListener("deviceready",onDeviceReady,false);
}

/*
Fonction gérant les évènements à réaliser lorsque l'appareil est prêt
*/
function onDeviceReady() {
	initDivs();
	showPage("index");
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false);
	document.addEventListener("backbutton", goBack, false);

	//Initialisation du popover
	$("#popoverButton").popover();

	$('body').on('click', function (e) {
		if ($('.popover').hasClass('in'))
			showPopover(false);
	});
	initCamera();
	openDB();
}

/*
Initialise l'affichage des divs au lancement de l'application.
Appelée dans la fonction onLoad du body d'index.html
*/
function initDivs() {
	try {
		$(".hidden").each(function(i, div) {
			$(this).removeClass("hidden");
		});
	} catch(err) {
		alert("error hidden each " + err.message);
	}
}