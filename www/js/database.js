var db;
var phylumsTables = ["asco", "basidio", "chytridio", "glomero", "mycetozoa", "zygo"];
var phylumsArray = ["Ascomycota", "Basidiomycota", "Chytridiomycota", "Glomeromycota", "Mycetozoa", "Zygomycota"];

var loggedIn;
var user = {};
var db_name = "smnf.db";

// Ouvre la base de données
function openDB() {
	if (window.sqlitePlugin) {
		db = window.sqlitePlugin.openDatabase({name: db_name});
		checkConnection();
	}
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
		createDB();
		populateDBs();

		showModal('connectionModal', true);
	}
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
	tx.executeSql("DROP TABLE IF EXISTS substrat");
	for (var i = 0; i < phylumsTables.length; ++i) {
		tx.executeSql("DROP TABLE IF EXISTS " + phylumsTables[i] + ";");
	}
}

function dropRecolts() {
	db.transaction(function (tx) {
		tx.executeSql("DROP TABLE IF EXISTS gatherings;");
		tx.executeSql("CREATE TABLE IF NOT EXISTS gatherings("
			+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
			+ "data TEXT);");
	});
}

//Crée les tables de la base. Les tables qui n'ont qu'un champ data contiennent des objets JSON
function createTables(tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS users("
		+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
		+ "data TEXT)");
	tx.executeSql("CREATE TABLE IF NOT EXISTS gatherings("
		+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
		+ "data TEXT);");
	for (var i = 0; i < phylumsTables.length; ++i) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS " + phylumsTables[i] +"("
			+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
			+ "genre TEXT,"
			+ "epithete TEXT,"
			+ "rang TEXT,"
			+ "taxon TEXT"
			+");");
	}
	tx.executeSql("CREATE TABLE IF NOT EXISTS substrat(data TEXT);");
}

var genres = [];
function populateDBs() {
	db.transaction(function (tx) {
		populatePhylums(tx);
	});
}

function populatePhylums() {
	phylumsTables.forEach(function (phylum) {
		ajaxCall("GET", "http://smnf-db.fr/ajax/requestNameData.php?base=" + phylum, insertNameInfo, phylum);
	});
}

function showGenres () {
	db.transaction(function (tx) {
		tx.executeSql("SELECT * FROM asco", [], function (tx, res) {
			var ch = "";
			alert("showin genres " + res.rows.length);
			for (var i = 0; i < res.rows.length; i++) {
				var item = res.rows.item(i); 
				ch += item.genre;
			}
			alert(ch);
		});
	});
}

function insertNameInfo(data, phylum) {
	var rows = data.split("\n");

	db.transaction(function (tx) {
		rows.forEach(function(entry) {
			entry = entry.trim();
			if (entry.length == 0)
				return;

			var elements = entry.split(" ");
			var columns = ["genre", "epithete", "rang", "taxon"];
			var query = buildInsertQuery(phylum, elements, columns);

			tx.executeSql(query);
		});
	}, function (e) {
		alert("error insertNameInfo " + e.message);
	});
}

function buildInsertQuery(table, values, columns) {
	var validValues = [];
	values.forEach(function (entry, i) {
		if (entry.length != 0) {
			var item = {};
			item.column = columns[i];
			item.entry = entry;
			validValues.push(item);
		}
	});
	var query = "INSERT INTO " + table + " (";
		validValues.forEach(function (entry) {
			query += entry.column + ", ";
		});
		query = query.substring(0, query.length - 2) + ") VALUES (";

		validValues.forEach(function (entry) {
			query += "'" + entry.entry + "', ";
		});
		query = query.substring(0, query.length - 2) + ");";
return query;
}

// Tente de se connecter sur le serveur de l'inventaire
function tryToConnect() {
	var login = $("#inputLogin");
	var password = $("#inputPassword");

	//TODO : connexion base de données en ligne
	try {
		addUser(login.val(), password.val(), "toto", "tata");
	} catch (err) {
		alert("error ttc " + err.message);
	}

}

