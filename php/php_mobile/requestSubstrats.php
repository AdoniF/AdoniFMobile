<?php
//Ce fichier permet de récupérer l'intégralité des substrats depuis le référentiel.

// connexion
include('../connexionBdd/bddReferentielMobile.php');
// requête
$query = "SELECT DISTINCT code, libelle FROM substrat ORDER BY code";

$resultat = mysqli_query($id_connect, $query);

while ($row = mysqli_fetch_array($resultat)) {
	$code = $row['code'];
	//On cherche la première occurence d'un 0 dans le code...
	$i = strpos($code, '0');

	$spaces = '';
	//Pour chaque nombre qui n'est pas 0 dans le code, on met deux espaces
	for ($j = 0; $j < $i - 1; $j++)
		$spaces .= '&nbsp;&nbsp;';

	echo $spaces.$row['libelle']."\n";
}

?>