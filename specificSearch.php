<?php

$genre = $_GET['genre'];
$epithete = $_GET['epithete'];
$rang = $_GET['rang'];
$taxon = $_GET['taxon'];
$commune = $_GET['commune'];
$dpt = $_GET['departement'];
$habitat = $_GET['ecologie'];
$substrat = getCodeSubstrat($_GET['substrat']);
$hote = $_GET['hote'];
$provenance = $_GET['provenance'];

$query = "SELECT id, epithete, domaine, departement, genre, rangintraspec, taxintraspec, localite, domaine, sous_domaine, date_recolte FROM recolte where valide=1";

if (isset($genre) && strlen($genre) > 0)
	$query .= " AND genre='".$genre."'";
if (isset($epithete) && strlen($epithete) > 0)
	$query .= " AND epithete='".$epithete."'";
if (isset($rang) && strlen($rang) > 0)
	$query .= " AND rangintraspec='".$rang."'";
else
	$query .= " AND rangintraspec=''";
if (isset($taxon) && strlen($taxon) > 0)
	$query .= " AND taxintraspec='".$taxon."'";
else
	$query .= " AND taxintraspec=''";
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

$query .= " ORDER BY genre, epithete, rangintraspec, taxintraspec, localite, domaine, date_recolte ASC";
include("connexionBdd/bddInventaireMobile.php"); 
$resultat = mysqli_query($id_connect, $query);

echo "<table class='table table-condensed table-striped'>";
echo "<thead><tr><th colspan='2'>Nom</th><th>Dép.</th><th colspan='2'>Commune/Domaine</th><th>Date</th><th>Photo</th><th>Fiches</th></tr></thead>";
$table_rows = array();
$liste = array();


$query = "SELECT id, epithete, domaine, departement, genre, rangintraspec, taxintraspec, localite, domaine, sous_domaine, date_recolte FROM recolte where valide=1";

while ($row = mysqli_fetch_array($resultat)) {
	//On détermine le champ commune/domaine, on s'arrange pour ne mettre un / que si les deux sont présents dans la table
	$location = "";
	if (strlen($row['localite']) > 0) {
		$location = $row['localite'];
		if (strlen($row['domaine']) > 0)
			$location .= "/";
	}
	$location .= $row['domaine'];


	$line = "<td class='text-center' colspan='2'>".$row['genre']." ".$row['epithete']." ".$row['rangintraspec']." ".$row['taxintraspec']."</td>";
	$line .= "<td class='text-center' >".$row['departement']."</td>";
	$line .= "<td class='text-center' colspan='2'>".$location."</td>";
	$line .= "<td class='text-center' >".$row['date_recolte']."</td>";

	$pic_query = "SELECT COUNT(*) as nb from recolte_photos WHERE recolt_id=".$row['id'];
	$pic_res = mysqli_query($id_connect, $pic_query);
	$res = mysqli_fetch_array($pic_res);

	if ($res['nb'] > 0)
		$line .= "<td class='text-center' >Oui</td>";
	else
		$line .= "<td class='text-center' >Non</td>";
	array_push($liste, $row['id']);
	array_push($table_rows, $line);
}

$liste_str= $liste[0]."";
for ($i = 1; $i < count($liste); $i++) {
	$liste_str .= ",".$liste[$i];
}

for ($i = 0; $i < count($table_rows); $i++) {
	echo "<tr>";
	echo $table_rows[$i];
	$url = "../fiches-techniques?id=".$liste[$i]."&PHYLUM=&liste=".$liste_str."&index=".$i;
	echo "<td class='text-center'><a href='".$url."'>voir</a></td>";
	echo "</tr>";

}
echo "</table>";

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

<style>
.table-striped > tbody > tr:nth-child(2n+1) {
	background-color: #D0F0C0;
}

table, th, td {
	text-align: center;
}

.table td {
   text-align: center;   
}
</style>