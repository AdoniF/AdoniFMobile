<?php 
$result = "";
$data = json_decode($_POST['data']);
$mail = $data->param1;
$pass = $data->param2;
if ((!empty($mail)) && (!empty($pass))) {
  include("../connexionBdd/bddusers.php");

  $query = 'SELECT id, nom, prenom, email, password FROM user';
  $sum = md5($pass);
  $response = mysql_query($query);

  while ($data = mysql_fetch_array($response)) {
    if (($data['email']==$mail) and ($data['password']==$sum)) {
      $result = "OK$".$data['prenom']."$".$data['nom']."$".$data['id'];
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