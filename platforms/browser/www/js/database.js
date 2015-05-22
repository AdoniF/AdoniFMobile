var db;
var phylumsTables = ["asco", "basidio", "chytridio", "glomero", "mycetozoa", "zygo"];
var phylumsArray = ["Ascomycota", "Basidiomycota", "Chytridiomycota", "Glomeromycota", "Mycetozoa", "Zygomycota"];

var loggedIn;
var dbCreated = false;
var user = {};
var db_name = "smnf.db";

// Ouvre la base de données
function openDB() {
	/*if (window.sqlitePlugin) {
		if (!db)
			db = window.sqlitePlugin.openDatabase({name: db_name});
		checkConnection();
	} else {
		alert("no plugin");
	}*/
}

function getPhylumTable(phylumName) {
	return phylumsTables[phylumsArray.indexOf(phylumName)];
}

function getPhylumName(phylumTable) {
	return phylumsArray[phylumsTables.indexOf(phylumTable)];
}

// Détermine si l'utilisateur s'est déjà connecté auparavant, puis agit en conséquence
function checkConnection() {
	db.transaction(function (tx) {
		tx.executeSql("SELECT count(*) as cpt from users;", [], function (tx, res) {
			loggedIn = res.rows.item(0).cpt > 0;
			dbCreated = true;
			connectUser();
		});
	}, function (e) {
		loggedIn = false;
		connectUser();			
	});
}

// Initialise l'utilisateur s'il est connecté, ou déclenche la procédure de connexion dans le cas contraire
function connectUser() {
	if (loggedIn) {
		initUser();
	} else {
		if (!dbCreated)
			initDB();
		
		alert("Un compte sur le site de récolte est requis pour utiliser cette application. Veuillez vous connecter.",
			showConnectionPage, "Connexion requise", "Connexion");
	}
}

function initDB() {
	createDB();
	populateDB();
}

// Crée la base de données
function createDB() {
	db.transaction(function (tx) {
		dropTables(tx);
		createTables(tx);
	}, function (e) {
		alert("error create DB " + e.message);
	});
}

//Détruit les tables présentes dans la base
function dropTables(tx) {
	tx.executeSql("DROP TABLE IF EXISTS users;");
	tx.executeSql("DROP TABLE IF EXISTS gatherings;");
	dropReferentialTables(tx);
}

function dropReferentialTables(tx) {
	tx.executeSql("DROP TABLE IF EXISTS substrats");
	tx.executeSql("DROP TABLE IF EXISTS hotes");
	for (var i = 0; i < phylumsTables.length; ++i) {
		tx.executeSql("DROP TABLE IF EXISTS " + phylumsTables[i] + ";");
	}
}

//Crée les tables de la base. Les tables qui n'ont qu'un champ data contiennent des objets JSON
function createTables(tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS users("
		+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
		+ "data TEXT)");
	tx.executeSql("CREATE TABLE IF NOT EXISTS gatherings("
		+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
		+ "data TEXT);");
	createReferentialTables(tx);
}

function createReferentialTables(tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS substrats(data TEXT);");
	tx.executeSql("CREATE TABLE IF NOT EXISTS hotes(data TEXT);");
	for (var i = 0; i < phylumsTables.length; ++i) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS " + phylumsTables[i] +"("
			+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
			+ "genre TEXT,"
			+ "epithete TEXT,"
			+ "rang TEXT,"
			+ "taxon TEXT,"
			+ "auteur TEXT"
			+");");
	}	
}

function showRefreshAlert() {
	confirm("Etes vous sur de vouloir rafraichir les informations du référentiel ? Cette opération peut prendre plusieurs minutes"
		+ " et nécessite une connexion internet.", refreshReferential, "Attention", ["Annuler", "Valider"]);
}

function refreshReferential(buttonIndex) {
	if (buttonIndex == 2) {
		db.transaction(function (tx) {
			dropReferentialTables(tx);
			createReferentialTables(tx);
			populateDB();
		}, function (e) {
			alert("error refreshReferential " + e.message);
		});
	}
}

