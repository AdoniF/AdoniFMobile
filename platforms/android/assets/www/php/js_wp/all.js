var phylumsArray = ["Ascomycota", "Basidiomycota", "Chytridiomycota", "Glomeromycota", "Mycetozoa", "Zygomycota"];
var rangArray = ["var.", "f.", "subsp."];
var modulationArray = ["aff.", "(cf.)", "ad int.", "sp.", "ss.lat", "ss.str", "(gr.)", "?"];
var etatHoteArray = ["vivant", "moribond", "mort"];
var substratArray = [];
var recoltTypeArray = ["Sortie privée", "Association", "Financement", "Saisir une novuelle valeur"];
var referentielHabitatArray = ["EUNIS", "CORINE", "Phytosocio", "Libre"];
var months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
var pictures = [];

var recolt;
var recolt_id;
var picID = -1;


function init(id) {
	recolt_id = id;
	ajaxCall("GET", "/ajax/getRecolte.php?id=" + recolt_id, getRecolt);
	addListeners();
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
	if (method === "GET") {
		$.ajax( {
			url: url,
			type: "GET",
			data: param,
			success: toDo
		});
	}
}

function getRecolt(data) {
	var arr = data.split("$");
	recolt = new Recolte(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10],
		arr[11], arr[12], arr[13], arr[14], arr[15], arr[16], arr[17]);

	populateFields();
}

function populateFields() {
	populateSelect('listSVF', rangArray, recolt.rang);
	populateSelect("listPhylum", phylumsArray, "");
	populateSelect("listModulation", modulationArray, recolt.modulation);
	populateSelect("hostState", etatHoteArray, recolt.etatHote);
	populateSelect("typeRecolte", recoltTypeArray);
	populateSelect("ref", referentielHabitatArray);

	populateElementsFromReferential();

	populateInput("dataGenre", recolt.genre);
	populateInput("dataSpecies", recolt.epithete);
	populateInput("dataTaxon", recolt.taxon);
	populateInput("dataAuthor", recolt.autorites);

	populateDate(recolt.date);

	populateInput("latitude", recolt.latitude);
	populateInput("longitude", recolt.longitude);
	populateInput("altitude", recolt.altitude);
	populateInput("range", recolt.rayon);
	populateInput("nbFound", recolt.quantite);
	
	populateInput("leg0", recolt.leg);
	populateInput("det0", recolt.det);

	callPositionInformations();

	loadPictures();
}

function populateElementsFromReferential() {
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestSubstrats.php", populateSubstrats);
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestProtectionStatus.php", populateProtectionStatus);
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestAssociations.php", populateAssos);
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestHosts.php", populateHosts);
}

function populateSubstrats(data) {
	var array = data.trim().split("\n");
	populateSelect("substrat", array, recolt.substrat);
}

function populateProtectionStatus(data) {
	var array = data.trim().split("\n");
	populateSelect("protectionStatus", array);
}

function populateAssos(data) {
	var array = data.trim().split("\n");
	populateSelect("asso", array);

	//TODO : Ajouter possibilité d'ajouter une nouvelle asso
}

function populateHosts(data) {
	var array = data.trim().split("\n");
	populateSelect("hote", array);

	//TODO : Ajouter possibilité d'ajouter un nouvel hote
}

function populateDate(date) {
	var days = [];
	for (var i = 1; i < 32; ++i)
		days.push(i);

	var day, month, year;
	if (!date) {
		var d = new Date();
		day = d.getUTCDate();
		month = months[d.getMonth()];
		year = d.getFullYear();
	} else {
		var d = date.split("-");
		year = d[0];
		month = months[parseInt(d[1]) - 1];
		day = d[2];
	}

	populateSelect("day", days, day);
	populateSelect("month", months, month);
	populateInput("year", year);
}

var geocoder;
var dpt;
function callPositionInformations() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(parseFloat(recolt.latitude), parseFloat(recolt.longitude));
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var comp = results[0].address_components;
			populateInput("country", comp[5].long_name);
			dpt = comp[3].short_name + " - " + comp[3].long_name.toUpperCase();
			populateDepartements();
			populateInput("city", comp[2].long_name);
		} else {
			alert('Geocoder failed due to: ' + status);
		}
	});

}

function populateDepartements() {
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestDepartements.php", populateDepartementsInfos);
}

function populateDepartementsInfos(data) {
	var array = data.split("\n");
	populateSelect("dpt", array, dpt);
	checkFields();
}

