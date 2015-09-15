/**
 * Created by peukert on 02.09.15.
 */

/* Funktion, die meistverkauften Produkte auf der Oberfläche ausgibt, die aktuell noch vorrätig sind.
* */
function productSelectBestSales(limitNumber, rowID, bigItem) {
    console.log("productSelectBestSales wird aufgerufen. Die meistverkauften Produkte sollen angezeigt werden.");
    DB.Product.find()
        .isNotNull('bild')
        .greaterThan("stueckzahl", 0)
        .descending("gesamtverkauf").limit(limitNumber)
        .resultList(function (result) {
            result.forEach(function (product) {
               console.log("productSelectBest Sales - Folgendes Produkt soll ausgegeben werden:" + JSON.stringify(product));
            });
            if (bigItem === 1) {
                printItemsBig(result, rowID)
            } else {
                printItemsSmall(result, rowID)
            }
        });
}

var loadSingleProduct = function (pid) {
    console.log("loadSingleProduct wird aufgerufen. Anzeige des Produkts und seiner Bewertung soll via ID eingeleitet werden.");
    var idBewertung = {};
    DB.Product.load(pid).then(function (product) {
        console.log("loadSingleProduct - Folgendes Produkt geladen:" + JSON.stringify(product));
            printSingleProduct(product);
        console.log("loadSingleProduct - Folgende Bewertung errechnet:" + idBewertung[getProductScore(product)]);
    });
};



var topSales = function () {
    productSelectBestSales(4, "#topProducts", 1);
};

var allSales = function () {
    productSelectBestSales(100, "#moreTopProducts");
};




var filter = /^.*/;

/* Funktion, die die Filtervariable neu setzt.
*
* @Param newFilter: Neuer Regex, der als Filter für die Suche eingesetzt werden soll.
* */
function setFilter(newFilter)
{
    filter = newFilter;
}


/* Funktion, welche eine Suche in der Datenbank nach einem Produkt einleitet. Konkret wird
*  nach den einem Produkt zugefügten Tags gesucht, nach einer eingestellten Kategorie
*  gefiltert und die Ergebnismenge nach dem aktiven Sortierverfahren geordnet. Weitere
*  Informationen über die Funktionsweise sind bitte den Kommentaren im Quelltext zu
*  entnehmen.
*/
function searchBarAction() {
    //Der Eintrag der Suchleiste wird in Kleinbuchstaben ermittelt und aus ihm ein
    //Regex für den Abgleich mit den Produkt-Tags gebildet.
    var input = document.getElementById('searchbar').value.toLowerCase();
    var inputReg = new RegExp("^.*" + input);

    //Aus der Optionsauswahl für die Sortierung wird ein aussagekraeftier String entnommen, mit
    //dem das Sortierverfahren später eingeleitet werden soll.
    var sort = document.getElementById('sortOption').value;
    console.log("searchBarAction - Input: " + input + " inputReg: " + inputReg + " sort: " + sort);

    // Aufruf der Methode, die gemäß des Sortierverfahrens den Suchbefehl an Baqend richtet.
    sortSwitch(sort, inputReg);

    //Aufruf der Methode, die die URL anpasst.
    urlRefresh(input);
}


/* Funktion, welche mithilfe eines angegebenen Sortierverfahrens den Aufruf auswählt, der
* an Baqend gerichtet werden soll.
*
* @Param: sort Ein String, der für das entsprechende Sortierverfahren steht.
* @Param: inputReg Die Eingabe im Suchfeld als Regex.
*/
function sortSwitch(sort, inputReg)
{
    switch(sort)
    {
        case 'Feedbacks':
            feedbackSearch(filter, inputReg);
            break;

        case 'preis':
            ascSearch(filter, inputReg, sort);
            break;

        default:
            descSearch(filter,inputReg, sort);
    }
}


/* Funktion, die eine Suchanfrage an die Datenbank richtet, wenn das Ergebnis aufsteigend nach einer Kategorie
* sortiert werden soll.(Aktuell existiert nur eine, aber Ergänzungen könnten so leicht abgehandelt werden).
*
* @Param: filterRegex Nur aus der Kategorie, die mit diesem Regex beschrieben wurde, sollen Ergebnisse
*         ausgegeben werden
* @Param: inputRegex Aus der Sucheingabe gebildeter Regex, mit dem die Tags der Produkte abgeglichen werden.
* @Param: sortParam Angabe des Spaltennamens, nachdem die Einträge der Datenbank aufsteigend sortiert werden
 *        sollen.
*/
function ascSearch(filterRegex, inputRegex, sortParam)
{
    console.log("searchBarAction - Suche und Sortierung nach Preis eingeleitet");
    DB.Product.find()
        .matches('liste', filterRegex)
        .matches('tags', inputRegex)
        .isNotNull('bild')
        .ascending(sortParam)
        .resultList(function (result) {
            printItemsSmall(result, "#moreTopProducts");
        });
}


