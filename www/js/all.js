var previousPages = [], currentPage, dom;
var currentPage;

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
	initDomElements();
	showPage("index");
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false);
	document.addEventListener("backbutton", goBack, false);

	//Initialisation du popover
	dom.popover.popover();

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
	$(".hidden").each(function(i, div) {
		$(this).removeClass("hidden");
	});
}

function initDomElements() {
	dom = {
		legNumber: $("#listLegNumber"),
		legs: $("#listLegatees"),
		detNumber: $("#listDetNb"),
		dets: $("#listDet"),
		hostData: $("#dataHC"),
		range: $("#range"),
		quantity: $("#nbFound"),
		genre: $("#dataGenre"),
		epithete: $("#dataSpecies"),
		taxon: $("#dataTaxon"),
		author: $("#dataAuthor"),
		longitude: $("#longitude"),
		latitude: $("#latitude"),
		accuracy: $("#accuracy"),
		cameraPicture: $("#cameraPic"),
		picturesDiv: $("#picturesDiv"),
		date: $("#date"),

		popover: $("#popoverButton"),
		pages: $(".page"),
		tbody: $("#table").children("tbody")
	}

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
	if (show === true)
		dom.popover.popover();
	else if (show === false) {
		if (clicked)
			clicked = false;
		else
			dom.popover.popover("hide");		
	} else
		dom.popover.popover();
}

/*
Fonction permettant de faire un appel ajax sur une ressource
@param method : méthode de la requête (GET, POST...)
@param url : lien vers la ressource
@param toDo : méthode qui sera effectuée en réponse à la requête
@param param : paramètre que l'on peut passer à la méthode toDo si besoin d'infos
@param toDoError : fonction appelée en cas d'échec de l'appel ajax
*/

function ajaxCall(method, url, toDo, param, toDoError) {
	if (method == "GET") {
		$.get(url)
		.done(function (data) {
			toDo(data, param);
		})
		.fail(function (err) {
			if (toDoError)
				toDoError();
		});
	} else if (method == "POST") {
		var parameters = {"param1": param.param1, "param2": param.param2};
		$.post(url, parameters)
		.done(function (data) {
			toDo(data, param);
		})
		.fail(function (err) {
			if (toDoError)
				toDoError();
		});
	}
}

