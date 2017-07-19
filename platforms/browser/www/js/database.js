var db;
var phylumsTables = ["asco", "basidio", "chytridio", "glomero", "mycetozoa", "zygo"];
var phylumsArray = ["Ascomycota", "Basidiomycota", "Chytridiomycota", "Glomeromycota", "Mycetozoa", "Zygomycota"];

var loggedIn;
var dbCreated = false;
var user = {};
var db_name = "adonif.db";

// Ouvre la base de données
function openDB() {
	if (window.localStorage) {
		if (!db)
			db = window.openDatabase(db_name,'1.0','espoir',2*1024*1024);
		checkConnection();
	} else {
		alert("Erreur : impossible d'utiliser la base de données. Votre appareil n'est pas compatible avec cette application.");
	}
}

// Donne le nom de la table correspondant au phylum passé en paramètre
function getPhylumTable(phylumName) {
	return phylumsTables[phylumsArray.indexOf(phylumName)];
}

// Donne le nom du phylum correspondant à la table passée en paramètre
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
		
		navigator.notification.alert("Un compte sur le site de récolte est requis pour utiliser cette application. Veuillez vous connecter.",
			showConnectionPage, "Connexion requise", "Connexion");
	}
}

// Initialise la base en la créant et la remplissant.
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

// Détruit les tables présentes dans la base
function dropTables(tx) {
	tx.executeSql("DROP TABLE IF EXISTS users;");
	tx.executeSql("DROP TABLE IF EXISTS gatherings;");
	dropReferentialTables(tx);
}

// Détruit les tables correspondant aux informations issues du référentiel
function dropReferentialTables(tx) {
	tx.executeSql("DROP TABLE IF EXISTS substrats");
	tx.executeSql("DROP TABLE IF EXISTS hotes");
	for (var i = 0; i < phylumsTables.length; ++i) {
		tx.executeSql("DROP TABLE IF EXISTS " + phylumsTables[i] + ";");
	}
}

// Crée les tables de la base. Les tables qui n'ont qu'un champ data contiennent des objets JSON.
function createTables(tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS users("
		+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
		+ "data TEXT)");
	tx.executeSql("CREATE TABLE IF NOT EXISTS gatherings("
		+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
		+ "data TEXT);");
	createReferentialTables(tx);
}

// Crée les tables correspondant aux informations issues du référentiel
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

// Affiche une alerte vérifiant que l'utilisateur souhaite bien mettre à jour le référentiel.
function showRefreshAlert() {
	confirm("Etes vous sur de vouloir rafraichir les informations du référentiel ? Cette opération peut prendre plusieurs minutes"
		+ " et nécessite une connexion internet.", refreshReferential, "Attention", ["Annuler", "Valider"]);
}

// Met à jour les informations du référentiel si l'utilisateur a choisi le bouton "Valider" de la popup d'avertissement
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

// Remplit la DB en allant chercher les informations du référentiel.
function populateDB() {
	showSpinnerDialog("Chargement", "Chargement des informations du référentiel...", true);
	populateCallsRunning = 0;
	errorShown = false;

	populateHotes();
	populateSubstrats();
	populateNamesInfos();
}

// Variable permettant de vérifier si tous les appels Ajax sont terminés (ou non)
var populateCallsRunning = 0;
// Fonction lançant les appels Ajax remplissant les tables des phylums
function populateNamesInfos() {
	populateCallsRunning += phylumsTables.length;
	phylumsTables.forEach(function (phylum) {
		ajaxCall("GET", "http://fongiref.adonif.fr/ajax/requestNameData.php?base=" + phylum,
			insertNameInfo, phylum, populateDBError);
	});
}

// Fonction lançant l'appel Ajax remplissant la table des hôtes
function populateHotes() {
	populateCallsRunning++;
	ajaxCall("GET", "http://fongibase.adonif.fr/ajax/requestHosts.php", insertHotesInfos, null, populateDBError);
}

// Fonction lançant l'appel Ajax remplissant la table des substrats
function populateSubstrats() {
	populateCallsRunning += 1;
	ajaxCall("GET", "http://fongiref.adonif.fr/ajax/requestSubstrats.php", insertSubstratsInfos, null, populateDBError);
}

var errorShown = false;
// Fonction appellée si une erreur survient lors du chargement des informations du référentiel 
function populateDBError() {
	hideSpinnerDialog();
	if (!errorShown) {
		confirm("Echec de la récupération des informations du référentiel. Veuillez vérifier votre connexion internet"
			+ " ou réessayer ultérieurement.", populateDBErrorCallback, "Erreur", ["Annuler", "Réessayer"]);
		errorShown = true;
	}
}

// Fonction permettant de relancer les appels de remplissage de la base depuis le référentiel en cas d'erreur
function populateDBErrorCallback(buttonIndex) {
	if (buttonIndex == 2)
		populateDB();
}

// Insère dans la base les informations concernant les hôtes possibles
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
			// shortBottomToast("Récupération des informations du référentiel réussie !");
		} else {
			errorShown = false;
		}
	});
}

// Insère dans la base les informations concernant les substrats possibles
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
			// shortBottomToast("Récupération des informations du référentiel réussie !");
		} else {
			errorShown = false;
		}
	}, function (e) {
		alert("error insertNameInfo " + e.message);
	});
}

// Insère dans la base les informations concernant les lb noms possibles
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
			// shortBottomToast("Récupération des informations du référentiel réussie !");
		} else {
			errorShown = false;
		}
	}, function (e) {
		alert("error insertNameInfo " + e.message);
	});
}
/*
Fonction permettant de construire dynamiquement une requête d'insertion de champignon dans les bases
phylums en n'insérant que les champs disponibles
*/
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

// Vérifie que la connexion sur la base des utilisateurs est possible grâce aux champs entrés par l'utilisateur
function tryToConnect() {
	var email = $("#inputMail");
	var password = $("#inputPassword");
	var donnees;
	var param = {};
	param.param1 = email.val();
	param.param2 = password.val();
	alert(param.param1);
	ajaxCall("POST", "http://fongiref.adonif.fr/ajax/connexionMobile.php", getConnectionResult, JSON.stringify(param),
		connectionError);

}

// Fonction appellée lors de l'échec d'un appel Ajax de connexion
function connectionError() {
	alert("Echec de la connexion au serveur. Vérifiez votre connexion internet.");
}

// Récupère le résultat de la tentative de connexion de l'utilisateur
function getConnectionResult(data, param) {
	if (data.contains("OK")) {
		console.log("Connexion réussie ! Chargement des informations du référentiel...");
		toIndex();
		initDB();
		createUser(param.param1, param.param2, data);
		addUser(user);
	} else {
		 console.log("Echec de la connexion. Veuillez réessayer");
	}
}

// Crée un objet user à partir des informations de l'utilisateur
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

// Met à jour une récolte effectuée par l'utilisateur
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

