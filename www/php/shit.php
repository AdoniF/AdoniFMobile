<link type="text/css" rel="stylesheet" href="/lib_js_autocomplete/jquery.autocomplete.css" />
<script type="text/javascript" src="/lib_js_autocomplete/jquery.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/jquery.autocomplete.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/script.js"></script>
<script type="text/javascript" src="/fonction/listlist.js"></script>
<script type="text/javascript" src="/fonction/listlist2.js"></script>
<script type="text/javascript" src="/fonction/listlist3.js"></script>

<div class="row" >
<h3><span class="label label-success col-md-offset-1">Modification de récolte</span></h3>
</div>
<?php
remove_filter( 'the_content', 'wpautop'); 

if(isset($_REQUEST['id'])){

if(isset($_SESSION['id'])){
include("connexionBdd/bddinventaire.php");
mysql_query("SET NAMES 'utf8'");
require_once(ABSPATH . 'wp-admin/includes/admin.php');


//recherche des infobulles
$sql="Select libelle, commentaire from infobulles";
$result = mysql_query($sql);
while($infos = mysql_fetch_array($result)){
$infobulle[$infos['libelle']]=$infos['commentaire'];
}

$query = 'SELECT * FROM recolte where id=\'' .  $_REQUEST['id']  . '\' ';
$reponse = mysql_query($query);

$donnees = mysql_fetch_array($reponse);
echo '<div class="row"><label> Vous pouvez sur cette page modifier une fiche en corrigeant le(s) champ(s) désiré(s) dans ce formulaire</label></div>';
echo '<form action="../valideedition" class="form1 form-horizontal" name="form1" method="post" enctype="multipart/form-data">'; ?>
<input type="hidden" name"genre" value="<?php echo $donnees['genre']; ?>"/>
<input type="hidden" name"epithete" value="<?php echo $donnees['epithete']; ?>"/>
<input type="hidden" name"rangintraspec" value="<?php echo $donnees['rangintraspec']; ?>"/>
<input type="hidden" name"taxintraspec" value="<?php echo $donnees['taxintraspec']; ?>"/>

<input type="hidden" name="id" value="<?php echo $_GET['id']; ?> "/>	
<table>
<div class="row" >
<h5><span class="label label-success col-md-offset-3 col-md-3">Taxonomie</span></h5>
</div>
</br>
<div class="row">
<label class="control-label col-md-2">Genre*</label>
<input class="col-md-4" id="genre" type="text" name="genre" id="genre" value="<?php echo $donnees['genre']; ?>" onFocus="getGenre(this.value)" /> 

<!-- fonction suggest qui permet d'afficher les choix possible -->     
<?php if(!empty($infobulle['genre'])){

echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['genre'].'</span></a></div>';
}
?>
<div class="col-md-1"> <INPUT TYPE="button" VALUE="Auto" onclick="ComplementInfos();" class="rechercheAuto"></div>

</div>
<div class="row">
<label class="control-label col-md-2">Espèce*</label>    
<input class="col-md-4" type="text"  id="epithete" name="epithete" value="<?php echo $donnees['epithete']; ?>" onFocus="getepithete(this.value, genre.value)" />
<!-- Si infobulle existe  -->
<?php if(!empty($infobulle['epithete'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['epithete'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Rang intraspécifique</label>
<select name ="rangintraspec" id="rangintraspec" class="col-md-4">
<option selected value="<?php echo $donnees['rangintraspec']; ?>"><?php echo $donnees['rangintraspec']; ?></option>
<option value=""></option>
<option value="var.">var.</option>
<option value="f.">f.</option>
<option value="ssp.">ssp.</option>   
</select>
<?php if(!empty($infobulle['rang'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['rang'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Épithète intraspécifique</label>
<input class="col-md-4" type="text"  name="taxintraspec" id="taxintraspec" value="<?php echo $donnees['taxintraspec']; ?>" />
<?php if(!empty($infobulle['epithete'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['epithete'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Modulation</label>
<select class="col-md-4" name="modulation" id="modulation"/>
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
<?php if(!empty($infobulle['modulation'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['modulation'].'</a></div>';
}
?>
</div>
<tr>
<div class="row">
<label class="control-label col-md-2">Autorités</label>
<input type="text" class="col-md-4" name="autorites" id="autorites" value="<?php echo $donnees['autorites']; ?>"  />
<?php if(!empty($infobulle['auteur'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['auteur'].'</span></a></div>';
}
?>
</div>
<div class="row" >
<h5><span class="label label-success col-md-offset-3 col-md-3">Position</span></h5>
</div>
</br>
<div class="row">
<label class="control-label col-md-2">Règne</label>	

<select id="regne" name="regne" class="col-md-4">
<option selected  ="<?php echo $donnees['regne']; ?>"><?php echo $donnees['regne']; ?></option>
<option>Fungi</option> 
<option>Mycetozoa</option> 
<option>Chromista </option> 
</select>
<?php if(!empty($infobulle['regne'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['regne'].'</span></a></div>';
}?>
</div>
<div class="row">
<label class="control-label col-md-2">Phylum</label>
<input type="text" class="col-md-4" id="phylum" name="phylum" value="<?php echo $donnees['phylum']; ?>" />
<?php if(!empty($infobulle['phylum'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['phylum'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Classe</label>
<input type="text"  class="col-md-4" id="classe" name="classe" value="<?php echo $donnees['classe']; ?>" />
<?php if(!empty($infobulle['classe'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['classe'].'</span></a></div>';
}
?>
</div>

<div class="row">
<label class="control-label col-md-2">Ordre</label>
<input type="text"  class="col-md-4" id="ordre" name="ordre" value="<?php echo $donnees['ordre']; ?>" />
<?php if(!empty($infobulle['ordre'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['ordre'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Famille</label>
<input type="text" class="col-md-4" id="famille" name="famille" value="<?php echo $donnees['famille']; ?>" />
<?php if(!empty($infobulle['famille'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['famille'].'</span></a></div>';
}
?>
</div>

<div class="row" >
<h5><span class="label label-success col-md-offset-3 col-md-3">Localisation</span></h5>
</div>
</br>
<div class="row">
<label class="control-label col-md-2">Pays*</label>
<input type="text" class="col-md-4" name="pays" value=<?php echo "France"; ?> />
<?php if(!empty($infobulle['typerecolte'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['typerecolte'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Département*</label>
<select name ="departement" class="col-md-4">
<?php
$answerdpt = mysql_query('SELECT * FROM departement where num=\''.$donnees['departement'].'\' ');
$depart=mysql_fetch_array($answerdpt);
?>
<option selected value="<?php echo $depart['num']; ?>"><?php echo $depart['num'].'-'.$depart['dept']; ?></option>
<?php
$answer = mysql_query("SELECT * FROM departement");
while ($donnees1 = mysql_fetch_array($answer) )
{
?>
<option value="<?php echo $donnees1['num']; ?>"><?php echo $donnees1['num'].'-'.$donnees1['dept']; ?></option>		
<?php 
}?> </select>
<?php if(!empty($infobulle['typerecolte'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['typerecolte'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Commune</label>
<input type="text" class="col-md-4" name="localite" value="<?php echo $donnees['localite']; ?>" /></td>
<?php if(!empty($infobulle['typerecolte'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['typerecolte'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Lieu-dit</label>
<input type="text" class="col-md-4" name="lieu_dit" value="<?php echo $donnees['lieu_dit']; ?>" />
<?php if(!empty($infobulle['lieudit'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['lieudit'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Domaine</label>
<input type="text" class="col-md-4" name="domaine" value="<?php echo $donnees['domaine']; ?>" />
<?php if(!empty($infobulle['domaine'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['domaine'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Sous-domaine</label>
<input type="text" class="col-md-4" name="sous domaine" value="<?php echo $donnees['sous_domaine']; ?>" />
<?php if(!empty($infobulle['sousdomaine'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['sousdomaine'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Statut de protection</label>
<select id="statut" name ="statut" class="col-md-4">
<?php include("connexionBdd/bddreferentiel.php");  
$answersta = mysql_query('SELECT * FROM statutProtection where codestatut=\''.$donnees['statut'].'\' ');
$statut=mysql_fetch_array($answersta);
?>
<option selected value="<?php echo $statut['codestatut']; ?>"><?php echo $statut['statutlibelle']; ?></option>
<?php  
$answer = mysql_query("SELECT * FROM statutProtection " );
while ($statut = mysql_fetch_array($answer) )
{ 
?>
<option value="<?php echo $statut['codestatut']; ?>"><?php  echo $statut['statutlibelle']; ?></option>    
<?php } ?> </select></td>
<?php if(!empty($infobulle['statut'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['statut'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">MEN/MER</label>
<input type="text" class="col-md-4" name="MEN" value="<?php echo $donnees['MEN']; ?>" />
<?php if(!empty($infobulle['men'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['men'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">GPS Latitude</label>
<input type="text" class="col-md-4" name="gps_latitude" value="<?php echo $donnees['gps_latitude']; ?>" />
<?php if(!empty($infobulle['gps_latitude'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['gps_latitude'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">GPS Longitude</label>
<input type="text" class="col-md-4" name="gps_longitude" value="<?php echo $donnees['gps_longitude']; ?>" />
<?php if(!empty($infobulle['gps_longitude'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['gps_longitude'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Altitude</label>
<input type="text" class="col-md-4" name="altitude" value="<?php echo $donnees['altitude']; ?>" />
<?php if(!empty($infobulle['altitude'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['altitude'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Rayon de récolte</label>
<input type="text" class="col-md-4" name="rayon" value="<?php echo $donnees['rayon']; ?>" />
<?php if(!empty($infobulle['rayon'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['rayon'].'</span></a></div>';
}
?>
</div>
</table><table>
<div class="row" >
<h5><span class="label label-success col-md-offset-3 col-md-3">Ecologie</span></h5>
</div>
</br>
<div class="row">
<label class="control-label col-md-2">Réferentiel habitat</label>
<select id="referentiel" name ="referentiel" onchange="selectHabitat()"  class="col-md-4">
<option>EUNIS<?php $ref=1; ?></option>
<option>CORINE<?php $ref=2; ?></option>
<option>Phytosocio<?php $ref=3; ?></option>
<option selected>Libre<?php $ref=4; ?></option>
</select>
<?php if(!empty($infobulle['refhabitat'])){ 
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['refhabitat'].'</span></a></div>';
}
?>
</div>

<style>
.SELECTHABITAT>li:hover{background:url('/wp-content/themes/tous/images/select_hover.png') ;}
li {
white-space:nowrap;
}
</style>
<div><span style="display:none;" id="NOMSELECTHABITAT"> Choix d'habitat </span></div>
<td><ul style="overflow:scroll; display:none; cursor:default; width:600px;" id="SELECTHABITAT" name ="SELECTHABITAT" class="SELECTHABITAT" " ">
</ul>
</td>
</tr>
<div class="row">
<label class="control-label col-md-2">Habitat choisi</label>
<input type="text" class="col-md-4" id="ecologie" name="ecologie"  class="ecologie" value="" />
<?php if(!empty($infobulle['habitat'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['habitat'].'</span></a></div>';
}
?>
</div>
</table>
<table>
<div class="row">
<label class="control-label col-md-2">Substrat</label>
<select name ="substrat" class="col-md-4" onChange="SelectionSubstrat()">
<?php include("connexionBdd/bddinventaire.php");
$answer2 = mysql_query('select codeSubstrat from recolte where id='.$_GET['id'].'');
$data2=mysql_fetch_array($answer2);?>
<option>
<?
if($data2){
include("connexionBdd/bddreferentiel.php");
$substrat="Select libelle from substrat where code='".$data2['codeSubstrat']."'";
$result=mysql_query($substrat);
$libelle=mysql_fetch_array($result);
echo $libelle[0];}?>
</option>       
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
}?> </select> 
<?php if(!empty($infobulle['substrat'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['substrat'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Hote</label>
<select name ="hote" class="col-md-4" onChange="AjoutOption(this);">
<?php     
include("connexionBdd/bddinventaire.php");
$answer2 = mysql_query('select hote from recolte where id='.$_GET['id'].'');
$data2=mysql_fetch_array($answer2);
?>
<option><?php echo $data2['hote'];?></option>
<option>Saisir une nouvelle valeur</option>
<?php
$answer = mysql_query("SELECT distinct hote FROM recolte where hote != ' ' order by hote asc" );
while ($data2 = mysql_fetch_array($answer) )
{
?>
<option><?php echo $data2['hote']; ?></option>		
<?php 
}
?> </select> 
<?php if(!empty($infobulle['hote'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['hote'].'</span></a></div>';
}
?>
</div>
<div class="row" >
<h5><span class="label label-success col-md-offset-3 col-md-3">Propriétaires</span></h5>
</div>
</br>
<?php
$countleg=mysql_query("Select count(idleg) as nb from recleg where idrecolte=".$_REQUEST['id']."");
$count=mysql_fetch_array($countleg);
?>

<div class="row">
<label class="control-label col-md-2">Nb. légataires</label>
<select id="nbLeg" name="nbLeg" class="col-md-1" onChange="AjoutLeg();">
<option selected value="<?php echo $count['nb']; ?>"><?php echo $count['nb']; ?></option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
</select>
<?php if(!empty($infobulle['nbLeg'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['nbLeg'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Leg.*</label>
<input type="text" class="col-md-4" name="leg1" id="leg1" value="" onFocus="getLeg1(this.value);" />
<?php  if(!empty($infobulle['leg'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['leg'].'</span></a></div>';
}
?>
</div>

<div class="row">
<label class="control-label col-md-2">Nb. déterminateurs</label>
<select id="nbDet" name="nbDet" class="col-md-1 onChange="AjoutDet();">
<option selected value="<?php echo $count['nb']; ?>"><?php echo $count['nb']; ?></option>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
</select>
<?php if(!empty($infobulle['nbDeg'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['nbDeg'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Det.*</label>
<input type="text" class="col-md-4" name="det1" id="det1" value="" onFocus="getDet1(this.value);" />
<?php if(!empty($infobulle['det'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['det'].'</span></a></div>';
}
?>
</div>
<div class="row" >
<h5><span class="label label-success col-md-offset-3 col-md-3">Herbier</span></h5>
</div>
</br>
<div class="row">
<label class="control-label col-md-2">Nb. codes Herbier</label>
<?php  $nom=$_SESSION['prenom'] . ' ' . $_SESSION['nom']; ?>
<select id="nbProprietaire" name="nbProprietaire" class="col-md-1 onChange="AjoutProprietaire();">
<option selected value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
<option value="6">6</option>
</select>
<?php if(!empty($infobulle['Nb_codes_herbier'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['Nb_codes_herbier'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Code herbier</label>
<input type="text" class="col-md-4" name="codeherbier" value="<?php echo $donnees['codeherbier']; ?>" />
<?php if(!empty($infobulle['code_herbier'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['code_herbier'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Numéro d'herbier</label>
<input type="text" class="col-md-4" name="herbier" value="<?php echo $donnees['herbier']; ?>" />
<?php if(!empty($infobulle['numherbier'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['numherbier'].'</span></a></div>';
}
?>
</div>
<div class="row" >
<h5><span class="label label-success col-md-offset-3 col-md-3">Informations complémentaires</span></h5>
</div>
</br>
<div class="row">
<label class="control-label col-md-2">Association/Organisme*</label>
<select class="col-md-4" name="origin" onChange="AjoutOptionAsso2(this);"> 
<option VALUE="<?php echo $donnees['origin']; ?>"><?php echo $donnees['origin']; ?></option>
<?php  
$queryS = 'SELECT * FROM asso WHERE nom <> \'' . $donnees['origin'] .'\'';
$reponseS = mysql_query($queryS);
while($donnees2 = mysql_fetch_array($reponseS))
{
echo '<OPTION VALUE="'. $donnees2['nom'] .'">' . $donnees2['nom'] .'</OPTION>';
}
?>
<option>Saisir une nouvelle valeur</option>
</select>
<?php if(!empty($infobulle['origine'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['origine'].'</span></a></div>';
}
?>
</div>

<div class="row">
<label class="control-label col-md-2">Collaboration </label>
<input class="col-md-4" name="collaboration" value="<?php echo $donnees['collaboration']; ?>"/>
<?php if(!empty($infobulle['collaboration'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['collaboration'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Type de récolte</label>
<select class="col-md-4 name="type_recolte" onChange="AjoutOption(this);"> 
<option selected value="<?php echo $donnees['type_recolte']; ?>"><?php echo $donnees['type_recolte']; ?></option>
<OPTION VALUE="sortie privée">sortie privée</OPTION>
<OPTION VALUE="association">association</OPTION>
<OPTION VALUE="financement">financement</OPTION>
<option>Saisir une nouvelle valeur</option>
</select>
<?php if(!empty($infobulle['typerecolte'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['typerecolte'].'</span></a></div>';
}
?>
</div>

<div class="row">
<label class="control-label col-md-2">Date récolte*</label>
<?php 
include('connexionBdd/bddinventaire.php');
$answer = mysql_query('select date_recolte from recolte where id='.$_GET['id'].'');
$data=mysql_fetch_array($answer);
$jour=date("d",strtotime($data['date_recolte']));
$mois=date("n",strtotime($data['date_recolte']));
$annees=date("Y",strtotime($data['date_recolte']));
$listeMois = array("","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre");
?>
<select class="col-md-1" name="jour"><OPTION VALUE="<?php echo $jour ?>"selected="selected"><?php echo $jour; ?></OPTION>
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
</select>
<select class="col-md-2" name="mois">
<OPTION VALUE="<?php echo $mois ?>"selected="selected"><?php echo $listeMois[$mois]; ?></OPTION>
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
<input class="col-md-1" type="text" name="annees" VALUE="<?php echo $annees ?>">
</div>

<div class="row">
<label class="control-label col-md-2">Remarques</label>
<textarea class="col-md-4" name="remarque"><?php echo $donnees['remarque']; ?></textarea>
<?php if(!empty($infobulle['remarques'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['remarques'].'</span></a></div>';
}
?>
</div>
<div class="row" >
<h5><span class="label label-success col-md-offset-3 col-md-3">Photos</span></h5>
</div>
</br>
<div class="row">
<label class="control-label col-md-2">Nb. photos</label>
<input type="text" class="col-md-1" name="nb_photos" value="<?php echo $donnees['nb_photos']; ?>" />
<?php if(!empty($infobulle['nb_photos'])){
echo '<div class="col-md-1"><a class="info" href="#"><img src="/images/infobulle.png"/><span>'.$infobulle['nb_photos'].'</span></a></div>';
}
?>
</div>
<div class="row">
<label class="control-label col-md-2">Photos</label>
<input type="hidden" name="valid" />
<input type="hidden" name="MAX_FILE_SIZE" value="209715002" />
<input id="file" class="col-md-4" class="file" type="file" name="photo1" onchange="getvalue()" />
<input type="hidden" id="recu" type="text" name="imag1" value="" size="17" />
</div>
<div class="row">
<input class="col-md-4 col-md-offset-2" type="text" name="imageAut1" value="Nom auteur" onclick="Effna(this);" />
</div>
</br>
<div class="row">
<INPUT class="col-md-2 col-md-offset-1" TYPE="button" VALUE="Valider" class="recherche" onclick="this.form.submit()">
<INPUT class="col-md-2 col-md-offset-1" TYPE="reset" class="recherche"> 
<INPUT class="col-md-2 col-md-offset-1" TYPE="button" VALUE="Retour" class="recherche" onclick="window.history.back()">
</div> 

</form>
<?php } else { echo 'veuillez vous identifier pour modifier une récolte !'; } 

}else{

echo "Aucune récolte choisi pour la modification !";
}

?>