var pictureSource;
var destinationType;
var currentPicNumber = -1;
var online = false;
var cameraOptions;

var nbPictures = 0;

// Fonction appellée lors de la réussite d'une géolocalisation
function onGeolocationSuccess(pos) {
	$("#longitude").text("Longitude : " + pos.coords.longitude);
	$("#latitude").text("Latitude : " + pos.coords.latitude);
	$("#accuracy").text("Précision : " + Math.round(pos.coords.accuracy) + " mètres");
}

// Fonction appellée lors de l'échec d'une géolocalisation
function onGeolocationError(error) {
	window.plugins.toast.showShortCenter("Localisation échouée. Activez votre wifi pour faciliter la localisation." + error.message);
	//alert("Code " + error.code + "\n" + "message " + error.message + "\n");
	$("#longitude").text("Longitude : échec");
	$("#latitude").text("Latitude : échec");
	$("#accuracy").text("Précision : échec");
}

// Lance la géolocalisation de l'utilisateur
function calculatePosition() {
	$("#longitude").text("Longitude : calcul en cours...");
	$("#latitude").text("Latitude : calcul en cours...");
	$("#accuracy").text("Précision : calcul en cours...");

	var locationOptions = {maximumAge: 60000, timeout: 5000, enableHighAccuracy: !online};
	navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, locationOptions);
}

//	Initialisation de la source de l'image et de la destination au lancement de la page
function initCamera() {
	nbPictures = 0;
	if (navigator.camera) {
		cameraOptions = {quality: 100, destinationType: Camera.DestinationType.DATA_URL,
			correctOrientation: true, encodingType: Camera.EncodingType.JPEG };

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
	data = "data:image/jpeg;base64," + data;
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
	var picturesDiv = $("#picturesDiv");
	var idButton = nb + "delete";
	var idRow = nb + "row";
	var idPic = nb + "pic";

	var pictureRow ="<div id='" + idRow + "'><div class='row'><div class='col-xs-6 pull-left vcenter'><img id='" + idPic + "'"
	+ "class='img-thumbnail' src=" + src + " alt='picture' /></div><div class='col-xs-6 vcenter'>"
	+ "<button type='button' class='btn btn-primary btn-lg delete pull-right' id='" + idButton + "'"
	+ "onclick='deletePicture(this.id);'>Supprimer</button></div></div><div class='divider'></div></div>";

	++nb;
	++nbPictures
	picturesDiv.append(pictureRow);

	var pic = $("#" + idPic);
	var button = $("#" + idButton);
	var marginTop = (pic.height() / 2) - button.height() / 2;
	button.css("margin-top", marginTop + "px" );	
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