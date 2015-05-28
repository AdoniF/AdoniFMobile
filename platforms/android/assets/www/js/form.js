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
    try {
        var list = document.getElementById(id);

        if (content) {
            list.value = content;
            if (!options.contains(content))
                options.push(content);
        }

        var autoComplete = inputCompletions[id];
        autoComplete.list = options;
        autoComplete.evaluate();
    } catch (err) {
        alert(err.message);
    }
}

/*
Fonction permettant de remplir les propositions du select dont 
l'id est passé en paramètre
@param array : propositions possibles
@param id : id du select auquel on ajoute les propositions
*/
function populateSelect(id, array, selected) {
    var list = $("#" + id);

    /*var idx = array.indexOf(selected);
    if (idx != -1)
        array.splice(idx, 1);*/

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
    if (!date) {
        var d = new Date();
        var dateFormat = d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate();
        recolt.date = dateFormat;
    }
    dom.date.text("Date : " + recolt.date);
}

//Remplit les champs de position
function setLocationAndDate(data) {
    if (data && !data.date.isEmpty()) {
        setDate(data.date);
        setLocationFields(data.longitude, data.latitude, data.accuracy + " mètres", data.altitude + " mètres");
    } else {
        updatePosition();
        setDate();
    }
}

function setLocationFields(longitude, latitude, accuracy, altitude) {
    dom.longitude.text("Longitude : " + longitude);
    dom.latitude.text("Latitude : " + latitude);
    dom.accuracy.text("Précision : " + accuracy);
    dom.altitude.text("Altitude : " + altitude);
}

//Remplit par défaut le champ de nombre de légataires et son nom
function setUserFields(recolt) {
    var username = user.prenom + " " + user.nom;
    var legs = recolt.legataires.isEmpty() ? username : decodeURIComponent(recolt.legataires),
    dets = recolt.determinateurs.isEmpty() ? username : decodeURIComponent(recolt.determinateurs),
    nbLegs = recolt.nbLegataires.isEmpty() ? 1 : decodeURIComponent(recolt.nbLegataires),
    nbDets = recolt.nbDet.isEmpty() ? 1 : decodeURIComponent(recolt.nbDet);

    dom.legNumber.val(nbLegs);
    dom.detNumber.val(nbDets);
    dom.legs.val(legs);
    dom.dets.val(dets);
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

    recolt.legataires = encodeURIComponent(dom.legs.val());
    recolt.determinateurs = encodeURIComponent(dom.dets.val());
    recolt.genre = encodeURIComponent(dom.genre.val());
    recolt.epithete = encodeURIComponent(dom.epithete.val());
    recolt.taxon = encodeURIComponent(dom.taxon.val());
    recolt.author = encodeURIComponent(dom.author.val());
    recolt.quantity = encodeURIComponent(dom.quantity.val());
    recolt.range = encodeURIComponent(dom.range.val());
    recolt.habitat = encodeURIComponent(dom.hostData.val());
    recolt.nbLegataires = encodeURIComponent(dom.legNumber.val());
    recolt.nbDet = encodeURIComponent(dom.detNumber.val());

    recolt.pictures = pictures;

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

    dom.hostData.val(decodeURIComponent(recolt.habitat));
    dom.range.val(decodeURIComponent(recolt.range));
    dom.quantity.val(decodeURIComponent(recolt.quantity));
    dom.genre.val(decodeURIComponent(recolt.genre));
    dom.epithete.val(decodeURIComponent(recolt.epithete));
    dom.taxon.val(decodeURIComponent(recolt.taxon));
    dom.author.val(decodeURIComponent(recolt.author));

    setUserFields(recolt);
    updateFields(0);
    getSubstrats(recolt.substrat);
    getHotes(recolt.hote);

    loadPictures(recolt);

    checkPhylumValidity();
}

function checkPhylumValidity() {
    var phylumDiv = $("#phylumDiv");
    phylumDiv.removeClass("has-error has-warning has-success");

    if (phylumIsChosen())
        phylumDiv.addClass("has-success");
    else
        phylumDiv.addClass("has-error");
}

function loadPictures(recolt) {
    if (!recolt.pictures.isEmpty()) {
        pictures = recolt.pictures;
        showPicturesTab();
       // document.getElementById("picturesDiv").innerHTML = pictureRows;
   }
        //document.getElementById("picturesDiv").innerHTML = "";
    }

    function updateFields(rank) {
        var phylum = $("#listPhylum option:selected").text();
        var genre = dom.genre.val();
        var epithete = dom.epithete.val();
        var rang = $("#listSVF option:selected").text();
        var taxon = dom.taxon.val();
        var auteur = dom.author.val();

        if (phylum.isEmpty())
            return;
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
        date, pictures, altitude) {
        this.phylum = phylum || "",
        this.modulation = modulation || "",
        this.substrat = substrat || "",
        this.rang = rang || "",
        this.hote = hote || "",
        this.etatHote = etatHote || "",
        this.legataires = legataires || "",
        this.determinateurs = determinateurs || "",
        this.genre = genre || "",
        this.epithete = epithete || "",
        this.taxon = taxon || "",
        this.author = author || "",
        this.quantity = quantity || "",
        this.range = range || "",
        this.habitat = habitat || "",
        this.nbLegataires = nbLegataires || "",
        this.nbDet = nbDet || "",
        this.longitude = longitude || "",
        this.latitude = latitude || "",
        this.accuracy = accuracy || "",
        this.date = date || "",
        this.pictures = pictures || [],
        this.altitude = altitude || ""
    }

    function phylumIsChosen() {
        return !$("#listPhylum option:selected").text().isEmpty();
    }