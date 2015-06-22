<script src="/lib_js_autocomplete/script.js" type="text/javascript"></script>
<script type="text/javascript" src="/lib_js_autocomplete/jquery.js"></script>
<script src="/javascript/fiche_technique.js" type="text/javascript"></script>

<link rel="stylesheet" type = "text/css" href ="/wp-content/themes/gardenia/css/bootstrap.css" media ="print"/>
<style>
#tr0:hover{
	color:#996600;
	cursor:pointer;
}

</style>
<style type ="text/css" media="print">
.label-success {
	background-color: #5CB85C;
}
.label {
	display: inline;
	padding: 0.2em 0.6em 0.3em;
	font-size: 100%;
	font-weight: bold;
	line-height: 1;
	color: #FFF;
	text-align: center;
	white-space: nowrap;
	vertical-align: baseline;
	border-radius: 0.25em;
}
body.custom-background {
	background-color: #5FAF63;
}
</style>
<?php
include 'connexionBdd/bddinventaire.php';

if (isset($_REQUEST['id'])){
	$query = 'SELECT `id`, `user_id`, `localite`, `departement`, `lieu_dit`, `domaine`, `sous_domaine`, `MEN`, `MER`,  `gps_latitude`, `gps_longitude`, `altitude`, `pays`, `genre`, `epithete`, `rangintraspec`, `taxintraspec`, `autorites`, `ecologie`, `hote`, `codeherbier`, `herbier`, `leg`, `det`, `valide`, `origin`, `remarque`,`source`, `valide`, `date_recolte`, `created_at`, `collaboration`, `statut_protection`, `refhabitat`,`modified_by` FROM recolte where id=\'' .  $_GET['id']  . '\' ';
	$reponse = mysql_query($query);
	$donnees = mysql_fetch_array($reponse);

$base=strstr($_REQUEST['PHYLUM'],"mycota",true);  // on decoupe le phylum pour connaitre la base ex :si PHYLUM = Basidiomycota la base =Basidio

if(!$base){// si ce n'est ni basidio ni asco (si il n'y pas mycota dans le nom) recherche multibase

include 'connexionBdd/bddreferentiel.php';


$arraybase=array('asco','basidio',"chytridio","glomero","mycetozoa");

$l=0;
$reqPhylum="Select * From ( ";
	foreach($arraybase as $base){
		if($l==0){
			$reqPhylum .= "SELECT phylum FROM ".$base." WHERE genre='".$donnees['genre']."' and epithete='".$donnees['epithete']."'";
		}
		else{
			$reqPhylum.=" union SELECT phylum FROM ".$base." WHERE genre='".$donnees['genre']."' and epithete='".$donnees['epithete']."'";
		}
		$l++;
	}
	$reqPhylum .= " ) as requete";


$donneesPhy=mysql_fetch_array(mysql_query($reqPhylum));
if(strtolower($donneesPhy['phylum'])=="mycetozoa"){
	$base="mycetozoa";
}else{
	$base=strstr($donneesPhy['phylum'],"mycota",true);
$base=strtolower($base);//on mets tous en minuscule
}
if(!$base){
	$base="champignon";


}
}
else{
$base=strtolower($base);//on mets tous en minuscule
}


remove_filter( 'the_content', 'wpautop'); 

include("connexionBdd/bddinventaire.php");
?>
<div class="container" >
	<div class="row" >
		<h3><span class="label label-success col-xs-6 offset-1 col-xs-7 "> <?php 
		echo '<td class="titre" ><B>'.$donnees['genre'].' '.$donnees['epithete'].' '.$donnees['rangintraspec'].' '.$donnees['taxintraspec'].'</B><br>'.$donnees['autorites'];
		echo '</td>'; ?> </span></h3>
	</div>

	<!-- image -->
	<div class="col-xs-offset-9 col-xs-1" >

		<?php

		if($donnees['origin']==''){
			$donnees['origin']='SMF';
		}

		$queryIm = 'SELECT chemin, nom, url FROM asso WHERE nom=\'' . $donnees['origin'] . '\'';
		$reponseIm = mysql_query($queryIm);
		$donneesIm = mysql_fetch_array($reponseIm);

		if(isset($donneesIm['url']) && !empty($donneesIm['url'])){
			echo "<a href='".$donneesIm['url']."' target='_blank' >";
			$lien=1;
			echo "<img src='/" .$donneesIm['chemin']."' title='".$donneesIm['nom']."'  />";
		}


		if(isset($lien) && $lien==1){
			echo "</a>";
		}
		?>


		<?php

// Recherche des infos complémentaires dans les référentiels basidio & synonymes
		include("connexionBdd/bddreferentiel.php");

// REFERENTIEL
		$reqReferentiel = "SELECT * FROM ".$base." WHERE GENRE='".$donnees['genre']."' AND EPITHETE='".$donnees['epithete']."' AND RANGINTRASPECIFIQUE='".$donnees['rangintraspec']."' AND TAXINTRASPECIFIQUE='".$donnees['taxintraspec']."' ;";


		$repReferentiel = mysql_query($reqReferentiel);
		$donneesReferentiel = mysql_fetch_array($repReferentiel);


/*	
// S'il n'y a pas de correspondance dans le referentiel basidio, on l'ajoute dans le referentiel des champignons manquants
if (mysql_num_rows($repReferentiel) == 0) {

// Check s'il n'a pas deja été ajouté
$reqCheck = "SELECT LB_NOM FROM basidio_manquants WHERE LB_NOM='".$donnees['genre'].' '.$donnees['epithete'].' '.$donnees['rangintraspec'].' '.$donnees['taxintraspec']."';";
$repCheck = mysql_query($reqCheck);
$donneesCheck = mysql_fetch_array($repCheck);

if (mysql_num_rows($repCheck) == 0) {

// Sinon ajout
$reqAjout = "INSERT INTO basidio_manquants (LB_NOM,GENRE,EPITHETE,RANGINTRASPECIFIQUE,EPITHETEINTRASPECIFIQUE) values ('".$donnees['genre'].' '.$donnees['epithete'].' '.$donnees['rangintraspec'].' '.$donnees['taxintraspec']."','".$donnees['genre']."','".$donnees['epithete']."','".$donnees['rangintraspec']."','".$donnees['taxintraspec']."');";
mysql_query($reqAjout);
}

}
*/
// SYNONYMES

if (mysql_num_rows($repReferentiel) != 0) {

	$nomRetenuReferentiel = $donneesReferentiel['LB_NOM'].' '.$donneesReferentiel['LB_AUTEUR'];
	$reqSynonymes = "SELECT cd_nom, cd_ref, lb_nom, lb_auteur FROM ".$base." WHERE cd_nom='".$donneesReferentiel['CD_NOM']."'";
	$reqCountSyn = "SELECT count(cd_nom) as nb_synonyme FROM ".$base." WHERE cd_nom='".$donneesReferentiel['CD_NOM']."'";
	$sqlSynonyme = mysql_query($reqSynonymes);
	$sqlCountSyn = mysql_query($reqCountSyn);
	$donneesCountSyn = mysql_fetch_array($sqlCountSyn);

}

?>

</div>
</td>
</tr>
</div></div>
<fieldset >
	<div class="form-group">    
		<div class='row'><h4 class='text-center' style='color: #5CB85C; font-weight: bold;'>Taxinomie</h4></div>
	</div>
</div>

<table >


	<?php 
	$i=0;
	if (mysql_num_rows($repReferentiel) != 0) {
		$query = 'SELECT * FROM '.$base.' where CD_REF ='.$donneesReferentiel['CD_NOM'];
		$reponse=mysql_query($query);
		if(mysql_error()){

			echo '<tr><td>Il y a une erreur .Veuillez passer par le formulaire de recherche .</td></tr>';
		}else{

if($donnees1 = mysql_fetch_assoc($reponse)){// on commence par le nom retenu
	?>
	<div class="row" id="<?php echo "tr".$i++ ?>"  onclick="taxonimie(nbTr.value)"><label class="col-xs-2">Nom retenu </label><label class="col-xs-10"><?php echo $donnees1['LB_NOM']; ?> <?php echo $donnees1['LB_AUTEUR']; ?></label></div>
	<div class="col-xs-12"><h6>Pour déplier les synonymes, cliquer sur le nom retenu</h6></div>

	<?php
	$cd_nom=$donnees1['CD_NOM'];


$reponse=mysql_query("select * from ".$base." where CD_LEG = ".$cd_nom." and cd_nom != cd_ref order by LB_NOM , LB_AUTEUR");//on fais tous les synonyme non légitime lié directement au nom retenu
while( $donnees1=mysql_fetch_assoc($reponse))
{ 
	?>
	<div id="<?php echo "tr".$i++ ?>" class="row">
		<span class="col-xs-2">&equiv;</span><span class="col-xs-10"><?php echo $donnees1['LB_NOM']; ?> <?php echo $donnees1['LB_AUTEUR']; ?></span> 
	</div>
	<?php
}

$reponse=mysql_query("select * from ".$base." where CD_NOM = ".$cd_nom." and CD_LEG != CD_NOM AND CD_LEG = CD_REF AND CD_LEG != 0 order by LB_NOM , LB_AUTEUR" );//on fais tous les synonyme légitime
while($donnees1=mysql_fetch_assoc($reponse))
{
	?>
	<div id="<?php echo "tr".$i++ ?>"  class="row">
		<label class="col-xs-2">&nbsp;&nbsp;&nbsp;=</label><span class="col-xs-10"><?php echo $donnees1['LB_NOM']; ?> <?php echo $donnees1['LB_AUTEUR']; ?></span> 
	</div>
	<?php

$reponse2=mysql_query("select * from ".$base." where CD_LEG = ".$donnees1['CD_LEG']." AND CD_REF !=  CD_LEG order by LB_NOM , LB_AUTEUR" );// pour chaque synonyme légitime ses synonyme non légitime

while($donnees1=mysql_fetch_assoc($reponse2))
{
	?>
	<div id="<?php echo "tr".$i++ ?>" class="row">

		<span class="col-xs-2" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&equiv;</span><span class="col-xs-10"><?php echo $donnees1['LB_NOM']; ?> <?php echo $donnees1['LB_AUTEUR']; ?></span> 

	</div>
	<?php

}

}
$reponse=mysql_query("select * from ".$base." where CD_LEG = 0 AND CD_NOM = ".$cd_nom." order by LB_NOM , LB_AUTEUR ");//on verifie les interprétation
while($donnees1=mysql_fetch_assoc($reponse))
{
	?>
	<tr id="<?php echo "tr".$i++ ?>">
		<td></td><td><?php echo $donnees1['LB_NOM']; ?><?php echo $donnees1['LB_AUTEUR']; ?></td> 
	</tr>



	<?php
}
}else{
	echo '<tr><td>Il y a une erreur .Veuillez passer par le formulaire de recherche .</td></tr>';
}

echo "<input type=hidden id=nbTr name=nbTr value=".$i.">";
}
}else{
	echo "Ce champignon n'existe pas dans le référentiel";
}
?> 

</table>
</fieldset>


<button class="btn btn-default btn-xs"onclick="systematique()">Pour déplier la systématique, cliquer ici </button>

<div id="systematique">
	<div class='row'>
		<h4 class='text-center' style='color: #5CB85C; font-weight: bold;'>Systématique</h4>
	</div>
	<div class="row">
		<label class="col-sm-3 control-label">Division</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['PHYLUM']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Sous division</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['SOUS_CLASSE']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Classe</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['CLASSE']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Sous classe</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['SOUS_CLASSE']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Ordre</label>
		<div class="col-sm-3">
			<?php  echo $donneesReferentiel['ORDRE']; ?>
		</div>
	</div>
	<div class="row">
		<label class="col-sm-3 control-label">Famille</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['FAMILLE']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Tribu</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['TRIBU']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Genre</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['GENRE']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Sous genre</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['SOUS_GENRE']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Section</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['SELECTION']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Espèce</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['EPITHETE']; ?>
		</div>
	</div>

	<div class="row">
		<label class="col-sm-3 control-label">Rang/Tax infraspécifique</label>
		<div class="col-sm-3">
			<?php echo $donneesReferentiel['RANGINTRASPECIFIQUE'] . ' ' . $donneesReferentiel['TAXINTRASPECIFIQUE']; ?>
		</div>
	</div>
</div>



<?php

include("connexionBdd/bddinventaire.php");

?>

<fieldset >
	<div class='row'><h4 class='text-center' style='color: #5CB85C; font-weight: bold;'>Localisation</h4></div>
	<table>
		<div class="row">
			<label class="col-xs-1"> Pays  </label>
			<span class="col-xs-3"> <?php echo $donnees['pays']; ?> </span>
			<label class="col-xs-1 ">Commune  </label>

			<?php if(!empty($donnees['departement'])){
				$query2 = 'select * from departement where num=\'' .  $donnees['departement']  . '\' ';
				$reponse2 = mysql_query($query2);
				$donnees2 = mysql_fetch_array($reponse2);
				$numrow=mysql_num_rows($reponse2);?>
				<span class="col-xs-3 col-xs-offset-1"> <?php  if($numrow>0){echo $donnees['localite'] .' '. ' [' . $donnees2['num'] .'-'.  $donnees2['dept'] . ']';}else{echo $donnees['localite'];}?>  </span> <?php } ?>
			</div>
			<div class="row">
				<?php if(isset($_SESSION['droits_inventaire']) && ($_SESSION['droits_inventaire']<7 || $_SESSION['droits_inventaire']==11) ){?>
				<label class="col-xs-2"> Domaine  </label> 
				<span class="col-xs-10"> <?php echo $donnees['domaine'];?></span>
			</div><div class="row"> 
			<label class="col-xs-2">Sous-domaine</label>
			<span class="col-xs-2"> <?php echo $donnees['sous_domaine'];?></span>

			<?php } ?>
			<!--  </div> -->


			<?php 
			if ((isset($_SESSION['login'])))
			{   
				if($_SESSION['droitLocalisation']==1) 
					{ ?>
				<label class="col-xs-1"> Lieu dit </label> 
				<span class="col-xs-3"> <?php echo $donnees['lieu_dit']; ?> </span>
			</div>
			<div class="row">
				<label class="col-xs-1"> Longitude</label> 
				<span class="col-xs-3"> <?php if(!(empty($donnees['gps_longitude']))) echo $donnees['gps_longitude'];?> </span>
				<label class="col-xs-1">Latitude</label>
				<span class="col-xs-3"> <?php if(!(empty($donnees['gps_latitude']))) echo $donnees['gps_latitude'];?> </span>
				<label class="col-xs-1">Altitude </label>
				<span class="col-xs-3"> <?php if(!(empty($donnees['altitude']))) echo 
				$donnees['altitude'];?> </span>

			</div>
			<div class="row">

				<label class="col-xs-1"> Statut </label>
				<span class="col-xs-3"> <?php echo $donnees['statut_protection']; ?>  </span>
				<label class="col-xs-1"> Rayon </label>
				<span class="col-xs-3"> <?php echo $donnees['rayon']; ?>  </span> 
				<label class="col-xs-1"> Quantité </label>
				<span class="col-xs-3"> <?php echo $donnees['quantite']; ?>  </span> 

			</div>
			<?php
		}
		else if(($_SESSION['droits_inventaire']<=6) && (($donnees['protection']=='aucune') && ($donnees['valeur_patrimoniale']=='aucune'))) 
			{ ?>

		<div class="row">
<!-- <label class="col-xs-1"> Lieu dit : </label>
	<span class="col-xs-3"> <?php echo $donnees['lieu_dit']; ?> </span> -->
	<label class="col-xs-1"> Longitude : </label>
	<span class="col-xs-3"><?php if((!empty($donnees['gps_latitude']) || (!empty($donnees['gps_longitude']))) && isset($_SESSION['droits_inventaire']) && $_SESSION['droits_inventaire']<7){ ?> <?php echo $donnees['gps_longitude']; ?><?php } ?></span>  
	<label class="col-xs-1"> Latitude: </label>
	<span class="col-xs-3"><?php if((!empty($donnees['gps_latitude']) || (!empty($donnees['gps_longitude']))) && isset($_SESSION['droits_inventaire']) && $_SESSION['droits_inventaire']<7){ ?> <?php echo $donnees['gps_latitude']; ?><?php } ?></span> 
	<label class="col-xs-1"> Altitude : </label>
	<span class="col-xs-3"><?php if((!empty($donnees['gps_latitude']) || (!empty($donnees['gps_longitude']))) && isset($_SESSION['droits_inventaire']) && $_SESSION['droits_inventaire']<7){ ?> <?php echo $donnees['altitude']; ?><?php } ?></span> 
</div>
<?php
}
}

?> <!-- MEN/MER -->
<div class ="row">
	<label class="col-xs-1"> MEN/MER  </label>

	<span class="col-xs-4"> <?php if(isset($donnees['MER'])) { echo $donnees['MER'];} else { echo $donnees['MEN']; } ?> </span>
</div>

</table>
</fieldset>

<div class="row">
	<div class="col-xs-6">
		<div class="row">
			<h4 class="col-xs-3 col-xs-offset-5 text-center" style='color: #5CB85C; font-weight: bold;'>Ecologie
			</h4>
		</div>
		<div class="row">
			<label class="col-xs-4"> Référentiel Habitat  </label>
			<span class="col-xs-6"> <?php echo $donnees['refhabitat']; ?> </span>
		</div>
		<div class="row">
			<label class="col-xs-4">  Habitat   </label>
			<span class="col-xs-6"> <?php echo $donnees['ecologie']; ?>  </span>
		</div>
		<div class="row">
			<label class="col-xs-4">  Hôte   </label>
			<span class="col-xs-6"> <?php echo $donnees['hote']; ?>  </span>
		</div>
		<div class="row">
			<label class="col-xs-4">  Substrat  </label>
			<span class="col-xs-6"><?php if(!empty($donnees['codeSubstrat'])){ 
				include 'connexionBdd/bddreferentiel.php';
				$substrat="Select libelle from substrat where code='".$donnees['codeSubstrat']."'";
				$result=mysql_query($substrat);
				$libelle=mysql_fetch_array($result);
				echo $libelle[0];
			}?> </span>
		</div>
	</div>
	<div class="col-xs-6">
		<div class="row">
			<h4 class="col-xs-3 col-xs-offset-5 text-center" style='color: #5CB85C; font-weight: bold;'>
				Herbier
			</h4>
		</div>
		<?php

		include("connexionBdd/bddInventaireMobile.php");
		$query = "SELECT herbier, codeherbier FROM herbier WHERE id_recolte = ?";
		if (!($stmt = $id_connect->prepare($query))) {
			echo "Echec de la préparation : (" . $id_connect->errno . ") " . $id_connect->error;
		}
		if (!$stmt->bind_param("i", $_REQUEST['id'])) {
			echo "Echec lors du liage des paramètres : (" . $stmt->errno . ") " . $stmt->error;
		}
		if (!$stmt->execute()) {
			echo "echec de l'execution ".$stmt->errno." : ".$stmt->error;
		} else {
			$stmt->bind_result($herbier, $codeherbier);
			$stmt->fetch();
		}

		?>
		<div class="row">
			<label class="col-xs-4">Code Herbier </label>
			<span class="col-xs-6"> <?php echo $codeherbier; ?>  </span>
		</div>
		<div class="row">
			<label class="col-xs-4"> N°Herbier </label>
			<span class="col-xs-6"><?php echo $herbier; ?>  </span>
		</div>
	</div>
</div>
<div class='row'><h4 class='text-center' style='color: #5CB85C; font-weight: bold;'>Propriétaires</h4></div>
<div class="row">
	<?php
	include("connexionBdd/bddinventaire.php");
	$sql= mysql_query("Select idleg from recleg where idrecolte=".$_GET['id']);
	$sql2= mysql_query("Select iddet from recdet where idrecolte=".$_GET['id']);
	?>
	<label class="col-xs-1">  Leg. </label>
	<span class="col-xs-4"> <?php 

	while($leg=mysql_fetch_array($sql)){
		include("connexionBdd/bddusers.php");
		$user= mysql_query("Select nom,prenom from user where id=".$leg['idleg']);
		$name = mysql_fetch_array($user);
		echo $name['prenom'].' '.$name['nom'].'/';

		$legataire=true;

	}


	if(!$legataire){
		echo $donnees['leg'];
	}
	?> 
</span>

<label class="col-xs-1 col-xs-offset-1"> Det. </label>
<span class="col-xs-4"> <?php 
while($det=mysql_fetch_array($sql2)){
	include("connexionBdd/bddusers.php");
	$user= mysql_query("Select nom,prenom from user where id=".$det['iddet']);
	$name = mysql_fetch_array($user);
	echo $name['prenom'].' '.$name['nom'].'/';
	$determinateur=true;
}

if(!$determinateur){
	echo $donnees['det'];
}
?> 
</span>
</div>
<div class="row">
	<label class="col-xs-2"> Collaboration  </label>
	<span class="col-xs-3"> <?php if(!empty($donnees['collaboration'])) echo $donnees['collaboration']; ?> </span>
</div>

<div class="row">
	<div class='row'><h4 class='text-center' style='color: #5CB85C; font-weight: bold;'>Création/Mise à jour</h4></div>
</div>
<table >
	<div class="row">
		<label class="col-xs-1">Récolte</label>
		<span class="col-xs-4"  > <?php if(!empty($donnees['date_recolte'])) echo $donnees['date_recolte']; ?>  </span>
		<label class="col-xs-2 col-xs-offset-1">  Enregistrement </label>
		<span class="col-xs-4"> <?php if(!empty($donnees['created_at'])) echo $donnees['created_at']; ?> </span>
	</div>
	<div class="row">
		<label class="col-xs-1">  Auteur </label>
		<span class="col-xs-4"> <?php  echo $donnees['modified_by']; ?>  </span>
	</div>
</table>  
</fieldset >
</td>
</tr>
</table>
<table>
	<tr>
		<td>
			<?php if($donnees['remarque']!=''){ ?>
			<fieldset >
				<legend align="center">
					Remarque
				</legend>
				<table>
					<tr>
						<td> <?php echo $donnees['remarque'] . '</p>'; ?> </td>
					</tr>
				</table>
			</fieldset >
			<?php } ?>
		</td>
		<td>

			<?php




			$donnees2=explode(' ',$donnees['genre']);
			$donnees3=explode(' ',$donnees['epithete']);
			$filename = "./fiches/Documents/pdf/" . $donnees2[0] ."_" . $donnees3[0] .".pdf";
			$filename2 = "./fiches/Documents/doc/" . $donnees2[0] ."_" . $donnees3[0] .".docx";

			if(file_exists($filename) && file_exists($filename2))
				{ ?>

			<fieldset >
				<div class="row">
					<h4><label class="col-xs-2 col-xs-offset-5 control-label label label-success" align="center">
						Détails
					</label></h4>
				</div>
				<table>
					<tr>
						<td height="20"><?php echo '<a href="/fiches/Documents/pdf/' . $donnees2[0] .'_' . $donnees3[0] .'.pdf" TARGET=_BLANK>Fichier PDF</a></td>
						<td>&nbsp;</td>';
						if(!empty($_SESSION) && $_SESSION['droitAdmin']==1){
							echo'
							<td><a href="/fiches/modifier-fiche.php?file=' . $donnees2[0] .'_' . $donnees3[0] .'" TARGET=_BLANK>Fichier DOCX</a>  </td> ';}?></tr></table></fieldset>
							<?php } ?> 

						</td>
					</tr>
				</table>
			</table>

			<div class="impr">
				<?php
				include("connexionBdd/bddinventaire.php");
				$query2 = 'SELECT illustration1, auteur_illustration1, illustration2, auteur_illustration2, illustration3, auteur_illustration3, illustration4, auteur_illustration4 from recolte where id=\'' .  $_GET['id']  . '\'';
				$reponse2 = mysql_query($query2);
				$donnees2 = mysql_fetch_array($reponse2);

				if(!empty($donnees['illustration1']))
				{
					?>
					<div class="row">
						<h4><label class="col-xs-2 col-xs-offset-5 control-label label label-success" align="center">
							Photos
						</label></h4>
					</div>
					<tr>
<?php /*
for($i=0; $i<9; $i++){
echo "illustration".$i." = ".$donnees2[0]."<br>";
}
*/?>

<?php if(!(is_null($donnees2['illustration1'])))
{ ?>
<!-- <td>
<a HREF="http://inventaire.dbmyco.fr/<?php echo $donnees2['illustration1'] ;?>" rel="lightbox[roadtrip]" ><IMG SRC="http://inventaire.dbmyco.fr/<?php echo $donnees2['illustration1'] ;?>" WIDTH="130" HEIGHT="116" BORDER=0 alt="circinans"></a>
</td> -->
<?php } ?>
<?php if(!(is_null($donnees2['illustration2'])))
{ ?>
	<td width="20"></td>

<!-- <td>
<a HREF="http://inventaire.dbmyco.fr/<?php echo $donnees2['illustration2'] ;?>" rel="lightbox[roadtrip]" >                          <IMG SRC="http://inventaire.dbmyco.fr/<?php echo $donnees2['illustration2'] ;?>" WIDTH="130" HEIGHT="116" BORDER=0 alt="circinans"></a>   
</td> -->
<?php } ?>

<?php if(!(is_null($donnees2['illustration3'])))
{ ?>
	<td width="85"></td>

	<td>
<!-- <a HREF="http://inventaire.dbmyco.fr/<?php echo $donnees2['illustration3'] ;?>" rel="lightbox[roadtrip]" >                          <IMG SRC="http://inventaire.dbmyco.fr/<?php echo $donnees2['illustration3'] ;?>" WIDTH="130" HEIGHT="116" BORDER=0 alt="circinans"></a> 
-->  
</td>
<?php } ?>

<?php if(!(is_null($donnees2['illustration4'])))
{ ?>
	<td width="20"></td>

	<td>
<!--  <a HREF="http://www.inventaire.dbmyco.fr/<?php echo $donnees2['illustration4'] ;?>" rel="lightbox[roadtrip]" >                          <IMG SRC="http://inventaire.www.dbmyco.fr/<?php echo $donnees2['illustration4'] ;?>" WIDTH="130" HEIGHT="116" BORDER=0 alt="circinans"></a>   
</td>
-->
<?php } ?>
</tr>
</table>
</fieldset>
<?php } ?>

<?php
echo "<div class='row'><h4 class='text-center' style='color: #5CB85C; font-weight: bold;'>Photos</h4></div>";
echo "<div class='row'>";
echo "<div id='pics' class='col-xs-12'>";
echo "<table id='table' class='table'><tbody id='tableBody'></tbody></table>";
echo "</div></div>";

?>

<div class="row">
	<?php
	if(isset($_SESSION['login']) && ($_SESSION['droitModif']==2 || $_SESSION['prenom']." ".$_SESSION['nom']==$donnees['leg'] && $_SESSION['droitModif']==1) ){ ?> 
	<div id ="navfiche-technique">
		<button TYPE="button" class="recherche" onclick="self.location.href='./ModifierCreation?type=1&id=<?php echo $_GET['id'] ?>'"> Modifier <span class="glyphicon glyphicon-edit"></span> </button>
	</div> <!-- fin div navfiche-technique-->
	<?php }  

	if($_SESSION['droitAdmin']==1){ 
		?>
		<button TYPE="button" class="recherche" onclick="self.location.href='/valideedition?id=<?php echo $_GET['id'] ?>&bouton=sup'">  Supprimer <span class="glyphicon glyphicon-trash"></span> </button>

		<?php } ?>
		<button name="button" type="button" onClick="window.print()" class="recherche" > Imprimer <span class="glyphicon glyphicon-print"></span> </button>
		<button TYPE="button" class="recherche" onclick="window.history.back();" ><span class="glyphicon glyphicon-backward"></span> Retour </button>

		<?php
		if(isset($_GET['liste']) && isset($_GET['index'])){
			$liste=explode(",",$_GET['liste']);
			$index=htmlentities($_GET['index']);
			if($index>0){
				$index=$index-1;
				echo "<button type='button' class='recherche' onclick=self.location.href='./?id=".$liste[$index]."&liste=".implode(",",$liste)."&index=".$index ."'> <span class='glyphicon glyphicon-chevron-left'></span> Précédent </button>";
			}

			$index=$index+2;
			if($index<count($liste)){
				echo "<button type='button' class='recherche' onclick=self.location.href='./?id=".$liste[$index]."&liste=".implode(",",$liste)."&index=".$index ."'> Suivant <span class='glyphicon glyphicon-chevron-right'></span> </button>";
			}

		}
		?>

	</div>

	<div class="row">
		<div class="col-xs-3" > <button type="button" onclick="self.location.href='http://doc.dbmyco.fr/consultation-par-especes/resultat-de-recherche-par-especes/fiche-technique/?g=<?php echo $donnees['genre'].'&e='.$donnees['epithete'].'&r='.$donnees['rangintraspec'].'&t='.$donnees['taxintraspec']; ?>'"/> Consulter la bibliographie <span class="glyphicon glyphicon-book"></span> </button></div></div>

	</div>

	<?php 
}else{
	echo "Aucun champignon indiqué à afficher. ";
}



?>

<script>
init(<?php echo $_REQUEST['id'];?>);
taxonimie(nbTr.value);
systematique();
</script>


