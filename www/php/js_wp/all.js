var phylumsArray = ["Ascomycota", "Basidiomycota", "Chytridiomycota", "Glomeromycota", "Mycetozoa", "Zygomycota"];
var rangArray = ["var.", "f.", "subsp."];
var modulationArray = ["aff.", "(cf.)", "ad int.", "sp.", "ss.lat", "ss.str", "(gr.)", "?"];
var etatHoteArray = ["vivant", "moribond", "mort"];

var recolt;

function init(id) {
	ajaxCall("GET", "/ajax/getRecolte.php?id=" + id, getRecolt, "", callFailure);
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
		jQuery.get(url)
		.done(function (data) {
			toDo(data, param);
		})
		.fail(function (err) {
			if (toDoError)
				toDoError();
		});
	} else if (method == "POST") {
		var parameters = {data: param};

		jQuery.post(url, parameters)
		.done(function (data) {
			toDo(data, param);
		})
		.fail(function (xhr, textStatus, errorThrown) {
			if (toDoError)
				toDoError(xhr, textStatus, errorThrown);
		});
	}
}

function getRecolt(data) {
	var arr = data.split("$");
	recolt = new Recolte(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10],
		arr[11], arr[12], arr[13], arr[14], arr[15], arr[16]);
	console.log(recolt);

	populateFields();
}

function populateFields() {
	populateSelect('listSVF', rangArray, recolt.rang);
	populateSelect("listPhylum", phylumsArray, "");
	populateSelect("listModulation", modulationArray, recolt.modulation);
	populateSelect("hostState", etatHoteArray, recolt.etatHote);

	populateInput("dataGenre", recolt.genre);
	//TODO : finish method
}


/*
Fonction permettant de remplir les suggestions de l'input dont l'id
est passé en paramètre
*/
function populateInput(id, content) {
	console.log("populate input");
	var input = $("#" + id);
	input.val(content);
	console.log(input);
	input.change(function () {
		console.log("change");
		input.autocomplete({
			"../lib_js_autocomplete/requestGenre.php?q="+input.val()+"&b=asco"
		});
	});
	
}

/*
Fonction permettant de remplir les propositions du select dont 
l'id est passé en paramètre
*/
function populateSelect(id, array, selected) {
	var list = jQuery("#" + id);

	list.empty();
	list.attr("placeholder", selected);
	var options = "";
	options += "<option>" + selected + "</option>";
	for (var i = 0; i < array.length; ++i) {
		options += "<option>" + array[i] + "</option>";
	}

	list.append(options);
}

function callFailure(a, b, c) {
	console.log(a);
	console.log(b);
	console.log(c);
}

function Recolte(genre, epithete, rang, taxon, modulation, autorites, date, latitude, longitude, altitude, rayon,
	quantite, substrat, hote, etatHote, leg, det) {
	this.genre = genre || "",
	this.epithete = epithete || "",
	this.rang = rang || "",
	this.taxon = taxon || "",
	this.modulation = modulation || "",
	this.autorites = autorites || "",
	this.date = date || "",
	this.latitude = latitude || "",
	this.longitude = longitude || "",
	this.altitude = altitude || "",
	this.rayon = rayon || "",
	this.quantite = quantite || "",
	this.substrat = substrat || "",
	this.hote = hote || "",
	this.etatHote = etatHote || "",
	this.leg = leg || "",
	this.det = det || ""
}
