// Projektuppgift Moa Hjemdahl 2018.

"use strict";

/*  Delar till ej obligatorisk funktionalitet, som kan ge poäng för högre betyg
*   Radera rader för funktioner du vill visa på webbsidan. */
document.getElementById("search").style.display = "none";      // Radera denna rad för att visa sök

/* Här under börjar du skriva din JavaScript-kod */

//Varialer till HTML fil
var infoEl = document.getElementById("info"); //Variabel för info
var logoEl = document.getElementById("logo"); //Variabel för logo
var checkBox = document.getElementById("onlyit"); //Variabel för checkbox
var numRows = document.getElementById("numrows"); //Variabel för antal rader som visas

//Händerlsehanterare
window.addEventListener("load", loadAreaList, false); //Inladdning av fönster
logoEl.addEventListener("click", loadAreaList, false); //Klick på logo


// Funktion anropa AJAX, ladda lista med län
function loadAreaList() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) { //Om filen hittad och allt stämmer
            var areaListObj = JSON.parse(this.response); //Formatera om JSON till JavaScript

            displayAreaList(areaListObj.soklista.sokdata); //Anropa nästa funktion och skicka med specifik data
        }
    };
    xhttp.open('GET', 'http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan', true); //Hämta JSON array
    xhttp.send(); //Skicka JSON array till funktion ovan
}

// Funktion visa lista med län
function displayAreaList(list) {

    var areaNavEl = document.getElementById("mainnavlist"); //Variabel för <ul> block

    for (var i = 0; i < list.length; i++) { //Loopa genom array och skriv ut i <ul> nya <li> emelent, anropa och skicka med id till nästa funktion vid klick
        areaNavEl.innerHTML += "<li onclick='loadAds(" + list[i].id + ")'>" + list[i].namn + "</li>";
    }
    //Utskrift till inforutan
    infoEl.innerHTML = "<p>Välkommen, välj län i menyn till vänster för att se annonser.</p>";
}

//Funktion anropa AJAX, ladda annonser från klickat län
function loadAds(id) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) { //Om filen hittad och allt stämmer
                var adsObj = JSON.parse(this.response); //Formatera om JSON till JavaScript

                displayAds(adsObj.matchningslista); //Anropa nästa funktion och skicka med specifik data
            }
        };
        // Om checkboxen är markerad
        if (checkBox.checked == false) {
        xhttp.open('GET', 'http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=' + id + '&antalrader=' + numRows.value + '', true); //Hämta JSON array
        xhttp.send(); //Skicka JSON array till funktion ovan
        } else {
            xhttp.open('GET', 'http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?lanid=' + id + '&yrkesomradeid=3&antalrader=' + numRows.value + '', true); //Hämta JSON array
            xhttp.send(); //Skicka JSON array till funktion ovan
        }
}

//Funktion visa lista med annonser
function displayAds(obj) {

    infoEl.innerHTML = ""; //Rensa infosida innan nästa läns annonser visas

    for (var i = 0; i < obj.matchningdata.length; i++) { //Loopa genom annonser

        //Variabler för info
        var addHead = obj.matchningdata[i].annonsrubrik;
        var proffession = obj.matchningdata[i].yrkesbenamning;
        var workplace = obj.matchningdata[i].arbetsplatsnamn;
        var commune = obj.matchningdata[i].kommunnamn;
        var sort = obj.matchningdata[i].anstallningstyp;
        var number = obj.matchningdata[i].antalPlatserVisa;
        var firstDate = obj.matchningdata[i].publiceraddatum.substr(0, 10); //Datum och tid sträng utan tid
        var url = obj.matchningdata[i].annonsurl;
        //if sats för vilken info som ska visas då datum finns
        if (obj.matchningdata[i].sista_ansokningsdag != undefined) {
            var endDate = obj.matchningdata[i].sista_ansokningsdag.substr(0, 10)
        }
        else {
            var endDate = "Inget angivet datum";
        }

        //Utskrift av info till sidan
        infoEl.innerHTML += "<article>" +
            "<h3>" + addHead + "</h3>" +
            "<h4>" + proffession + " på " + workplace + " i " + commune + "</h3>" +
            "<p>" +
            "<strong>Anställningstyp: </strong>" + sort +
            "<br>" +
            "<strong>Antal platser: </strong>" + number +
            "<br>" +
            "<strong>Publiceringsdatum: </strong>" + firstDate +
            "<br>" +
            "<strong>Sista ansökningsdag: </strong>" + endDate +
            "<br>" +
            "</p>" +
            "<p>" +
            "<a href='" + url + "' target='_blank' class='btn'>Läs mer</a>" +
            "</p>" +
            "</article>";
    }
    //Utskrift antal annonser som visas av fullt antal
    infoEl.innerHTML += "<p>Visar: " + numRows.value + " av " + obj.antal_platsannonser + "</p>"
}