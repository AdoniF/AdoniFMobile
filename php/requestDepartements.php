<?php 
include("../connexionBdd/bddInventaireMobile.php"); 

$query = "SELECT num, dept FROM departement;";
$resultat = mysqli_query($id_connect, $query);

while ($row = mysqli_fetch_array($resultat)) {
	if (strlen($row['dept']) == 0)
		continue;
	echo $row['num']." - ".$row['dept']."\n";
}

?>