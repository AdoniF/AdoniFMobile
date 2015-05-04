function RecoltBean (data, picturesUrls) {
	this.data = data;
	this.picturesUrls = picturesUrls;
	
	var uploadFailed = false;

	var nbUploaded = 0;
	var ftPictures = [];

	this.upload = function () {
		ajaxCall("POST", "http://inventaire.dbmyco.fr/ajax/createTemporaryRecolt.php", onDataUploadSuccess, JSON.stringify(data),
			onDataUploadError);
	}

	function onDataUploadSuccess(data) {
		if (data.contains("OK")) {
			window.plugins.toast.showShortBottom("Envoi de la récolte réussi. Envoi des photos en cours...");
			uploadPictures(data.split(";")[1]);
			checkUploadCompletion();
		} else {
			window.plugins.toast.showShortBottom("Echec de l'envoi. Veuillez réessayer plus tard.");
		}
	}

	function onDataUploadError() {
		alert("Echec de la connexion au serveur. Vérifiez votre connexion internet.");
	}

	function uploadPictures(id) {
		for (var i = 0; i < picturesUrls.length; ++i) {
			var fileURI = picturesUrls[i];
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";

			var params = {};
			params.userID = user.id;
			params.recoltID = id;
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
		/*alert("An error has occurred: Code = " + error.code);
		alert("upload error source " + error.source);
		alert("upload error target " + error.target);*/
		// Si le code d'erreur n'est pas celui d'un abort de l'upload, on abort
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

		if (uploadFailed)
			window.plugins.toast.showShortBottom("Echec de la sauvegarde des photos. Veuillez les ajouter manuellement sur le site.");
		else
			window.plugins.toast.showShortBottom("Sauvegarde des photos réussie !");
	}
}

function uploadRecolt(recolt, id) {
	var data = {};
	
	data.recolt_id = id;
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

	var bean = new RecoltBean(data, recolt.pictures);
	bean.upload();
}