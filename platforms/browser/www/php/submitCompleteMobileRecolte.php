<?php
ini_set('display_errors', 1);
// Reporte toutes les erreurs PHP (Voir l'historique des modifications)
error_reporting(E_ALL);
$data = json_decode($_POST['data']);

if (!$data || empty($data->user_id))
	return;

$recolt_ID = executeRequest($data);
if ($recolt_ID == -1) {
	echo "Echec de l'insertion dans la base";
	return;
}

savePictures($recolt_ID, $data);

function executeRequest($data) {
	//typeID = 0 => création
	//typeID = 1 => modification de récolte
	//typeID = 2 => complétion d'une récolte faite sur mobile
	$type_id = $data->type_id;

	if ($type_id === 0 || $type_id === 2) {
		$query = "INSERT INTO recolte (user_id, genre, epithete, rangintraspec, taxintraspec, modulation, autorites, date_recolte, pays,"
			. " departement, localite, lieu_dit, domaine, sous_domaine, statut_protection, MEN, MER, gps_latitude, gps_longitude, rayon,"
			. " qte_sur_rayon, altitude, refhabitat, ecologie, codeSubstrat, hote, etat_hote, leg, det, origin,"
			. " collaboration, type_recolte, remarque, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
} else {
	$query = "UPDATE recolte SET user_id=?, genre=?, epithete=?, rangintraspec=?, taxintraspec=?, modulation=?, autorites=?, "
	. "date_recolte=?, pays=?, departement=?, localite=?, lieu_dit=?, domaine=?, sous_domaine=?, statut_protection=?, MEN=?, MER=?,"
	. " gps_latitude=?, gps_longitude=?, rayon=?, qte_sur_rayon=?, altitude=?, refhabitat=?, ecologie=?, codeSubstrat=?, hote=?, etat_hote=?,"
	. " leg=?, det=?, origin=?, collaboration=?, type_recolte=?, remarque=? WHERE id=?";
}

include('../connexionBdd/bddInventaireMobile.php');

if (!($stmt = $id_connect->prepare($query))) {
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
}

$codeSubstrat = getCodeSubstrat($data->substrat);

if ($type_id === 0 || $type_id === 2) {
	if (!$stmt->bind_param("issssssssssssssssddiiississsssssss", $data->user_id, $data->genre, $data->espece, $data->rang, $data->taxon
		, $data->modulation, $data->autorites, $data->date, $data->pays, $data->departement, $data->ville, $data->lieu_dit, $data->domaine
		, $data->sous_domaine, $data->statut_protection, $data->men, $data->mer, $data->latitude, $data->longitude, $data->etendue
		, $data->quantite, $data->altitude, $data->referentiel, $data->habitat, $codeSubstrat, $data->hote, $data->etat_hote
		, $data->legs, $data->dets, $data->asso, $data->collaboration, $data->type_recolte, $data->remarques, $data->created_at)) {

		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
}
} else {
	if (!$stmt->bind_param("issssssssssssssssddiiississssssssi", $data->user_id, $data->genre, $data->espece, $data->rang, $data->taxon
		, $data->modulation, $data->autorites, $data->date, $data->pays, $data->departement, $data->ville, $data->lieu_dit, $data->domaine
		, $data->sous_domaine, $data->statut_protection, $data->men, $data->mer, $data->latitude, $data->longitude, $data->etendue
		, $data->quantite, $data->altitude, $data->referentiel, $data->habitat, $codeSubstrat, $data->hote, $data->etat_hote
		, $data->legs, $data->dets, $data->asso, $data->collaboration, $data->type_recolte, $data->remarques, $data->former_id)) {

		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
}
}

		//On exécute la requête
if (!$stmt->execute()) {
	echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
	return -1;
} else {
	if ($type_id === 0 || $type_id === 2)
		$id = mysqli_insert_id($id_connect);
	else
		$id = $data->former_id;

	$numsHerbier = $data->numsHerbier;
	$codesHerbier = $data->codesHerbier;
	for ($i = 0; $i < count($numsHerbier); $i++) {
		$num = $numsHerbier[$i];
		$code = $codesHerbier[$i];

		$query = "INSERT INTO herbier (id_recolte, herbier, codeherbier) VALUES (?, ?, ?);";
		if (!($stmt = $id_connect->prepare($query))) {
			echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
		}
		if (!$stmt->bind_param("iss", $id, $num, $code)) {
			echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
		}
		$stmt->execute();
	}
	return $id;
}
}

function removeFormerPictures($id) {
	include('../connexionBdd/bddInventaireMobile.php');

	$query = "DELETE FROM recolte_photos WHERE recolt_id = ?";
	if (!($stmt = $id_connect->prepare($query))) {
		echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
	}
	if (!$stmt->bind_param("i", $id)) {
		echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
	}
	$stmt->execute();
}

function savePictures($recolt_id, $data) {
	include('../connexionBdd/bddInventaireMobile.php');

	$type_id = $data->type_id;

	if ($type_id == 1)
		removeFormerPictures($recolt_id);

	$array = $data->pictures;

	if (count($array) == 0)
		return;
	
	$picturesAuthors = $data->pictures_authors;
	$path = makeRecoltDir($data->user_id, $recolt_id);

	for ($i = 0; $i < count($array); $i++) {
		$src = $array[$i];
		$image_name = $data->genre."_".$data->espece."_".$data->rang."_".$data->taxon."_".$recolt_id."_".$data->date."_".$i.".jpg";
		$query = "INSERT INTO recolte_photos (user_id, recolt_id, nom, auteur) VALUES (?, ?, ?, ?);";

		if (! ($stmt = $id_connect->prepare($query))) {
			echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
			return;
		}
		if (!$stmt->bind_param("iiss", intval($data->user_id), $recolt_id, $image_name, $picturesAuthors[$i])) {
			echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
			return;
		}
		if (!$stmt->execute()) {
			echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
			return;
		} else {
			if (strstr($src, "wp-content")) {
				//Le fichier est déjà sur le serveur, on le déplace dans le bon dossier
				$src = "/home/dbmycofrhu/www/inventaire/".$src;
				echo $src."\n";
				if (!copy($src, $path.$image_name))
					echo "echec copie\n";
			} else {
				//On crée le fichier
				$src = explode(",", $src)[1];
				$img = base64_decode($src);
				if (!file_put_contents($path.$image_name, $img))
					echo "echec upload \n";
			}
		} 
	}
	echo "OK\n";
}

function makeRecoltDir($user_id, $recolt_id) {
	$path = "/home/dbmycofrhu/www/inventaire/wp-content/uploads/photos_recoltes/";
	$user_path = $path."user".$user_id."/";
	$recolt_path = $user_path."recolte".$recolt_id."/";

	if (!file_exists($user_path))
		mkdir($user_path);
	if (!file_exists($recolt_path))
		mkdir($recolt_path);

	return $recolt_path;
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
?>