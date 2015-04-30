<?php
$id_connect = mysql_connect("10.0.246.17","root", "lveblmeb");
	$id_db = mysql_select_db("users",$id_connect);
	mysql_query("SET NAMES 'utf8'");	
?>