/* Funktion, die eine Suchanfrage an die Datenbank richtet, wenn das Ergebnis nach den Feedbacks
 * sortiert werden soll.
 *
 * @Param: filterRegex Nur aus der Kategorie, die mit diesem Regex beschrieben wurde, sollen Ergebnisse
 *         ausgegeben werden
 * @Param: inputRegex Aus der Sucheingabe gebildeter Regex, mit dem die Tags der Produkte abgeglichen werden.
 */
function feedbackSearch(filterRegex,inputRegex)
{
    console.log("searchBarAction - Suche und Sortierung nach Feedbacks eingeleitet");
    DB.Product.find().matches('liste', filterRegex).matches('tags', inputRegex)
        .isNotNull('bild').resultList(function(result)
        {
            // Definition einer lokalen Vergleichsfunktion für die nachfolgende Sortierung der Liste.
            function sortBew(a,b)
            {
                // Diese Funktion ermittelt die Durchschnittsbewertung eines Produkts.
                function bewfinder(obj)
                {
                    // Ist die Feedbackliste leer, wird das Produkt vorerst mit 0 Sternen bewertet.
                    if(obj.Feedbacks.size == 0)
                    {
                        console.log("Zero");
                        return 0;
                    }
                    else
                    //Andernfalls wird die Liste mittels reduce auf die Summe aller Bewertungen reduziert
                    // und anschließend durch ihre Anzahl geteilt.
                    {
                        console.log("Not Zero");
                        return obj.Feedbacks.reduce(function (bewsum, feedback)
                            {
                                return bewsum + feedback.Bewertung;
                            }, 0) / obj.Feedbacks.size;
                    }
                }
                return bewfinder(b) - bewfinder(a);
            }
            //Liste der Produkte wird nach den Bewertungen sortiert und angezeigt.
            result.sort(sortBew);
            printItemsSmall(result, "#moreTopProducts");
        });
}

/* Funktion, die eine Suchanfrage an die Datenbank richtet, wenn das Ergebnis absteigend nach einer Kategorie
 * sortiert werden soll.(Aktuell existiert nur einer, aber Ergänzungen könnten so leicht abgehandelt werden).
 *
 * @Param: filterRegex Nur aus der Kategorie, die mit diesem Regex beschrieben wurde, sollen Ergebnisse
 *         ausgegeben werden
 * @Param: inputRegex Aus der Sucheingabe gebildeter Regex, mit dem die Tags der Produkte abgeglichen werden.
 * @Param: sortParam Angabe des Spaltennamens, nachdem die Einträge der Datenbank absteigend sortiert werden
 *         sollen.
 */
function descSearch(filterRegex, inputRegex, sortParam)
{
    console.log("searchBarAction - Suche und Sortierung nach " + sortParam + " eingeleitet");
    DB.ready(function () {
        DB.Product.find()
            .matches('liste', filterRegex)
            .matches('tags', inputRegex)
            .isNotNull('bild')
            .descending(sortParam)
            .resultList(function (result) {
                printItemsSmall(result, "#moreTopProducts");
            })
    });
}

function urlRefresh(searchInput)
{
    //Aus dem in der globalen Filtervariable hinterlegten Regex wird ein String gebildet.
    //Sollte es sich um keinen Namen einer Gruppe von Produkten handeln, wird der String
    //vollkommen geleert.
    var filterString = filter.toString().substring(2, filter.toString().length - 1);
    if(filterString.match(/^\.\*/))
    {
        filterString = "";
    }

    //Sollte die URL bereits in für eine Suche angepasst worden sein und die nötigen Parameter
    //enthalten, so wird der aktuelle Eintrag in der Browser-History mit den derzeitigen
    //Werten von Suchbegriff und Filter überschrieben. Wenn nicht, wird ein solcher Eintrag angelegt.
    if (window.location.href.match(/^.*\?s=.*f=.*/))
    {
        var urlString = "?s=" + searchInput + "&f=" + filterString;
        var popString = "Search for " + searchInput;
        window.history.replaceState({info: popString}, null, urlString);
        console.log("searchBarAction - URL modifiziert mit: " + urlString);
    }
    else
    {
        var urlString = "?s=" + searchInput + "&f=" + filterString;
        var popString = "Search for " + searchInput;
        window.history.pushState({info: popString}, null, urlString);
        console.log("searchBarAction - URL modifiziert mit: " + urlString);
    }
}

