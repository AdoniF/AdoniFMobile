<?php
//Ce fichier permet de récupérer l'intégralité des genres possibles depuis la base de données du référentiel.
$base=htmlentities($_GET['base']);
$arraybase=array('asco','basidio',"chytridio","glomero","mycetozoa", "zygo");

if (!in_array($base, $arraybase))
	return;

// connexion
include('../connexionBdd/bddRef.php');
// requête
$query = "SELECT DISTINCT GENRE, EPITHETE, RANGINTRASPECIFIQUE, TAXINTRASPECIFIQUE, LB_AUTEUR FROM "
	.$base." ORDER BY GENRE, EPITHETE, RANGINTRASPECIFIQUE, TAXINTRASPECIFIQUE, LB_AUTEUR";

$resultat = mysql_query($query);
while ($row = mysql_fetch_array($resultat)) {
	echo $row['GENRE']."$".$row['EPITHETE']."$".$row['RANGINTRASPECIFIQUE']."$".$row['TAXINTRASPECIFIQUE']."$".$row['LB_AUTEUR']."\n";
}
?>