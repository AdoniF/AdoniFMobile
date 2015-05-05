function shortBottomToast(message) {
	window.plugins.toast.showShortBottom(message);
}

function showSpinnerDialog(title, message, dismissible) {
	window.plugins.spinnerDialog.show(title, message, dismissible);
}

function hideSpinnerDialog() {
	window.plugins.spinnerDialog.hide();
}

function alert(message, toDo, title, buttonText) {
	if (!title)
		title = "Attention";
	if (!buttonText)
		buttonText = "Ok";

	navigator.notification.alert(message, toDo, title, buttonText);
}

function confirm(message, toDo, title, buttons) {
	navigator.notification.confirm(message, toDo, title, buttons);
}

//Ajoute des fonctions utilitaires aux chaines et aux tableaux
function addCustomFunctions() {
	String.prototype.isEmpty = function() {
		return this.length === 0;
	}

	String.prototype.contains = function (str) {
		return this.indexOf(str) >= 0;
	}

	Array.prototype.contains = function (str) {
		return this.indexOf(str) >= 0;
	}

	Array.prototype.isEmpty = function() {
		return this.length == 0;
	}
}