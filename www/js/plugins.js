var pictureSource;
var destinationType;
var currentPicNumber = -1;
var online = false;
var cameraOptions;
var firstTry;

var timeoutExpired = 3;

var nbPictures = 0;

// Fonction appellée lors de la réussite d'une géolocalisation
function onGeolocationSuccess(pos) {
	try {
		recolt.longitude = pos.coords.longitude;
		recolt.latitude = pos.coords.latitude;
		recolt.accuracy = Math.round(pos.coords.accuracy);
		recolt.altitude = pos.coords.altitude;
		
		var altitude = recolt.altitude ? recolt.altitude + " (mètres)" : "indisponible";
		setLocationFields(recolt.longitude, recolt.latitude, recolt.accuracy + " (mètres)", altitude);
	}catch (err) {alert(err.message);}
}

// Fonction appellée lors de l'échec d'une géolocalisation
function onGeolocationError(error) {
	try {
		if (firstTry) {
			window.plugins.toast.showShortBottom("Echec de la localisation GPS. Tentative de localisation par le réseau");
			firstTry = false;
			calculatePosition(true);
		} else {
			recolt.longitude = "";
			recolt.latitude = "";
			recolt.accuracy = "";
			recolt.altitude = "";
			setLocationFields("échec", "échec", "échec", "échec");
		}
	}catch (err) {alert(err.message);}
}

// Lance la géolocalisation de l'utilisateur
function calculatePosition(lowAccuracy) {
	var timeout, highAccuracy;
	try {
		setLocationFields("calcul en cours...", "calcul en cours...", "calcul en cours...", "calcul en cours...");
		if (lowAccuracy) {
			timeout = 3000;
			highAccuracy = false;
		} else {
			firstTry = true;
			timeout = 2000;
			highAccuracy = true;
		}

		var locationOptions = {enableHighAccuracy: highAccuracy, timeout: timeout};
		navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, locationOptions);
	} catch (err) {
		alert("error calculate position " + err.message);
	}
}

//	Initialisation de la source de l'image et de la destination au lancement de la page
function initCamera() {
	nbPictures = 0;
	if (navigator.camera) {
		cameraOptions = {quality: 50, destinationType: Camera.DestinationType.FILE_URI, correctOrientation: true, 
			encodingType: Camera.EncodingType.JPEG, saveToPhotoAlbum: true};
		pictureSource=navigator.camera.PictureSourceType;
		destinationType=navigator.camera.DestinationType;
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
