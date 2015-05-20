<?php 
include("../connexionBdd/bddInventaireMobile.php"); 

$query = "SELECT DISTINCT hote FROM recolte WHERE hote != '' ORDER BY hote ASC;";
$resultat = mysqli_query($id_connect, $query);

while ($row = mysqli_fetch_array($resultat)) {
	echo $row['hote']."\n";
}

?>