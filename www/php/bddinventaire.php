<?php
	$id_connect = mysql_connect("dbmycofrhuinv.mysql.db","dbmycofrhuinv", "Inv1myco");
	$id_db = mysql_select_db("dbmycofrhuinv",$id_connect);
	mysql_query("SET NAMES 'utf8'");	
?>