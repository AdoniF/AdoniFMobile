//Fonction permettant d'ajouter une récolte dans la table des récoltes
function addRecolt(src, phylum, id) {
	var tbody = $("#table").children("tbody");
	var deleteID = "delete:" + id;
	var newRow = "<tr id='entry" + id + "'><td><div class='row'><div class='col-sm-4 vcenter hidden-xs'>"
	+ "<img class='img-thumbnail' id='recolt' src='" + src + "' alt='picture'/></div>"
	+ "<div class='col-xs-4 col-sm-2 vcenter'>" + id + " : " + phylum + "</div>"
	+ "<div class='col-xs-offset-0 col-xs-8 col-sm-offset-2 col-sm-4 vcenter'>"
	+ "<div class='row'>"
	+ "<div class='col-xs-6'><button type='button' class='btn btn-primary vcenter row-button'>Modifier</button></div>"
	+ "<div class='col-xs-6'><button type='button' id = '" + deleteID + "'"
	+ "class='btn btn-primary vcenter row-button' onclick='removeGathering(this);'>Supprimer</button></div>"
	+ "</div></div></div></td></tr>";
	tbody.append(newRow);
}

//Affiche toutes les récoltes dans la base
function showGatherings(items) {
	var tbody = $("#table").children("tbody");
	for (var i = 0; i < items.length; ++i) {
		var data = JSON.parse(items[i].data);
		var row = $("#entry" + items[i].id);

		if (row.text() === "") {
			addRecolt(data.src, data.phylum, items[i].id);
		}
	}
}

//Met à jour la liste des récoltes en ajoutant simplement les changements
function updateGatheringsList() {
	getGatherings();
}

//Nettoie la liste des récoltes et les recharge depuis la db
function refreshGatheringsList() {
	var tbody = $("#table").children("tbody");
	tbody.empty();
	getGatherings();
}

// Supprime l'entrée associée au bouton en paramètre de la liste des récoltes
function removeGathering(button) {
	var gatheringID = button.id.split(":")[1];
	deleteGathering(gatheringID);
	$("#entry" + gatheringID).remove();
}