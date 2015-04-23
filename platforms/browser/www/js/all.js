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

/*
Fonction permettant de faire un appel ajax sur une ressource
@param method : méthode de la requête (GET, POST...)
@param url : lien vers la ressource
@param toDo : méthode qui sera effectuée en réponse à la requête
@param param : paramètre que l'on peut passer à la méthode toDo si besoin d'infos
*/

function ajaxCall(method, url, toDo, param, errorMessage) {
	if (method == "GET") {
		$.get(url)
		.done(function (data) {
			toDo(data, param);
		})
		.fail(function (err) {
			alert(errorMessage);
		});
	} else if (method == "POST") {
		var parameters = {"param1": param.param1, "param2": param.param2};
		$.post(url, parameters)
		.done(function (data) {
			toDo(data, param);
		})
		.fail(function (err) {
			alert(errorMessage);
		});
	}
}

function sendPicture(fileURI) {
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";

	var params = {};
	params.value1 = "test";
	params.value2 = "param";

	options.params = params;

	var ft = new FileTransfer();
	ft.upload(fileURI, encodeURI("http://smnf-db.fr/ajax/uploadPicture.php"), win, fail, options);
}

var win = function (r) {
	console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
}

var fail = function (error) {
	alert("An error has occurred: Code = " + error.code);
	console.log("upload error source " + error.source);
	console.log("upload error target " + error.target);
}

