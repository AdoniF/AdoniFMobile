<?php 
include("../connexionBdd/bddReferentielMobile.php"); 

$query = "SELECT statutlibelle FROM statutProtection;";
$resultat = mysqli_query($id_connect, $query);

while ($row = mysqli_fetch_array($resultat)) {
	echo $row['statutlibelle']."\n";
}

?>