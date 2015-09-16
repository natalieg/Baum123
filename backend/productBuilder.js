/**
 * Created by peukert on 02.09.15.
 */

var filter = /^.*/;


/* Funktion, die die meistverkauften Produkte auf der Oberfläche ausgibt, die aktuell noch vorrätig sind.
*/
var ShowBestSales = function() {
    DB.Product.find()
        .isNotNull('bild')
        .greaterThan("stueckzahl", 0)
        .descending("gesamtverkauf").limit(4)
        .resultList(function (result)
        {
                printItemsBig(result)
        });
};

/*Diese Funktion laedt mithilfe der Produkt-ID eine Ware aus der Datenbank und
*uebergibt diese dann der Funktion printSingleProduct, die die Anzeige des
*Produktes uebernimmt.
*
* @Param: pid Die ID des Produkts.
*/
var loadSingleProduct = function (pid)
{
    DB.Product.load(pid).then(function (product)
    {
            printSingleProduct(product);

    });
};


/* Funktion, die die Filtervariable neu setzt.
*
* @Param newFilter: Neuer Regex, der als Filter für die Suche eingesetzt werden soll.
* */
var setFilter = function(newFilter)
{
    filter = newFilter;
};


/* Funktion, welche eine Suche in der Datenbank nach einem Produkt einleitet. Konkret wird
*  nach den einem Produkt zugefügten Tags gesucht, nach einer eingestellten Kategorie
*  gefiltert und die Ergebnismenge nach dem aktiven Sortierverfahren geordnet. Weitere
*  Informationen über die Funktionsweise sind bitte den Kommentaren im Quelltext zu
*  entnehmen.
*/
var searchBarAction = function() {
    //Der Eintrag der Suchleiste wird in Kleinbuchstaben ermittelt und aus ihm ein
    //Regex für den Abgleich mit den Produkt-Tags gebildet.
    var input = document.getElementById('searchbar').value.toLowerCase();
    var inputReg = new RegExp("^.*" + input);

    //Aus der Optionsauswahl für die Sortierung wird ein aussagekraeftier String entnommen, mit
    //dem das Sortierverfahren später eingeleitet werden soll.
    var sort = document.getElementById('sortOption').value;

    // Aufruf der Methode, die gemäß des Sortierverfahrens den Suchbefehl an Baqend richtet.
    sortSwitch(sort, inputReg);

    //Aufruf der Methode, die die URL anpasst.
    urlRefresh(input);
};


/* Funktion, welche mithilfe eines angegebenen Sortierverfahrens den Aufruf auswählt, der
* an Baqend gerichtet werden soll.
*
* @Param: sort Ein String, der für das entsprechende Sortierverfahren steht.
* @Param: inputReg Die Eingabe im Suchfeld als Regex.
*/
var sortSwitch = function(sort, inputReg)
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
};


/* Funktion, die eine Suchanfrage an die Datenbank richtet, wenn das Ergebnis aufsteigend nach einer Kategorie
* sortiert werden soll.(Aktuell existiert nur eine, aber Ergänzungen könnten so leicht abgehandelt werden).
*
* @Param: filterRegex Nur aus der Kategorie, die mit diesem Regex beschrieben wurde, sollen Ergebnisse
*         ausgegeben werden
* @Param: inputRegex Aus der Sucheingabe gebildeter Regex, mit dem die Tags der Produkte abgeglichen werden.
* @Param: sortParam Angabe des Spaltennamens, nachdem die Einträge der Datenbank aufsteigend sortiert werden
*         sollen.
*/
var ascSearch = function(filterRegex, inputRegex, sortParam)
{
    DB.Product.find()
        .matches('liste', filterRegex)
        .matches('tags', inputRegex)
        .isNotNull('bild')
        .ascending(sortParam)
        .resultList(function (result) {
            printItemsSmall(result);
        });
};


/* Funktion, die eine Suchanfrage an die Datenbank richtet, wenn das Ergebnis nach den Feedbacks
 * sortiert werden soll.
 *
 * @Param: filterRegex Nur aus der Kategorie, die mit diesem Regex beschrieben wurde, sollen Ergebnisse
 *         ausgegeben werden
 * @Param: inputRegex Aus der Sucheingabe gebildeter Regex, mit dem die Tags der Produkte abgeglichen werden.
 */
