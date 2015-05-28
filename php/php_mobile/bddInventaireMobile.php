<?php
$id_connect = new mysqli("dbmycofrhuinv.mysql.db","dbmycofrhuinv", "Inv1myco", "dbmycofrhuinv");
if ($id_connect->connect_errno) {
	echo "Echec lors de la connexion à MySQL : (" . $id_connect->connect_errno . ") " . $id_connect->connect_error;
}
mysqli_query($id_connect, "SET NAMES 'utf8'");
?>