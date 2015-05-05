//Fonction permettant de créer une nouvelle récolte et de lui associer une photo prise auparavant
function beginRecolt() {
	var picSrc = dom.cameraPicture.attr('src');
	if (picSrc.valueOf() === "src")
		picSrc = null;

	dom.cameraPicture.hide();
	generateNewForm(picSrc);
	dom.cameraPicture.attr("src", "");
	toAddRecolt();
}

//Fonction permettant de charger une récolte pour la modifier et aller sur la page de modification
function loadRecolt(id) {
	getGathering(id);
	toAddRecolt();
}

function showConnectionPage() {
	showPage('connection');
}

//Fonction permettant de se rendre sur la page listant les récoltes locales et de l'actualiser
function toRecolts() {
	updateGatheringsList();
	toShowRecolts();
}

//Fonction permettant de se rendre sur la page listant les récoltes locales
function toShowRecolts() {
	showPage('recolts_list');
}

function modifyAndShowRecolt(data, id) {
	populateFormFromGathering(data, id);
	toAddRecolt();
}
//Fonction permettant de se rendre sur la page de création/modification d'une récolte
function toAddRecolt() {
	showPage('add_recolt');
}

function toIndex() {
	showPage('index');
}

function saveAndShowRecolts() {
	if (phylumIsChosen()) {
		saveRecolt();
		toRecolts();
	} else
		alert("Vous devez au moins choisir le phylum pour sauvegarder une récolte", null, "Phylum requis", "OK");
}

/*
Fonction affichant la div d'id id et cachant les autres.
@param id : id de la div à afficher
*/
function showPage(id) {
	dom.pages.each(function(i, div) {
		$(this).hide();
	});

	window.scrollTo(0, 0);

	$("#" + id).show();
	currentPage = id;
}

/*
Fonction permettant de reculer d'une page dans la hiérarchie
*/
function goBack() {
	if (currentPage == "index")
		navigator.app.exitApp();
	else
		showPage("index");
}