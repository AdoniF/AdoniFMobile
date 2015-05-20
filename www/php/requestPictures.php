<?php

$recolt_id = $_GET['id'];

//typeID = 0 => création
//typeID = 1 => modification de récolte
//typeID = 2 => complétion d'une récolte faite sur mobile
$type_id = $_GET['type'];
if (!isset($recolt_id) || !isset($type_id) || $type_id === 0) {
	echo "KO";
	return;
}

include("../connexionBdd/bddInventaireMobile.php"); 

$table = $type_id === "1" ? "recolte_photos" : "recolte_photos_mobile";
$query = "SELECT nom, auteur FROM ".$table." WHERE recolt_id = ?";

$stmt = $id_connect->prepare($query);
$stmt->bind_param("i", $recolt_id);
$stmt->execute();

$stmt->bind_result($nom, $auteur);

while ($stmt->fetch()) {
	echo $nom."$".$auteur."\n";
}

$stmt->close();
?>