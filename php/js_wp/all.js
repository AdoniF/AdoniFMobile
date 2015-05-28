var phylumsArray = ["Ascomycota", "Basidiomycota", "Chytridiomycota", "Glomeromycota", "Mycetozoa", "Zygomycota"];
var rangArray = ["var.", "f.", "subsp."];
var modulationArray = ["aff.", "(cf.)", "ad int.", "sp.", "ss.lat", "ss.str", "(gr.)", "?"];
var etatHoteArray = ["vivant", "moribond", "mort"];
var substratArray = [];
var recoltTypeArray = ["Sortie privée", "Association", "Financement", "Saisir une nouvelle valeur"];
var referentielHabitatArray = ["EUNIS", "CORINE", "Phytosocio", "Libre"];
var months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
var pictures = [];
var picturesAuthors = [];
var reignArray = ["Fungi", "Mycetozoa", "Chromista"];

var recolt = null;
var recolt_id;

//typeID = 0 => création
//typeID = 1 => modification de récolte
//typeID = 2 => complétion d'une récolte faite sur mobile
var type_id;
var picID = -1;
var username;


function init(recoltID, typeID, name) {
	recolt_id = recoltID;
	type_id = typeID;
	username = name;

	if (type_id != 0)
		ajaxCall("GET", "/ajax/getRecolte.php?id=" + recolt_id + "&type=" + type_id, getRecolt);
	else {
		getRecolt("");
		recolt.user_id = recoltID;
	}
	var modal = "<div id='modal' class='modal fade in' tabindex='-1' role='dialog'>"
	+ "<div class='modal-dialog modal-lg'><div class='modal-content'><div class='modal-header'>Choix de l'espèce"
	+ "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"
	+ "</div><div class='modal-body'><center>"
	+ "Choisissez parmi les valeurs proposées celle correspondant à l'espèce que vous souhaitez compléter."
	+ "<select id='modalSelect'></select></center>"
	+ "</div><div class='modal-footer'><button type='button' class='btn btn-success btn-block' data-dismiss='modal' id='validateModalButton' onclick='choseSpecie();'>Ok"
	+ "</button></div></div></div></div>";
	$("body").append(modal);

	var button = "<button id='modalButton' style='display: none;' type='button' class='btn btn-primary btn-lg' data-toggle='modal' data-target='#modal'>Button</button>";
	$("body").append(button);
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
			success: toDo,
			error: toDoError
		});
	} else if (method === "POST") {
		var parameters = {data: param};

		$.ajax({
			url: url,
			type: "POST",
			data: parameters,
			success: toDo,
			error: toDoError
		});
	}
}

function getRecolt(data) {
	var arr = data.split("$");
	if (arr[0] == "0") {
		alert("La récolte passée en paramètre n'existe pas.");
		document.location.href="http://inventaire.dbmyco.fr/";
	}

	if (type_id == 0)
		recolt = new Recolte();
	else if (type_id == 1) {
		recolt = new Recolte(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10],
			arr[11], arr[12], arr[13], arr[14], arr[15], arr[16], arr[17], "", arr[18], arr[19], arr[20], arr[21], arr[22],
			arr[23], arr[24], arr[25], arr[26], arr[27], arr[28], arr[29], arr[30], arr[31], arr[32]);
		ajaxCall("GET", "/ajax/getHerbiers.php?id=" + recolt_id, populateHerbiers);
	}
	else
		recolt = new Recolte(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10],
			arr[11], arr[12], arr[13], arr[14], arr[15], arr[16], arr[17], arr[18]);		

	populateFields();
}

function populateHerbiers(data) {
	if (data.length == 0)
		return;

	var array = data.split("\n");
	for (var i = 0; i < array.length; i++) {
		if (array[i].length > 0) {
			var entry = array[i].split("$");

			recolt.codeHerbier.push(entry[0]);
			recolt.herbier.push(entry[1]);
		}
	}
	populateHerbierFields();
}

