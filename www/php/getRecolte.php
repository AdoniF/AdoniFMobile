<?php
error_reporting(E_ALL);
ini_set("display_errors", 1); 
$recoltID = $_GET['id'];
include('../connexionBdd/bddInventaireMobile.php');

$query = "SELECT user_id, genre, epithete, rangintraspec, taxintraspec, modulation, autorites, date_recolt, gps_latitude, "
."gps_longitude, altitude, rayon, quantite, hote, etat_hote, leg, det FROM recolte_mobile WHERE id=?";

if (!($stmt = $id_connect->prepare($query)))
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;

if (!$stmt->bind_param("i", $recoltID))
	echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;

if (!$stmt->execute())
	echo "KO";
else {
	$substrat = getSubstrat($recoltID);

	$stmt->bind_result($user_id, $genre, $epithete, $rang, $taxon, $modulation, $autorites, $date, $latitude,
		$longitude, $altitude, $rayon, $quantite, $hote, $etat_hote, $leg, $det);
	$stmt->fetch();
	echo $user_id."$".$genre."$".$epithete."$".$rang."$".$taxon."$".$modulation."$".$autorites."$".$date."$".$latitude
	."$".$longitude."$".$altitude."$".$rayon."$".$quantite."$".$substrat."$".$hote."$".$etat_hote."$".$leg."$".$det;
}

function getSubstrat($id) {
	include '../connexionBdd/bddReferentielMobile.php';

	$query = "SELECT libelle from substrat WHERE code=?";
	$stmt = $id_connect->prepare($query);
	$stmt->bind_param("i", $id);
	$stmt->execute();

	$stmt->bind_result($substrat);
	$stmt->fetch();

	return $substrat;
}

?>