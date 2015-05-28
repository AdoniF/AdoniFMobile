<?php
include "connexionBdd/bddInventaireMobile.php";

$id = $_SESSION['id'];

if (!isset($id)) {
	echo "Veuillez vous connecter.";
	return;
}

$query = "SELECT genre, epithete, date_recolt, id FROM recolte_mobile WHERE user_id = ?";

if (!($stmt = $id_connect->prepare($query))) {
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
}

if (!$stmt->bind_param("i", $id)) {
	echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
}

if (!$stmt->execute()) {
	echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
	return;
}
$stmt->store_result();
if ($stmt->num_rows == 0) {
	echo "Vous n'avez aucune récolte temporaire à compléter.";
	return;
}

$stmt->bind_result($genre, $epithete, $date, $id_recolte);

$table = "<div id='listRows'><table class='table' id='table'><thead><tr><th>Récoltes en attente</th></tr></thead><tbody>";
$fields = "";
while ($stmt->fetch()) {
	$url = "http://inventaire.dbmyco.fr/modification-recolte-mobile/?id=".$id_recolte."&type=2";
	$function = "document.location.href='".$url."'";
	$fields .= "<fieldset style='margin-bottom:20px;'><legend>".$genre." ".$epithete."</legend>";
	$fields .= "<p><span>Date de récolte : ".$date."</span>";

	$fields .= "<button type='button' class='btn btn-success pull-right' onclick=".$function.">Compléter la récolte</button>";
	$fields .= "</p></fieldset>";
}

echo "<h3 class='col-xs-offset-2'>Liste des récoltes mobiles</h3>";
echo $fields;
?>