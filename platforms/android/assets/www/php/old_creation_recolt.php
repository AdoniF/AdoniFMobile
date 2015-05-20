<?php session_start(); 
?>

<link href="/ajax/jquery.autocomplete.css" rel="stylesheet" type="text/css"></link>
<script type="text/javascript" src="../ajax/listlist.js"></script>
<script type="text/javascript" src="../ajax/listlist2.js"></script>
<script type="text/javascript" src="../ajax/listlist3.js"></script>

<script type="text/javascript" src="/lib_js_autocomplete/jquery.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/jquery.autocomplete.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/script.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/saisie.js"></script>
<!-- Complète les informations du champignon choisi avec les données du référentiel basidio -->

<?php
//Obligation d'être connecté

if(isset($_SESSION['id']) && $_SESSION['droitSaisie']==1){
remove_filter( 'the_content', 'wpautop'); 
include("connexionBdd/bddinventaire.php");

mysql_query("SET NAMES 'utf8'");
require_once(ABSPATH . 'wp-admin/includes/admin.php');

//recherche des infobulles
$sql="Select libelle, commentaire from infobulles";
$result = mysql_query($sql);
while($infos = mysql_fetch_array($result)){
$infobulle[$infos['libelle']]=$infos['commentaire'];
}

// Si bouton supprimer utiliser
if(isset($_GET['bouton']) && $_GET['bouton']=='sup')
{
   echo 'Voulez-vous vraiment supprimer ?';
   ?>
    <INPUT TYPE="button" VALUE="Oui" class="recherche" onclick="self.location.href='../valideedition?id=<?php echo $_GET['id'] ?>&bouton=sup'"><INPUT TYPE="button" VALUE="Non" class="recherche" onclick="self.location.href='../fiches-techniques/?id=<?php echo $_GET['id'] ?>'">

   <?php
}
else
{
  // CONNEXION A LA RECOLTE
  $query = 'SELECT * FROM recolte where id=\'' .  $_REQUEST['id']  . '\' ';
  $reponse = mysql_query($query);
  $donnees = mysql_fetch_array($reponse); ?>
<div class="container" >
   <div class="row" >
     <div> <label class="control-label col-md-2"> Phylum</label> </div>
   </div>
  <?php echo '<div class="texteEdition"><p>Tous les champs marqués d\'un * sont obligatoires.</p></div>';
//formulaire dirigeant vers validecreation
  echo '<form action="../validecreation" name="form1" method="post" enctype="multipart/form-data" onSubmit="return validationFormulaire()">';
?>
  <input type="hidden" name="id" value="<?php echo $_GET['id']; ?>"/>
<input type="hidden" name="creation" value="true" />
  <table>
  <tr>
    <td colspan=3><B style="font-size: 25px;"> Nom </B></td>
  </tr> 
  <tr>
     <td> Phylum</td>
       <td><select name ="phylum" id="phylum" style="width:275px">
     <option selected value=""></option>
     <option value="Ascomycota">Ascomycota</option>
     <option value="Basidiomycota">Basidiomycota</option>
     <option value="Zygomycota">Zygomycota</option>
     <option value="Glomeromycota">Glomeromycota</option>
     <option value="Chytridiomycota">Chytridiomycota</option>
     <option value="Mycetozoa">Mycetozoa</option>
</select></td>
  </tr>
  <tr>
     <td> Genre*</td>
     <!-- fonction suggest qui permet d'afficher les choix possibles -->
       <td><input id="genre" type="text" name="genre" value="" size="32px" onFocus="getGenre(this.value, phylum.value)"/></td>

 <?php //<td> <INPUT TYPE="button" VALUE="Auto" onclick="ComplementInfosRecolte();" class="rechercheAuto"></td> ?>     
<?php if(!empty($infobulle['genre'])){
	 
      echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['genre'].'</span></a></td>';
    }else{    
		echo "<td></td>";
	}
    ?> 
     <td> <INPUT TYPE="button" VALUE="Auto" onclick="EnvoieGE();" class="rechercheAuto"></td>
     
  </tr>
  <tr>
<!-- <td width=20px> </td> -->
    <td> Espèce* </td>
   <td><input type="text" style="width: 276px;" id="epithete" name="epithete" value="" onFocus="getEpithete(this.value, genre.value)" /></td>
<!-- Si infobulle existe  -->
    <?php if(!empty($infobulle['espece'])){
      echo '<td><a class="info" href="#" ><img src="/images/infobulle.png" 
onmouseover = "" /><span>'.$infobulle['espece'].'</span> </a></td>';  

    }
     else {
                echo "<td></td>";
	}
    ?>
  </tr>
  <tr>
   <!-- <td width=20px> --> </td>
     <td> Rang intraspécifique</td>
     <td><select style="width: 276px;" name="rangintraspec" id="rangintraspec"/>
	 <option selected value=""></option>
	 <option value="var.">var.</option>
	 <option value="f.">f.</option>
	 <option value="ssp.">ssp.</option>
	 </select>
	 </td>
     <?php if(!empty($infobulle['rang'])){
      echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['rang'].'</span></a></td>';
    }
    ?>
  </tr>
  <tr>
    
     <td> Épithète intraspécifique </td>
     <td><input type="text" style="width: 276px;" name="taxintraspec" id="taxintraspec" value="" 
onFocus="getTaxon(this.value,phylum.value, genre.value,espece.value,rangintraspec.value)"/></td>
    <?php if(!empty($infobulle['epithete'])){
      echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['epithete'].'</span></a></td>';
    }
    ?>
  </tr>
  <tr>
     </td>
     <td> Modulation </td>
     <td><select style="width: 276px;" name="modulation" id="modulation"/>
	 <option selected value=""></option>
	 <option value="aff.">aff.</option>
	 <option value="(cf.)">(cf.)</option>
	 <option value="ad int.">ad int.</option>
	 <option value="sp.">sp.</option>
	 <option value="ss. lat.">ss. lat.</option>
	 <option value="ss. str.">ss. str.</option>
	 <option value="(gr.)">(gr.)</option>
	 <option value="?">?</option>
	 </select>
	 </td>
    <?php if(!empty($infobulle['modulation'])){
      echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['modulation'].'</span></a></td>';
    }
    ?>
  </tr>
  <tr>
    
     <td> Auteur</td>
     <td><input type="text" style="width: 276px;" name="autorites" id="autorites" value=""  /></td>
      <?php if(!empty($infobulle['auteur'])){
      echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['auteur'].'</span></a></td>';
      }
      ?>
  </tr>
  
<tr>
  <td colspan=3><B style="font-size: 25px;"> Localisation </B></td>
</tr>
  
   <td> Pays*</td>
   <td><input type="text" style="width: 276px;" name="pays" value=<?php echo "France"; ?> /></td>
   <?php if(!empty($infobulle['pays'])){
      echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['pays'].'</span></a></td>';
    }
    ?>
   </tr>
<tr>
  
   <td> Département*</td>
   <td><select name ="departement" style="width:280px">
   <option selected value=""></option>
   <?php
//recherche des départements dans la base de donnée 
        include("connexionBdd/bddinventaire.php");
  $answer = mysql_query("SELECT * FROM departement");
  while ($donnees = mysql_fetch_array($answer) )
  {
  ?>
  <option value="<?php echo $donnees['num']; ?>"><?php echo $donnees['num'].'-'.$donnees['dept']; ?></option>   
  <?php 
  }?> </select></td> 
  <?php if(!empty($infobulle['departement'])){
      echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['departement'].'</span></a></td>';
  }
  ?>
</tr>
<tr>
  
   <td> Commune</td>
   <td><input type="text" style="width: 276px;" name="localite" value="<?php echo $donnees['localite']; ?>" width="41" /></td>
   <?php if(!empty($infobulle['commune'])){
      echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['commune'].'</span></a></td>';
    }
    ?>
</tr>
<tr>
  
  <td> Lieu-dit</td>
  <td><input type="text" style="width: 276px;" name="lieu_dit" value="<?php echo $donnees['lieu_dit']; ?>" width="41"/></td>
<?php if(!empty($infobulle['lieudit'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['lieudit'].'</span></a></td>';
}
?>
</tr>
 
   <td> Domaine</td>
   <td><input type="text" style="width: 276px;" name="domaine" value="<?php echo $donnees['domaine']; ?>" width="41" /></td>
<?php if(!empty($infobulle['domaine'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['domaine'].'</span></a></td>';
}
?>
</tr>
<tr>
  
   <td> Sous-domaine</td>
   <td><input type="text" style="width: 276px;" name="sous domaine" value="<?php echo $donnees['sous_domaine']; ?>" width="41" /></td>
<?php if(!empty($infobulle['sousdomaine'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['sousdomaine'].'</span></a></td>';
}
?>
</tr>
<tr>
  
   <td> Statut de protection</td>
   <td><select id="statut" name ="statut" style="width:280px">
        <option selected value=""></option>
        <?php  
        // recherche des différents statut de protection
        include("connexionBdd/bddreferentiel.php");
        $answerSta = mysql_query("SELECT * FROM statutProtection " );
    while ($statut = mysql_fetch_array($answerSta) )
    { 
         ?>
      <option value="<?php echo $statut['codestatut']; ?>"><?php  echo $statut['statutlibelle']; ?></option>    
  <?php } ?> </select></td>
 <?php if(!empty($infobulle['statut'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['statut'].'</span></a></td>';
}
?>
</tr>
    
<tr>
  
   <td> MEN/MER </td>
   <td><input type="text" style="width: 276px;" name="MEN" value="<?php echo $donnees['MEN'];?>" width="41" /></td>
<?php if(!empty($infobulle['men'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['men'].'</span></a></td>';
}
?>
</tr>
<tr>
  
  <td> GPS Latitude</td>
  <td><input type="text" style="width: 276px;" name="gps_latitude" value="<?php echo $donnees['gps_latitude']; ?>" width="41"/></td>
</tr>
<tr>
  
  <td> GPS Longitude</td>
  <td><input type="text" style="width: 276px;" name="gps_longitude" value="<?php echo $donnees['gps_longitude']; ?>" width="41"/></td>
</tr>
<tr>
  
  <td> Altitude</td>
  <td><input type="text" style="width: 276px;" name="altitude" value="<?php echo $donnees['altitude']; ?>" width="41"/></td>
</tr>
<tr>
  <td colspan=3><B style="font-size: 25px;"> Ecologie </B></td>
</tr>
</table>
<table>
<tr>
 
<td> Referentiel habitat </td>
<td><select id="referentiel" name ="referentiel" onchange="selectHabitat()">
<option>EUNIS<?php $ref=1; ?></option>
<option>CORINE<?php $ref=2; ?></option>
<option>Phytosocio<?php $ref=3; ?></option>
<option selected>Libre<?php $ref=4; ?></option>
</select></td>
<?php if(!empty($infobulle['refhabitat'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['refhabitat'].'</span></a></td>';
}
?>
</tr>

<style>
.SELECTHABITAT>li:hover{background:url('/wp-content/themes/gardenia/images/hover-pf.png') ;}
li {
  white-space:nowrap;
}</style>
<tr><td></td>
<td><span style="display:none;" id="NOMSELECTHABITAT"> Choix d'habitat </span></td>
<td><ul style="overflow:scroll; display:none; cursor:default; width:600px;" id="SELECTHABITAT" name ="SELECTHABITAT" class="SELECTHABITAT" " ">
 </ul>
</td>
</tr>
<tr>

<td>Habitat choisi</td>
<td><input type="text" style="width: 276px;" id="ecologie" name="ecologie"  class="ecologie" value="" /></td>

<?php if(!empty($infobulle['habitat'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['habitat'].'</span></a></td>';
}
?>
</tr>
<tr>

  <td> Substrat</td>
  <td><select name ="substrat" style="width:280px" onChange="AjoutOption(this);">
     <option selected value=""></option>
     <option>Saisir une nouvelle valeur</option>
     <?php
        include("connexionBdd/bddreferentiel.php");
  $answer = mysql_query("SELECT * FROM substrat " );
  while ($substrat = mysql_fetch_array($answer) )
  { $esp=" ";
          $test=$substrat['code'];
          $i=10;
           while($i<100001){
               $valeur=$test%$i;
              if($valeur!=0){ 
                 $esp.="&ensp;";
              }
              $i=$i*10;
           }
        ?>
  <option value="<?php echo $substrat['libelle']; ?>"><?php  echo $esp.$substrat['libelle']; ?></option>
  <?php 
  }include("connexionBdd/bddinventaire.php");?> </select></td> 
<?php if(!empty($infobulle['substrat'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['substrat'].'</span></a></td>';
}
?>
</tr>
<tr>
  
  <td> Hote</td>
    <td><select name ="hote" style="width:280px" onChange="AjoutOption(this);">
          <option selected value=""></option>
    <option>Saisir une nouvelle valeur</option>
    <?php
      $answer = mysql_query("SELECT distinct hote FROM recolte where hote != ' ' order by hote asc" );
      while ($donnees = mysql_fetch_array($answer) )
      {
      ?>
        <option><?php echo $donnees['hote']; ?></option>    
    <?php 
      }
    ?> </select></td> 
<?php if(!empty($infobulle['hote'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['hote'].'</span></a></td>';
}
?>
</tr>
<tr>
  
  <td> État Hote</td>
    <td><select name ="etathote" style="width:280px">
			<option selected value=""></option>
			<option value="mort">Mort</option>
			<option value="moribond">Moridbond</option>
			<option value="vivant">Vivant</option>
     </select></td> 
<?php if(!empty($infobulle['etathote'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['etathote'].'</span></a></td>';
}
?>
</tr>
</table>
<table>
<tr>
  <td colspan=3><B style="font-size: 25px;"> Propriétaires </B></td>
</tr>
<tr>
  <td>
  Nombre de Légataires</td>
  <td><select id="nbLeg" name="nbLeg" onChange="AjoutLeg();">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
  </select>
  </td>
</tr>
</table> 

<table id="legataire" style="margin-top:-25px">  > 
<tr>
  </td>

  <td style="width: 360px;"> Leg.*</td>
   <td><input type="text" style="width: 276px;" name="leg1" id="leg1" value="" onFocus="getLeg1(this.value)" /></td>

   <?php  if(!empty($infobulle['leg'])){
   echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['leg'].'</span></a></td>';
   }
  ?>
</tr>
<tr>
  
  <td width="0px">Nbre de déterminateurs</td>
  <td><select id="nbDet" name="nbDet" onChange="AjoutDet();">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
  </select>
  </td>
</tr>
</table><table id="determinateur">
<tr>
  
  <td style="width: 360px;"> Det.*</td>
  <td><input type="text" style="width: 276px;" name="det1" id="det1" value="" onFocus="getDet1(this.value)" /></td>
  <?php if(!empty($infobulle['det'])){
    echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['det'].'</span></a></td>';
   }
  ?>
</tr>


<tr>
  <td colspan=3><B style="font-size: 0px;"> Herbier </B></td>
</tr>
<tr>
   
  <td>Nombre d'herbiers:</td>
  <td width= 130px> </td>
<?php  $nom=$_SESSION['prenom'] . ' ' . $_SESSION['nom']; ?>
  <td><select id="nbProprietaire" name="nbProprietaire" style="width: 50px;" onChange="AjoutProprietaire();">
        <option selected value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
  </select>
  </td>
</tr>
</table>
<table id="proprietaire">
<tr>
  
  <td> Code herbier</td>
  <td><input type="text" style="width: 276px;" name="codeherbier1" value="<?php echo $donnees['codeherbier']; ?>" /></td>
<?php if(!empty($infobulle['codeherbier'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['codeherbier'].'</span></a></td>';
}
?>
</tr>
<tr>
  
  <td> Numéro d'herbier</td>
  <td><input type="text" style="width: 276px;" name="herbier1" value="<?php echo $donnees['herbier']; ?>" /></td>
<?php if(!empty($infobulle['numherbier'])){
echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['numherbier'].'</span></a></td>';
}
?>
</tr>
</table>
<table>
<tr>
  <td colspan=3><B style="font-size: 25px;"> Suppléments </B></td>
</tr>

 
  <td style="width: 170px;"> Association/Organisme* </td>
  <td> <select name="origin" onChange="AjoutOptionAsso2(this);"> 
<option value=""> </option>
    <?php  
       include("connexionBdd/bddinventaire.php");
       $queryS = 'SELECT * FROM asso';
       $reponseS = mysql_query($queryS);
     while($donnees = mysql_fetch_array($reponseS))
     {
         echo '<OPTION VALUE="'. $donnees['nom'] .'">' . $donnees['nom'] .'</OPTION>';
     }
    ?>
        <option>Saisir une nouvelle valeur</option>
     </select></td>
  <?php if(!empty($infobulle['origine'])){
  echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['origine'].'</span></a></td>';
  }
  ?>

<tr id="zoneAsso">

 </tr>
<tr>
  
  <td> Collaboration </td>
  <td><input type="text" style="width: 276px;" onkeyup="remCollaboration(this.value)" name="collaboration"/></td>
  <?php if(!empty($infobulle['collaboration'])){
  echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['collaboration'].'</span></a></td>';
  }
  ?>
</tr>
<tr id="trRemarque">

  <td> Remarque collaboration </td>
  <td><input type="text" style="width: 276px;"  "name="remarqueCollaboration"/></td>
</tr>
<tr>
  
  <td> Type de récolte </td>
  <td> <select name="type_recolte" onChange="AjoutOption(this);"> 
        <option selected value=""></option>
        <OPTION VALUE="sortie privée">sortie privée</OPTION>
    <OPTION VALUE="association">association</OPTION>
    <OPTION VALUE="financement">financement</OPTION>
        <option>Saisir une nouvelle valeur</option>
     </select></td>
   <?php if(!empty($infobulle['typerecolte'])){
  echo '<td><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['typerecolte'].'</span></a></td>';
  }
  ?>
</tr>
<tr>

    <td> Date récolte*</td><td>
<?php  
    $jour=date("d");
    $mois=date("n");
    $annees=date("Y");

          $listeMois = array("","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"); 
         
 ?>
     <select name="jour">       
                <OPTION VALUE="<?php echo $jour ?>"selected="selected"><?php echo $jour; ?></OPTION>
    <OPTION VALUE="01">01</OPTION>
    <OPTION VALUE="02">02</OPTION>
    <OPTION VALUE="03">03</OPTION>
    <OPTION VALUE="04">04</OPTION>
    <OPTION VALUE="05">05</OPTION>
    <OPTION VALUE="06">06</OPTION>
    <OPTION VALUE="07">07</OPTION>
    <OPTION VALUE="08">08</OPTION>
    <OPTION VALUE="09">09</OPTION>
    <OPTION VALUE="10">10</OPTION>
    <OPTION VALUE="11">11</OPTION>
    <OPTION VALUE="12">12</OPTION>
    <OPTION VALUE="13">13</OPTION>
    <OPTION VALUE="14">14</OPTION>
    <OPTION VALUE="15">15</OPTION>
    <OPTION VALUE="16">16</OPTION>
    <OPTION VALUE="17">17</OPTION>
    <OPTION VALUE="18">18</OPTION>
    <OPTION VALUE="19">19</OPTION>
    <OPTION VALUE="20">20</OPTION>
    <OPTION VALUE="21">21</OPTION>
    <OPTION VALUE="22">22</OPTION>
    <OPTION VALUE="23">23</OPTION>
    <OPTION VALUE="24">24</OPTION>
    <OPTION VALUE="25">25</OPTION>
    <OPTION VALUE="26">26</OPTION>
    <OPTION VALUE="27">27</OPTION>
    <OPTION VALUE="28">28</OPTION>
    <OPTION VALUE="29">29</OPTION>
    <OPTION VALUE="30">30</OPTION>
                <OPTION VALUE="31">31</OPTION>
     </select><select name="mois">
               <OPTION VALUE="<?php echo $mois ?>"><?php echo $listeMois[$mois]; ?></OPTION>
                <OPTION VALUE="01">Janvier</OPTION>
                <OPTION VALUE="02">Février</OPTION>
                <OPTION VALUE="03">Mars</OPTION>
                <OPTION VALUE="04">Avril</OPTION>
                <OPTION VALUE="05">Mai</OPTION>
                <OPTION VALUE="06">Juin</OPTION>
                <OPTION VALUE="07">Juillet</OPTION>
                <OPTION VALUE="08">Août</OPTION>
                <OPTION VALUE="09">Septembre</OPTION>
                <OPTION VALUE="10">Octobre</OPTION>
                <OPTION VALUE="11">Novembre</OPTION>
                <OPTION VALUE="12">Décembre</OPTION>
    </select>
  <input type="text" style="width: 40px;" name="annees" VALUE="<?php echo $annees ?>">
  </td>
</tr>
<tr>
  
  <td> Remarque</td>
  <td><textarea name="remarque"><?php echo $donnees['remarque']; ?></textarea></td>
</tr>
<tr>
  
  <td> Biblio</td>
  <td><textarea name="biblio"><?php echo $donnees['biblio']; ?></textarea></td>
</tr>
</table>
<br><br>
<table>
<tr>

 
  <td width=20px> Photo 1</td>
     <div class="decal">
  <td><input type="hidden" name="valid" />
      <input type="hidden" name="MAX_FILE_SIZE" value="209715002" />
      <input id="file" class="file" type="file" name="photo1" onchange="getvalue()" />
 
      <img id="fichier" onclick="getfile()" src="/wp-content/image_user/icon.png" width="40" height="40" />
      <input id="recu" type="text" name="imag1" value="" size="17" />
      <input type="text" name="imageAut1" size="14" value="Nom auteur" onclick="Effna(this);" style="color: grey;" /> </td>
 </div>  
</tr>
<tr>
  
  <td width=20px> Photo 2</td>
  <td><input type="hidden" name="valid" />
      <input type="hidden" name="MAX_FILE_SIZE" value="209715002" />
      <input id="file2" class="file" type="file" name="photo2" onchange="getvalue2()" />
      <div class="decal">
      <img id="fichier" onclick="getfile2()" src="/wp-content/image_user/icon.png" alt="" width="40" height="40" />
      <input id="recu2" type="text" name="imag2" value="" size="17" />
<input type="text" name="imageAut2" size="14" value="Nom auteur" onclick="Effna(this);" style="color: grey;" />
      </div>  
  </td>
</tr>
<tr>
  
  <td width=20px> Photo 3</td>
  <td><input type="hidden" name="valid" />
      <input type="hidden" name="MAX_FILE_SIZE" value="209715002" />
      <input id="file3" class="file" type="file" name="photo3" onchange="getvalue3()" />
      <div class="decal">
      <img id="fichier" onclick="getfile3()" src="/wp-content/image_user/icon.png" alt="" width="40" height="40" />
      <input id="recu3" type="text" name="imag3" value="" size="17" />
<input type="text" name="imageAut2" size="14" value="Nom auteur" onclick="Effna(this);" style="color: grey;" />
      </div>  
  </td>
</tr>
<tr>
  
  <td width=20px> Photo 4</td>
  <td><input type="hidden" name="valid" />
      <input type="hidden" name="MAX_FILE_SIZE" value="209715002" />
      <input id="file4" class="file" type="file" name="photo4" onchange="getvalue4()" />
      <div class="decal">
      <img id="fichier" onclick="getfile4()" src="/wp-content/image_user/icon.png" alt="" width="40" height="40" />
      <input id="recu4" type="text" name="imag4" value="" size="17" />
<input type="text" name="imageAut2" size="14" value="Nom auteur" onclick="Effna(this);" style="color: grey;" />
      </div>  
  </td>
</tr>


</table>
<div class=espace>
<INPUT TYPE="submit" VALUE="Valider" class="recherche"><INPUT TYPE="reset" class="recherche"><INPUT TYPE="button" VALUE="Retour" class="recherche" onclick="self.location.href='/les-inventaires/recherche/'">
</div>

</form>
<?php }}else{ echo 'Vous ne disposez pas des droits pour saisir une nouvelle recolte !';} ?>

<script>document.getElementById('trRemarque').style.display="none";</script>