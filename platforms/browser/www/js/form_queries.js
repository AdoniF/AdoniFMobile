// Remplit les suggestions de genre selon le phylum après avoir vérifié la validité de celui-ci
function getPossibleGenres(phylum, value) {
	phylum = getPhylumTable(phylum);

	if (phylum)
		getGenresForPhylum(phylum, value);
}

// Récupère les suggestions de genre et remplit le champ correspondant
function getGenresForPhylum(phylum, value) {
	db.transaction(function (tx) {
		tx.executeSql("SELECT DISTINCT genre FROM " + phylum, [], function(tx, res) {
			var array = [];
			for (var i = 0; i < res.rows.length; ++i) {
				var genre = res.rows.item(i).genre;
				if (genre)
					array.push(genre);
			}
			populateInput("dataGenre", array, value);
		});
	}, function (e) {
		alert("error getGenresFromPhylum " + e.message);
	});
}

// Remplit les suggestions d'épithètes selon le phylum et le genre
function getPossibleEpithetes(phylum, genre, value) {
	phylum = getPhylumTable(phylum);

	if (phylum)
		getPossibleEpithetesForPhylum(phylum, genre, value);
}

// Récupère les suggestions d'épithètes et remplit le champ correspondant
function getPossibleEpithetesForPhylum(phylum, genre, value) {
	var query = "SELECT DISTINCT epithete FROM " + phylum;
	var whereArg = [];
	if (genre && !genre.isEmpty()) {
		query += " WHERE genre = ?";
		whereArg.push(genre);
	}

	query += " ORDER BY epithete;"
	db.transaction(function (tx) {

		tx.executeSql(query, whereArg, function (tx, res){
			var array = [];
			for (var i = 0; i < res.rows.length; ++i) {
				var epithete = res.rows.item(i).epithete;
				if (epithete)
					array.push(epithete);
			}
			populateInput("dataSpecies", array, value);
		});
	}, function (e) {
		alert("error getPossibleEpithetesForPhylum " + e.message);
	});
}

// Remplit les suggestions de taxons selon le phylum, le genre et l'épithète
function getPossibleTaxons(phylum, genre, epithete, rang, value) {
	phylum = getPhylumTable(phylum);
	var clause = buildWhereClause(genre, epithete, rang);

	if (phylum)
		getPossibleTaxonsForPhylum(phylum, clause, value);
}

// Récupère les suggestions de taxons et remplit le champ correspondant
function getPossibleTaxonsForPhylum(phylum, clause, value) {
	var query = "SELECT DISTINCT taxon FROM " + phylum;
	query += clause.where;
	query += " ORDER BY taxon;"

	db.transaction(function (tx) {

		tx.executeSql(query, clause.args, function (tx, res){
			var array = [];
			for (var i = 0; i < res.rows.length; ++i) {
				var taxon = res.rows.item(i).taxon;
				if (taxon)
					array.push(taxon);
			}

			populateInput("dataTaxon", array, value);
		});
	}, function (e) {
		alert("error getPossibleTaxonsForPhylum " + e.message);
	});
}

// Permet de construire dynamiquement une requête selon les champs disponibles
function buildWhereClause(genre, epithete, rang, taxon) {
	var clause = {};
	var values = [];
	var query = "";

	if (genre && !genre.isEmpty()) {
		query += " genre = ?";
		values.push(genre);
	}
	if (epithete && !epithete.isEmpty()) {
		if (!query.isEmpty())
			query += " AND ";
		query += " epithete = ?";
		values.push(epithete);
	}
	if (rang && !rang.isEmpty()) {
		if (!query.isEmpty())
			query += " AND ";
		query += " rang = ?";
		values.push(rang);
	}
	if (taxon && !taxon.isEmpty()) {
		if (!query.isEmpty())
			query += " AND ";
		query += " auteur = ?";
		values.push(taxon);
	}
	if (!query.isEmpty())
		query = " WHERE " + query;

	clause.where = query;
	clause.args = values;
	return clause;
}

// Remplit les suggestions de subtrats
function getSubstrats(value) {
	var query = "SELECT data FROM substrats;"
	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i) {
				var data = res.rows.item(i).data;
				if (data)
					array.push(data);
			}
			
			populateSelect("listSubstrate", array, value);		
		})
	}, function (e) {
		alert("error getSubstrats " + e.message);
	});
}

// Remplit les suggestions d'hôtes'
function getHotes(value) {
	var query = "SELECT data FROM hotes;"
	db.transaction(function (tx) {
		tx.executeSql(query, [], function (tx, res) {
			var array = [];

			for (var i = 0; i < res.rows.length; ++i) {
				var data = res.rows.item(i).data;
				if (data)
					array.push(data);
			}
			
			populateSelect("listHost", array, value);		
		})
	}, function (e) {
		alert("error getSubstrats " + e.message);
	});
}

// Remplit les suggestions d'autorités selon le phylum, le genre, le rang, le taxon et l'épithète
function getPossibleAuteurs(phylum, genre, epithete, rang, taxon, value) {
	phylum = getPhylumTable(phylum);
	var clause = buildWhereClause(genre, epithete, rang, taxon);

	if (phylum)
		getPossibleAuteursForPhylum(phylum, clause, value);
}

// Récupère les suggestions d'auteurs et remplit le champ correspondant
function getPossibleAuteursForPhylum(phylum, clause, value) {
	var query = "SELECT DISTINCT auteur FROM " + phylum;
	query += clause.where;
	query += " ORDER BY auteur;"

	db.transaction(function (tx) {
		tx.executeSql(query, clause.args, function (tx, res){
			var array = [];
			for (var i = 0; i < res.rows.length; ++i) {
				var auteur = res.rows.item(i).auteur;
				if (auteur)
					array.push(auteur);
			}

			populateInput("dataAuthor", array, value);
		});
	}, function (e) {
		alert("error getPossibleAuteursForPhylum " + e.message);
	});
}