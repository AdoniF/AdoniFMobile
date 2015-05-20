<?php
//Vérifier la connexion de l'utilisateur
if(!(empty($_POST['email']) || empty($_POST['mdp'])))
	return;

include "connexionBdd/bddInventaireMobile.php";

$id = $_SESSION['id'];

$query = "SELECT genre, epithete, date_recolt, id FROM recolte_mobile WHERE user_id =".$id.";";
//$query = "SELECT genre, epithete, date_recolt, id FROM recolte_mobile;";
$resultat = $id_connect->query($query);
/*
if (!($resultat = mysqli_query($id_connect, $query)))
	echo "Erreur requête : ".mysqli_errno($id_connect).":".mysqli_error($id_connect)."</br>";
else
	echo "pas d'erreur</br>";
*/
$no_result = true;
$table = "<div id='listRows'><table class='table' id='table'><thead><tr><th>Récoltes en attente</th></tr></thead><tbody>";
while ($row = mysqli_fetch_array($resultat)) {
	$table .= "<tr><td><div class='row'>";
	$table .= "<span class='col-xs-8'>".$row['genre']." ".$row['epithete']."</span>";
	$table .= "<span class='col-xs-4'>";
	$table .= "<button type='button' class='btn btn-success pull-right'>Soumettre</button>";
	$table .= "<button type='button' class='btn btn-success pull-right'>Modifier</button>";
	$table .= "</span>";
	$table .= "</div></td></tr>";
	$no_result = false;
}
$table .= "</tbody></table></div>";

/*"http://inventaire.dbmyco.fr/modify_recolt/"
*/
if ($no_result)
	echo "Vous n'avez pas de récolte temporaire.";
else
	echo $table;
mysqli_close($id_connect);
?>