function populateFields() {
	populateOfflineFields();
	populateElementsFromReferential();

	callPositionInformations();
	requestCompleteRecolte();
	loadPictures();
}

function populateOfflineFields() {
	populateSelect('listSVF', rangArray, recolt.rang);
	populateSelect("listPhylum", phylumsArray, "");
	populateSelect("listModulation", modulationArray, recolt.modulation);
	populateSelect("hostState", etatHoteArray, recolt.etatHote);
	populateSelect("typeRecolte", recoltTypeArray, recolt.type_recolte);
	populateSelect("ref", referentielHabitatArray, recolt.ref);
	populateSelect("listRegne", reignArray);
	populateInput("dataGenre", recolt.genre);
	populateInput("dataSpecies", recolt.epithete);
	populateInput("dataTaxon", recolt.taxon);
	populateInput("dataAuthor", recolt.autorites);
	populateDate(recolt.date);
	populateInput("latitude", recolt.latitude);
	populateInput("longitude", recolt.longitude);
	populateInput("altitude", recolt.altitude);
	populateInput("precision", recolt.precision);
	populateInput("range", recolt.rayon);
	populateInput("nbFound", recolt.quantite);
	populateLegsDets();
	populateInput("lieu-dit", recolt.lieu_dit);
	populateInput("domain", recolt.domaine);
	populateInput("subdomain", recolt.sous_domaine);
	populateInput("mailles", recolt.mer + "/" + recolt.men);
	populateInput("ecologie", recolt.ecologie);
	populateInput("collaboration", recolt.collaboration);
	populateInput("remarques", recolt.remarque);
}

function populateLegsDets() {
	var legs = recolt.leg.split("/");
	var dets = recolt.det.split("/");

	populateInput("leg0", legs[0]);
	populateInput("det0", dets[0]);

	if (legs.length > 1 || dets.length > 1) {
		var max = Math.max(legs.length, dets.length);
		for (var i = 1; i < max; i++) {
			addLegDet(legs[i], dets[i]);
		}
	}
}

function populateHerbierFields() {
	var codes = recolt.codeHerbier;
	var nums = recolt.herbier;

	if (codes[0])
		populateInput("codeHerbier0", codes[0]);
	if (nums[0])
		populateInput("numHerbier0", nums[0]);

	if (codes.length > 1 || nums.length > 1) {
		var max = Math.max(codes.length, nums.length);
		for (var i = 1; i < max; i++) {
			addHerbier(codes[i], nums[i]);
		}
	}
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
	populateSelect("protectionStatus", array, recolt.statut_protection);
}

function populateAssos(data) {
	var array = data.trim().split("\n");

	populateSelect("asso", array, recolt.asso);
}

function populateHosts(data) {
	var array = data.trim().split("\n");
	populateSelect("hote", array, recolt.hote);
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
	var lat = $("#latitude").val(), lon = $("#longitude").val();
	if (lat)
		recolt.latitude = lat;
	if (lon)
		recolt.longitude = lon;

	if (recolt.latitude.length > 1 && recolt.longitude.length > 1) {
		var latlng = new google.maps.LatLng(parseFloat(recolt.latitude), parseFloat(recolt.longitude));
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var position = getPositionInformations(results);
				populateInput("country", position.country);
				dpt = position.dpt;
				populateDepartements();
				populateInput("city", position.city);
			} else {
				alert('Geocoder failed due to: ' + status);
			}
		});
	} else {
		if (recolt.pays.length == 0)
			recolt.pays = "France";
		populateInput("country", recolt.pays);
		dpt = recolt.departement;
		populateDepartements();
		populateInput("city", recolt.ville);
	}

}

function getPositionInformations(position) {
	var infos = {};
	for (var i = 0; i < position.length; i++) {
		var components = position[i].address_components;
		for (var j = 0; j < components.length; j++) {
			var item = components[j];
			for (var k = 0; k < item.types.length; k++) {
				if (!infos.city && item.types[k] == "locality")
					infos.city = item.long_name;
				if (!infos.dpt && item.types[k] == "administrative_area_level_2")
					infos.dpt = item.short_name + " - " + item.long_name.toUpperCase();
				if (!infos.country && item.types[k] == "country")
					infos.country = item.long_name;
			}
		}
	}
	return infos;
}

