/*
Fonction permettant d'initialiser un listener détectant
le moment où les fonctionnalités de phonegap sont prêtes
*/
function init() {
	document.addEventListener("deviceready",onDeviceReady,false);
}

/*
Fonction gérant les évènements à réaliser lorsque l'appareil est prêt
*/
function onDeviceReady() {
	initDivs();
	showPage("index");
	document.addEventListener("offline", onOffline, false);
	document.addEventListener("online", onOnline, false);
	document.addEventListener("backbutton", goBack, false);

	initCamera();
	openDB();
}

/*
Initialise l'affichage des divs au lancement de l'application.
Appelée dans la fonction onLoad du body d'index.html
*/
function initDivs() {
	try {
		$(".hidden").each(function(i, div) {
			$(this).removeClass("hidden");
		});
	} catch(err) {
		alert("error hidden each " + err.message);
	}
}

function testAjax () {
	alert("testing ajax");
	$.get("http://www.smnf-db.fr/ajax/requestGenre.php?q=z&b=union", function () {
		alert("success");
	})
	.done(function(data) {
		alert("second success");
		alert(data);
	})
	.fail(function(data) {
		alert("fail");
		alert(data);
	})
	.always(function () {
		alert("finished");
	});
}

function ajaxCall(method, url, toDo, param) {
	console.log("ajaxCall");
	if (method == "GET") {
		$.get(url)
		.done(function (data) {
			toDo(data, param);
		})
		.fail(function (err) {
			alert(url + " call failed " + err.message);
		});
	}
}
function test() {
	var toto = "ti to  ta";
	console.log(toto.split(" "));
	toto = "ti   ta";
	console.log(toto.split(" "));
}