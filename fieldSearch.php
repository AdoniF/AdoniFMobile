<style>
#results > div:nth-child(even) {
	background-color: #D0F0C0;
}
</style>

<?php
remove_filter ('the_content','wpautop');

$query = "SELECT DISTINCT epithete, genre, rangintraspec, taxintraspec FROM recolte WHERE valide=1 ";

$genre = $_REQUEST['genre'];
$espece = $_REQUEST['epithete'];
$rang = $_REQUEST['rang'];
$epithete = $_REQUEST['taxintraspec'];
$commune = $_REQUEST['commune'];
$dpt = $_REQUEST['departement'];
$habitat = $_REQUEST['ecologie'];
$substrat = getCodeSubstrat($_REQUEST['substrat']);
$hote = $_REQUEST['hote'];
$provenance = $_REQUEST['provenance'];

if (isset($genre) && strlen($genre) > 0)
	$query .= " AND genre='".$genre."'";
if (isset($espece) && strlen($espece) > 0)
	$query .= " AND epithete='".$espece."'";
if (isset($rang) && strlen($rang) > 0)
	$query .= " AND rangintraspec='".$rang."'";
if (isset($epithete) && strlen($epithete) > 0)
	$query .= " AND taxintraspec='".$epithete."'";
if (isset($commune) && strlen($commune) > 0)
	$query .= " AND localite='".$commune."'";
if (isset($dpt) && strlen($dpt) > 0)
	$query .= " AND departement='".$dpt."'";
if (isset($habitat) && strlen($habitat) > 0)
	$query .= " AND ecologie='".$habitat."'";
if (isset($substrat) && strlen($substrat) > 0)
	$query .= " AND substrat='".$substrat."'";
if (isset($hote) && strlen($hote) > 0)
	$query .= " AND hote='".$hote."'";
if (isset($provenance) && strlen($provenance) > 0)
	$query .= " AND origin='".$provenance."'";

$query .= " AND genre<>'' ORDER BY genre, epithete, rangintraspec, taxintraspec ASC";

include("connexionBdd/bddInventaireMobile.php"); 
$resultat = mysqli_query($id_connect, $query);

$row_cnt = mysqli_num_rows($resultat);

if ($row_cnt > 0) {
	echo "<div class='col-xs-12'><h3>Nom</h3></div>";
	echo "<div id='results'>";
	while ($row = mysqli_fetch_array($resultat)) {
		echo "<div class='row'>";
		$nom = $row['genre']." ".$row['epithete']." ".$row['rangintraspec']." ".$row['taxintraspec'];
		echo "<div class='col-xs-6'>".$nom."</div>";
		$url = "../recherche-specifique?genre=".$row['genre']."&epithete=".$row['epithete']."&rang=".$row['rangintraspec']."&taxon=".$row['taxintraspec']
		."&commune=".$commune."&dpt=".$dpt."&habitat=".$habitat."&substrat=".$substrat."&hote=".$hote."&provenance=".$provenance;
		echo "<div class='col-xs-6 text-right'><a href='".$url."'>détails</a></div>";
		echo "</div>";
	}
	echo "</div>";
} else {
	echo "Aucun résultat dans la base. Veuillez simplifier votre requête.";
}

//Fonction permettant de récupérer le code du substrat textuel passé en paramètre
function getCodeSubstrat($code) {
	if (!isset($code) || strlen($code) == 0)
		return;

	include('connexionBdd/bddReferentielMobile.php');
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
