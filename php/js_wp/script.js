function newXHR()
{
	if(window.XMLHttpRequest) // FIREFOX
		return new XMLHttpRequest();
	else if(window.ActiveXObject) // IE
		return new ActiveXObject("Microsoft.XMLHTTP");
	else
		return(false);
}

function remCollaboration(collaboration){
if(collaboration.length<1){
document.getElementById('trRemarque').style.display="none";
}else{
document.getElementById('trRemarque').style.display = "";
}
}

function taxonimie(nbTr){
	for(var i=1;i<nbTr;i++){
		if(document.getElementById('tr'+i).style.display=="none"){
			document.getElementById('tr'+i).style.display="";
		}else{
			document.getElementById('tr'+i).style.display="none";
		}
	}
}

	function systematique() {
		var systematique = document.getElementById('systematique');
		if (systematique.style.display == "none") {
			systematique.style.display = "";
		} else {
			systematique.style.display = "none";
		}
	}
function ComplementInfos(){

	var chaine = document.getElementById('genre').value+'-_-'+document.getElementById('epithete').value+'-_-'+document.getElementById('rangintraspec').value+'-_-'+document.getElementById('taxintraspec').value;
	var xhr = newXHR();
	xhr.open("GET","/lib_js_autocomplete/reqComplementInfos.php?chaine="+chaine,false);
	xhr.send(null);

	var reponse = xhr.responseText.split('||');
	
			for(i=0; i<8;i++){
			if(reponse[i]===undefined){
				reponse[i]="";
			}
		}
		

	
	document.getElementById('autorites').value = reponse[1];
	document.getElementById('famille').value = reponse[2];
	document.getElementById('classe').value = reponse[3];
	document.getElementById('regne').value = reponse[4];
	document.getElementById('ordre').value = reponse[5];
	document.getElementById('taxintraspec').value = reponse[6];
	document.getElementById('rangintraspec').value = reponse[7];

}
    
function ComplementInfosRecolte(){
var chaine = document.getElementById('genre').value+'-_-'+document.getElementById('epithete').value+'-_-'+document.getElementById('rangintraspec').value+'-_-'+document.getElementById('taxintraspec').value;
	var xhr = newXHR();
	xhr.open("GET","/lib_js_autocomplete/reqComplementInfosRecolte.php?chaine="+chaine,false);
	xhr.send(null);
	
	
		var reponse = xhr.responseText.split('||');
		var i;
		

		for(i=0; i<7;i++){
			if(reponse[i]===undefined){
				reponse[i]="";
			}
		}
		
		reponse[0]=reponse[0].charAt(0).toUpperCase()+reponse[0].substring(1).toLowerCase();
		for(i=0; i<phylum.options.length;i++){
			if(phylum.options[i].value==reponse[0]){
			phylum.options[i].selected=true;
			}
		}
	document.getElementById('famille').value = reponse[1];
	document.getElementById('taxintraspec').value = reponse[2];
		
		for(i=0; i<rangintraspec.options.length;i++){
			if(rangintraspec.options[i].value==reponse[3]){
			rangintraspec.options[i].selected=true;
			}
		}
}


function validationFormulaire()
{
    var err = "";
    if(document.form1.genre.value == '')
        err += '- genre\n';
    if(document.form1.espece.value == '')
        err += '- espece\n';
    if(document.form1.pays.value == '')
        err += '- pays\n';
    if(document.form1.departement.value == '')
        err += '- departement\n';
    if(document.form1.leg1.value == '')
        err += '- leg1\n';
    if(document.form1.det1.value == '')
        err += '- det1\n';
    if(document.form1.jour.value == '')
        err += '- jour\n';
    if(document.form1.mois.value == '')
        err += '- mois\n';
    if(document.form1.annees.value == '')
        err += '- annees\n';
    if(document.form1.origin.value == '')
        err += '- origin\n';

    if(err != '')
    {
        alert('les champs suivants sont manquants :\n'+err);
        return false;
    }
    else
        return true;
}

function getNom(nom)
{

//Supprime les résultats précédents restés dans le DOM
	$( "div" ).remove( ".ac_results" );
	$('#requete').autocomplete("../../openlayers/autocompleteChamp.php?q="+nom);

}

function getGenre(genre,base)
{

if(!base){
base="union";
}
//Supprime les résultats précédents restés dans le DOM
	$( "div" ).remove( ".ac_results" );
	$('#genre').autocomplete("../../lib_js_autocomplete/requestGenre.php?q="+genre+"&b="+base);

}

function getEpithete(espece, genre, base) 
{
if(!base){
base="union";
}
//Supprime les résultats précédents restés dans le DOM
	$( "div" ).remove( ".ac_results" );
	$('#epithete').autocomplete("../../lib_js_autocomplete/requestEspece.php?q="+espece+"&genre="+genre+"&b="+base);
	
}


function getFamillec(famille,genre,espece,base)
{
//Supprime les résultats précédents restés dans le DOM
	$( "div" ).remove( ".ac_results" );
	$('#famille').autocomplete("../../lib_js_autocomplete/requestFamille.php?q="+famille+"&genre="+genre+"&espece="+espece+"&b="+base);
}

function getLeg1(leg)
{
	$('#leg1').autocomplete("../../../lib_js_autocomplete/requestLeg.php?q="+leg+"");
}

function getLeg2(leg)
{
	$('#leg2').autocomplete("../../../lib_js_autocomplete/requestLeg.php?q="+leg+"");
}

function getLeg3(leg)
{
	$('#leg3').autocomplete("../../../lib_js_autocomplete/requestLeg.php?q="+leg+"");
}

function getLeg4(leg)
{
	$('#leg4').autocomplete("../../../lib_js_autocomplete/requestLeg.php?q="+leg+"");
}

function getLeg5(leg)
{
	$('#leg5').autocomplete("../../../lib_js_autocomplete/requestLeg.php?q="+leg+"");
}

function getLeg6(leg)
{
	$('#leg6').autocomplete("../../../lib_js_autocomplete/requestLeg.php?q="+leg+"");
}

function getDet1(det)
{
	$('#det1').autocomplete("../../../lib_js_autocomplete/requestDet.php?q="+det+"");
}

function getDet2(det)
{
	$('#det2').autocomplete("../../../lib_js_autocomplete/requestDet.php?q="+det+"");
}

function getDet3(det)
{
	$('#det3').autocomplete("../../../lib_js_autocomplete/requestDet.php?q="+det+"");
}

function getDet4(det)
{
	$('#det4').autocomplete("../../../lib_js_autocomplete/requestDet.php?q="+det+"");
}

function getDet5(det)
{
	$('#det5').autocomplete("../../../lib_js_autocomplete/requestDet.php?q="+det+"");
}

function getDet6(det)
{
	$('#det6').autocomplete("../../../lib_js_autocomplete/requestDet.php?q="+det+"");
}
transformButton();