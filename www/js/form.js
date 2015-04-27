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
function populateInput(id, options, content) {
    var list = document.getElementById(id);

    if (content) {
        list.value = content;
        if (options.indexOf(content) < 0)
            options += "<option value='" + content + "'/>";
    }

    var data = document.getElementById("list" + id);
    data.innerHTML = options;
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
    dom.date.text("Date : " + recolt.date);
}

//Remplit les champs de position
function setLocationAndDate(data) {
    if (data && data.date && data.date.length > 0) {
        setDate(data.date);
        setLocationFields(data.longitude, data.latitude, data.accuracy + " mètres");
    } else {
        calculatePosition();
        setDate();
    }
}

function setLocationFields(longitude, latitude, accuracy) {
    dom.longitude.text("Longitude : " + longitude);
    dom.latitude.text("Latitude : " + latitude);
    dom.accuracy.text("Précision : " + accuracy);
}

//Remplit par défaut le champ de nombre de légataires et son nom
function setUserFields() {
    dom.legNumber.val(1);
    dom.legs.val(user.prenom + " " + user.nom);
    dom.detNumber.val(1);
    dom.dets.val(user.prenom + " " + user.nom);
}

//Génère un formulaire vide pour une nouvelle récolte
function generateNewForm(imageSrc) {
    populateFields();
    if (imageSrc)
        addPicture(imageSrc);
}

// Génère un formulaire depuis une récolte déjà entamée
function populateFormFromGathering(gathering, id) {
    recoltID = id;
    recolt = gathering;
    populateFieldsFromRecolt(recolt);
}

//Sauve les images courantes
function savePictures() {
    var pictures = $("#picturesDiv img").map(function () {
        return this;
    });

    recolt.pictures = [];
    for (var i = 0; i < pictures.length; ++i) {
        recolt.pictures.push(pictures[i].src);
    }
}

function populateFields() {
    var recolt = new Recolte();
    populateFieldsFromRecolt(recolt);
}

//Récupère les valeurs des champs pour les stocker dans la récolte actuelle
function saveRecolt() {
    recolt.phylum = $("#listPhylum option:selected").text();
    recolt.modulation = $("#listModulation option:selected").text();
    recolt.substrat = $("#listSubstrate option:selected").text();
    recolt.rang = $("#listSVF option:selected").text();
    recolt.hote = $("#listHost option:selected").text();
    recolt.etatHote = $("#listHostState option:selected").text();
    recolt.legataires = $("#listLegatees option:selected").text();
    recolt.determinateurs = $("#listDet option:selected").text();

    recolt.genre = dom.genre.val();
    recolt.epithete = dom.epithete.val();
    recolt.taxon = dom.taxon.val();
    recolt.author = dom.author.val();
    recolt.quantity = dom.quantity.val();
    recolt.range = dom.range.val();
    recolt.habitat = dom.hostData.val();
    recolt.nbLegataires = dom.legNumber.val();
    recolt.nbDet = dom.detNumber.val();

    savePictures();
    if (recoltID) {
        updateGathering(recolt, recoltID);
    } else {
        addGathering(recolt);
    }
    recoltID = null;
}

function populateFieldsFromRecolt(recolt) {
    setLocationAndDate(recolt);

    populateSelect('listSVF', rangArray, recolt.rang);
    populateSelect("listPhylum", phylumsArray, recolt.phylum);
    populateSelect("listModulation", modulationArray, recolt.modulation);
    populateSelect("listHostState", etatHoteArray, recolt.etatHote);
    $("#listHost").val(recolt.hote);

    dom.legNumber.val(recolt.nbLegataires);
    dom.detNumber.val(recolt.nbDet);
    dom.hostData.val(recolt.habitat);
    dom.range.val(recolt.range);
    dom.quantity.val(recolt.quantity);
    dom.genre.val(recolt.genre);
    dom.epithete.val(recolt.epithete);
    dom.taxon.val(recolt.taxon);
    dom.author.val(recolt.author);

    setUserFields();
    updateFields(0);
    getSubstrats(recolt.substrat);

    loadPictures(recolt);
}

function loadPictures(recolt) {
    var pictures = recolt.pictures;
    if (pictures) {
        var pictureRows = "";
        for (var i = 0; i < pictures.length; i++) {
            pictureRows += getPictureRow(pictures[i]);
        }
        document.getElementById("picturesDiv").innerHTML = pictureRows;
    }
}

function updateFields(rank) {
    var phylum = $("#listPhylum option:selected").text();
    var genre = dom.genre.val();
    var epithete = dom.epithete.val();
    var rang = $("#listSVF option:selected").text();
    var taxon = dom.taxon.val();
    var auteur = dom.author.val();

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