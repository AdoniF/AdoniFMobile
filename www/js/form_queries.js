function getPossibleGenres(phylum, value) {
	phylum = getPhylumTable(phylum);

	if (phylum)
		getGenresForPhylum(phylum, value);
	else 
		getAllGenres(value);
}
function getGenresForPhylum(phylum, value) {
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

function getAllGenres(value) {
	var array = [];

	var query = "SELECT DISTINCT GENRE FROM " + phylumsTables[0];
	for (var i = 1; i < phylumsTables.length; ++i) {
		query += " UNION SELECT DISTINCT GENRE FROM " + phylumsTables[i];
	}

	query += " ORDER BY GENRE";

	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i) 
				array.push(res.rows.item(i).GENRE);
			
			populateInput("dataGenre", array, value);		
		})
	}, function (e) {
		alert("error getAllGenres " + e.message);
	});
}

function getPossibleEpithetes(phylum, genre, value) {
	phylum = getPhylumTable(phylum);

	if (phylum)
		getPossibleEpithetesForPhylum(phylum, genre, value);
	else
		getPossibleEpithetesForAllPhylums(genre, value);
}

function getPossibleEpithetesForPhylum(phylum, genre, value) {
	var query = "SELECT DISTINCT epithete FROM " + phylum;
	var whereArg = [];
	if (genre && genre.length > 0) {
		query += " WHERE genre = ?";
		whereArg.push(genre);
	}

	query += " ORDER BY epithete;"
	db.transaction(function (tx) {

		tx.executeSql(query, whereArg, function (tx, res){
			var array = [];
			for (var i = 0; i < res.rows.length; ++i) 
				array.push(res.rows.item(i).epithete);

			populateInput("dataSpecies", array, value);
		});
	}, function (e) {
		alert("error getPossibleEpithetesForPhylum " + e.message);
	});
}

function getPossibleEpithetesForAllPhylums(genre, value) {
	var userInput = [];
	var where = "";
	var hasGenre = genre && genre.length > 0;
	if (hasGenre)
		userInput.push(genre);
	where = " WHERE genre = ?";

	var query = "SELECT DISTINCT epithete FROM " + phylumsTables[0] + where;
	for (var i = 1; i < phylumsTables.length; ++i) {
		query += " UNION SELECT DISTINCT epithete FROM " + phylumsTables[i] + where;
		if (hasGenre)
			userInput.push(genre);
	}
	query += " ORDER BY epithete;";

	db.transaction(function (tx) {
		tx.executeSql(query, userInput, function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i)
				array.push(res.rows.item(i).epithete);
			
			populateInput("dataSpecies", array, value);		
		})
	}, function (e) {
		alert("error getPossibleEpithetesForAllPhylums " + e.message);
	});
}

function getPossibleTaxons(phylum, genre, epithete, rang, value) {
	phylum = getPhylumTable(phylum);
	var clause = buildWhereClause(genre, epithete, rang);

	if (phylum)
		getPossibleTaxonsForPhylum(phylum, clause, value);
	else
		getPossibleTaxonsForAllPhylums(genre, clause, value);
}

function getPossibleTaxonsForPhylum(phylum, clause, value) {
	var query = "SELECT DISTINCT taxon FROM " + phylum;
	query += clause.where;
	query += " ORDER BY taxon;"

	db.transaction(function (tx) {

		tx.executeSql(query, clause.args, function (tx, res){
			var array = [];
			for (var i = 0; i < res.rows.length; ++i) 
				array.push(res.rows.item(i).taxon);

			populateInput("dataTaxon", array, value);
		});
	}, function (e) {
		alert("error getPossibleTaxonsForPhylum " + e.message);
	});
}

