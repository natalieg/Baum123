/**
 * Created by peukert on 02.09.15.
 */

// zeigt die topSaleNumber meist gekauften Produkte an
function productSelectBestSales(limitNumber, rowID, bigItem) {
    console.log("productSelectBestSales wird aufgerufen. Die meistverkauften Produkte sollen angezeigt werden.");
    DB.Product.find()
        .isNotNull('bild')
        .greaterThan("stueckzahl", 0)
        .descending("Verkauf_Gesamt").limit(limitNumber)
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
};

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
}

var allSales = function () {
    productSelectBestSales(100, "#moreTopProducts");
}


//hier werden die Methoden ausgef�hrt, wenn die Datenbank bereit ist
DB.ready(topSales);

var filter = /^.*/;

function setFilter(newFilter)
{
    filter = newFilter;
}

// Sucht Dinge. Vielleicht. Jetzt auch mit Sortierung nach Bewertung.
function searchBarAction() {
    console.log("searchBarAction wird aufgerufen. Inhalt der Suchleiste soll gesucht werden.");
    var input = document.getElementById('searchbar').value.toLowerCase();
    console.log("searchBarAction - Searchbar enthaelt folgenden Input: " + input);

    var sort = document.getElementById('sortOption').value;
    console.log("searchBarAction - Ergebnisse werden sortiert nach: " + sort);

    var inputPrep = "^.*" + input;
    var inputReg = new RegExp(inputPrep);
    console.log("searchBarAction - Folgender RegEx wurde gebildet: " + inputReg);

    if (window.location.href.match(/^.*\?s=.*/))
    {
        console.log("searchBarAction - Suche durch URL erkannt.");
        var urlString = "?s=" + input;
        var popString = "Search for " + input;
        window.history.replaceState({info: popString}, null, urlString);
        console.log("searchBarAction - URL modifiziert mit: " + urlString);
    }
    else
    {
        console.log("searchBarAction - Keine Suche erkannt.");
        var urlString = "?s=" + input;
        var popString = "Search for " + input;
        window.history.pushState({info: popString}, null, urlString);
        console.log("searchBarAction - URL modifiziert mit: " + urlString);
    }

    switch(sort)
    {
        case 'preis':

            console.log("searchBarAction - Suche und Sortierung nach Preis eingeleitet");
            DB.Product.find()
                .matches('liste', filter)
                .matches('tags', inputReg)
                .isNotNull('bild')
                .ascending('preis')
                .resultList(function (result) {
                    printItemsSmall(result, "#moreTopProducts");
                });
            break;

        case 'Feedbacks':

            console.log("searchBarAction - Suche und Sortierung nach Feedbacks eingeleitet");
            DB.Product.find().matches('liste', filter).matches('tags', inputReg)
                .isNotNull('bild').resultList(function(result)
                {
                    function sortBew(a,b)
                    {
                        function bewfinder(obj)
                        {
                            if(obj.Feedbacks == null)
                            {
                                return 0;
                            }
                            else
                            {
                                return obj.Feedbacks.reduce(function (avg, el) {
                                    return avg + el.Bewertung;
                                }, 0) / obj.Feedbacks.size;
                            }

                        }
                        return bewfinder(b) - bewfinder(a);
                    }
                    result.sort(sortBew);
                    printItemsSmall(result, "#moreTopProducts");
                });

            break;

        default:

            console.log("searchBarAction - Suche und Sortierung nach " + sort + " eingeleitet");
            DB.ready(function () {
                DB.Product.find()
                    .matches('liste', filter)
                    .matches('tags', inputReg)
                    .isNotNull('bild')
                    .descending(sort)
                    .resultList(function (result) {
                        printItemsSmall(result, "#moreTopProducts");
                    })
            });
    }


};

// In Arbeit: Id rein, Bewertung raus

var getBewertung = function (pid) {
    DB.Product.load(pid).then(function (product) {

        if(product.Feedbacks == null)
        {
// Sonderfall einfügen...
        }
        else
        {
            var bew = product.Feedbacks.reduce(function (avg, el) {
                    return avg + el.Bewertung;
                }, 0) / product.Feedbacks.size;
            console.log(bew);
            //Ergebnis kann zwar berechnet, aber nicht ausgegeben werden oO
        }

    });
};


//Testweises ersetzen der Url in der History. Scheint zu funzen.
function urlChange()
{
    window.history.replaceState(null, null, "fuu.html");
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
        "<div class=\"col-md-3 singleViewDiv\"><img src=\"" + product.bild + "\"></div>" +
        "<div class=\"col-md-3 singleViewContent\">" +
        "<div class=\"productTD\"><h2>" + product.name + " </h2></div>" +
        "<div class=\"productTD\">" + product.preis + " Euro</div>" +
        "<div class=\"productTD\">nur noch <h6 class=\"stueckZahl\">" + product.stueckzahl + "</h6> vorhanden" +
        "<div class=\"productDescription productTD\"><p class=\"productDescription\">" + product.beschreibung + "</p></div>" +
            "<br><button type=\"button\" class=\"cartButton\" id=" + product.id + ">Add to Cart</button> " +
        "</div></div></div></div>"
    );
    clickCartBtn();
};


//Gibt alle Informationen zu den Produkten aus
// Wird grad nicht verwendet!
function printProductComplete(products) {
    products.forEach(function (product) {
        $("#topProducts").append("<div class=\"col-md-3\"><a class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productTD\">" + product.name + " </div>" +
            "<div class=\"productTD\">" + product.preis + " Euro</div>" +
            "<div class=\"productTD\">nur noch " + product.stueckzahl + " vorhanden</div>" +
            "<div class=\"productTD\">Bewertung: " + product.Feedbacks.reduce(function (avg, el) {
                return avg + el.Bewertung;
            }, 0) / product.Feedbacks.size + "</div></div></div>");
    });
    clickAction();
}

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
