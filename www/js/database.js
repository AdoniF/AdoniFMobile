var db;
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

// Détermine si l'utilisateur s'est déjà connecté auparavant, puis agit en conséquence
function checkConnection() {
	db.transaction(function (tx) {
		tx.executeSql("SELECT count(*) as cpt from users;", [], function (tx, res) {
			loggedIn = res.rows.item(0).cpt > 0;
			connectUser();
		});
	}, function (e) {
		loggedIn = false;
	});
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
	tx.executeSql("DROP TABLE IF EXISTS referential;");
	tx.executeSql("DROP TABLE IF EXISTS gatherings;");
}

//Crée les tables de la base
function createTables(tx) {
	tx.executeSql("CREATE TABLE IF NOT EXISTS users("
		+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
		+ "data TEXT)");
	tx.executeSql("CREATE TABLE IF NOT EXISTS gatherings("
		+ "id INTEGER PRIMARY KEY AUTOINCREMENT,"
		+ "data TEXT);");
	//TODO : completer cette création
	//tx.executeSql("CREATE TABLE IF NOT EXISTS referential()");
}

// Initialise l'utilisateur s'il est connecté, ou déclenche la procédure de connexion dans le cas contraire
function connectUser() {
	if (loggedIn) {
		initUser();
	} else {
		createDB();
		showModal('connectionModal', true);
	}
}

// Tente de se connecter sur le serveur de l'inventaire
function tryToConnect() {
	var login = $("#inputLogin");
	var password = $("#inputPassword");

	//TODO : connexion base de données en ligne
	addUser(login.val(), password.val(), "toto", "tata");
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

// Initialise l'utilisateur depuis la base de données
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

function addFakeGathering() {
	var gathering = {};
	gathering.src="none.jpg";
	gathering.phylum = "myPhylum" + Math.round(Math.random() * 1000);
	addGathering(gathering);
}

// Récupère la récolte correspondant à l'id en paramètre
function getGathering(id) {
	var id = parseInt(id);
	db.transaction(function (tx) {
		tx.executeSql("SELECT data from gatherings WHERE id = (?);", [id], function(tx, res) {
			populateFormFromGathering(JSON.parse(res.rows.item(0).data));
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
		tx.executeSql("DELETE FROM gatherings WHERE id = (?)", [id], function () {/* success */});
	}, function (e) {
		alert("error delete gathering " + e.message);
	});
}