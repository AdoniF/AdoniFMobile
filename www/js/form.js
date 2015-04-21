var rangArray = ["var.", "f.", "subsp."];
var recolt = {};
var recoltID = null;

/*
Fonction permettant de remplir les suggestions de l'input dont l'id
est passé en paramètre
@param array: suggestions possibles
@param id : id de l'input auquel on ajoute les suggestions
*/
function populateInput(id, array, content) {
    var list = $("#" + id);
    var options = "";

    var idx = array.indexOf(content);
    if (idx != -1)
        array.splice(idx, 1);

    list.val(content);
    //options += "<option value='" + content + "'/>";
    for (var i = 0; i < array.length; i++) {
        options += "<option value='" + array[i] + "'/>";
    }

    var data = $("#list" + id);
    data.empty();
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

    var idx = array.indexOf(selected);
    if (idx != -1)
        array.splice(idx, 1);

    list.empty();
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
    setLocationAndDate();

    array.push('toto 1iubhigbugvugfvuyvuvu');
    array.push('toto 2');
    array.push('toto 3');
    array.push('titi 1');
    array.push('titi 2');
    array.push('titi 3');
    array.push('42');
    array.push('1');
    array.push(user.login);

    populateFieldsFromDB();

    populateSelect('listSVF', rangArray, "");
    populateSelect("listPhylum", phylumsArray, "");
    populateSelect("listModulation", array, "");
    populateSelect("listSubstrate", array, "");
    populateSelect("listHost", array, "");
    populateSelect("listHostState", array, "");
    populateSelect("listDet", array, "");
    populateSelect("listLegatees", array, "");
    
    populateInput("listLegNumber", array, "");
    populateInput("listDetNb", array, "");
    //populateInput("dataGenre", array, "Genre");
    populateInput("dataSpecies", array, "");
    populateInput("dataTaxon", array, "");
    populateInput("range", array, "");
    populateInput("dataAuthor", array, "");
    populateInput("nbFound", array, "");
    populateInput("dataHC", [], "");

    setAuthor();
}

function populateFieldsFromDB() {
    getPossibleGenres("", "Genre");
}

//Remplit le champ date
function setDate(date) {
    var d;
    if (date) {
        d = date
    } else {
        d = new Date().toLocaleString();
        recolt.date = d;
    }
    $("#date").text("Date : " + recolt.date);
}

//Remplit les champs de position
function setLocationAndDate(data) {
    if (data) {
        setDate(data.date);
        setLocationFields(data.longitude, data.latitude, data.accuracy + " mètres");
    } else {
        calculatePosition();
        setDate();
    }
}

