/**
 * Created by Nat on 07.09.2015.
 */


/**
 function stopRKey(evt) {
    var evt = (evt) ? evt : ((event) ? event : null);
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if ((evt.keyCode == 13) && (node.type=="text"))  {return false;}
}

 document.onkeypress = stopRKey;
 **/

/* Funktion, die ausgeführt wird, sobald das Skript geladen ist. Sie startet den ersten Aufbau
 *  der Website und initialisiert im Anschluss die grundlegenden Ueberpruefungen, mit denen
 *  die Interaktionen mit der Web-Applikation moeglich gemacht werden.
 *  Weitere Informationen über die zusaetzkichen Funktionsweisen sind bitte den Kommentaren
 *  im Quelltext zu entnehmen.
 *
 */
var main = function ()
{

    //Der Aufbau der Website wird eingeleitet, sobald die Datenbank bereit zum Herausgeben der
    //anzuzeigenden Produkte ist. Dabei wird die URL in der Adressleiste beachtet.
    DB.ready(function()
    {
        createPage()
    });

    //Sobald in der Searchbar ein Tastendruck abgeschlossen wurde, wird die Suchfunktion
    //aufgerufen. Mittels einer If-Abfrage wird verhindert, dass eine solche Suche auch
    //mit den Tasten STRG, ALT, SHIFT, Esc und Enter, sowie den Pfeiltasten ausgeloest werden
    //kann.
    $('.searchbar').on('keyup', function (event)
    {
        if(!(event.ctrlKey || event.altKey || event.shiftKey
            || String.fromCharCode(event.which) == 27 || String.fromCharCode(event.which) == 13
            || String.fromCharCode(event.which) == "%" || String.fromCharCode(event.which) == "&"
            || String.fromCharCode(event.which) == "'" || String.fromCharCode(event.which) == "("))
        {
            startSearch();
        }
    });

    //Sollte die Einstellung der Sortierung verändert werden, so wird die Suche gestartet,
    //bzw. aktualisiert.
    $('.sortBox').change(function () {
        startSearch();
    });

    //Eine Aenderung der Filter bewirkt ebenso ein Ausloesen der Suchfunktion und
    //aktualisiert den global hinterlegten Filter-Regex. Wird eine Kategorie gewaehlt,
    //die bereits aktiv ist, so wird ihr der Aktiv-Zustand entzogen und der Regex
    //so veraendert, dass er alle Ausdruecke akzeptiert. Wird hingegen eine nicht
    //aktive Kategorie gewaehlt, so werden alle anderen aktiven Kategorien abgestellt,
    //die soeben gewaehlte in den Aktiv-Zustand versetzt und danach der Regex mit dem
    //Namen der Kategorie erneuert.
    $('.kategorie').click(function ()
    {
        var filter;
        if($(this).hasClass('active'))
        {
            $(this).removeClass("active");
            filter = new RegExp("^.*");
        }
        else
        {
            $('.kategorie').removeClass("active");
            $(this).addClass("active");
            filter = new RegExp("^"+this.id);
        }
        setFilter(filter);
        startSearch();
    });

    //Ein Klick auf das Logo der Seite schickt den Anwender zurueck zum Startbildschirm.
    //Sollte noch kein Eintrag in der Browser-Historie vorhanden sein, so wird einer
    //angelegt, damit zu der Seite vor und zurueckgesprungen werden kann.
    $('#welcome').click(function ()
    {
        showMainPageOnly();
        if (window.location.href.match(/^.*\?main/))
        {
            window.history.replaceState({info: "Mainpage"}, null, "?main");
        }
        else
        {
            window.history.pushState({info: "Mainpage"}, null, "?main");
        }
    });

    // Ein Klick auf den Link "Show me more" leitet eine Suche ohne Begriff ein
    // und listet so die aktuell bestverkauften Produkte auf. Es wird auch ein
    // Eintrag in der Browserhistory angelegt.
    $('.more').click(function ()
    {
        startSearch();
        window.history.pushState({info: "Mainpage"}, null, "?s=&f=");
    });

    // Ein Klick auf das Warenkorbsymbol oeffnet ebenjene Auflistung an zum Kauf
    // vorgemerkten Produkten. Je nachdem, ob das Symbol bei bereits geoeffnetem
    // Warenkorb ausgesteuert wurde, wird ein Eintrag in der Browserhistory angelegt
    // oder erneuert.
    $('.cart').click(function()
    {
        showCartPageOnly();
        if (window.location.href.match(/^.*\?cart/))
        {
            window.history.replaceState({info: "Cart"}, null, "?cart");
        }
        else
        {
            window.history.pushState({info: "Cart"}, null, "?cart");
        }
    });
};

/* Sollte ein Klick auf die Vor-/Zurueck-Buttons im Browser erfolgen, so wird die
 * zu zeigende Seite unter Zuhilfenahme der URL neu erstellt.
 */
