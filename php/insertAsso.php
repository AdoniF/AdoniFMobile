<?php

ini_set('display_errors', 1);
error_reporting(e_all);

$asso = $_GET['asso'];

if (!isset($asso)) {
	return;
}

include('../connexionBdd/bddInventaireMobile.php');

$query = "INSERT INTO asso (nom) VALUES (?)";

if (!($stmt = $id_connect->prepare($query))) {
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
}

if (!$stmt->bind_param("s", $asso)) {
	echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
}

if (!$stmt->execute()) {
	echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
	return;
} else {
	echo "OK";
}

?>