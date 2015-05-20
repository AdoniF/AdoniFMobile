<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
include('../connexionBdd/bddInventaireMobile.php');
$user_id = $_POST["userID"];
$recolt_id = $_POST["recoltID"];
$image_name = $_POST["fileName"].".jpg";

$pictures_path = "/home/dbmycofrhu/www/inventaire/wp-content/uploads/photos_recoltes/";
$user_path = $pictures_path."user".$user_id."/";
$image_path = $user_path."recolte ".$recolt_id."/";

if (!file_exists($user_path))
	mkdir($user_path);
if (!file_exists($image_path))
	mkdir($image_path);

echo $_FILES["file"]["tmp_name"]."\n";
//$image_name = substr($_FILES["file"]["tmp_name"], strrpos($_FILES["file"]["tmp_name"], "/") + 1).".jpg";

$query = "INSERT INTO recolte_photos_mobile (user_id, recolt_id, nom) VALUES (?, ?, ?);";

if (! ($stmt = $id_connect->prepare($query)))
	echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;

if (!$stmt->bind_param("iis", $user_id, $recolt_id, $image_name))
	echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;

if (!$stmt->execute()) {
	echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
} else {
	$result = move_uploaded_file($_FILES["file"]["tmp_name"], $image_path.$image_name);
	echo "OK";
}
?>