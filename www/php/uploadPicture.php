<?php
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

$image_path = "/var/www/smnf/champignons_pictures/";
$image_name = substr($_FILES["file"]["tmp_name"], strrpos($_FILES["file"]["tmp_name"], "/") + 1).".jpg";
$result = move_uploaded_file($_FILES["file"]["tmp_name"], $image_path.$image_name);
if ($result)
	echo "trokiewl";
else
	echo "caca :'(";
?>