function populateDepartements() {
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestDepartements.php", populateDepartementsInfos);
}

function populateDepartementsInfos(data) {
	var array = data.split("\n");
	for (var i = 0; i < array.length; i++) {
		if (array[i].indexOf(dpt) > -1) {
			dpt = array[i];
			break;
		}
	}
	populateSelect("dpt", array, dpt);
	finishInit();
}

function finishInit() {
	addListeners();
	checkFields();
}

function loadPictures() {
	if (type_id != 0)
		ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestPictures.php?id=" + recolt_id + "&type=" + type_id, populatePictures);
	else
		populatePictures("");
}

function populatePictures(data) {
	if (data.length > 0) {
		var array = data.split("\n");
		array.forEach(function(entry) {
			if (entry.trim().length > 0) {
				var values = entry.split("$");
				pictures.push("/wp-content/uploads/photos_recoltes/user" + recolt.user_id + "/recolte" + recolt_id + "/" + values[0]);
				var name = values[1].length > 0 ? values[1] : username;
				picturesAuthors.push(name);
			}
		});
	}
	showPicturesTab();
}

function changePhotoListener(id) {
	$("#picButton").unbind();
	$("#picButton").bind("click", function() {
		$("#picInput" + id).trigger("click");
	});

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
	if (!input.files || !input.files[0].type.match("image.*")) {
		alert("Veuillez sélectionner une image.");
		return;
	}

	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			pictures.push(e.target.result);
			picturesAuthors.push(username);
			savePicturesAuthors();
			showPicturesTab();
		}
		reader.readAsDataURL(input.files[0]);
	}
}

function savePicturesAuthors() {
	for (var i = 0; i < picturesAuthors.length; i++) {
		var input = $("#picAuthorInput" + i);
		if (input.length != 0) {
			var regex = new RegExp("'", "g");
			picturesAuthors[i] = input.val().replace(regex, "&#39;");
		}
	}
}

function showPicturesTab() {
	var pics = "<tr>", authors = "<tr>", deletes = "<tr>";

	var picMaxWidth;
	if (pictures.length == 1)
		picMaxWidth = "30%";
	else if (pictures.length == 2)
		picMaxWidth = "75%";
	else
		picMaxWidth = "100%";

	var div = "";
	for (var i = 0; i < pictures.length; i++) {
		pics += "<td class='text-center'><img style='max-width: " + picMaxWidth + ";' class='picture' src='" + pictures[i] + "' alt='photo'/></td>";
		authors += "<td class='text-center'>Auteur : <input id='picAuthorInput" + i + "' value='" + picturesAuthors[i] + "'></input></td>";
		deletes += "<td class='text-center'><button type='button' class='btn btn-success delete' onclick='removePicture(" + i + ")'>"
		+ "<span class='glyphicon glyphicon-trash'></span></button></td>";

		if ((i - 3)%4 == 0 && i != (pictures.length - 1)) {
			pics += "</tr>", authors += "</tr>", deletes += "</tr>";
			div += pics + authors + deletes; 
			pics = "<tr>", authors = "<tr>", deletes = "<tr>";
		}
	}
	pics += "</tr>", authors += "</tr>", deletes += "</tr>";
	div += pics + authors + deletes;
	$("#tableBody").empty();
	$("#tableBody").append(div);
	addPictureInput();
}

function removePicture(id) {
	pictures.splice(id, 1);
	picturesAuthors.splice(id, 1);
	showPicturesTab();
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
	var src = picSrc ? picSrc : "/wp-content/uploads/photos_recoltes/user" + recolt.user_id + "/recolte" + recolt_id + "/" + name;
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
	if (id == "substrat" || id == "asso" || id == "hote")
		options += "<option class='newValue'>Ajouter une nouvelle valeur</option>";
	for (var i = 0; i < array.length; ++i) {
		options += "<option>" + array[i] + "</option>";
	}
	list.val(selected);

	list.append(options);
}

