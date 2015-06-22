<?php
//Fichier permettant d'ajouter une nouvelle position (règne-phylum-classe-ordre-famille) au référentiel.

$regne = $_GET['regne'];
$phylum = $_GET['phylum'];
$classe = $_GET['classe'];
$ordre = $_GET['ordre'];
$famille = $_GET['famille'];
$genre = $_GET['genre'];
$epithete = $_GET['epithete'];
$rang = $_GET['rang'];
$taxon = $_GET['taxon'];
$autorites = $_GET['autorites'];

$exists = doesPositionExists($regne, $phylum, $classe, $ordre, $famille, $autorites, $genre, $epithete, $rang, $taxon);

if ($exists)
	return;

insertNewPosition($regne, $phylum, $classe, $ordre, $famille, $autorites, $genre, $epithete, $rang, $taxon);


function insertNewPosition($regne, $phylum, $classe, $ordre, $famille, $autorites, $genre, $epithete, $rang, $taxon) {
	$lb_nom = $genre." ".$epithete." ".$rang." ".$taxon;
	include("../connexionBdd/bddReferentielMobile.php");

	$query = "INSERT INTO tmp (REGNE, PHYLUM, CLASSE, ORDRE, FAMILLE, LB_NOM, LB_AUTEUR, GENRE, EPITHETE, RANGINTRASPECIFIQUE, "
	."TAXINTRASPECIFIQUE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

	if (!($stmt = $id_connect->prepare($query))) {
		echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
	}

	if (!$stmt->bind_param("sssssssssss", $regne, $phylum, $classe, $ordre, $famille, $lb_nom, $autorites, $genre, $epithete, $rang, $taxon)) {
		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
	}

	if (!$stmt->execute())
		echo "KO";
	else
		echo "OK";
}


function doesPositionExists($regne, $phylum, $classe, $ordre, $famille, $autorites, $genre, $epithete, $rang, $taxon) {
	include("../connexionBdd/bddReferentielMobile.php");
	$regne = "%".$regne."%";
	$phylum = "%".$phylum."%";
	$classe = "%".$classe."%";
	$ordre = "%".$ordre."%";
	$famille = "%".$famille."%";
	$autorites = "%".$autorites."%";
	$genre = "%".$genre."%";
	$epithete = "%".$epithete."%";
	$rang = "%".$rang."%";
	$taxon = "%".$taxon."%";

	$query = "SELECT COUNT(*) as cpt FROM champignon WHERE REGNE LIKE ? AND PHYLUM LIKE ? AND CLASSE LIKE ? AND ORDRE LIKE ? AND "
	."FAMILLE LIKE ? AND LB_AUTEUR LIKE ? AND GENRE LIKE ? AND EPITHETE LIKE ? AND RANGINTRASPECIFIQUE LIKE ? "
	."AND TAXINTRASPECIFIQUE LIKE ?;";

	if (!($stmt = $id_connect->prepare($query))) {
		echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
	}

	if (!$stmt->bind_param("ssssssssss", $regne, $phylum, $classe, $ordre, $famille, $autorites, $genre, $epithete, 
		$rang, $taxon)) {
		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
	}

	if (!$stmt->execute())
		echo "KO";
	else
		echo "OK";

	$stmt->bind_result($cpt);
	$stmt->fetch();

	if ($cpt > 0)
		return true;
	else
		return false;
}


?>