window.onpopstate = function ()
{
    DB.ready(function()
    {
        createPage()
    });
};


/* Die Funktion, die den Aufbau der Weboberflaeche einleitet. Sie entnimmt der
 * Adressleiste die URL, ueberprueft diese auf Uebereinstimmungen mit bekannten
 * Mustern und gibt entsprechend des Ergebnisses die Befehle zu Herstellen der
 * Oberflaeche.
 * Weitere Informationen über die zusaetzkichen Funktionsweisen sind bitte den Kommentaren
 * im Quelltext zu entnehmen.
 */
var createPage = function()
{
    var url = window.location.href;

    //An dieser Stelle wird eine Produktseite erstellt.
    if(url.match(/^.*\?p=.*/))
    {
        showSingleProductOnly();
        var pid = url.substring(url.indexOf('=')+1,url.length);
        loadSingleProduct(pid);
    }

    //Hier kommt es zum Aufbau einer Suchansicht.
    else if (url.match(/^.*\?s=.*f=.*o=.*/))
    {
        //Es werden die Eingabe in die Suchleiste und der Filter aus der URL ausgelesen.
        var sfoString = url.substring(url.indexOf('s=')+2,url.length);
        var foString = sfoString.substring(sfoString.indexOf('f=')+2, sfoString.length);
        var oString = foString.substring(foString.indexOf('o=')+2, foString.length);

        //Die Eingabe fuer die Suchleiste wird in selbige eingetragen.
        var searchLength = sfoString.length - ( foString.length + 3);
        var searchString = sfoString.substring(0 , searchLength);
        document.getElementById("searchbar").value = searchString;

        //Der neue Filter wird gesetzt und der Reiter an der Oberflaeche auf aktiv geschaltet.
        var filterLength = foString.length - ( oString.length + 3);
        var filterString = foString.substring(0 , filterLength);

        setFilter(new RegExp("^" + filterString));
        $('.kategorie').each(function()
        {
            if(this.id == filterString)
            {
                $(this).addClass("active");
            }
            else
            {
                $(this).removeClass("active");
            }
        });

        //Die Sortierung wird eingestellt.
        document.getElementById("sortOption").value = oString;

        //Die Ansicht wird fuer die Suche umgestellt und die eigentliche Suche eingeleitet.
        startSearch();
    }

    //Sollte dieser Fall eintreten, wird der Warenkorb angezeigt.
    else if (url.match(/^.*\?cart.*/))
    {
        showCartPageOnly();
    }

    //Sollte keiner der Sonderfaelle zutreffen, wird die Seite automatisch zur
    //Frontpage umgeleitet.
    else
    {
        window.history.replaceState({info: "Mainpage"}, null, "?main");
        showMainPageOnly();
    }
};

/* Der Aufruf dieser Funktion versteckt alle austauschbaren Elemente der Oeberflaeche,
 *  setzt alle Suchspezifika auf den Standartzustand und deckt danach die Elemente fuer
 *  die Einzelansicht eines Produktes auf.
 */
var showSingleProductOnly = function()
{
    hideMainPage();
    hideProductOverview();
    hideCartPage();

    resetInput();

    showSingleProduct();
};

/* Diese Funktion zeigt ein einzelnes Produkt an.
 *  (Der Einzel-Befehl wurde in eine Funktion eingebunden, um spaetere Ergaenzungen zu
 *  erleichtern.)
 */
var showSingleProduct = function()
{
    $('.singleView').html("").show();
};

/* Diese Funktion blendet ein einzelnes Produkt aus.
 *  (Der Einzel-Befehl wurde in eine Funktion eingebunden, um spaetere Ergaenzungen zu
 *  erleichtern.)
 */
var hideSingleProduct = function()
{
    $('.singleView').html("").hide();
};



/* Der Aufruf dieser Funktion versteckt alle austauschbaren Elemente der Oeberflaeche,
 * und deckt danach die Elemente fuer die Auflistung der Suchergebnisse auf.
 */
var showProductOverviewOnly = function()
{
    hideMainPage();
    hideSingleProduct();
    hideCartPage();

    showProductOverview();
};

/* Diese Funktion zeigt die Suchergebnisse an.
 *  (Der Einzel-Befehl wurde in eine Funktion eingebunden, um spaetere Ergaenzungen zu
 *  erleichtern.)
 */
var showProductOverview = function()
{
    $('.moreBestseller').html("").show();
};

/* Diese Funktion blendet die Suchergebnisse aus.
 *  (Der Einzel-Befehl wurde in eine Funktion eingebunden, um spaetere Ergaenzungen zu
 *  erleichtern.)
 */
var hideProductOverview = function()
{
    $(".moreBestseller").html("").hide();
};

/* Der Aufruf dieser Funktion versteckt alle austauschbaren Elemente der Oeberflaeche,
 *  setzt alle Suchspezifika auf den Standartzustand und deckt danach die Elemente fuer
 *  die Landingpage auf.
 */