function populateDB() {
	showSpinnerDialog("Chargement", "Chargement des informations du référentiel...", true);
	populateCallsRunning = 0;
	errorShown = false;

	populateHotes();
	populateSubstrats();
	populateNamesInfos();
}

var populateCallsRunning = 0;
function populateNamesInfos() {
	populateCallsRunning += phylumsTables.length;
	phylumsTables.forEach(function (phylum) {
		ajaxCall("GET", "http://referentiel.dbmyco.fr/ajax/requestNameData.php?base=" + phylum,
			insertNameInfo, phylum, populateDBError);
	});
}

function populateHotes() {
	populateCallsRunning++;
	ajaxCall("GET", "http://inventaire.dbmyco.fr/ajax/requestHosts.php", insertHotesInfos, null, populateDBError);
}
function populateSubstrats() {
	populateCallsRunning += 1;
	ajaxCall("GET", "http://referentiel.dbmyco.fr/ajax/requestSubstrats.php", insertSubstratsInfos, null, populateDBError);
}

var errorShown = false;
function populateDBError() {
	hideSpinnerDialog();
	if (!errorShown) {
		confirm("Echec de la récupération des informations du référentiel. Veuillez vérifier votre connexion internet"
			+ " ou réessayer ultérieurement.", populateDBErrorCallback, "Erreur", ["Annuler", "Réessayer"]);
		errorShown = true;
	}
}

function populateDBErrorCallback(buttonIndex) {
	if (buttonIndex == 2)
		populateDB();
}

function insertHotesInfos(data) {
	var rows = data.split("\n");
	db.transaction(function (tx) {
		rows.forEach(function(entry) {
			entry = entry.trim();
			if (entry.isEmpty())
				return;

			var query = "INSERT INTO hotes VALUES ('" + entry + "');";
			tx.executeSql(query);
		});
		populateCallsRunning--;
		if (populateCallsRunning == 0 && !errorShown) {
			hideSpinnerDialog();
			shortBottomToast("Récupération des informations du référentiel réussie !");
		} else {
			errorShown = false;
		}
	});
}

function insertSubstratsInfos(data) {
	var rows = data.split("\n");
	db.transaction(function (tx) {
		rows.forEach(function(entry) {
			entry = entry.trim();
			if (entry.isEmpty())
				return;

			var query = "INSERT INTO substrats VALUES ('" + entry + "');";
			tx.executeSql(query);
		});
		populateCallsRunning--;
		if (populateCallsRunning == 0 && !errorShown) {
			hideSpinnerDialog();
			shortBottomToast("Récupération des informations du référentiel réussie !");
		} else {
			errorShown = false;
		}
	}, function (e) {
		alert("error insertNameInfo " + e.message);
	});
}

function insertNameInfo(data, phylum) {
	var rows = data.split("\n");
	db.transaction(function (tx) {
		rows.forEach(function(entry) {
			entry = entry.trim();
			if (entry.isEmpty())
				return;

			var elements = entry.split("$");
			var columns = ["genre", "epithete", "rang", "taxon", "auteur"];
			var query = buildInsertQuery(phylum, elements, columns);

			if (query)
				tx.executeSql(query);
		});

		populateCallsRunning--;
		if (populateCallsRunning == 0 && !errorShown) {
			hideSpinnerDialog();
			shortBottomToast("Récupération des informations du référentiel réussie !");
		} else {
			errorShown = false;
		}
	}, function (e) {
		alert("error insertNameInfo " + e.message);
	});
}

function buildInsertQuery(table, values, columns) {
	var validValues = [];
	values.forEach(function (entry, i) {
		if (!entry.isEmpty()) {
			var item = {};
			item.column = columns[i];

			//Retire les apostrophes dans la variable entry, pose problème pour les requêtes SQL
			var regex = new RegExp("'", "g");
			item.entry = entry.replace(regex, "");
			validValues.push(item);
		}
	});
	if (validValues.isEmpty())
		return null;

	var query = "INSERT INTO " + table + " (";
		validValues.forEach(function (entry) {
			query += entry.column + ", ";
		});
		query = query.substring(0, query.length - 2) + ") VALUES (";

		validValues.forEach(function (entry) {
			query += "'" + entry.entry + "', ";
		});
		query = query.substring(0, query.length - 2);
		return query + ");";
}