var feedbackSearch = function(filterRegex,inputRegex)
{
    DB.Product.find().matches('liste', filterRegex).matches('tags', inputRegex)
        .isNotNull('bild').resultList(function(result)
        {
            //Liste der Produkte wird nach den Bewertungen sortiert und angezeigt.
            result.sort(sortBew);
            printItemsSmall(result);
        });
};

/* Vergleichsfunktion, die dazu genutzt werden kann, zu ermitteln, welches Produkt
* besser bewertet wurde als das andere.
*
* @Param: prodA Produkt Nummer 1
* @Param: prodB Produkt Nummer 2
*/
var sortBew = function(prodA,prodB)
{
    // Diese Funktion ermittelt die Durchschnittsbewertung eines Produkts.
    function bewfinder(product)
    {
        // Ist die Feedbackliste leer, wird das Produkt vorerst mit 0 Sternen bewertet.
        if(product.Feedbacks.size == 0)
        {
            return 0;
        }
        else
        //Andernfalls wird die Liste mittels reduce auf die Summe aller Bewertungen reduziert
        // und anschließend durch ihre Anzahl geteilt.
        {
            return product.Feedbacks.reduce(function (bewsum, feedback)
                {
                    return bewsum + feedback.Bewertung;
                }, 0) / product.Feedbacks.size;
        }
    }
    return bewfinder(prodB) - bewfinder(prodA);
};


/* Funktion, die eine Suchanfrage an die Datenbank richtet, wenn das Ergebnis absteigend nach einer Kategorie
 * sortiert werden soll.(Aktuell existiert nur einer, aber Ergänzungen könnten so leicht abgehandelt werden).
 *
 * @Param: filterRegex Nur aus der Kategorie, die mit diesem Regex beschrieben wurde, sollen Ergebnisse
 *         ausgegeben werden
 * @Param: inputRegex Aus der Sucheingabe gebildeter Regex, mit dem die Tags der Produkte abgeglichen werden.
 * @Param: sortParam Angabe des Spaltennamens, nachdem die Einträge der Datenbank absteigend sortiert werden
 *         sollen.
 */
var descSearch = function(filterRegex, inputRegex, sortParam)
{
    DB.ready(function () {
        DB.Product.find()
            .matches('liste', filterRegex)
            .matches('tags', inputRegex)
            .isNotNull('bild')
            .descending(sortParam)
            .resultList(function (result) {
                printItemsSmall(result);
            })
    });
};

/*Funktion, die mithilfe der Eingabe in die Suchleiste und dem vorliegenden Filter
* die URL in der Adressleiste entsprechend anpasst und einen Eintrag in die Browserhistory
* einfuegt, bzw., wenn schon vorhanden, erneuert.
*
* @Param searchInput Die aus der Suchleiste ausgelesene Eingabe des Benutzers
*/
var urlRefresh = function(searchInput)
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
    //Werten von Suchbegriff, Filter und Sortierung überschrieben. Wenn nicht, wird ein
    // solcher Eintrag angelegt.
    var orderString = document.getElementById("sortOption").value;
    var urlString = "?s=" + searchInput + "&f=" + filterString + "&o=" + orderString;
    var popString = "Search for " + searchInput;

    if (window.location.href.match(/^.*\?s=.*&f=.*&o=.*/))
    {
        window.history.replaceState({info: popString}, null, urlString);
    }
    else
    {
        window.history.pushState({info: popString}, null, urlString);
    }
};

/*Diese Funktion bekommt eine Reihe von Produkten uebergeben und bildet mithilfe dieser Daten
* Zusaetze fuer die HTML aus, mit denen die Produkte dann auf der Hauptseite dargestellt werden.
* Im Speziellen werden hier die Verkaufsschlager der Landingpage angezeigt.
*
* @Param: products Eine Liste an Produkten, die ausgegeben werden soll
*/
var printItemsBig = function(products)
{
    products.forEach(function (product)
    {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $("#topProducts").append("<div id=\"" + product.id + "\" class=\"productLink productRow col-md-3\">" +
            "<a class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-3\"><div class=\"productName\">" + name + " </div></div>" +
            "</div></div>");
    });
    clickAction();
};


