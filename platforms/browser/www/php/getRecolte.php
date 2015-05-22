<?php
$recoltID = $_GET['id'];
if (!isset($recoltID)) {
	echo "KO";
	return;
}

//typeID = 0 => création
//typeID = 1 => modification de récolte
//typeID = 2 => complétion d'une récolte faite sur mobile
$typeID = $_GET['type'];

$isTemporaryRecolt = (isset($typeID) && $typeID == 2);

if ($isTemporaryRecolt)
	$query = "SELECT user_id, genre, epithete, rangintraspec, taxintraspec, modulation, autorites, date_recolt, gps_latitude, "
."gps_longitude, altitude, rayon, quantite, hote, etat_hote, leg, det, accuracy FROM recolte_mobile WHERE id=?";

else //tableID = 1
$query = "SELECT user_id, genre, epithete, rangintraspec, taxintraspec, modulation, autorites, date_recolte, gps_latitude, "
."gps_longitude, altitude, rayon, qte_sur_rayon, hote, etat_hote, leg, det, pays, departement, localite, lieu_dit, "
."domaine, sous_domaine, statut_protection, MEN, MER, refhabitat, ecologie, origin, collaboration, "
."remarque, type_recolte FROM recolte WHERE id=?";

include('../connexionBdd/bddInventaireMobile.php');

if (!($stmt = $id_connect->prepare($query)))
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;

if (!$stmt->bind_param("i", $recoltID))
	echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;

if (!$stmt->execute())
	echo "KO";
else {
	$substrat = getSubstrat($recoltID);

	if ($isTemporaryRecolt) {
		$stmt->bind_result($user_id, $genre, $epithete, $rang, $taxon, $modulation, $autorites, $date, $latitude,
			$longitude, $altitude, $rayon, $quantite, $hote, $etat_hote, $leg, $det, $precision);
		$stmt->fetch();
		echo $user_id."$".$genre."$".$epithete."$".$rang."$".$taxon."$".$modulation."$".$autorites."$".$date."$".$latitude
		."$".$longitude."$".$altitude."$".$rayon."$".$quantite."$".$substrat."$".$hote."$".$etat_hote."$".$leg."$".$det
		."$".$precision;
	} else {

		$stmt->bind_result($user_id, $genre, $epithete, $rang, $taxon, $modulation, $autorites, $date, $latitude,
			$longitude, $altitude, $rayon, $quantite, $hote, $etat_hote, $leg, $det, $pays, $departement, $localite, $lieu_dit,
			$domaine, $sous_domaine, $statut_protection, $men, $mer, $refhabitat, $ecologie, $origin, 
			$collaboration, $remarque, $type_recolte);
		$stmt->fetch();
		echo $user_id."$".$genre."$".$epithete."$".$rang."$".$taxon."$".$modulation."$".$autorites."$".$date."$".$latitude
		."$".$longitude."$".$altitude."$".$rayon."$".$quantite."$".$substrat."$".$hote."$".$etat_hote."$".$leg."$".$det."$".$pays
		."$".$departement."$".$localite."$".$lieu_dit."$".$domaine."$".$sous_domaine."$".$statut_protection."$".$men."$".$mer
		."$".$refhabitat."$".$ecologie."$".$origin."$".$collaboration."$".$remarque."$".$type_recolte;
	}
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