function buildWhereClause(genre, epithete, rang, taxon) {
	var clause = {};
	var values = [];
	var query = "";

	if (genre && genre.length > 0) {
		query += " genre = ?";
		values.push(genre);
	}
	if (epithete && epithete.length > 0) {
		if (query.length > 0)
			query += " AND ";
		query += " epithete = ?";
		values.push(epithete);
	}
	if (rang && rang.length > 0) {
		if (query.length > 0)
			query += " AND ";
		query += " rang = ?";
		values.push(rang);
	}
	if (taxon && taxon.length > 0) {
		if (query.length > 0)
			query += " AND ";
		query += " auteur = ?";
		values.push(taxon);
	}
	if (query.length > 0)
		query = " WHERE " + query;

	clause.where = query;
	clause.args = values;
	return clause;
}

function getPossibleTaxonsForAllPhylums(genre, clause, value) {
	var whereArgs = [];
	var query = "SELECT DISTINCT taxon FROM " + phylumsTables[0] + clause.where;
	whereArgs.push.apply(clause.args);
	for (var i = 1; i < phylumsTables.length; ++i) {
		query += " UNION SELECT DISTINCT taxon FROM " + phylumsTables[i] + clause.where;
		whereArgs.push.apply(clause.args);
	}

	query += " ORDER BY taxon;";

	db.transaction(function (tx) {
		tx.executeSql(query, whereArgs, function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i)
				array.push(res.rows.item(i).epithete);
			
			populateInput("dataTaxon", array, value);		
		})
	}, function (e) {
		alert("error getPossibleTaxonsForAllPhylums " + e.message);
	});
}

function getSubstrats(value) {
	var query = "SELECT data FROM substrats;"
	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i)
				array.push(res.rows.item(i).data);
			
			populateSelect("listSubstrate", array, value);		
		})
	}, function (e) {
		alert("error getSubstrats " + e.message);
	});
}

function getPossibleAuteurs(phylum, genre, epithete, rang, taxon, value) {
	phylum = getPhylumTable(phylum);
	var clause = buildWhereClause(genre, epithete, rang, taxon);

	if (phylum)
		getPossibleAuteursForPhylum(phylum, clause, value);
	else
		getPossibleAuteursForAllPhylums(genre, clause, value);
}

function getPossibleAuteursForPhylum(phylum, clause, value) {
	var query = "SELECT DISTINCT auteur FROM " + phylum;
	query += clause.where;
	query += " ORDER BY auteur;"

	db.transaction(function (tx) {
		tx.executeSql(query, clause.args, function (tx, res){
			var array = [];
			for (var i = 0; i < res.rows.length; ++i) 
				array.push(res.rows.item(i).auteur);

			populateInput("dataAuthor", array, value);
		});
	}, function (e) {
		alert("error getPossibleAuteursForPhylum " + e.message);
	});
}

function getPossibleAuteursForAllPhylums(genre, clause, value) {
	var whereArgs = [];
	var query = "SELECT DISTINCT auteur FROM " + phylumsTables[0] + clause.where;
	whereArgs.concat(whereArgs, clause.args);
	for (var i = 1; i < phylumsTables.length; ++i) {
		query += " UNION SELECT DISTINCT auteur FROM " + phylumsTables[i] + clause.where;
		whereArgs.concat(whereArgs, clause.args);
	}
	query += " ORDER BY auteur;";

	db.transaction(function (tx) {
		tx.executeSql(query, whereArgs, function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i)
				array.push(res.rows.item(i).epithete);
			
			populateInput("dataAuthor", array, value);		
		})
	}, function (e) {
		alert("error getPossibleAuteursForAllPhylums " + e.message);
	});
}

function getDeterminateurs(value) {
	var query = "SELECT DISTINCT data FROM determinateurs;";
	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i)
				array.push(res.rows.item(i).data);
			
			populateSelect("listDet", array, value);
		})
	}, function (e) {
		alert("error getDeterminateurs " + e.message);
	});
}

function getLegataires(value) {
	var query = "SELECT DISTINCT data FROM legataires;";
	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i)
				array.push(res.rows.item(i).data);
			
			populateSelect("listLegatees", array, value);
		})
	}, function (e) {
		alert("error getLegataires " + e.message);
	});
}