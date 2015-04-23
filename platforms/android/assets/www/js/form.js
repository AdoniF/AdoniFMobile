var rangArray = ["var.", "f.", "subsp."];
var modulationArray = ["aff.", "(cf.)", "ad int.", "sp.", "ss.lat", "ss.str", "(gr.)", "?"];
var etatHoteArray = ["vivant", "moribond", "mort"];

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

    if (content)
        list.val(content);
    if (array.indexOf(content) < 0)
        options += "<option value='" + content + "'/>";
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
    if (data && data.date.length > 0) {
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
function setUserFields() {
    $("#listLegNumber").val(1);
    $("#listLegatees").val(user.prenom + " " + user.nom);
    $("#listDetNb").val(1);
    $("#listDet").val(user.prenom + " " + user.nom);
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
        alert("pictures" + pictures[i].src);
        picturesSources.push(pictures[i].src);
    }
    recolt.pictures = picturesSources;
}

// DEPRECATED ??
function openRecolt(data) {
    recolt = new Recolte(data.phylum, data.modulation, data.substrat, data.rang, data.substrat, data.hote, data.etatHote,
        data.legataires, data.determinateurs, data.genre, data.epithete, data.taxon, data.author, data.quantity, data.range,
        data.habitat, data.nbLegataires, data.nbDet, data.longitude, data.latitude, data.accuracy, data.date, data.pictures);
}

function populateFields() {
    var recolt = new Recolte();
    populateFieldsFromRecolt(recolt);
}

function populateFieldsFromRecolt(recolt) {
    var array = ["toto1561611", "toto 2", "toto 3", "titi 1 ", "titi 42", "42", "6", user.login];

    setLocationAndDate(recolt);

    populateSelect('listSVF', rangArray, recolt.rang);
    populateSelect("listPhylum", phylumsArray, recolt.phylum);
    populateSelect("listModulation", modulationArray, recolt.modulation);
    populateSelect("listHostState", etatHoteArray, recolt.etatHote);

    populateInput("listLegNumber", [], recolt.nbLegataires);
    populateInput("listDetNb", [], recolt.nbDet);
    populateInput("dataHC", [], recolt.habitat);
    populateInput("range", [], recolt.range);
    populateInput("nbFound", [], recolt.quantity);
    populateInput("dataGenre", [], recolt.genre);
    populateInput("dataSpecies", [], recolt.epithete);
    populateInput("dataTaxon", [], recolt.taxon);
    populateInput("listHost", [], recolt.hote);

    setUserFields();
    updateFields(0);
    getSubstrats(recolt.substrat);

    loadPictures(recolt);
}

function loadPictures(recolt) {
    var pictures = recolt.pictures;
    if (pictures) {
        for (var i; i < pictures.length; ++i) {
            addPicture(pictures[i]);
        }
    }
}

function updateFields(rank) {
    var phylum = $("#listPhylum option:selected").text();
    var genre = $("#dataGenre").val();
    var epithete = $("#dataSpecies").val();
    var rang = $("#listSVF option:selected").text();
    var taxon = $("#dataTaxon").val();
    var auteur = $("#dataAuthor").val();

    if (rank < 1)
        getPossibleGenres(phylum, genre);
    if (rank < 2)
        getPossibleEpithetes(phylum, genre, epithete);
    if (rank < 3)
        getPossibleTaxons(phylum, genre, epithete, rang, taxon);
    if (rank < 4)
        getPossibleAuteurs(phylum, genre, epithete, rang, taxon, auteur);
}

function Recolte(phylum, modulation, substrat, rang, hote, etatHote, legataires, determinateurs,
    genre, epithete, taxon, author, quantity, range, habitat, nbLegataires, nbDet, longitude, latitude, accuracy,
    date, pictures) {
    this.phylum = phylum || "";
    this.modulation = modulation || "";
    this.substrat = substrat || "";
    this.rang = rang || "";
    this.hote = hote || "";
    this.etatHote = etatHote || "";
    this.legataires = legataires || "";
    this.determinateurs = determinateurs || "";
    this.genre = genre || "";
    this.epithete = epithete || "";
    this.taxon = taxon || "";
    this.author = author || "";
    this.quantity = quantity || "";
    this.range = range || "";
    this.habitat = habitat || "";
    this.nbLegataires = nbLegataires || "";
    this.nbDet = nbDet || "";
    this.longitude = longitude || "";
    this.latitude = latitude || "";
    this.accuracy = accuracy || "";
    this.date = date || "";
    this.pictures = pictures || "";
}