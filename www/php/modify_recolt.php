<link type="text/css" rel="stylesheet" href="/lib_js_autocomplete/jquery.autocomplete.css" />
<script type="text/javascript" src="/lib_js_autocomplete/jquery.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/jquery.autocomplete.js"></script>
<script type='text/javascript' src='/javascript/all.js'></script>
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true"></script>

<?php
echo "<div class='row'><h3><span class='label label-success col-xs-offset-1'>Modification d'une récolte</span></h3></div>";

$recoltID = $_GET['id'];
if (!isset($_SESSION['id'])) {
	echo "Veuillez vous connecter.";
	return;
}
if (!isset($recoltID)) {
	echo "Vous devez choisir une récolte pour pouvoir la modifier.";
	return;
}

remove_filter( 'the_content', 'wpautop'); 
include('connexionBdd/bddInventaireMobile.php');
require_once(ABSPATH.'wp-admin/includes/admin.php');

$tooltips = getTooltips($id_connect);

echo "<div class='form-inline'>\n";
echo getSubtitle("Nom");

echo getSelect("Phylum", "listPhylum");
echo "<div class='form-group col-xs-6'><button type='button' class='btn btn-success'>Auto</button></div>";
echo getInput("Genre*", "dataGenre", $tooltips['genre'], true);
echo getInput("Espèce*", "dataSpecies", $tooltips['espece'], true);
echo getSelect("Rang", "listSVF", $tooltips['rang']);
echo getInput("Taxon", "dataTaxon", $tooltips['epithete']);
echo getSelect("Modulation", "listModulation");
echo getInput("Autorités", "dataAuthor", $tooltips['auteur']);


echo getSubtitle("Informations et localisation");

echo getInput("Pays*", "country", $tooltips['pays'], true);
echo getSelect("Département*", "dpt", "", true);
echo getInput("Commune", "city", $tooltips['commune']);
echo getInput("Lieu-dit", "lieu-dit", $tooltips['lieudit']);
echo getInput("Domaine", "domain", $tooltips['domaine']);
echo getInput("Sous-domaine", "subdomain", $tooltips['sousdomaine']);
echo getSelect("Statut protec", "protectionStatus", $tooltips['statut']);
echo getInput("MEN/MER", "mailles", $tooltips['men']);
echo getInput("GPS Latitude", "latitude");
echo getInput("GPS Longitude", "longitude");
echo getInput("GPS Altitude", "altitude");
echo getInput("GPS Précision", "precision");
echo getInput("Quantité", "nbFound", "", false, "type='number' min='0'");
echo getInput("Etendue(mètres)", "range", "", false, "type='number' min='0'");


echo getSubtitle("Ecologie");

echo getSelect("Réf. habitat", "ref", $tooltips['refhabitat']);
echo getInput("Habitat choisi", "habitat", $tooltips['habitat']);
echo getSelect("Hôte", "hote", $tooltips['hote']);
echo getSelect("Etat hôte", "hostState");
echo getSelect("Substrat", "substrat", $tooltips['substrat']);


echo getSubtitle("Propriétaires");

echo getSelect("Nb légataires", "nbLegs");
echo getInput("Légataire(s)*", "legs", $tooltips['leg'], true);
echo getSelect("Nb déterm", "nbDets");
echo getInput("Déterminateur(s)*", "dets", $tooltips['det'], true);
echo getSelect("Nb d'herbiers", "nbHerbiers");
echo getInput("Code herbier", "codeHerbier", $tooltips['codeherbier']);
echo getInput("Num herbier", "numHerbier", $tooltips['numherbier'], false, "type=number min='0'");


echo getSubtitle("Suppléments");

echo getSelect("Asso/Orga*", "asso", $tooltips['origine'], true);
echo getInput("Collaboration", "collaboration", $tooltips['collaboration']);
echo getSelect("Type récolte", "typeRecolte", $tooltips['typerecolte']);
echo getDateInput();
echo getTextArea("Remarques", "remarques");

//TODO : bouton bibliographie
echo "<style>.control-label {text-align: right; padding-top:5px;}</style>";


echo getSubtitle("Photos");
echo "<div id='pics' class='row'>";
echo "</div>";

echo "<button type='button' id='picButton' class='btn btn-success btn-lg btn-block'>Ajouter une photo&nbsp;<span class='glyphicon glyphicon-camera'></span></button>";

echo "</div>\n"; //fermeture div form-inline

echo "<script type='text/javascript'>init(".$recoltID.");</script>";

//Génère un sous-titre
function getSubtitle($text) {
	return "<div class='row'><div class='col-xs-12'>
	<h5><span class='label label-success col-xs-offset-3 col-xs-3'>".$text."</span></h5></div></div>\n";
}

//Génère un champ de selection
function getSelect($name, $selectName, $tooltip, $hasError=false) {
	if ($hasError)
		$error = "has-error";
	else
		$error = "";

	$str = "<div id='group".$selectName."' class='form-group col-xs-6 ".$error."'>";
	$str .= "<label for='".$selectName."' class='control-label col-xs-3'>".$name."</label>";
	$str .= "<div class='col-xs-7'>";
	$str .= "<select id='".$selectName."' style='width:100%;' ></select>";
	$str .= "</div>";
	$str .= getTooltip($tooltip);
	return $str."</div>\n";
}

//Génère un champ d'input
function getInput($name, $inputName, $tooltip="", $hasError=false, $option="") {
	if ($hasError)
		$error = "has-error";
	else
		$error = "";

	$str = "<div id='group".$inputName."'class='form-group col-xs-6 ".$error."'>";
	$str .= "<label for='".$inputName."' class='control-label col-xs-3'>".$name."</label>";
	$str .= "<div class='col-xs-7'>";
	$str .= "<input id='".$inputName."' style='width:100%;' ".$option."></input>";
	$str .= "</div>";
	$str .= getTooltip($tooltip);
	return $str."</div>\n";
}

//Génère un textarea
function getTextArea($name, $areaName) {
	$str = "<div class='form-group col-xs-6'>";
	$str .= "<label for='".$areaName."' class='control-label col-xs-3'>".$name."</label>";
	$str .= "<div class='col-xs-9'>";
	$str .= "<textarea id='".$areaName."' class='form-control' rows='2'></textarea>";
	return $str."</div></div>";
}

function getDateInput() {
	$year=date("Y");

	$str = "<div id='groupDate'class='form-group col-xs-6 has-error'>";
	$str .= "<label class='control-label col-xs-3'>Date*</label>";
	$str .= "<div class='col-xs-7'>";
	$str .= "<select id='day' style='width:33.3%;' ></select>";
	$str .= "<select id='month' style='width:33.3%;' ></select>";
	$str .= "<input id='year' type='number' value='".$year."' style='width:33.3%;' ></input>";
	$str .= "</div></div>";

	return $str."\n";
}

//Génère un tooltip
function getTooltip($text) {
	if (empty($text))
		return "";

	//On remplace les apostrophes par leur équivalent en code HTML pour qu'ils ne soient pas interprétés comme une fin de chaine
	$text = str_replace("'", "&#39;", $text);
	return "<span class='col-xs-2'><img class='data-toggle='tooltip' data-placement='top' title='".$text."' src='/images/infobulle.png'></span>";
}

//Récupère les tooltips dans la base
function getTooltips($id) {
	$query='Select libelle, commentaire from infobulles;';

	$result = $id->query($query);
	while ($row = $result->fetch_array()) {
		$tooltips[$row['libelle']] = $row['commentaire'];
	}
	return $tooltips;
}
?>