var showMainPageOnly = function()
{
    hideProductOverview();
    hideSingleProduct();
    hideCartPage();
    resetInput();
    showMainPage();
};

/* Diese Funktion zeigt die Landingpage an. Aus der Datenbank werden die am meisten verkauften
 * Produkte ausgelesen und als Vorschlaege auf der Seite angezeigt.
 */
var showMainPage = function()
{
    $('.bestsellerRow').html("").show();
    $('.bestsellerText').show();
    $('.more').show();
    DB.ready(ShowBestSales());
};

/* Diese Funktion blendet die Landingpage aus.
 */
var hideMainPage = function()
{
    $('.bestsellerRow').html("").hide();
    $('.bestsellerText').hide();
    $('.more').hide();
};

/* Der Aufruf dieser Funktion versteckt alle austauschbaren Elemente der Oeberflaeche,
 *  setzt alle Suchspezifika auf den Standartzustand und deckt danach die Elemente fuer
 *  den Warenkorb auf.
 */
var showCartPageOnly = function()
{
    hideMainPage();
    hideProductOverview();
    hideSingleProduct();

    resetInput();

    showCartPage();

};

/* Diese Funktion zeigt den Warenkorb an.
 */
var showCartPage = function()
{
    $('#cartTop').show();
    $('#cartPage').html("").show();
    $('#fullPrice').html("").show();

    buildCartPage();
    printTotalPrice();
    changeAndCalculateFullPrice();
};

/* Diese Funktion blendet den Warenkorb aus.
 */
var hideCartPage = function()
{
    $('#cartTop').hide();
    $('#cartPage').hide();
    $('#fullPrice').hide();
};

/* Diese Funktion zeigt die Suchansicht an und laesst danach die Suchbar auslesen, um den
 * darin enthaltenen Begriff in der Datenbank zu suchen.
 */
var startSearch = function()
{
    showProductOverviewOnly();
    searchBarAction();
};

/*Diese Funktion setzt die Eingabe der Suchleiste, die eingestellte Sortierung und den aktiven
 * Filter zurueck auf den Anfangszustand.(Kein Suchbegriff, Sortierung nach Verkaufszahlen, kein Filter).
 */
var resetInput = function()
{
    resetSearch();
    resetSort();
    resetFilter();
};

/* Diese Funktion setzt die Sortierung zurueck.
 *  (Der Einzel-Befehl wurde in eine Funktion eingebunden, um spaetere Ergaenzungen zu
 *  erleichtern.)
 */
var resetSort = function()
{
    document.getElementById("sortOption").value = "gesamtverkauf";
};

/* Diese Funktion setzt den eingestellten Filter zurueck.
 */
var resetFilter = function()
{
    $('.kategorie').each(function()
    {
        $(this).removeClass("active");
    });
    setFilter(/^.*/);
};

/* Diese Funktion setzt die Eingabe in der Suchleiste zurueck.
 *  (Der Einzel-Befehl wurde in eine Funktion eingebunden, um spaetere Ergaenzungen zu
 *  erleichtern.)
 */
var resetSearch = function()
{
    document.getElementById("searchbar").value = "";
};

/* Diese Funktion registriert Klick-Ereignisse und fuehrt entsprechend der Quelle dieser
 * Aktionen aus. Aktuell wird hier nur der Klick auf ein Produktbild abgefangen, sodass
 * dessen Detailseite angezeigt und in der Browserhistory vermerkt wird.
 */
var clickAction = function ()
{
    $(".productLink").click(function ()
    {
        var pid = this.id;
        DB.ready(loadSingleProduct(pid));
        showSingleProductOnly();
        var urlString = "?p=" + pid;
        var popString = "Page of " + pid;
        window.history.pushState({info: popString}, null, urlString);
    });
};


/* Diese Funktion registriert Aenderungen der Stueckzahlen der Waren im Warenkorb und aktualisiert
 * entsprechend die Datenbank und die Gesamtkosten fuer den Kunden.
 */

var changeCartAmountAction = function()
{
    $('.cartAmountInput').change(function()
    {
            changeAndCalculateFullPrice();
    });
    $('#fullPrice').html("").show();
};


/* Diese Funktion registriert einen Klick auf den Button, der ein Produkt einmal dem Warenkorb
 * hinzufuegen soll und tut entsprechendes. In der Datenbank wird entsprechend die Anzahl
 * der verfuegbaren Produkte um 1 reduziert.
 */
var clickCartBtn = function()
{
    $('.cartButton').click(function(){
        var pid = this.id;
        DB.ready(updateProductQuantity(pid, 1));
    })
};

var deleteFromCart = function(){
    $('.deleteFromCart').click(function(){
        console.log("Deleting Item from Cart");
        var pid = this.id;
        deleteProductFromCart(pid);
        showCartPage();
    })
};

//TODO Bewertungsfunktion
var clickStarBtn = function(){

};

//Start der Main-Funktion.
$(document).ready(main);

