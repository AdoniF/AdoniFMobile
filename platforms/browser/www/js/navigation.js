function beginRecolt() {
	var picSrc = $("#cameraPic").attr('src');
	if (picSrc.valueOf() === "src")
		picSrc = null;

	generateNewForm(picSrc);
	toAddRecolt();
}

function loadRecolt(id) {
	getGathering(id);
	toAddRecolt();
}

function toRecolts() {
	getGatherings();
	toShowRecolts();
}

function toShowRecolts() {
	showPage('recolts_list');
}

function toAddRecolt() {
	showPage('add_recolt');
}

function saveRecolt() {

	//TODO : récupérer les infos du formulaire, les mettre dans la db
	// voir sur quelle page on va ensuite
}

/* 
Fonction gérant la transition entre les pages
@param id : id de la div à afficher 
*/
function showPage(id, wentBack) {
	if (id == "index")
		previousPages = [];
	else if (!wentBack)
		previousPages.push($(".page").filter(":visible").attr("id"));
	
	changePage(id);
}

/*
Fonction affichant la div d'id id et cachant les autres.
@param id : id de la div à afficher
*/
function changePage(id) {
	try {
		$(".page").each(function(i, div) {
			$(this).hide();
		});
	} catch(err) {
		alert("error each page " + err.message);
	}
	
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
	var ch = "";
	for (var i = 0; i < previousPages.length; i++) {
		ch += ":" + previousPages[i] + ": ";
	}
	alert(ch);
	var previous = previousPages.pop();
	if (!previous) {
		navigator.app.exitApp();
	}
	showPage(previous, true);
}