function loadPictures() {
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestPictures.php?id=" + recolt_id, populatePictures);
}

function populatePictures(data) {
	var array = data.split("\n");
	array.forEach(function(entry) {
		if (entry.trim().length > 0)
			pictures.push(entry);
	});

	showPictures();
}

function changePhotoListener(id) {
	$("#picButton").unbind();
	$("#picButton").bind("click", function() {
		$("#picInput" + id).trigger("click");
	});

}

function showPictures() {
	var pics = $("#pics");
	pictures.forEach(function(entry) {
		pics.append(makePictureRow(entry));
		++picID;
	});
	--picID;
	addPictureInput();
}

function addPictureInput() {
	++picID;
	var input = "<input class='hidden' type='file' accept='image/*' id='picInput" + picID + "'/>";
	$("#pics").append(input);
	$("#picInput" + picID).bind("change", function() {
		readURL(this);
	});

	changePhotoListener(picID);
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			var newRow = makePictureRow(getPicName(), e.target.result);
			$("#pics").append(newRow);
		}
		reader.readAsDataURL(input.files[0]);
		addPictureInput();
	}
}

function getPicName() {
	var picName = $("#dataGenre").val() + "_" + $("#dataSpecies").val() + "_" + $("#listSVF").val() + "_" + $("#dataTaxon").val() + "_"
	+ recolt_id + "_" + getFormatedDate() + "_" + picID + ".jpg";
	return picName;
}

function getFormatedDate() {
	return $("#year").val() + "-" + (months.indexOf($("#month").val()) + 1) + "-" + $("#day").val();
}

function makePictureRow(name, picSrc) {
	var src = picSrc ? picSrc : "/wp-content/uploads/photos_recoltes/user" + recolt.user_id + "/recolte " + recolt_id + "/" + name;
	var row = "<div class='col-xs-12'>"
	+ "<span class='col-xs-offset-1 col-xs-3'><img style='height=250px' class='img-thumbnail picture' src='" + src + "' alt='picture'/></span>"
	+ "<span class='col-xs-4'>" + name + "</span>"
	+ "<span class='col-xs-4 text-center'><button type='button' class='btn btn-success delete'>"
	+ "<span class='glyphicon glyphicon-trash'></span></button></span></div>";

	return row;
}

/*
Fonction permettant de remplir les suggestions de l'input dont l'id
est passé en paramètre
*/
function populateInput(id, content) {
	$("#" + id).val(content);
}

/*
Fonction permettant de remplir les propositions du select dont 
l'id est passé en paramètre
*/
function populateSelect(id, array, selected) {
	var list = $("#" + id);

	if (!selected)
		selected = "";
	list.empty();
	var options = "<option selected>" + selected + "</option>";
	for (var i = 0; i < array.length; ++i) {
		options += "<option>" + array[i] + "</option>";
	}
	list.val(selected);

	list.append(options);
}

