<?php 
$result = "";
$mail = $_POST['param1'];
$pass = $_POST['param2'];
if ((!empty($mail)) && (!empty($pass))) {
  include("../connexionBdd/mycofrancebdd.php");

  $query = 'SELECT nom, prenom, email, password FROM user where provenance=2 or provenance=3';
  $sum = md5($pass);
  $response = mysql_query($query);

  while ($data = mysql_fetch_array($response)) {
    if (($data['email']==$mail) and ($data['password']==$sum)) {
      $result = "OK$".$data['prenom']."$".$data['nom'];
      break;
    }
  }
}
if (!empty($result)) {
  echo $result;
} else {
  echo "KO";
}
?>