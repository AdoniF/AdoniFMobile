function RecoltBean (data, picturesUrls, localID) {
	this.data = data;
	this.picturesUrls = picturesUrls;
	var localID = localID;
	
	var uploadFailed = false;

	var nbUploaded = 0;
	var ftPictures = [];

	this.upload = function () {
		ajaxCall("POST", "http://inventaire.dbmyco.fr/ajax/createTemporaryRecolt.php", onDataUploadSuccess, JSON.stringify(data),
			onDataUploadError);
	}

	function onDataUploadSuccess(data) {
		if (data.contains("OK")) {
			var message = "Envoi de la récolte " + localID + " réussi.";

			if (!picturesUrls.isEmpty())
				uploadPictures(data.split(";")[1]);
			else {
				uploadFinished();
				shortBottomToast(message);
			}
		} else {
			hideSpinnerDialog();
			shortBottomToast("Echec de l'envoi. Veuillez réessayer plus tard.");
		}
	}

	function onDataUploadError() {
		hideSpinnerDialog();
		alert("Echec de la connexion au serveur. Vérifiez votre connexion internet.");
	}

	function uploadPictures(recoltID) {
		for (var i = 0; i < picturesUrls.length; ++i) {
			var fileURI = picturesUrls[i];
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";

			var params = {};
			params.userID = user.id;
			params.recoltID = recoltID;
			params.fileName = data.genre + "_" + data.epithete + "_" + data.rangintraspec + "_" + data.taxintraspec 
			+ "_" + recoltID + "_" + data.date_recolt + "_" + i;
			options.params = params;

			var ft = new FileTransfer();
			ftPictures.push(ft);
			ft.upload(fileURI, encodeURI("http://inventaire.dbmyco.fr/ajax/uploadPicture.php"), 
				onUploadSuccess, onUploadFailure, options);
		}
		
	}

	function onUploadSuccess (r) {
		nbUploaded++;
		checkUploadCompletion();
	}

	function onUploadFailure (error) {
		if (error.code != 4)
			abortPicturesUpload();
		uploadFailed = true;
	}

	function abortPicturesUpload() {
		ftPictures.forEach(function (entry) {
			entry.abort();
		});
	}

	function checkUploadCompletion() {
		if (nbUploaded !== picturesUrls.length)
			return;
		uploadFinished();

		if (uploadFailed)
			alert("Ajout de la récolte " + localID + ":" + data.phylum + " réussi mais échec de la sauvegarde des photos. "
				+ "Veuillez les ajouter manuellement sur le site.");
		else
			shortBottomToast("Envoi de la récolte " + localID + " et des photos réussi !");
	}

	function uploadFinished() {
		hideSpinnerDialog();
		removeGathering(2, localID);		
	}
}

function uploadRecolt(recolt, id) {
	var data = {};

	data.user_id = user.id;
	data.genre = decodeURIComponent(recolt.genre);
	data.epithete = decodeURIComponent(recolt.epithete);
	data.rangintraspec = decodeURIComponent(recolt.rang);
	data.taxintraspec = decodeURIComponent(recolt.taxon);
	data.modulation = recolt.modulation;
	data.autorites = decodeURIComponent(recolt.author);
	data.date_recolt = recolt.date;
	data.gps_latitude = recolt.latitude;
	data.gps_longitude = recolt.longitude;
	data.altitude = recolt.altitude;
	data.rayon = decodeURIComponent(recolt.range);
	data.codeSubstrat = recolt.substrat;
	data.hote = decodeURIComponent(recolt.hote);
	data.etat_hote = recolt.etatHote;
	data.leg = decodeURIComponent(recolt.legataires);
	data.det = decodeURIComponent(recolt.determinateurs);
	data.quantite = decodeURIComponent(recolt.quantity);
	data.precision = recolt.accuracy;

	var bean = new RecoltBean(data, recolt.pictures, id);
	bean.upload();
}