/*Diese Funktion bekommt eine Reihe von Produkten uebergeben und bildet mithilfe dieser Daten
* Zusaetze fuer die HTML aus, mit denen die Produkte dann auf der Hauptseite dargestellt werden.
* Im Speziellen werden hier die Ergebnisse einer Suchanfrage angezeigt.
*
* @Param: products Eine Liste an Produkten, die ausgegeben werden soll
*/
var printItemsSmall = function(products)
{
    products.forEach(function (product)
    {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $("#moreTopProducts").append("<div id=\"" + product.id + "\" class=\"productLink productRow col-md-2\">" +
            "<a><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-2\"><div class=\"productNameSmall\">" + name + "<br><p>"
            + " EUR " + product.preis + "</p></div>" +
            "</div></div>");
    });
    clickAction();
};

/*Diese Funktion bekommt ein Produkt uebergeben und gibt dieses dann auf der Weboberflaeche aus.
* Es werden Zusaetze fuer die HTML gebildet, die die Darstellung der Bewertungssterne, die Anzeige
* des Produktbildes und die Ausgabe der Textdaten regeln.
*
* @Param: Das auf der Detailseite auszugebende Produkt.
*/
var printSingleProduct = function (product)
{
    $("#singleProduct").append(

        "<div class=\"col-md-3 singleViewDiv\"><img src=\"" + product.bild + "\"></div>" +
        "<div class=\"col-md-3 singleViewContent\">" +
        "<div class=\"productTD\"><h2>" + product.name + " </h2></div>" +
        "<div class=\"productTD\"><h6 class=\"preis\">" + product.preis + "</h6>" +" Euro</div>" +
        "<div class=\"productTD\">nur noch <h6 class=\"stueckZahl\">" + product.stueckzahl + "</h6> vorhanden</div>" +
        "<div class=\"productTD\">Durchschnittliche Produktbewertung: <h6 class=\"productScore\">"  + product.Feedbacks.reduce(function (avg, el)
        {
            return avg + el.Bewertung;
        }, 0) / product.Feedbacks.size + "</h6> Punkte</div>" +
        "<div class=\"productTD rating\">" +
        "<ul class=\"rating\" id=\"rating\">" +
        "<li class=\"star_off\" id=\"star1\"><a title=\"Ich vergebe der Pflanze 1 Punkt\" href=\"?star=1\">Ich vergebe der Pflanze 1 Punkt</a></li>" +
        "<li class=\"star_off\" id=\"star2\"><a title=\"Ich vergebe der Pflanze 2 Punkte\" href=\"?star=2\">Ich vergebe der Pflanze 2 Punkte</a></li>" +
        "<li class=\"star_off\" id=\"star3\"><a title=\"Ich vergebe der Pflanze 3 Punkte\" href=\"?star=3\">Ich vergebe der Pflanze 3 Punkte</a></li>" +
        "<li class=\"star_off\" id=\"star4\"><a title=\"Ich vergebe der Pflanze 4 Punkte\" href=\"?star=4\">Ich vergebe der Pflanze 4 Punkte</a></li>" +
        "<li class=\"star_off\" id=\"star5\"><a title=\"Ich vergebe der Pflanze 5 Punkte\" href=\"?star=5\">Ich vergebe der Pflanze 5 Punkte</a></li></ul></div>" +
        "<div class=\"productDescription productTD\"><p class=\"productDescription\">" + product.beschreibung + "</p></div>" +
        "<br><button type=\"button\" class=\"cartButton\" id=" + product.id + ">Add to Cart</button> " +
        "</div>"
    );
    clickCartBtn();
};


/* Sobald das Laden der Datei abgeschlossen ist, werden die innenstehenden Funktionen aktiv.
*/
$(document).ready(function()
{
    //Sollte die Maus auf die Sternebewertung eines Produktes bewegt werden, so
    //werden die Sterne entsprechend der Position der Maus eingefärbt.
    $('body').on('mouseover', '#rating', function()
    {
        $('.star_off').mouseover(function(){
            $(this).removeClass('star_off').addClass('star_on');
            $(this).prevAll('.star_off').removeClass('star_off').addClass('star_on');
            $(this).nextAll('.star_on').removeClass('star_on').addClass('star_off');
        });
    }).on('click', '#rating', function(e)
    {
        e.preventDefault();
        var $rating = $('#rating');
        console.log($rating.find('.star_on').length);
    });
});

//-----------------------------------Unused Code?--------------------------------------

//Gibt die Bewertung eines Produkts zurück
function getProductScore(products)
{
    products.forEach(function (product)
    {
        return product.id + (product.Feedbacks.reduce(function (avg, el)
            {
                return avg + el.Bewertung;
            }, 0) / product.Feedbacks.size);
    });
}