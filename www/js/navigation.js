//Fonction permettant de créer une nouvelle récolte et de lui associer une photo prise auparavant
function beginRecolt() {
	var picSrc = dom.cameraPicture.attr('src');
	if (picSrc.valueOf() === "src")
		picSrc = null;

	generateNewForm(picSrc);
	toAddRecolt();
}

//Fonction permettant de charger une récolte pour la modifier et aller sur la page de modification
function loadRecolt(id) {
	getGathering(id);
	toAddRecolt();
}

//Fonction permettant de se rendre sur la page listant les récoltes locales et de l'actualiser
function toRecolts() {
	refreshGatheringsList();
	toShowRecolts();
}

//Fonction permettant de se rendre sur la page listant les récoltes locales
function toShowRecolts() {
	showPage('recolts_list');
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
	} else {
		navigator.notification.alert(
			"Vous devez au moins choisir le phylum pour sauvegarder une récolte",
			null,
			"Phylum requis",
			"OK"
			);
	}
}


/* 
Fonction gérant la transition entre les pages
@param id : id de la div à afficher 
*/
function showPage(id, wentBack) {
	if (id == "index" || id == "connection")
		previousPages = [];
	else if (!wentBack) {
		var idx = previousPages.indexOf(id);
		if (idx != -1) {
			previousPages = previousPages.slice(0, idx);
		}
		previousPages.push(dom.pages.filter(":visible").attr("id"));
	}
	
	changePage(id);
}

/*
Fonction affichant la div d'id id et cachant les autres.
@param id : id de la div à afficher
*/
function changePage(id) {
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
	var previous = previousPages.pop();
	if (!previous) {
		navigator.app.exitApp();
	}
	showPage(previous, true);
}

function showConnectionPage() {
	showPage('connection');
}