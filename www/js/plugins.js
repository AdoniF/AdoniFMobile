var currentPicNumber = -1;
var online = false;
var cameraOptions;
var firstTry;

var timeoutExpired = 3;
var nbPictures = 0;

var position = {
	coords : {
		longitude: "en cours...",
		latitude: "en cours...",
		accuracy: "en cours....",
		altitude: "en cours..."
	}
};

// Fonction appellée lors de la réussite d'une géolocalisation
function updatePosition() {
	recolt.longitude = position.coords.longitude;
	recolt.latitude = position.coords.latitude;
	recolt.accuracy = Math.round(position.coords.accuracy);
	recolt.altitude = position.coords.altitude;

	var altitude = recolt.altitude ? recolt.altitude + " (mètres)" : "indisponible";
	var accuracy = recolt.accuracy ? recolt.accuracy + " (mètres)" : "indisponible"
	setLocationFields(recolt.longitude, recolt.latitude, accuracy, altitude);
}

function onGeolocationSuccess (pos) {
	position = pos;
}

// Fonction appellée lors de l'échec d'une géolocalisation
function onGeolocationError(error) {
	window.plugins.toast.showShortBottom("Echec de la localisation GPS.");
}

var watchID;
// Lance la géolocalisation de l'utilisateur
function calculatePosition() {
	var options = {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000};
	watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, options);
}

//	Initialisation de la source de l'image et de la destination au lancement de la page
function initCamera() {
	nbPictures = 0;
	if (navigator.camera) {
		cameraOptions = {
			quality: 50, 
			destinationType: Camera.DestinationType.FILE_URI, 
			correctOrientation: true, 
			encodingType: Camera.EncodingType.JPEG
		};
	}
}
//	Fonction qui démarre l'appareil photo
function launchCamera() {
	if (nbPictures < 4) {
		navigator.camera.getPicture(cameraSuccess, cameraFailure, cameraOptions);
	} else {
		navigator.notification.alert(
			"Vous avez atteint la limite du nombre de photos. Veuillez en supprimer une pour en prendre une nouvelle.",
			function (){},
			"Trop de photos",
			"Ok"
			);
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
	var img = dom.cameraPicture;
	img.attr("src", src);
	img.show();
}

var nb = 0;
//Fonction permettant d'ajouter une photo
function addPicture(src) {
	try {
		var picturesDiv = document.getElementById("picturesDiv");
		picturesDiv.innerHTML = picturesDiv.innerHTML + getPictureRow(src);
	} catch (err) {
		alert("add picture " + err.message);
	}
}

function getPictureRow(src) {
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
	return pictureRow;
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
