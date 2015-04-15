/*
Fonction permettant de remplir les suggestions de l'input dont l'id
est passé en paramètre
@param array: suggestions possibles
@param id : id de l'input auquel on ajoute les suggestions
*/
function populateInput(id, array, placeholder) {
    var data = $("#" + id);
    
    data.attr("placeholder", placeholder);
    var options = "";
    options += "<option value='" + placeholder + "'/>";
    for (var i = 0; i < array.length; i++) {
        options += "<option value='" + array[i] + "'/>";
    }

    data.append(options);
}

/*
Fonction permettant de remplir les propositions du select dont 
l'id est passé en paramètre
@param array : propositions possibles
@param id : id du select auquel on ajoute les propositions
*/
function populateSelect(id, array, selected) {
    var list = $("#" + id);

    list.attr("placeholder", selected);
    var options = "";
    options += "<option>" + selected + "</option>";
    for (var i = 0; i < array.length; ++i) {
        options += "<option>" + array[i] + "</option>";
    }

    list.append(options);
}

function populateFields() {
    var array = [];

    setDate();
    setLocation();

    array.push('toto 1iubhigbugvugfvuyvuvu');
    array.push('toto 2');
    array.push('toto 3');
    array.push('titi 1');
    array.push('titi 2');
    array.push('titi 3');
    array.push('42');
    array.push('1');
    array.push(user.login);

    var arraySVF = [];
    arraySVF.push('var.');
    arraySVF.push('ssp.');
    arraySVF.push('f.');

    populateSelect('listSVF', arraySVF, "var., ssp., f.");

    populateSelect("listPhylum", array, "Phylum");
    populateSelect("listModulation", array, "Modulation");
    populateSelect("listRH", array, "Référentiel habitat");
    populateSelect("listSubstrate", array, "Substrat");
    populateSelect("listHost", array, "Hôte");
    populateSelect("listHostState", array, "Etat de l'hôte");
    populateSelect("listDet", array, "Déterminateur(s)");
    populateSelect("listDetNb", array, "Nombre de déterminateurs");
    populateSelect("listLegatees", array, "Légataire(s)");
    populateSelect("listLegNumber", array, "Nombre de légataires");

    populateInput("dataGenre", array, "Genre*");
    populateInput("dataSpecies", array, "Espèce");
    populateInput("dataEpithete", array, "Epithète");
    populateInput("dataHC", array, "Habitat choisi");
    populateInput("range", array, "Etendue (mètres)");
    populateInput("dataAuthor", array, "Auteur");
    populateInput("nbFound", array, "Quantité trouvée");

    setAuthor();
}

//Remplit le champ date
function setDate() {
    $("#date").text("Date : " + new Date().toLocaleString());
}

//Remplit les champs de position
function setLocation() {
    calculatePosition();
}

//Remplit par défaut le champ de nombre de légataires et son nom
function setAuthor() {
    $("#listLegNumber").val(1);
    $("#listLegatees").val(user.login);
    $("#listDetNb").val(1);
    $("#listDet").val(user.login);
}

//Génère un formulaire vide pour une nouvelle récolte
function generateNewForm(imageSrc) {
    populateFields();
    if (imageSrc)
        addPicture(imageSrc);
}

// Génère un formulaire depuis une récolte déjà entamée
function populateFormFromGathering(gathering) {
    //TODO : Charger depuis la BDD la recolte plutôt qu'un nouveau formulaire
    populateFields();
}