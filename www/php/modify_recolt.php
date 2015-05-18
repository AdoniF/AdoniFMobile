<link type="text/css" rel="stylesheet" href="/lib_js_autocomplete/jquery.autocomplete.css" />
<script type="text/javascript" src="/lib_js_autocomplete/jquery.js"></script>
<script type="text/javascript" src="/lib_js_autocomplete/jquery.autocomplete.js"></script>
<script type='text/javascript' src='/javascript/all.js'></script>
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true"></script>
<script type="text/javascript" src="../ajax/listlist.js"></script>
<script type="text/javascript" src="../ajax/listlist2.js"></script>
<script type="text/javascript" src="../ajax/listlist3.js"></script>

<?php
echo "<style>.control-label {text-align: right; padding-top:5px;} .label-success{margin-bottom: 5px;} .btn{margin-bottom: 1px;}</style>";
echo "<style>#SELECTHABITAT {overflow: scroll; display: block; cursor: default; width: 600px; height: 300px;}</style>";
echo "<style>.vcenter{display: table-cell; vertical-align: middle;}</style>";

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

echo getSubtitle("Taxonomie");

echo getInput("Genre*", "dataGenre", $tooltips['genre'], true);
echo getInput("Espèce*", "dataSpecies", $tooltips['espece'], true);
echo getSelect("Rang", "listSVF", $tooltips['rang']);
echo getInput("Taxon", "dataTaxon", $tooltips['epithete']);
echo getSelect("Modulation", "listModulation");
echo getInput("Autorités", "dataAuthor", $tooltips['auteur']);


echo getSubtitle("Position");

echo getSelect("Règne", "listRegne", $tooltips['regne']);
echo getSelect("Phylum", "listPhylum", $tooltips['phylum']);
echo getInput("Classe", "dataClasse", $tooltips['classe']);
echo getInput("Ordre", "dataOrdre", $tooltips['ordre']);
echo getInput("Famille", "dataFamille", $tooltips['famille']);
echo "<div class='form-group col-xs-6 text-center'><button type='button' class='btn btn-success' onclick='requestCompleteRecolte()'>Compléter</button></div>";


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
echo getChoixHabitat();
echo getInput("Habitat choisi", "ecologie", $tooltips['habitat']);
echo getSelect("Hôte", "hote", $tooltips['hote']);
echo getSelect("Etat hôte", "hostState");
echo getSelect("Substrat", "substrat", $tooltips['substrat']);


echo getSubtitle("Propriétaires");

echo getInput("Légataire(s)*", "leg0", $tooltips['leg'], true);
echo getInputWithButton("Déterminateur(s)*", "det0", "addLegDet()", $tooltips['det'], true);
echo getInput("Code herbier", "codeHerbier0", $tooltips['codeherbier']);
echo getInputWithButton("Num herbier", "numHerbier0", "addHerbier()", $tooltips['numherbier'], false, "type=number min='0'");


echo getSubtitle("Suppléments");

echo getSelect("Asso/Orga*", "asso", $tooltips['origine'], true);
echo getInput("Collaboration", "collaboration", $tooltips['collaboration']);
echo getSelect("Type récolte", "typeRecolte", $tooltips['typerecolte']);
echo getDateInput();
echo getTextArea("Remarques", "remarques");

//TODO : bouton bibliographie

echo getSubtitle("Photos");
echo "<div id='pics'>";
echo "</div>";

echo "<div class='form-group col-xs-12 text-center'><button type='button' id='picButton' class='btn btn-success'>Ajouter une photo&nbsp;<span class='glyphicon glyphicon-camera'></span></button></div>";

echo "</div>\n"; //fermeture div form-inline

echo "<script type='text/javascript'>init(".$recoltID.");</script>";

//Génère un sous-titre
function getSubtitle($text) {
	return "<div class='col-xs-12'><h5><span class='label label-success col-xs-offset-3 col-xs-3'>".$text."</span></h5></div>\n";
}

//Génère un champ de selection
function getSelect($name, $selectName, $tooltip, $hasError=false) {
	if ($hasError)
		$error = "has-error";
	else
		$error = "";

	$str = "<div id='group".$selectName."' class='form-group col-xs-6 ".$error."'>";
	$str .= "<label for='".$selectName."' class='control-label col-xs-3'>".$name."</label>";
	$str .= "<div class='col-xs-8'>";
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

	$str = "<div id='group".$inputName."' class='form-group col-xs-6 ".$error."'>";
	$str .= "<label for='".$inputName."' class='control-label col-xs-3'>".$name."</label>";
	$str .= "<div class='col-xs-8'>";
	$str .= "<input id='".$inputName."' style='width:100%;' ".$option."/>";
	$str .= "</div>";
	$str .= getTooltip($tooltip);
	return $str."</div>\n";
}

function getInputWithButton($name, $inputName, $buttonAction, $tooltip="", $hasError=false, $option="") {
	if ($hasError)
		$error = "has-error";
	else
		$error = "";

	$str = "<div id='group".$inputName."' class='form-group col-xs-6 ".$error."'>";
	$str .= "<label for='".$inputName."' class='control-label col-xs-3'>".$name."</label>";
	$str .= "<div class='col-xs-6'>";
	$str .= "<input id='".$inputName."' class='legdet' style='width:100%;' ".$option."/>";
	$str .= "</div>";
	$str .= getTooltip($tooltip);
	$str .= "<div class='col-xs-2'>";
	$str .= "<button type='button' class='btn btn-success btn-block' onclick='".$buttonAction."'>";
	$str .= "<span class='glyphicon glyphicon-plus'></span>";
	return $str."</button></div></div>\n";
}

//Génère un textarea
function getTextArea($name, $areaName) {
	$str = "<div class='form-group col-xs-6'>";
	$str .= "<label for='".$areaName."' class='control-label col-xs-3'>".$name."</label>";
	$str .= "<div class='col-xs-8'>";
	$str .= "<textarea id='".$areaName."' style='width: 100%;' class='form-control' rows='2'></textarea>";
	return $str."</div></div>";
}

function getDateInput() {
	$year=date("Y");

	$str = "<div id='groupDate' class='form-group col-xs-6 has-success'>";
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
//	return "<span class='col-xs-1'><img class='data-toggle tooltip' data-placement='top' title='".$text."' src='/images/infobulle.png'></span>";
	return "<span class='col-xs-1'><img data-toggle='tooltip' data-placement='top' title='".$text."' src='/images/infobulle.png'></span>";

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

function getChoixHabitat() {
	$str = "<div id='groupselectHabitat' style='display: none' class='form-group col-xs-12'>";
	$str .= "<label class='control-label col-xs-1'>Choix d'habitat</label>";
	$str .= "<div class='col-xs-9'>";
	$str .= "<ul id='SELECTHABITAT'></ul>";
	$str .= "</div></div>";

	return $str;
}
?>