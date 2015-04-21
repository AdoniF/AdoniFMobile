<?php

//Ce fichier permet de récupérer l'intégralité des substrats depuis le référentiel.

// connexion
include('../connexionBdd/bddRef.php');
// requête
$query = "SELECT DISTINCT libelle FROM substrat ORDER BY code";

$resultat = mysql_query($query);
while ($row = mysql_fetch_array($resultat)) {
	echo $row['libelle']."\n";
}

?>