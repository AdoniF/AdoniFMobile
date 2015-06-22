<style>
.table-striped > tbody > tr:nth-child(2n+1) {
    background-color: #D0F0C0;
}

table, th, td {
    text-align: center;
}

.table td {
   text-align: center;   
}
</style>

<?php
// Le formulaire de connexion est bien rempli 
if((!empty($_POST['email'])) && (!empty($_POST['mdp'])))
{
  include("./connexionBdd/bddusers.php");

  $query = 'SELECT * FROM user';
  $reponse = mysql_query($query);
// crypte le mot de passe 
  $dec = md5($_POST['mdp']);


  while($donnees = mysql_fetch_array($reponse))
  {
   //Connexion si datefin non depassé ou ne dispose pas de date fin
     if(($donnees['email']==$_POST['email']) and ($donnees['password']==$dec) and ($donnees['droitConnexion']==0 || $donnees['droitConnexion']==1) and ($donnees['valide']==1) and ($donnees['date_fin']==NULL ||$donnees['date_fin']>date("Y-m-d")))
     {

     //Mise en place de toutes les Sessions
       $_SESSION['login']=$donnees['login'];
       $_SESSION['nom']=$donnees['nom'];
       $_SESSION['prenom']=$donnees['prenom'];
       $_SESSION['admin']=$donnees['admin'];
       $_SESSION['valideur']=$donnees['valideur'];
       $_SESSION['droits_inventaire']=$donnees['droits_inventaire'];
       $_SESSION['droits_mycodoc']=$donnees['droits_mycodoc'];
       $_SESSION['id']=$donnees['id'];

//actualisation de la dernière connexion 
       $update = 'UPDATE user SET last_login=now() WHERE id=\'' . $donnees['id'] . '\'';
       $rep = mysql_query($update);

       $sql="Select * from type_droits where numero=".$donnees['droits_inventaire']."";
       $rep2 = mysql_query($sql);
       $donnees2 = mysql_fetch_array($rep2);
       $_SESSION['dureeCompte']=$donnees2 ['dureeCompte'];
       $_SESSION['droitAdmin']=$donnees2 ['droitAdmin'];
       $_SESSION['droitLocalisation']=$donnees2 ['droitLocalisation'];
       $_SESSION['accesDonnee']=$donnees2 ['accesDonnee'];
       $_SESSION['droitModif']=$donnees2 ['droitModif'];
       $_SESSION['droitSaisie']=$donnees2 ['droitSaisie'];
       $_SESSION['superAdmin']=$donnees2 ['droitSuperAdmin'];
   }

//Si datefin du compte depassé
   else if(($donnees['email']==$_POST['email']) &&($donnees['password']==$dec) &&($donnees['valide']==1) && ($donnees['droitConnexion']==0 || $donnees['droitConnexion']==1) && ($donnees['date_fin']<date("Y-m-d"))){
// Mise de tous les droits des utilisateurs au plus bas comme un utilisateur non connecté
       $update = 'UPDATE user SET last_login=now() WHERE id=\'' . $donnees['id'] . '\'';
       $rep = mysql_query($update);
       $_SESSION['login']=$donnees['login'];
       $_SESSION['nom']=$donnees['nom'];
       $_SESSION['prenom']=$donnees['prenom'];
       $_SESSION['admin']=$donnees['admin'];
       $_SESSION['valideur']=$donnees['valideur'];
       $_SESSION['droits_inventaire']=$donnees['droits_inventaire'];
       $_SESSION['droits_mycodoc']=$donnees['droits_mycodoc'];
       $_SESSION['id']=$donnees['id'];

       $sql="Select * from type_droits where numero=".$donnees['droits_inventaire']."";
       $rep2 = mysql_query($sql);
       $donnees2 = mysql_fetch_array($rep2);
       $_SESSION['dureeCompte']=$donnees2 ['dureeCompte'];
       $_SESSION['droitAdmin']=$donnees2 ['droitAdmin'];
       $_SESSION['droitLocalisation']=$donnees2 ['droitLocalisation'];
       $_SESSION['accesDonnee']=$donnees2 ['accesDonnee'];
       $_SESSION['droitModif']=$donnees2 ['droitModif'];
       $_SESSION['droitSaisie']=$donnees2 ['droitSaisie'];
       $_SESSION['superAdmin']=$donnees2 ['droitSuperAdmin'];
   }
   setcookie("compte","connecter",0,"/",".dbmyco.fr");
} 
if(isset($_SESSION['login']) && isset($_POST['page'])){
    $_SESSION['redirection']="http://".$_POST['page'];
}
// rafraichit la page 
echo "<script>document.location.href='./';</script>"; 
}
// Si non connecté
if(empty($_SESSION['login']))
    {echo '<div class="container">

<style>.control-label { padding-top: 20px;
    margin-bottom: 0;
    text-align: right; }</style>
    <!-- Formulaire de connexion -->
    <form method="post" action="" class="form-horizontal">
    <div class="form-group">
    <label class="control-label col-md-2">Email</label>
    <div class="col-md-4">
    <input type="text" name="email" value="" class="form-control" />
    </div>
    </div>
    <div>  &nbsp; </div>

    <div class="form-group">
    <label class="control-label col-md-2">Mot de passe</label>
    <div class="col-md-4">
    <input type="password" name="mdp" value="" class="form-control" />
    </div>
    </div>
    <div>  &nbsp; </div>
    <div class="col-sm-3 col-md-3" > <a href="motdepasse/">Mot de passe oublié ?</a></div>
    <div>  &nbsp; </div>
    </div>';

    if (isset($_GET['page']) && strpos($_GET['page'], '/se-connecter/') !== false) {
       echo "<input type='hidden' name='page' value=" . $_GET['page'] . ">";
   }
   echo '<div class="form-group">
   <div class="col-sm-3 col-md-3" ><INPUT TYPE="submit" VALUE="Connexion" class="recherche"></div>
   <div class="col-sm-3 col-md-3" ><INPUT TYPE="reset" class="recherche"></div>
   <div class="col-sm-3 col-md-3" ><INPUT TYPE="button" VALUE="Nouveau compte" class="recherche" onclick="self.location.href=\'creationprofil/\'" ></div>
   </div>
   </form>
   </div> ';

}
else
{ //Si Connecté


    if(isset($_SESSION['redirection']) && !empty($_SESSION['redirection'])){
        $page=$_SESSION['redirection'];
        echo "<script>window.location.replace('".$page."');</script>"; 
    }
    ?>

<!-- <h3 style="margin-left:10%">Liste des dernières pages modifiées</h3>
<br/>

 <?php
include("./connexionBdd/bddinventaire.php");
/* $query=mysql_query("SELECT ID, post_title, post_modified FROM wp_posts group by post_title order by post_modified desc limit 0,10");
echo '<table>';
while($data= mysql_fetch_array($query)){
      echo '<tr><td><a href="' .get_permalink($data['ID']).'" target="_blank">'.$data['post_title'].' </a></td><td>modifié le : '. date('d/m/Y',strtotime($data['post_modified'])).'</td></tr>';
}
echo '</table>';
mysql_close();
*/?>
-->
<!--- historique des récoltes --> 
</br>
<h3 style="margin-left:10%">Mes dernières récoltes</h3>
<br>
<?php

include("./connexionBdd/bddinventaire.php");
$query = 'SELECT genre,epithete,created_at AS dated FROM recolte where user_id =  '.$_SESSION['id'].' and valide=1 ORDER BY validated_at desc LIMIT 0,10';

$reponse =mysql_query($query);
echo "<table class='table table-condensed table-striped'>";
echo "<thead><tr><th>Nom</th><th>Date d'ajout</th><th>Fiche technique</th></thead>";
echo "<tbody>";

while($donnees = mysql_fetch_array($reponse))
{
    echo "<tr>";
    echo "<td class='text-center'>".$donnees['genre']." ".$donnees['epithete']."</td>";
    echo "<td class='text-center'>".$donnees['dated']."</td>";
    echo "<td class='text-center'><a href='/les-inventaires/fiches-techniques/?id=".$donnees['id']."'>Voir la fiche</a></td>";
    echo "</tr>";
    /*echo '<fieldset style="margin-bottom : 20px">  
    <legend style="text-align : left"> '.$donnees['genre'].' '.$donnees['epithete'].'</legend>

    <span style="position:relative;float:right" ><a id="v" href="/les-inventaires/fiches-techniques/?id='. $donnees['id'] .'">voir</a></span>
    <span style="margin-left: 15px"><strong>Date d\'ajout : </strong>'. $donnees['dated'].' </span>
    </fieldset>';*/
}
echo "</tbody></table>";



?>
<!-- fin historique des récoltes -->
<br/>
<h3 style="margin-left:10%">Liste des dernières récoltes ajoutées</h3>
<br/>

<?php
include("./connexionBdd/bddinventaire.php");

$query = 'SELECT  genre, epithete, leg, created_at AS dated, id, localite, origin FROM recolte WHERE valide=1 ORDER BY validated_at desc LIMIT 0,10';

$reponse = mysql_query($query);

echo "<table class='table table-condensed table-striped'>";
echo "<thead><tr><th>Nom</th><th>Récolteur</th><th>Asso</th><th>Date d'ajout</th><th>Commune</th><th>Fiche technique</th></thead>";
echo "<tbody>";
while($donnees = mysql_fetch_array($reponse))
{
    echo "<tr>";
    echo "<td class='text-center'>".$donnees['genre']." ".$donnees['epithete']."</td>";
    echo "<td class='text-center'>".$donnees['leg']."</td>";
    echo "<td class='text-center'>".$donnees['origin']."</td>";
    echo "<td class='text-center'>".$donnees['dated']."</td>";
    echo "<td class='text-center'>".$donnees['localite']."</td>";
    echo "<td class='text-center'><a href='/les-inventaires/fiches-techniques/?id=".$donnees['id']."'>Voir la fiche</a></td>";
    echo "</tr>";

    /*echo '<fieldset style="margin-bottom : 20px">  
    <legend style="text-align : left"> '.$donnees['genre'].' '.$donnees['epithete'].'</legend>
    <span style="margin-left: 15px;"><strong>Récolteur : </strong>'.$donnees['leg'].' ('.$donnees['origin'].')</span><span style="position:relative;float:right" ><a id="v" href="/les-inventaires/fiches-techniques/?id='. $donnees['id'] .'">voir</a></span>
    <span style="margin-left: 15px"><strong>Date d\'ajout : </strong>'. $donnees['dated'].' </span><span style="margin-left: 15px"><strong>Commune : </strong>'. $donnees['localite'].' </span>
    </fieldset>';*/
}
echo "</tbody></table>";

mysql_close();

?>
<br/>
<?php
}

?>