//Gibt die Top-Sales-Produkte auf der Oberfl�che aus
function printItemsBig(products, rowID) {
    console.log("printItemsBig wird aufgerufen. Zeigt die meistverkauften Produkte an.");
    products.forEach(function (product) {
        console.log("printItemsBig - Folgendes Produkt soll angezeigt werden: " + JSON.stringify(product));
        var name = product.name;
        console.log("printItemsBig - Folgender Name soll angezeigt werden: " + name);
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
            console.log("printItemsBig - Name wird verkürzt auf: " + name);
        }
        $(rowID).append("<div id=\"" + product.id + "\" class=\"productLink productRow col-md-3\">" +
            "<a class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-3\"><div class=\"productName\">" + name + " </div></div>" +
            "</div></div>");
    });
    clickAction();
}


//Zeigt kleine Produkte an.
function printItemsSmall(products, rowID) {
    console.log("printItemsSmall wird aufgerufen. Zeigt Miniaturansichten der Produkte an (Suchergebnisse).");
    products.forEach(function (product) {
        console.log("printItemsSmall - Folgendes Produkt soll angezeigt werden: " + JSON.stringify(product));
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
            console.log("printItemsSmall - Folgender Name soll angezeigt werden: " + name);
        }
        $(rowID).append("<div id=\"" + product.id + "\" class=\"productLink productRow col-md-2\">" +
            "<a><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-2\"><div class=\"productNameSmall\">" + name + "<br><p>"
            + " EUR " + product.preis + "</p></div>" +
            "</div></div>");
    });
    clickAction();
}

var printSingleProduct = function (product) {
    console.log("printSingleProduct wird aufgerufen. Zeigt ein einzelnes Produkt an.");
    $("#singleProduct").append(
        "<ul id=\"rating\">" +
        "<li class=\"star_off\"><a title=\"Ich vergebe der Pflanze 1 Punkt\" href=\"?star=1\">Ich vergebe der Pflanze 1 Punkt</a></li>" +
        "<li class=\"star_off\"><a title=\"Ich vergebe der Pflanze 2 Punkte\" href=\"?star=2\">Ich vergebe der Pflanze 2 Punkte</a></li>" +
        "<li class=\"star_off\"><a title=\"Ich vergebe der Pflanze 3 Punkte\" href=\"?star=3\">Ich vergebe der Pflanze 3 Punkte</a></li>" +
        "<li class=\"star_off\"><a title=\"Ich vergebe der Pflanze 4 Punkte\" href=\"?star=4\">Ich vergebe der Pflanze 4 Punkte</a></li>" +
        "<li class=\"star_off\"><a title=\"Ich vergebe der Pflanze 5 Punkte\" href=\"?star=5\">Ich vergebe der Pflanze 5 Punkte</a></li>" +
        "</ul>" +
        "<div class=\"col-md-3 singleViewDiv\"><img src=\"" + product.bild + "\"></div>" +
        "<div class=\"col-md-3 singleViewContent\">" +
        "<div class=\"productTD\"><h2>" + product.name + " </h2></div>" +
        "<div class=\"productTD\">" + product.preis + " Euro</div>" +
        "<div class=\"productTD\">nur noch <h6 class=\"stueckZahl\">" + product.stueckzahl + "</h6> vorhanden</div>" +
        "<div class=\"productTD\">Durchschnittliche Produktbewertung: <h6 class=\"productScore\">"  + product.Feedbacks.reduce(function (avg, el)
        {
            return avg + el.Bewertung;
        }, 0) / product.Feedbacks.size + "</h6> Punkte</div>" +
        /**"<div class=\"productTD\">" + "<input type =\"range\" class=\"bewslide\" min=0 max=5 step=1 value=3></div>" +**/

        "<div class=\"productDescription productTD\"><p class=\"productDescription\">" + product.beschreibung + "</p></div>" +
            "<br><button type=\"button\" class=\"cartButton\" id=" + product.id + ">Add to Cart</button> " +
        "</div>"
    );
    clickCartBtn();
};


//Gibt die Bewertung eines Produkts zurück
function getProductScore(products)
{
    console.log("getProductScore wird aufgerufen. Gibt die Bewertungen aller Produkte zurueck.");
    products.forEach(function (product)
    {
        return product.id + (product.Feedbacks.reduce(function (avg, el)
        {
            return avg + el.Bewertung;
        }, 0) / product.Feedbacks.size);
    });
}

$(document).ready(function() {
    $('body').on('mouseover', '#rating', function() {

        $('.star_off').mouseover(function(){
            $(this).removeClass('star_off').addClass('star_on');
            $(this).prevAll('.star_off').removeClass('star_off').addClass('star_on');
            $(this).nextAll('.star_on').removeClass('star_on').addClass('star_off');
        });
    }).on('click', '#rating', function(e) {
        e.preventDefault();

        var $rating = $('#rating');

        console.log($rating.find('.star_on').length);
    });

});


//Hier werden die Methoden ausgeführt, sobald die Datenbank bereit ist.
DB.ready(topSales);