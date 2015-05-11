<?php

$recoltID = $_GET['id'];

echo "<link href='/ajax/jquery.autocomplete.css' rel='stylesheet' type='text/css'></link>"
."<script type='text/javascript' src='/lib_js_autocomplete/jquery_2.js'></script>"
."<script type='text/javascript' src='/javascript/all.js'></script>"
."<script type='text/javascript' src='/lib_js_autocomplete/jquery.autocomplete_2.js'></script>";

//Obligation d'être connecté

remove_filter( 'the_content', 'wpautop'); 
include('connexionBdd/bddInventaireMobile.php');
require_once(ABSPATH.'wp-admin/includes/admin.php');

//recherche des infobulles

$data = getRecoltData($id_connect);
$infobulle = getInfobulles($id_connect);

echo "<div class='page-header'><h2 style='text-align: center'>Modification d'une récolte</h2></div>";
echo getSubtitle("Nom");

echo "<div class='row'>";
echo getSelect("Phylum", "listPhylum");
echo getInputWithInfo("Genre*", "dataGenre", $infobulle['genre'], "", true);
echo "</div>";

echo "<div class='row'>";
echo getInputWithInfo("Epithète*", "dataSpecies", $infobulle['espece'], "", true);
echo getSelectWithInfo("Rang", "listSVF", $infobulle['rang']);
echo "</div>";

echo "<div class='row'>";
echo getInputWithInfo("Taxon", "dataTaxon", $infobulle['epithete']);
echo getInputWithInfo("Autorités", "dataAuthor", $infobulle['auteur']);
echo "</div>";

echo "<div class='row'>";
echo getSelect("Modulation", "listModulation");
echo "</div>";


echo getSubtitle("Informations et localisation");

echo "<div class='row'>";
echo getInput("Quantité trouvée", "nbFound", "type='number' min='1'");
echo getInput("Etendue (mètres)", "range", "type='number' min='1'");
echo "</div>";

echo "<div class='row'>";
echo getInputWithInfo("Pays*", "country", $infobulle['pays'], "", true);
echo getInput("Département*", "dpt", "", true);
echo "</div>";

echo "<div class='row'>";
echo getInputWithInfo("Commune", "city", $infobulle['commune']);
echo getInputWithInfo("Lieu-dit", "lieu-dit", $infobulle['lieudit']);
echo "</div>";

echo "<div class='row'>";
echo getInputWithInfo("Domaine", "domain", $infobulle['domaine']);
echo getInputWithInfo("Sous-domaine", "subdomain", $infobulle['sousdomaine']);
echo "</div>";

echo "<div class='row'>";
echo getSelectWithInfo("Statut de protection", "protectionStatus", $infobulle['statut']);
echo getInputWithInfo("MEN/MER", "mailles", $infobulle['men']);
echo "</div>";

echo "<div class='row'>";
echo getInput("GPS Latitude", "latitude");
echo getInput("GPS Longitude", "longitude");
echo "</div>";

echo "<div class='row'>";
echo getInput("GPS Altitude", "altitude");
echo "</div>";


echo getSubtitle("Ecologie");

echo "<div class='row'>";
echo getSelectWithInfo("Référentiel habitat", "ref", $infobulle['refhabitat']);
echo getInputWithInfo("Habitat choisi", "habitat", $infobulle['habitat']);
echo "</div>";

echo "<div class='row'>";
echo getSelectWithInfo("Substrat", "subtrat", $infobulle['substrat']);
echo getSelectWithInfo("Hôte", "hote", $infobulle['hote']);
echo "</div>";

echo "<div class='row'>";
echo getSelect("Etat hôte", "hostState");
echo "</div>";

echo getSubtitle("Propriétaires");
echo "<div class='row'>";
echo getSelect("Nombre de légataires", "nbLegs");
echo getInputWithInfo("Légataire(s)*", "legs", $infobulle['leg'], "", true);
echo "</div>";

echo "<div class='row'>";
echo getSelect("Nombre de déterminateurs", "nbDets");
echo getInputWithInfo("Déterminateur(s)*", "dets", $infobulle['det'], "", true);
echo "</div>";

echo "<div class='row'>";
echo getSelect("Nombre d'herbiers", "nbHerbiers");
echo getInputWithInfo("Code herbier", "codeHerbier", $infobulle['codeherbier']);
echo "</div>";

