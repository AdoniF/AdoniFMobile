<?php 
include("../connexionBdd/bddInventaireMobile.php"); 

$query = "SELECT nom FROM asso;";
$resultat = mysqli_query($id_connect, $query);

while ($row = mysqli_fetch_array($resultat)) {
	echo $row['nom']."\n";
}

?>