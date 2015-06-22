var currentPicNumber = -1;
var cameraOptions;
var firstTry;

var timeoutExpired = 3;
var nbPictures = 0;

var pictures = [];

var position = {
	coords : {
		longitude: "en cours...",
		latitude: "en cours...",
		accuracy: "en cours....",
		altitude: "en cours..."
	}
};

var nbTries = 0;
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

// Fonction appellée lors de la réussite d'une géolocalisation
function onGeolocationSuccess (pos) {
	shortBottomToast("Localisation détectée !");
	//alert("Localisation gps détectée");
	position = pos;
	updatePosition();
	nbTries = 0;
}

// Fonction appellée lors de l'échec d'une géolocalisation
function onGeolocationError(error) {
	alert("Echec de la localisation GPS, votre GPS est désactivé ou ne parvient pas à capter un signal. Un nouvel essai va se déclencher.");
	nbTries++;
	var options = {enableHighAccuracy: true, timeout: 15000, maximumAge: 5000};
	navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, options);
	/*navigator.geolocation.clearWatch(watchID);
	var options = {enableHighAccuracy: true, timeout: 20000, maximumAge: 3000};
	watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, options);*/
}

var watchID;
// Lance la géolocalisation de l'utilisateur
function calculatePosition() {
	shortBottomToast("Calculate position");
	/*var options = {enableHighAccuracy: true, timeout: 15000, maximumAge: 5000};
	watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, options);*/
}

function launchPosition() {
	nbTries++;
	var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 5000};
	navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, options);
	/*navigator.geolocation.getCurrentPosition(function(pos){
		alert('suc')
		alert(JSON.stringify(pos))
	},function(errMsg){
		alert(JSON.stringify(errMsg))
		navigator.geolocation.getCurrentPosition(function(pos){  
			alert('suc')
			alert(JSON.stringify(pos))
		},function(errMsg){
			alert(JSON.stringify(errMsg))
		}, {
			enableHighAccuracy: true,
			timeout: 60*1000*2,
			maximumAge: 1000*60*10
		});
	}, {
		enableHighAccuracy: false,
		timeout: 60*1000,
		maximumAge: 1000*60*10
	});*/
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
	canvas = document.createElement("canvas");
	navigator.camera.getPicture(cameraSuccess, cameraFailure, cameraOptions);
}

//	Fonction appelée suite à la réussite de la prise d'une photo
function cameraSuccess(src) {
	showSpinnerDialog("Sauvegarde", "Sauvegarde de l'image en cours...", true);
	savePictureToGallery(src);

	if (currentPage == "camera_screen")
		addPictureToCameraScreen(src);
	else
		addPicture(src);
}

var canvas;
// Sauvegarde les images dans la gallerie du smartphone
function savePictureToGallery(src) {
	var context, imageDataUrl, imageData;
	var img = new Image();
	img.onload = function() {
		canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		context = canvas.getContext('2d');
		context.drawImage(img, 0, 0);
		
		imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
		imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
		cordova.exec(
			onSaveSuccess,
			onSaveFailure,
			'Canvas2ImagePlugin',
			'saveImageDataToLibrary',
			[imageData]
			);
	};

	img.src = src;
}

// Fonction appellée lors de la réussite de la sauvegarde
function onSaveSuccess() {
	window.plugins.spinnerDialog.hide();
	shortBottomToast("Sauvegarde réussie !")
}

// Fonction appellée lors de l'échec de la sauvegarde
function onSaveFailure() {
	alert("La sauvegarde de la photo a échoué. Vous pourrez l'utiliser dans l'application, mais vous ne pourrez pas la retrouver"
		+ "dans votre gallerie.", null, "Echec de la sauvegarde", "Ok");
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
		pictures.push(src);
		showPicturesTab();
	} catch (err) {
		alert("add picture " + err.message);
	}
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

// Crée un tableau contenant les images de la récolte en cours
function showPicturesTab() {
	var pics = "<tr>", deletes = "<tr>";

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
		deletes += "<td class='text-center'><button type='button' class='btn btn-success delete' onclick='removePicture(" + i + ")'>"
		+ "<span class='glyphicon glyphicon-trash'></span></button></td>";

		if ((i - 2)%3 == 0 && i != (pictures.length - 1)) {
			pics += "</tr>", deletes += "</tr>";
			div += pics + deletes; 
			pics = "<tr>", deletes = "<tr>";
		}
	}
	pics += "</tr>", deletes += "</tr>";
	div += pics + deletes;

	document.getElementById("tableBody").innerHTML = div;
}

// Supprime une photo de la récolte en cours
function removePicture(id) {
	pictures.splice(id, 1);
	showPicturesTab();
}
