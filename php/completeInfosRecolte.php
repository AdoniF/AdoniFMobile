<?php
// Fichier renvoyant les informations complémentaires concernant l'espèce passée à la requête

$phylum = $_GET['phylum'];
$genre = "%".$_GET['genre']."%";
$espece = "%".$_GET['espece']."%";
$rang = "%".$_GET['rang']."%";
$taxon = "%".$_GET['taxon']."%";

if (strlen($genre) < 3 || strlen($espece) < 3)
	return;

$phylums = ["Ascomycota", "Basidiomycota", "Chytridiomycota", "Glomeromycota", "Mycetozoa", "Zygomycota"];
$tables = ["asco", "basidio", "chytridio", "glomero", "mycetozoa", "zygo"];

$phylumIdx = array_search($phylum, $phylums);

if (!empty($phylum) && $phylumIdx)
	$table = $tables[$phylumIdx];
else
	$table = "champignon";

$query = "SELECT PHYLUM, LB_AUTEUR, FAMILLE, CLASSE, REGNE, ORDRE, TAXINTRASPECIFIQUE, RANGINTRASPECIFIQUE FROM ".$table
." WHERE GENRE LIKE ? AND EPITHETE LIKE ? AND CD_NOM = CD_REF";
$params = "ss";

if (strlen($rang) > 2) {
	$query .= " AND RANGINTRASPECIFIQUE LIKE ?";
	$params .= "s";
}
if (strlen($taxon) > 2) {
	$query .= " AND TAXINTRASPECIFIQUE LIKE ?";
	$params .= "s";
}


include('../connexionBdd/bddReferentielMobile.php');

//On prépare la requête
if (!($stmt = $id_connect->prepare($query))) {
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
}

if (strlen($params) == 2) {
	if (!$stmt->bind_param($params, $genre, $espece))
		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
} else if (strlen($params) == 3) {
	if (strlen($rang) > 2) {
		if (!$stmt->bind_param($params, $genre, $espece, $rang))
			echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
	} else {
		if (!$stmt->bind_param($params, $genre, $espece, $taxon))
			echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
	}
} else {
	if (!$stmt->bind_param($params, $genre, $espece, $rang, $taxon))
		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
}

if (!$stmt->execute()) {
	echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
} else {
	$stmt->bind_result($phylum, $auteur, $famille, $classe, $regne, $ordre, $taxon, $rang);
	if ($stmt->fetch())
		echo $phylum.'||'.$auteur.'||'.$famille.'||'.$classe.'||'.$regne.'||'.$ordre.'||'.$taxon.'||'.$rang;

	while ($stmt->fetch()) {
		echo "\n".$phylum.'||'.$auteur.'||'.$famille.'||'.$classe.'||'.$regne.'||'.$ordre.'||'.$taxon.'||'.$rang;
	}
}
?>