function setLocationFields(longitude, latitude, accuracy) {
    $("#longitude").text("Longitude : " + longitude);
    $("#latitude").text("Latitude : " + latitude);
    $("#accuracy").text("Précision : " + accuracy);
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
function populateFormFromGathering(gathering, id) {
    //TODO : Charger depuis la BDD la recolte plutôt qu'un nouveau formulaire
    recoltID = id;
    recolt = gathering;
    populateFieldsFromRecolt(recolt);
}

//Récupère les valeurs des champs pour les stocker dans la récolte actuelle
function saveRecolt() {
    try {
        recolt.phylum = $("#listPhylum option:selected").text();
        recolt.modulation = $("#listModulation option:selected").text();
        recolt.substrat = $("#listSubstrate option:selected").text();
        recolt.rang = $("#listSVF option:selected").text();
        recolt.substrat = $("#listSubstrate option:selected").text();
        recolt.hote = $("#listHost option:selected").text();
        recolt.etatHote = $("#listHostState option:selected").text();
        recolt.legataires = $("#listLegatees option:selected").text();
        recolt.determinateurs = $("#listDet option:selected").text();

        recolt.genre = $("#dataGenre").val();
        recolt.epithete = $("#dataSpecies").val();
        recolt.taxon = $("#dataTaxon").val();
        recolt.author = $("#dataAuthor").val();
        recolt.quantity = $("#nbFound").val();
        recolt.range = $("#range").val();
        recolt.habitat = $("#dataHC").val();
        recolt.nbLegataires = $("#listLegNumber").val();
        recolt.nbDet = $("#listDetNb").val();

        savePictures();
        if (recoltID) {
            updateGathering(recolt, recoltID);
        } else {
            addGathering(recolt);
        }
        recoltID = null;
    } catch (err) {
        alert("error : " + err.message);
    }
}

//Sauve les images courantes
function savePictures() {
    var pictures = $("#picturesDiv img").map(function () {
        return this;
    });

    var picturesSources = [];
    for (var i = 0; i < pictures.length; ++i) {
        picturesSources.push(pictures[i].src);
    }
    recolt.pictures = picturesSources;
}

//Remplit la récolte et le formulaire avec la récolte data passée en paramètre
function openRecolt(data) {
    recolt.phylum = data.phylum;
    recolt.modulation = data.modulation;
    recolt.substrat = data.substrat;
    recolt.rang = data.rang;
    recolt.substrat = data.substrat;
    recolt.hote = data.hote;
    recolt.etatHote = data.etatHote;
    recolt.legataires = data.legataires;
    recolt.determinateurs = data.determinateurs;
    recolt.genre = data.genre;
    recolt.epithete = data.epithete;
    recolt.taxon = data.taxon;
    recolt.author = data.author;
    recolt.quantity = data.quantity;
    recolt.range = data.range;
    recolt.habitat = data.habitat;
    recolt.range = data.range;
    recolt.nbLegataires = data.nbLegataires;
    recolt.nbDet = data.nbDet;
    recolt.longitude = data.longitude;
    recolt.latitude = data.latitude;
    recolt.accuracy = data.accuracy;
    recolt.date = data.date;
    recolt.pictures = data.pictures;
}

function populateFieldsFromRecolt(recolt) {
    var array = [];

    setLocationAndDate(recolt);

    array.push('toto 1iubhigbugvugfvuyvuvu');
    array.push('toto 2');
    array.push('toto 3');
    array.push('titi 1');
    array.push('titi 2');
    array.push('titi 3');
    array.push('42');
    array.push('1');
    array.push(user.login);

    populateFieldsFromDBRecolt();
    populateSelect('listSVF', rangArray, recolt.rang);
    populateSelect("listPhylum", phylumsArray, recolt.phylum);
    populateSelect("listModulation", array, recolt.modulation);
    populateSelect("listSubstrate", array, recolt.substrat);
    populateSelect("listHost", array, recolt.hote);
    populateSelect("listHostState", array, recolt.etatHote);
    populateSelect("listDet", array, recolt.determinateurs);
    populateSelect("listLegatees", array, recolt.legataires);
    
    populateInput("listLegNumber", array, recolt.nbLegataires);
    populateInput("listDetNb", array, recolt.nbDet);
    //populateInput("dataGenre", array, recolt.genre);
    //populateInput("dataSpecies", array, recolt.epithete);
    populateInput("dataTaxon", array, recolt.taxon);
    populateInput("dataHC", [], recolt.habitat);
    populateInput("range", array, recolt.range);
    populateInput("dataAuthor", array, recolt.author);
    populateInput("nbFound", array, recolt.quantity);

    loadPictures();
}
function populateFieldsFromDBRecolt() {
    updateFields(0);
}

function loadPictures() {
    var pictures = recolt.pictures;
    if (pictures) {
        for (var i; i < pictures.length; ++i) {
            addPicture(pictures[i]);
        }
    }
}

function updateFields(rank) {
    var phylum, genre, epithete;

    if (rank < 2) {
        phylum = $("#listPhylum option:selected").text();
        genre = $("#dataGenre").val();
        epithete = $("#dataSpecies").val();

        getPossibleEpithetes(phylum, genre, epithete);
    }
    if (rank < 1)
        getPossibleGenres(phylum, genre);
}