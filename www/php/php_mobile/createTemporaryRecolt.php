<?php
include('../connexionBdd/bddInventaireMobile.php');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode($_POST['data']);
if (!$data || empty($data->user_id))
	return;

//Requête d'insertion dans la base
$query = "INSERT INTO recolte_mobile (user_id, genre, epithete, rangintraspec, taxintraspec, modulation, autorites, "
	." date_recolt, gps_latitude, gps_longitude, altitude, rayon, quantite, accuracy, codeSubstrat, hote, etat_hote, leg, det) VALUES ("
	."?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

//On prépare la requête
if (! ($stmt = $id_connect->prepare($query))) {
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
}

//On récupère le code du substrat entré sur mobile

$codeSubstrat = getCodeSubstrat($data->codeSubstrat);

//On bind les paramètres à la requête
if (!$stmt->bind_param("isssssssddiiiiissss", $data->user_id, $data->genre, $data->epithete, $data->rangintraspec, $data->taxintraspec
	, $data->modulation, $data->autorites, $data->date_recolt, $data->gps_latitude, $data->gps_longitude, $data->altitude, $data->rayon
	, $data->quantite, $data->precision, $codeSubstrat, $data->hote, $data->etat_hote, $data->leg, $data->det)) {
	echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
}

//On exécute la requête
if (!$stmt->execute()) {
	echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
} else {
	$id = mysqli_insert_id($id_connect);
	echo "OK;".$id;
}

//Fonction permettant de récupérer le code du substrat textuel passé en paramètre
function getCodeSubstrat($code) {
	include('../connexionBdd/bddReferentielMobile.php');
	$query = "SELECT code FROM substrat WHERE libelle = ?";

	if (! ($stmt = $id_connect->prepare($query))) {
		echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
	}
	$code = trim(str_replace("&nbsp", "", $code));

	if (!$stmt->bind_param("s", $code)) {
		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
	}
	if (!$stmt->execute()) {
		echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
		return null;
	}

	//On associe le code de la requête à une variable (ici substrat)
	$stmt->bind_result($substrat);
	//On charge la première ligne de résultat
	$stmt->fetch();
	
	return $substrat;
}

/*error_reporting(E_ALL);
ini_set('display_errors', 1);
include('../connexionBdd/bddInventaireMobile.php');

$data = json_decode($_POST['data']);
if (!$data || empty($data->user_id))
	return;

//Requête d'insertion dans la base
$query = "INSERT INTO recolte_mobile (user_id, genre, epithete, rangintraspec, taxintraspec, modulation, autorites, "
	." date_recolt, gps_latitude, gps_longitude, altitude, rayon, codeSubstrat, hote, etat_hote, leg, det, quantite, precision)"
	." VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

//On prépare la requête
if (! ($stmt = $id_connect->prepare($query))) {
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
}

//On récupère le code du substrat entré sur mobile
$codeSubstrat = getCodeSubstrat($data->codeSubstrat);


//On bind les paramètres à la requête
if (!$stmt->bind_param("isssssssddiiissssii", $data->user_id, $data->genre, $data->epithete, $data->rangintraspec, $data->taxintraspec
	, $data->modulation, $data->autorites, $data->date_recolt, $data->gps_latitude, $data->gps_longitude, $data->altitude, $data->rayon
	, $codeSubstrat, $data->hote, $data->etat_hote, $data->leg, $data->det, $data->quantite, $data->precision)) {
	echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
}

//On exécute la requête
if (!$stmt->execute()) {
	echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
} else {
	$id = mysqli_insert_id($id_connect);
	echo "OK;".$id;
}

//Fonction permettant de récupérer le code du substrat textuel passé en paramètre
function getCodeSubstrat($code) {
	include('../connexionBdd/bddReferentielMobile.php');
	$query = "SELECT code FROM substrat WHERE libelle = ?";

	if (! ($stmt = $id_connect->prepare($query))) {
		echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
	}
	$code = trim(str_replace("&nbsp", "", $code));

	if (!$stmt->bind_param("s", $code)) {
		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
	}
	if (!$stmt->execute()) {
		echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
		return null;
	}

	//On associe le code de la requête à une variable (ici substrat)
	$stmt->bind_result($substrat);
	//On charge la première ligne de résultat
	$stmt->fetch();
	
	return $substrat;
}*/
?>