// Tente de se connecter sur le serveur de l'inventaire
function tryToConnect() {
	var email = $("#inputMail");
	var password = $("#inputPassword");

	var param = {};
	param.param1 = email.val();
	param.param2 = password.val();
	ajaxCall("POST", "http://referentiel.dbmyco.fr/ajax/connexionMobile.php", getConnectionResult, JSON.stringify(param),
		connectionError);
}

function connectionError() {
	alert("Echec de la connexion au serveur. Vérifiez votre connexion internet.");
}

function getConnectionResult(data, param) {
	if (data.contains("OK")) {
		shortBottomToast("Connexion réussie !");
		toIndex();

		createUser(param.param1, param.param2, data);
		addUser(user);
	} else {
		shortBottomToast("Echec de la connexion. Veuillez réessayer");
	}
}

function createUser(email, password, userData) {
	var values = userData.split("$");
	user = {};
	user.email = email;
	user.password = password;
	user.prenom = values[1];
	user.nom = values[2];
	user.id = values[3];
}

// Ajoute l'utilisateur à la base de données
function addUser() {
	db.transaction(function (tx) {
		tx.executeSql("INSERT INTO users(data) VALUES (?)",
			[JSON.stringify(user)]);
		
	}, function (e) {
		alert("error addUser " + e.message);
	});
}

// Initialise l'utilisateur courant depuis la base de données
function initUser() {
	db.transaction(function (tx) {
		tx.executeSql("SELECT data from users;", [], function(tx, res) {
			user = JSON.parse(res.rows.item(0).data);
		});
	}, function (e) {
		alert("error initUser " + e.message);
	});
}

// Ajoute une récolte dans la base de données
function addGathering(gathering) {
	db.transaction(function (tx) {
		tx.executeSql("INSERT INTO gatherings (data) VALUES (?)", [JSON.stringify(gathering)]);
	}, function (e) {
		alert("error addGathering " + e.message);
	});
}

function updateGathering(gathering, id) {
	var data = JSON.stringify(gathering);
	var query = "UPDATE gatherings SET data = ? WHERE id = ?;";
	db.transaction(function (tx) {
		tx.executeSql(query, [data, id]);
	}, function (e) {
		alert("error update Gathering " + e.message);
	});
}

// Récupère la récolte correspondant à l'id en paramètre
function getGathering(id, toDo) {
	db.transaction(function (tx) {
		tx.executeSql("SELECT data from gatherings WHERE id = ?;", [id], function(tx, res) {
			toDo(JSON.parse(res.rows.item(0).data), id);
		});
	}, function (e) {
		alert("error getGathering " + e.message);
	});
}

// Récupère la liste des récoltes
function getGatherings() {
	db.transaction(function (tx) {
		tx.executeSql("SELECT * from gatherings;", [], function(tx, res) {
			var items = [];
			var rows = res.rows;
			
			for (var i = 0; i < rows.length; ++i) {
				items.push(new GatheringItem(rows.item(i).id, rows.item(i).data));
			}
			showGatherings(items);
		});
	}, function (e) {
		alert("error getGatherings " + e.message);
	});
}

//Objet permettant d'associer une récolte à son id dans la db
function GatheringItem(id, data) {
	this.id = id || -1;
	this.data = data || "unknown";
}

//Retire la récolte d'id id de la base
function deleteGathering(id) {
	db.transaction(function (tx) {
		tx.executeSql("DELETE FROM gatherings WHERE id = ?", [id], function () {});
	}, function (e) {
		alert("error delete gathering " + e.message);
	});
}

//Fonction de débug
function checkTablesSizes() {
	var idx = 0;
	db.transaction(function (tx) {
		for (var i = 0; i < phylumsTables.length; i++) {
			var phylum = phylumsTables[i];
			tx.executeSql("SELECT COUNT(*) as cpt FROM " + phylum, [], function (tx, res) {
				alert("phylum n°" + idx + " " + phylumsTables[idx] + " : " + res.rows.item(0).cpt);
				idx++;
			});
		}
	}, function (e) {
		alert("error check tables " + e.message);
	});
}

