<?php

$recolt_id = $_GET['id'];
if (!isset($recolt_id)) {
	echo "KO";
	return;
}

include("../connexionBdd/bddInventaireMobile.php"); 

$query = "SELECT nom FROM recolte_photos_mobile WHERE recolt_id = ?";

$stmt = $id_connect->prepare($query);
$stmt->bind_param("i", $recolt_id);
$stmt->execute();

$stmt->bind_result($row);

while ($stmt->fetch()) {
	echo $row."\n";
}

$stmt->close();
?>