function Recolte(user_id, genre, epithete, rang, taxon, modulation, autorites, date, latitude, longitude, altitude, rayon,
	quantite, substrat, hote, etatHote, leg, det) {
	this.user_id = user_id || "";
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

function checkFields() {
	$(".has-error").each(function() {
		$(this).trigger("change");
	});
}

function addListeners() {
	$("#dataGenre").bind("focus", function() {
		getGenre($(this).val(), $("#listPhylum").val());
	});

	$("#dataSpecies").bind("focus", function() {
		getEpithete($(this).val(), $("#dataGenre").val(), $("#listPhylum").val());
	});

	$(".has-error").bind("change", function() {
		var div = $(this);
		var id = div.attr("id").split("group")[1];
		var child = $("#" + id);


		var isValid = child.is("input") ? child.val().length > 0 : child.find(":selected").text().length > 0;

		if (isValid && div.hasClass("has-error")) {
			div.removeClass("has-error");
			div.addClass("has-success");
		} else if (!isValid && div.hasClass("has-success")) {
			div.removeClass("has-success");
			div.addClass("has-error");
		}
	});

	$("#ref").bind("change", selectHabitat);
}

function getGenre(genre, base){
	if (!base)
		base="union";

	//Supprime les résultats précédents restés dans le DOM
	$("div").remove(".ac_results");
	$("#dataGenre").autocomplete("/lib_js_autocomplete/requestGenre.php?q=" + genre + "&b=" + base);
}

function getEpithete(espece, genre, base) {
	if (!base)
		base="union";
	
	//Supprime les résultats précédents restés dans le DOM
	$("div").remove(".ac_results");
	$('#dataSpecies').autocomplete("/lib_js_autocomplete/requestEspece.php?q=" + espece + "&genre=" + genre + "&b=" + base);
}

//Choisie le bon habitat selon le referentiel choisi
function selectHabitat() {
	var select = document.getElementById("ref");
	var choice = select.selectedIndex;
	var valeur = select.options[choice].value;
	$.ajax({
		url:"/ajax/AJHabitat.php",
		data:{valeur:valeur},
		dataType:'text',
		type:'POST',
		success: function(data){
			document.getElementById("SELECTHABITAT").innerHTML=data;
		}
	});

	document.getElementById("ecologie").value="";

	$(document.getElementById('groupselectHabitat')).slideDown();
	
	var ulHabitat = document.getElementById("SELECTHABITAT");
	var refValue = select.options[select.selectedIndex].value;
	if (refValue == 'EUNIS' || refValue == 'Phytosocio'){
		ulHabitat.style.height="300px";
	} else if (refValue == 'CORINE'){
		ulHabitat.style.height="203px";
	} else {
		$(document.getElementById('groupselectHabitat')).slideUp();
	}
}

var legDetRow = 1;
function addLegDet() {
	var legInfo = $("#groupleg0").find("img").attr("title").replace("'", "&#39;");
	var detInfo = $("#groupdet0").find("img").attr("title").replace("'", "&#39;");
	var div = "<div id='groupleg" + legDetRow + "'class='form-group col-xs-6'>"
	+ "<label for='leg' class='control-label col-xs-3'>Légataire</label>"
	+ "<div class='col-xs-7'>"
	+ "<input id='leg" + legDetRow + "' class='legdet' style='width:100%;'></input>"
	+ "</div>"
	+ "<span class='col-xs-1'><img class='data-toggle='tooltip' data-placement='top' title='" + legInfo + "' src='/images/infobulle.png'></span>"
	+ "</div>";

	div += "<div id='groupdet" + legDetRow + "'class='form-group col-xs-6'>"
	+ "<label for='det' class='control-label col-xs-3'>Déterminateur</label>"
	+ "<div class='col-xs-6'>"
	+ "<input id='det" + legDetRow + "' class='legdet' style='width:100%;'></input>"
	+ "</div>"
	+ "<span class='col-xs-1'><img class='data-toggle='tooltip' data-placement='top' title='" + detInfo + "' src='/images/infobulle.png'></span>"
	+ "<div class='col-xs-2'>"
	+ "<button type='button' class='btn btn-success btn-block' onclick='addLegDet()'>"
	+ "<span class='glyphicon glyphicon-plus'></span>"
	+ "</button></div></div>";

	$("#groupdet" + (legDetRow - 1)).after(div);
	legDetRow++;
}

var herbierRow = 1;
function addHerbier() {
	var codeInfo = $("#groupcodeHerbier0").find("img").attr("title").replace("'", "&#39;");
	var numInfo = $("#groupnumHerbier0").find("img").attr("title").replace("'", "&#39;");

	var div = "<div id='groupcodeHerbier" + herbierRow + "'class='form-group col-xs-6'>"
	+ "<label for='codeHerbier' class='control-label col-xs-3'>Code herbier</label>"
	+ "<div class='col-xs-7'>"
	+ "<input id='codeHerbier" + herbierRow + "' class='legdet' style='width:100%;'></input>"
	+ "</div>"
	+ "<span class='col-xs-1'><img class='data-toggle='tooltip' data-placement='top' title='" + codeInfo + "' src='/images/infobulle.png'></span>"
	+ "</div>";

	div += "<div id='groupnumHerbier" + herbierRow + "'class='form-group col-xs-6'>"
	+ "<label for='numHerbier' class='control-label col-xs-3'>Num herbier</label>"
	+ "<div class='col-xs-6'>"
	+ "<input id='numHerbier" + herbierRow + "' class='legdet' type=number min='0' style='width:100%;'></input>"
	+ "</div>"
	+ "<span class='col-xs-1'><img class='data-toggle='tooltip' data-placement='top' title='" + numInfo + "' src='/images/infobulle.png'></span>"
	+ "<div class='col-xs-2'>"
	+ "<button type='button' class='btn btn-success btn-block' onclick='addHerbier()'>"
	+ "<span class='glyphicon glyphicon-plus'></span>"
	+ "</button></div></div>";

	$("#groupnumHerbier" + (herbierRow - 1)).after(div);
	herbierRow++;
}