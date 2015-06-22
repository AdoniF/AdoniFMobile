
var recolt_id;
function init(id) {
	console.log(id);
	recolt_id = id;
	loadPictures();
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


var pictures = [];
var picturesAuthors = [];
function loadPictures() {
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestPictures.php?id=" + recolt_id + "&type=1", populatePictures, "", function(a, b, c) {alert(b);});
}

function populatePictures(data) {
	console.log(data);
	if (data.length > 0) {
		var array = data.split("\n");
		array.forEach(function(entry) {
			if (entry.trim().length > 0) {
				var values = entry.split("$");
				pictures.push("/wp-content/uploads/photos_recoltes/user" + values[2] + "/recolte" + recolt_id + "/" + values[0]);
				var name = values[1].length > 0 ? values[1] : "inconnu";
				picturesAuthors.push(name);
			}
		});
	}
	showPicturesTab();
}

function showPicturesTab() {
	var pics = "<tr>", authors = "<tr>";

	var picMaxDimension;
	if (pictures.length == 1)
		picMaxDimension = "20%";
	else if (pictures.length == 2)
		picMaxDimension = "50%";
	else
		picMaxDimension = "75%";

	var div = "";
	for (var i = 0; i < pictures.length; i++) {
		pics += "<td class='text-center'><img style='max-width: " + picMaxDimension + "; max-height: " + picMaxDimension + ";' class='picture' src='" + pictures[i] + "' alt='photo'/></td>";
		authors += "<td class='text-center'>Auteur : " + picturesAuthors[i] + "</td>";

		if ((i - 3)%4 == 0 && i != (pictures.length - 1)) {
			pics += "</tr>", authors += "</tr>";
			div += pics + authors; 
			pics = "<tr>", authors = "<tr>";
		}
	}
	pics += "</tr>", authors += "</tr>";
	div += pics + authors;
	$("#tableBody").empty();
	$("#tableBody").append(div);
}