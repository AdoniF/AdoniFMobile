<?php

include('../connexionBdd/bddInventaireMobile.php');

$id_recolt = $_GET['id'];
if (!isset($id_recolt))
	return;

$query = "SELECT codeherbier, herbier from herbier WHERE id_recolte = ?";

if (!($stmt = $id_connect->prepare($query)))
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
if (!$stmt->bind_param("i", $id_recolt))
	echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;

$stmt->execute();
$stmt->bind_result($codeherbier, $herbier);

while ($stmt->fetch()) {
	echo $codeherbier."$".$herbier."\n";
}

?>