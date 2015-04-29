<?php 
$result = "";
$mail = $_POST['param1'];
$pass = $_POST['param2'];
if ((!empty($mail)) && (!empty($pass))) {
  include("../connexionBdd/bddusers.php");

  $query = 'SELECT nom, prenom, email, password FROM user';
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