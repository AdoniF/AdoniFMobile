//Fonction permettant d'ajouter une récolte dans la table des récoltes
function addRecolt(src, label, id) {
	var deleteID = "delete:" + id;

	if (src == null)
		src = "img/no_pic.png";
	
	var newRow = "<tr id='entry" + id + "'><td><div class='row vertical-align'>"
	+ "<span class='col-sm-5  hidden-xs'><img class='img-thumbnail' id='recolt' src='" + src + "' alt='picture'/></span>"
	+ "<span class='col-xs-7 col-sm-4'>" + label + "</span>"
	+ "<span class='col-xs-5 col-sm-3 text-right'>"
	+ "<button type='button' class='btn btn-success row-button' onclick='uploadRecoltForId(" + id + ");'>Envoyer</button>"
	+ "<button type='button' class='btn btn-success row-button' onclick='modifyRecolt(" + id + ");'>Modifier</button>"
	+ "<button type='button' id = '" + deleteID + "' class='btn btn-success row-button' onclick='tryRemovingGathering(this);'>"
	+ "<span class='glyphicon glyphicon-trash'></span></button>"
	+ "</span></div></td></tr>";
	dom.tbody.append(newRow);
}

function uploadRecoltForId(id) {
	showSpinnerDialog("Upload", "Envoi de la récolte au serveur...", true);
	getGathering(id, uploadRecolt);
}

function uploadAllRecolts() {
	
}

function modifyRecolt(id) {
	getGathering(id, modifyAndShowRecolt);
}

//Affiche toutes les récoltes dans la base
function showGatherings(items) {
	for (var i = 0; i < items.length; ++i) {
		var data = JSON.parse(items[i].data);
		var row = $("#entry" + items[i].id);

		if (row.text() === "") {
			var pictureSource = data.pictures && !data.pictures.isEmpty() ? data.pictures[0] : null;
			addRecolt(pictureSource, data.genre + " " + data.epithete, items[i].id);
		}
	}
}

//Met à jour la liste des récoltes en ajoutant simplement les changements
function updateGatheringsList() {
	getGatherings();
}

//Nettoie la liste des récoltes et les recharge depuis la db
function refreshGatheringsList() {
	dom.tbody.empty();
	getGatherings();
}

var toRemove = null;
function tryRemovingGathering(button) {
	toRemove = button;
	confirm("Etes vous sur de vouloir supprimer cette récolte ?", removeGathering, "Supprimer une récolte", ["Annuler", "Valider"]);
}
// Supprime l'entrée associée au bouton en paramètre de la liste des récoltes
function removeGathering(buttonIndex, id) {
	if (buttonIndex == 2) {
		var gatheringID = id ? id : toRemove.id.split(":")[1];
		deleteGathering(gatheringID);
		$("#entry" + gatheringID).remove();
	}
	toRemove = null;
}

function uploadAllRecolts() {
	try {
		dom.tbody.children().each(function (idx, row) {
			var id = $(row).attr("id").split("entry")[1];
			getGathering(id, uploadRecolt);
		})
	} catch (err) {alert(err.message);}
}