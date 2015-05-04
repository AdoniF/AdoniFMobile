var previousPages = [], currentPage, dom;

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
	addCustomFunctions();
	
	initDivs();
	initDomElements();
	FastClick.attach(document.body);
	showPage("index");
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false);
	document.addEventListener("backbutton", goBack, false);

	dom.popover.popover();

	$('body').on('click', function (e) {
		if ($('.popover').hasClass('in'))
			showPopover(false);
	});
	initCamera();
	openDB();
	initInputFields();
	positionUl();
	calculatePosition();
	navigator.splashscreen.hide();
}

//Ajoute des fonctions utilitaires aux chaines et aux tableaux
function addCustomFunctions() {
	String.prototype.isEmpty = function() {
		return this.length === 0;
	}

	String.prototype.contains = function (str) {
		return this.indexOf(str) >= 0;
	}

	Array.prototype.contains = function (str) {
		return this.indexOf(str) >= 0;
	}

	Array.prototype.isEmpty = function() {
		return this.length == 0;
	}
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

var inputCompletions;
function initInputFields() {
	var genre = document.getElementById("dataGenre");
	var epithete = document.getElementById("dataSpecies");
	var taxon = document.getElementById("dataTaxon");
	var auteur = document.getElementById("dataAuthor");

	var options = {minChars : 1};
	inputCompletions = 
	{
		dataGenre: new Awesomplete(genre, options),
		dataSpecies: new Awesomplete(epithete, options),
		dataTaxon: new Awesomplete(taxon, options),
		dataAuthor: new Awesomplete(auteur, options)
	}
}

function positionUl() {
	$("div.awesomplete > ul").css("top", $("#dataGenre").outerHeight(true) + 'px');
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
		altitude: $("#altitude"),
		cameraPicture: $("#cameraPic"),
		picturesDiv: $("#picturesDiv"),
		date: $("#date"),
		phylum: $("#listPhylum"),

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
		var parameters = {data: param};

		$.post(url, parameters)
		.done(function (data) {
			toDo(data, param);
		})
		.fail(function (xhr, textStatus, errorThrown) {
			if (toDoError)
				toDoError(xhr, textStatus, errorThrown);
		});
	}
}