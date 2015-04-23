var pictureSource;
var destinationType;
var currentPicNumber = -1;
var online = false;
var cameraOptions;

var nbPictures = 0;

// Fonction appellée lors de la réussite d'une géolocalisation
function onGeolocationSuccess(pos) {
	recolt.longitude = pos.coords.longitude;
	recolt.latitude = pos.coords.latitude;
	recolt.accuracy = Math.round(pos.coords.accuracy);
	setLocationFields(recolt.longitude, recolt.latitude, recolt.accuracy + " (mètres)");
}

// Fonction appellée lors de l'échec d'une géolocalisation
function onGeolocationError(error) {
	try {
		if (error.code == PositionError.PERMISSION_DENIED)
			alert("error.code permission denied");
		else if (error.code == PositionError.POSITION_UNAVAILABLE)
			alert("error.code POSITION_UNAVAILABLE");
		else if (error.code == PositionError.TIMEOUT)
			alert("error code timeout");

		alert("code " + error.code + " message " + error.message);

	//window.plugins.toast.showShortCenter("Localisation échouée. Activez votre wifi pour faciliter la localisation." + error.message);
	recolt.longitude = "";
	recolt.latitude = "";
	recolt.accuracy = "";
	setLocationFields("échec", "échec", "échec");
	} catch(err) {
		alert("error ongeolocerror " + error.message);
	}
}

// Lance la géolocalisation de l'utilisateur
function calculatePosition() {
	setLocationFields("calcul en cours...", "calcul en cours...", "calcul en cours...");
	try {
		alert(PositionError.PERMISSION_DENIED);
	} catch (err) {
		alert("permission denied " + err.message);
	}

	var locationOptions = {maximumAge: 60000, enableHighAccuracy: !online};
	navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, locationOptions);
}

//	Initialisation de la source de l'image et de la destination au lancement de la page
function initCamera() {
	nbPictures = 0;
	if (navigator.camera) {
		cameraOptions = {quality: 50, destinationType: Camera.DestinationType.FILE_URI, correctOrientation: true, encodingType: Camera.EncodingType.JPEG};
		pictureSource=navigator.camera.PictureSourceType;
		destinationType=navigator.camera.DestinationType;
	}
}
//	Fonction qui démarre l'appareil photo
function launchCamera() {
	if (nbPictures < 4) {
		navigator.camera.getPicture(cameraSuccess, cameraFailure, cameraOptions);
	} else {
		showModal("errorModal", true);
	}
}

//	Fonction appelée suite à la réussite de la prise d'une photo
function cameraSuccess(data) {
	if (currentPage == "camera_screen")
		addPictureToCameraScreen(data);
	else
		addPicture(data);
}

// Ajoute l'image photographiée à l'écran de prise de photo
function addPictureToCameraScreen(src) {
	var img = $("#cameraPic");
	img.attr("src", src);
	img.show();
}

var nb = 0;
//Fonction permettant d'ajouter une photo
function addPicture(src) {
	alert("add picture " + src);
	var picturesDiv = $("#picturesDiv");
	var idButton = nb + "delete";
	var idRow = nb + "row";
	var idPic = nb + "pic";

	var pictureRow = "<div id='" + idRow + "'>"+"<div class='row vertical-align'>"+"<span class='col-xs-6'><img id='"
	+ idPic + "'class='img-thumbnail picture' src=" + src + " alt='picture'/></span>"
	+"<span class='col-xs-6'><button type='button' class='btn btn-success btn-lg delete pull-right' id='" + idButton 
	+ "' onclick='deletePicture(this.id);'>"+"<span class='glyphicon glyphicon-trash'></span></button></span>"
	+"</div>"+"<div class='divider'></div></div>";

	++nb;
	++nbPictures
	picturesDiv.append(pictureRow);
}

//	Fonction appelée suite à l'échec de la prise d'une photo
function cameraFailure(data) {
	alert("camera failure " + data);
}

//	Fonction permettant de retirer une image
function deletePicture(id) {
	var div = $("#" + id).closest(".row").parent();
	div.remove();
	
	--nbPictures;
}

function uploadPicture(fileURI) {
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";

	var ft = new FileTransfer();
	ft.upload(fileURI, encodeURI("http://smnf-db.fr/ajax/uploadPicture.php"), onUploadSuccess, onUploadFailure, options);
}

function onUploadSuccess (r) {
	alert("Code = " + r.responseCode);
	alert("Response = " + r.response);
	alert("Sent = " + r.bytesSent);
}

function onUploadFailure (error) {
	alert("An error has occurred: Code = " + error.code);
	alert("upload error source " + error.source);
	alert("upload error target " + error.target);
}