function Recolte(user_id, genre, epithete, rang, taxon, modulation, autorites, date, latitude, longitude, altitude, rayon,
	quantite, substrat, hote, etatHote, leg, det, precision, pays, departement, ville, lieu_dit, domaine, sous_domaine, statut_protection,
	men, mer, ref, ecologie, asso, collaboration, remarque, type_recolte) {
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
	this.precision = precision || "",
	this.rayon = rayon || "",
	this.quantite = quantite || "",
	this.substrat = substrat || "",
	this.hote = hote || "",
	this.etatHote = etatHote || "",
	this.leg = leg || "",
	this.det = det || "",

	this.pays = pays || "",
	this.departement = departement || "",
	this.ville = ville || "",
	this.lieu_dit = lieu_dit || "",
	this.domaine = domaine || "",
	this.sous_domaine = sous_domaine || "",
	this.statut_protection = statut_protection || "",
	this.men = men || "",
	this.mer = mer || "",
	this.ref = ref || "",
	this.ecologie = ecologie || "",
	this.codeHerbier = [],
	this.herbier = [],
	this.asso = asso || "",
	this.collaboration = collaboration || "",
	this.remarque = remarque || "",
	this.type_recolte = type_recolte || ""
}

function checkFields() {
	$(".has-error").each(function() {
		$(this).trigger("change");
	});
	$(".has-success").each(function() {
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

	$("#biblioButton").bind("click", function() {
		var champi = $("#dataGenre").val() + "+" + $("#dataSpecies").val();
		window.open("http://doc.dbmyco.fr/consultation-par-especes/resultat-de-recherche-par-especes/?nom_biblio=" + champi);
		return false;
	});

	$(".newValue").bind("click", function() {
		addNewValue($(this).parent());
	});
}

function addNewValue(select) {
	var value = window.prompt("Entrez la nouvelle valeur : ");

	if (value) {
		select.append("<option>" + value + "</option>");
		select.val(value);
	}
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
function addLegDet(leg, det) {
	var legInfo = $("#groupleg0").find("img").attr("title").replace("'", "&#39;");
	var detInfo = $("#groupdet0").find("img").attr("title").replace("'", "&#39;");

	if (!leg)
		leg = "";
	if (!det)
		det = "";

	var div = "<div id='groupleg" + legDetRow + "'class='form-group col-xs-6'>"
	+ "<label for='leg' class='control-label col-xs-3'>Légataire</label>"
	+ "<div class='col-xs-8'>"
	+ "<input id='leg" + legDetRow + "' value='" + leg + "' class='legataire' style='width:100%;'></input>"
	+ "</div>"
	+ "<span class='col-xs-1'><img class='data-toggle='tooltip' data-placement='top' title='" + legInfo + "' src='/images/infobulle.png'></span>"
	+ "</div>";

	div += "<div id='groupdet" + legDetRow + "'class='form-group col-xs-6'>"
	+ "<label for='det' class='control-label col-xs-3'>Déterminateur</label>"
	+ "<div class='col-xs-6'>"
	+ "<input id='det" + legDetRow + "' value='" + det + "' class='determinateur' style='width:100%;'></input>"
	+ "</div>"
	+ "<span class='col-xs-1'><img class='data-toggle='tooltip' data-placement='top' title='" + detInfo + "' src='/images/infobulle.png'></span>"
	+ "<div class='col-xs-1'>"
	+ "<button type='button' class='btn btn-success' onclick='addLegDet()'>"
	+ "<span class='glyphicon glyphicon-plus'></span></div>"
	+ "<div class='col-xs-1'>"
	+ "<button type='button' class='btn btn-success' onclick='removeLegDet(" + legDetRow + ");'>"
	+ "<span class='glyphicon glyphicon-minus'></span></button>"
	+ "</div></div>";

	var row = getLastLegDetRow();
	$("#groupdet" + row).after(div);
	legDetRow++;
}

var herbierRow = 1;
function addHerbier(codeHerbier, numHerbier) {
	var regex = new RegExp("'", "g");
	var codeInfo = $("#groupcodeHerbier0").find("img").attr("title").replace(regex, "&#39;");
	var numInfo = $("#groupnumHerbier0").find("img").attr("title").replace(regex, "&#39;");

	if (!codeHerbier)
		codeHerbier = "";
	if (!numHerbier)
		numHerbier = ""; 

	var div = "<div id='groupcodeHerbier" + herbierRow + "'class='form-group col-xs-6'>"
	+ "<label for='codeHerbier' class='control-label col-xs-3'>Code herbier</label>"
	+ "<div class='col-xs-8'>"
	+ "<input id='codeHerbier" + herbierRow + "' value='" + codeHerbier + "' class='codeHerbier' style='width:100%;'></input>"
	+ "</div>"
	+ "<span class='col-xs-1'><img class='data-toggle='tooltip' data-placement='top' title='" + codeInfo + "' src='/images/infobulle.png'></span>"
	+ "</div>";

	div += "<div id='groupnumHerbier" + herbierRow + "'class='form-group col-xs-6'>"
	+ "<label for='numHerbier' class='control-label col-xs-3'>Num herbier</label>"
	+ "<div class='col-xs-6'>"
	+ "<input id='numHerbier" + herbierRow + "' value='" + numHerbier + "' class='numHerbier' style='width:100%;'></input>"
	+ "</div>"
	+ "<span class='col-xs-1'><img class='data-toggle='tooltip' data-placement='top' title='" + numInfo + "' src='/images/infobulle.png'></span>"
	+ "<div class='col-xs-1'>"
	+ "<button type='button' class='btn btn-success' onclick='addHerbier()'>"
	+ "<span class='glyphicon glyphicon-plus'></span></button></div>"
	+ "<div class='col-xs-1'>"
	+ "<button type='button' class='btn btn-success' onclick='removeHerbier(" + herbierRow + ");'>"
	+ "<span class='glyphicon glyphicon-minus'></span></button>"
	+ "</div></div>";

	var row = getLastHerbierRow();
	$("#groupnumHerbier" + row).after(div);
	herbierRow++;
}

function getLastLegDetRow() {
	var max = 0;
	$("div").filter(function() {
		return this.id.match("groupleg.*");
	}).each(function() {
		var id = parseInt(this.id.split("groupleg")[1]);
		if (id > max)
			max = id;
	});
	return max;
}
function getLastHerbierRow() {
	var max = 0;
	$("div").filter(function() {
		return this.id.match("groupnumHerbier.*");
	}).each(function() {
		var id = parseInt(this.id.split("groupnumHerbier")[1]);
		if (id > max)
			max = id;
	});
	return max;
}

function removeHerbier(id) {
	$("#groupcodeHerbier" + id).remove();
	$("#groupnumHerbier" + id).remove();
}

function removeLegDet(id) {
	$("#groupleg" + id).remove();
	$("#groupdet" + id).remove();
}

function requestCompleteRecolte() {
	var phylum = $("#listPhylum").find(":selected").text();
	var genre = $("#dataGenre").val();
	var espece = $("#dataSpecies").val();
	var rang = $("#listSVF").find(":selected").text();
	var taxon = $("#dataTaxon").val();

	var url = "/ajax/completeInfosRecolte.php?phylum=" + phylum + "&genre=" + genre + "&espece=" + espece + "&rang=" + rang
	+ "&taxon=" + taxon;

	if (genre.length == 0 || espece.length == 0)
		return;
	
	ajaxCall("GET", url, completeRecolte);
}

var modalOptions;
function completeRecolte(data) {
	var response;
	if (data.length == 0) {
		alert("Aucun résultat trouvé dans le référentiel.");
		return;
	}
	modalOptions = data.split("\n");
	if (modalOptions.length == 1)
		completeRecolteFields(modalOptions[0].split("||"));
	else if (modalOptions.length > 100)
		alert("Trop de résultats possibles, veuillez affiner votre recherche.");
	else
		showCompleteModal(modalOptions);
}

function showCompleteModal(array) {
	/*var modal = "<div id='toto' class='modal fade in' tabindex='-1' role='dialog'>"
	+ "<div class='modal-dialog'><div class='modal-content'><div class='modal-header'>A nice header</div><div class='modal-body'>"
	+ "Choisissez parmi les valeurs proposées celle correspondant à l'espèce que vous souhaitez compléter."
	+ "<select id='modalSelect'></select>"
	+ "</div><div class='modal-footer'>Ow, a footer !</div></div></div></div>";
	$("body").append(modal);
	*/
	var select = $("#modalSelect");
	select.text("");
	for (var i = 0; i < array.length; i++) {
		var response = array[i].split("||");
		select.append("<option>" + response[0] + " " + $("#dataGenre").val() + " " + $("#dataSpecies").val() + " " + response[7] + " "
			+ response[6] + " " + response[1] + "</option>");
	}
	$("#modalButton").trigger("click");
}

function choseSpecie() {
	var array = modalOptions;
	completeRecolteFields(modalOptions[document.getElementById("modalSelect").selectedIndex].split("||"));
}

function completeRecolteFields(response) {
	$("#listPhylum").val(response[0]);
	$("#dataAuthor").val(response[1]);
	$("#dataFamille").val(response[2]);
	$("#dataClasse").val(response[3]);
	$("#listRegne").val(response[4]);
	$("#dataOrdre").val(response[5]);
	$("#dataTaxon").val(response[6]);
	$("#listSVF").val(response[7]);
}

function submit() {
	if (!fieldsAreFilled()) {
		alert("Vous devez remplir tous les champs en rouge pour soumettre une récolte.");
		return;
	}
	saveRecolt();
}

function fieldsAreFilled() {
	return $(".has-error").length == 0;
}

function resetSelects() {
	var array = ["#substrat", "#asso", "#protectionStatus", "#hote"];

	for (var i = 0; i < array.length; i++) {
		var entry = array[i];
		var hasEmptyStr = false;

		$(entry + " option").each(function() {
			if ($(this).val().length == 0)
				hasEmptyStr = true;
		});

		if (!hasEmptyStr) {
			$(entry).append("<option></option>");
		}
		$(entry).val("");
	}

}

function reset() {
	recolt = new Recolte();
	populateOfflineFields();

	populateInput("dataClasse", "");
	populateInput("dataOrdre", "");
	populateInput("dataFamille", "");

	resetSelects();

	$("#leg0").val("");
	$("#groupleg0").trigger("change");
	$("#det0").val("");
	$("#groupdet0").trigger("change");

	for (var i = 1; i < legDetRow; i++) {
		var leg = $("#groupleg" + i);
		var det = $("#groupdet" + i);

		if (leg.length != 0) {
			leg.remove();
			det.remove();
		}
	}

	$("#codeHerbier0").val("");
	$("#numHerbier0").val("");

	for (var i = 1; i < herbierRow; i++) {
		var code = $("#groupcodeHerbier" + i);
		var num = $("#groupnumHerbier" + i);

		if (code.length != 0) {
			code.remove();
			num.remove();
		}
	}

	pictures = [];
	picturesAuthors = [];
	showPicturesTab();
	callPositionInformations();
	checkFields();
}

function saveRecolt() {
	var user_id = recolt.user_id;
	recolt = {};
	recolt.user_id = user_id;
	recolt.genre = $("#dataGenre").val();
	recolt.espece = $("#dataSpecies").val();
	recolt.rang = $("#listSVF option:selected").text();
	recolt.taxon = $("#dataTaxon").val();
	recolt.modulation = $("#listModulation option:selected").text();
	recolt.autorites = $("#dataAuthor").val();

	recolt.regne = $("#listRegne option:selected").text();
	recolt.phylum = $("#listPhylum option:selected").text();
	recolt.classe = $("#dataClasse").val();
	recolt.ordre = $("#dataOrdre").val();
	recolt.famille = $("#dataFamille").val();

	recolt.pays = $("#country").val();
	recolt.departement = $("#dpt option:selected").text().split("-")[0];
	recolt.ville = $("#city").val();
	recolt.lieu_dit = $("#lieu-dit").val();
	recolt.domaine = $("#domain").val();
	recolt.sous_domaine = $("#subdomain").val();
	recolt.statut_protection = $("#protectionStatus option:selected").text();

	var mailles = $("#mailles").val();
	if (mailles.length > 0) {
		mailles = mailles.split("/");
		recolt.men = mailles[0];
		recolt.mer = mailles[1];
	} else {
		recolt.men = "";
		recolt.mer = "";
	}
	recolt.latitude = $("#latitude").val();
	recolt.longitude = $("#longitude").val();
	recolt.altitude = $("#altitude").val();
	recolt.precision = $("#precision").val();
	recolt.quantite = $("#nbFound").val();
	recolt.etendue = $("#range").val();

	recolt.referentiel = $("#ref option:selected").text();
	recolt.habitat = $("#ecologie").val();
	recolt.hote = $("#hote option:selected").text();
	recolt.etat_hote = $("#hostState option:selected").text();
	recolt.substrat = $("#substrat option:selected").text();

	saveLegsDets();
	saveHerbiers();

	recolt.asso = $("#asso option:selected").text();
	recolt.collaboration = $("#collaboration").val();
	recolt.type_recolte = $("#typeRecolte option:selected").text();
	recolt.remarques = $("#remarques").val();
	recolt.pictures = pictures;
	savePicturesAuthors();
	recolt.pictures_authors = picturesAuthors;
	
	recolt.type_id = type_id;
	recolt.former_id = recolt_id;

	saveDate();
	if (!isValidDate(recolt.date)) {
		alert("La date de récolte est invalide, veuillez la modifier.");
		return;
	}

	ajaxCall("POST", "http://inventaire.dbmyco.fr/ajax/submitCompleteMobileRecolte.php", 
		recoltSaved, JSON.stringify(recolt), saveFailed);
}

function recoltSaved(data) {
	console.log(data);
	if (data.contains("OK")) {
		alert("Sauvegarde réussie !");
		document.location.href="http://inventaire.dbmyco.fr/";
		return false;
	} else
	alert("echec côté serveur");
}

function saveFailed(a, b, c) {
	alert("Echec de la requête de sauvegarde");
	console.log(a);
	console.log(b);
	console.log(c);
}
function saveLegsDets() {
	recolt.legs = $("#leg").val();
	recolt.dets = $("#det").val();
	var legs = "", dets = "";
	$(".legataire").each(function () {
		var val = $(this).val();
		if (val.length > 0)
			legs += val + "/";
	});
	legs = legs.substring(0, legs.length - 1);

	$(".determinateur").each(function () {
		var val = $(this).val();
		if (val.length > 0)
			dets += val + "/";
	});
	dets = dets.substring(0, dets.length - 1);

	recolt.legs = legs;
	recolt.dets = dets;
}
function saveHerbiers() {
	var numsHerbier = [], codesHerbier = [];
	$(".codeHerbier").each(function () {
		var val = $(this).val();
		if (val.length > 0)
			codesHerbier.push(val);
	});
	$(".numHerbier").each(function () {
		var val = $(this).val();
		if (val.length > 0)
			numsHerbier.push(val);
	});

	recolt.numsHerbier = numsHerbier;
	recolt.codesHerbier = codesHerbier;
}

function saveDate() {
	var day, month, year;
	day = $("#day option:selected").text();
	month = (months.indexOf($("#month option:selected").text()) + 1) + "";
	year = $("#year").val();

	if (month.length == 1)
		month = "0" + month;

	recolt.date = year + "-" + month + "-" + day;
	var d = new Date();
	recolt.created_at = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function isValidDate(d) {
	try {
		var date = new Date(d).toISOString();
		return true;
	} catch (e) {
		return false;
	}
}