echo "<div class='row'>";
echo getInputWithInfo("Numéro d'herbier", "numHerbier",$infobulle['numherbier'], "type=number min='0'");
echo "</div>";


echo getSubtitle("Suppléments");

echo "<div class='row'>";
echo getSelectWithInfo("Association/Organisme*", "asso", $infobulle['origine'], true);
echo getInputWithInfo("Collaboration", "collaboration", $infobulle['collaboration']);
echo "</div>";

echo "<div class='row'>";
echo getSelectWithInfo("Type de récolte", "typeRecolte", $infobulle['typerecolte']);
echo getInput("Date de récolte*", "date", "type='date'", true);
echo "</div>";

echo "<div class='row'>";
echo getTextArea("Remarques", "remarques");
echo getTextArea("Bibliographie", "biblio");
echo "</div>";

echo "<div id='pics' class='row'>";

echo "</div>";

echo "<script type='text/javascript'>init(".$recoltID.");</script>";


function getRecoltData($id_connect) {
	$query = "SELECT * FROM recolte_mobile where id=".$_GET['id'].";";
	$reponse = mysqli_query($id_connect, $query);
	$donnees = mysqli_fetch_array($id_connect, $reponse);
	return $donnees;
}

function getSubtitle($text) {
	return "<div class='page-header'><h3>".$text."</h3> </div>";
}

function getSelect($name, $selectName, $showError=false) {
	$error = "";
	if ($showError)
		$error = "has-error";

	$str = "<div class = 'col-xs-12 col-sm-6'><div class='input-group ".$error."'>";
	$str .= "<span class='input-group-addon'>".$name."</span>";
	$str .= "<select id='".$selectName."' class='form-control'>";
	$str .= "</select>"
	$str .= "</div></div>";
	return $str;
}

function getSelectWithInfo($name, $selectName, $textInfo, $showError=false) {
	$error = "";
	if ($showError)
		$error = "has-error";

	//On remplace les apostrophes par leur équivalent en code HTML pour qu'ils ne soient pas interprétés comme une fin de chaine
	$textInfo = str_replace("'", "&#39;", $textInfo);
	$str = "<div class = 'col-xs-12 col-sm-6'><div class='input-group ".$error."'>";
	$str .= "<span class='input-group-addon'>".$name."</span>";
	$str .= "<select id='".$selectName."' class='form-control'></select>";
	$str .= "<span class='input-group-addon data-toggle='tooltip' data-placement='top' title='".$textInfo."''>";
	$str .= "<span class='glyphicon glyphicon-question-sign'></span>";
	$str .= "</span></div></div>";
	return $str;
}

function getInputWithInfo($name, $inputName, $textInfo, $option="", $showError=false) {
	$error = "";
	if ($showError)
		$error = "has-error";

	//On remplace les apostrophes par leur équivalent en code HTML pour qu'ils ne soient pas interprétés comme une fin de chaine
	$textInfo = str_replace("'", "&#39;", $textInfo);
	$str = "<div class='col-xs-12 col-sm-6'><div class='input-group ".$error."'>";
	$str .= "<span class='input-group-addon'>".$name."</span>";
	$str .= "<input id='".$inputName."' class='form-control' ".$option."/>";
	$str .= "<span class='input-group-addon data-toggle='tooltip' data-placement='top' title='".$textInfo."''>";
	$str .= "<span class='glyphicon glyphicon-question-sign'></span>";
	$str .= "</span></div></div>";
	return $str;
}

function getInput($name, $inputName, $option="", $showError=false) {
	$error = "";
	if ($showError)
		$error = "has-error";

	$str = "<div class='col-xs-12 col-sm-6'><div class='input-group ".$error."'>";
	$str .= "<span class='input-group-addon'>".$name."</span>";
	$str .= "<input id='".$inputName."' class='form-control' ".$option."/>";
	$str .= "</div></div>";
	return $str;
}

function getTextArea($name, $areaName) {
	$str = "<div class='col-xs-12 col-sm-6'><div class='input-group'>";
	$str .= "<span class='input-group-addon'>".$name."</span>";
	$str .= "<textarea id='".$areaName."' class='form-control' rows='2'></textarea>";
	$str .= "</div></div>";
	return $str;
}

function getInfobulles($id) {
	$query='Select libelle, commentaire from infobulles;';

	$result = $id_connect->query($query);
	while ($row = $result->fetch_array()) {
		$infobulle[$row['libelle']] = $row['commentaire'];
	}
	return $infobulle;
}
?>