// Ajoute l'utilisateur à la base de données
function addUser(login, password, asso, role) {
	user.login = login;
	user.password = password;
	user.asso = asso;
	user.role = role;

	db.transaction(function (tx) {
		tx.executeSql("INSERT INTO users(data) VALUES (?)",
			[JSON.stringify(user)], function () { window.plugins.toast.showShortCenter("Connexion réussie !"); goBack();});
		
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
		tx.executeSql("INSERT INTO gatherings (data) VALUES (?)", [JSON.stringify(gathering)],
			function () {
				window.plugins.toast.showShortCenter("Sauvegarde réussie");
			});
	}, function (e) {
		alert("error addGathering " + e.message);
		window.plugins.toast.showShortCenter("Sauvegarde échouée, veuillez réessayer");
	});
}

function updateGathering(gathering, id) {
	var data = JSON.stringify(gathering);
	var query = "UPDATE gatherings SET data = '" + data + "' WHERE id = '" + id + "';";
	db.transaction(function (tx) {
		tx.executeSql(query);
	}, function (e) {
		alert("error update Gathering " + e.message);
	});
}

function addFakeGathering() {
	var gathering = {};
	gathering.src="none.jpg";
	gathering.phylum = "myPhylum" + Math.round(Math.random() * 1000);
	addGathering(gathering);
}

// Récupère la récolte correspondant à l'id en paramètre
function getGathering(id) {
	db.transaction(function (tx) {
		tx.executeSql("SELECT data from gatherings WHERE id = " + id + ";", [], function(tx, res) {
			populateFormFromGathering(JSON.parse(res.rows.item(0).data), id);
			showPage("add_recolt");
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
		tx.executeSql("DELETE FROM gatherings WHERE id = (?)", [id], function () {});
	}, function (e) {
		alert("error delete gathering " + e.message);
	});
}

function getPossibleGenres(phylum, value) {
	phylum = getPhylumTable(phylum);
	if (!phylum)
		getAllGenres(value);
	else {
		db.transaction(function (tx) {
			tx.executeSql("SELECT DISTINCT GENRE FROM " + phylum, [], function(tx, res) {
				var array = [];
				for (var i = 0; i < res.rows.length; ++i) 
					array.push(res.rows.item(i).genre);
				
				populateInput("dataGenre", array, value);
			});
		}, function (e) {
			alert("error getGenresFromPhylum " + e.message);
		});
	}
}

function getAllGenres(value) {
	var array = [];

	db.transaction(function (tx) {
		var query = "SELECT DISTINCT GENRE FROM " + phylumsTables[0];
		for (var i = 1; i < phylumsTables.length; ++i) {
			query += " UNION SELECT DISTINCT GENRE FROM " + phylumsTables[i];
		}

		query += " ORDER BY GENRE";

		tx.executeSql(query, [], function (tx, res) {
			var array = [];
			var ch = "";
			for (var prop in res.rows.item(0))
				ch += prop + " / ";
			alert("ch " + ch);
			for (var i = 0; i < res.rows.length; ++i) {
				array.push(res.rows.item(i).GENRE);
			}
			populateInput("dataGenre", array, value);		
		})
	}, function (e) {
		alert("error getAllGenres " + e.message);
	});
}

function getPossibleEpithetes(phylum, genre, value) {
	phylum = getPhylumTable(phylum);
	//TODO : cas ou on n'a pas choisi de phylum et/ou genre ou genre injection sql

	db.transaction(function (tx) {
		var query = "SELECT DISTINCT epithete FROM " + phylum + " WHERE genre = '" + genre + "';";
		tx.executeSql(query, [], function (tx, res){
			var array = [];
			for (var i = 0; i < res.rows.length; ++i) 
				array.push(res.rows.item(i).epithete);

			populateInput("dataSpecies", array, value);
		});
	}, function (e) {
		alert("error getPossibleEpithetes " + e.message);
	});

	//TODO : continue method
}