<?php

//Ce fichier permet de récupérer l'intégralité des substrats depuis le référentiel.

// connexion
include('../connexionBdd/bddInventaire.php');
// requête
$query = "SELECT DISTINCT id, nom, prenom FROM user WHERE id in (SELECT idleg FROM recleg) ORDER BY nom";

$resultat = mysql_query($query);
while ($row = mysql_fetch_array($resultat)) {
	echo $row['id']."$".$row['prenom']."$".$row['nom']."\n";
}

?>