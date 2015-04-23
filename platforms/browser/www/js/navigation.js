//Fonction permettant de créer une nouvelle récolte et de lui associer une photo prise auparavant
function beginRecolt() {
	var picSrc = $("#cameraPic").attr('src');
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


/* 
Fonction gérant la transition entre les pages
@param id : id de la div à afficher 
*/
function showPage(id, wentBack) {
	if (id == "index")
		previousPages = [];
	else if (!wentBack) {
		var idx = previousPages.indexOf(id);
		if (idx != -1) {
			previousPages = previousPages.slice(0, idx);
		}
		previousPages.push($(".page").filter(":visible").attr("id"));
	}
	
	changePage(id);
}

/*
Fonction affichant la div d'id id et cachant les autres.
@param id : id de la div à afficher
*/
function changePage(id) {
	$(".page").each(function(i, div) {
		$(this).hide();
	});

	
	window.scrollTo(0, 0);
	try {
		$("#" + id).show();
	} catch (err) {
		alert("error show " + err.message);
	}
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