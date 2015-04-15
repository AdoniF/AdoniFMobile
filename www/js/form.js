/*
Fonction permettant de remplir les suggestions de l'input dont l'id
est passé en paramètre
@param array: suggestions possibles
@param id : id de l'input auquel on ajoute les suggestions
*/
function populateInput(array, id) {
    var data = document.getElementById(id);
    
    var options = "";
    for (var i = 0; i < array.length; i++) {
        options += "<option value='" + array[i] + "'/>";
    }
    data.innerHTML = options;
}

/*
Fonction permettant de remplir les propositions du select dont 
l'id est passé en paramètre
@param array : propositions possibles
@param id : id du select auquel on ajoute les propositions
*/
function populateSelect(array, id) {
    var list = document.getElementById(id);
    /*var list = $("#"+id);*/

    var options = "";
    for (var i = 0; i < array.length; ++i) {
        options += "<option>" + array[i] + "</option>";
    }
    list.innerHTML = options;
}

function populateFields() {
    setDate();
    setLocation();

    var array = [];
    array.push('');
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
    arraySVF.push('');
    arraySVF.push('var.');
    arraySVF.push('ssp.');
    arraySVF.push('f.');

    populateSelect(arraySVF, 'listSVF');

    var selectsArray = [];
    selectsArray.push('listPhylum');
    selectsArray.push('listModulation');
    selectsArray.push('listRH');
    selectsArray.push('listSubstrate');
    selectsArray.push('listHost');
    selectsArray.push('listHostState');
    selectsArray.push('listLegNumber');
    selectsArray.push('listLegatees');
    selectsArray.push('listDetNb');
    selectsArray.push('listDet');

    selectsArray.forEach(function(select) {
        populateSelect(array, select);
    });

    var inputsArray = [];
    inputsArray.push('dataGenre');
    inputsArray.push('dataSpecies');
    inputsArray.push('dataEpithete');
    inputsArray.push('dataAuthor');
    inputsArray.push('dataHC');

    inputsArray.forEach(function(input) {
        populateInput(array, input);
    });

    setAuthor();

}

//Remplit le champ date
function setDate() {
    $("#date").text(new Date().toLocaleString());
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