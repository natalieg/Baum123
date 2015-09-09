/**
 * Created by peukert on 02.09.15.
 */
//Connect
DB.connect("http://baum123.baqend.com");

// zeigt die topSaleNumber meist gekauften Produkte an
function productSelectBestSales(limitNumber, rowID, bigItem) {
    DB.Product.find()
        .isNotNull('bild')
        .descending("Verkauf_Gesamt").limit(limitNumber)
        .resultList(function (result) {
            result.forEach(function (product) {
                // console.log(product.name);
            });
            if (bigItem === 1) {
                printItemsBig(result, rowID)
            } else {
                printItemsSmall(result, rowID)
            }
        });
};

var loadSingleProduct = function (pid) {
    DB.Product.load(pid).then(function (product) {
        console.log(JSON.stringify(product));
        printSingleProduct(product);
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


// Sucht Dinge. Vielleicht. Jetzt auch mit Sortierung nach Bewertung.
function searchBarAction() {
    var input = document.getElementById('searchbar').value.toLowerCase();
    console.log("Seachbar says: " + input);

    var sort = document.getElementById('sortOption').value;

    var inputPrep = "^.*" + input;
    var inputReg = new RegExp(inputPrep);

    switch(sort)
    {
        case 'preis':

            DB.Product.find()
                .matches('tags', inputReg)
                .isNotNull('bild')
                .ascending('preis')
                .resultList(function (result) {
                    printItemsSmall(result, "#moreTopProducts");
                });
            break;

        case 'Feedbacks':

            DB.Product.find().matches('tags', inputReg)
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
            DB.ready(function () {
                DB.Product.find()
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
// Sonderfall einfügen.
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
    products.forEach(function (product) {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $(rowID).append("<div id=\"" + product.id + "\" class=\"testClass productRow col-md-3\">" +
            "<a class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-3\"><div class=\"productName\">" + name + " </div></div>" +
            "</div></div>");
    });
    clickAction();
};


//Gibt die Top-Sales-Produkte auf der Oberflaeche aus
function printItemsSmall(products, rowID) {
    products.forEach(function (product) {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $(rowID).append("<div id=\"" + product.id + "\" class=\"testClass productRow col-md-2\">" +
            "<a><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-2\"><div class=\"productNameSmall\">" + name + "<br><p>"
            + " EUR " + product.preis + "</p></div>" +
            "</div></div>");
    });
    clickAction();
}

var printSingleProduct = function (product) {
    console.log("hey");
    $("#singleProduct").append(
        "<div class=\"col-md-3\"><a href=\"#\" class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
        "<div class=\"productTD\">" + product.name + " </div>" +
        "<div class=\"productTD\">" + product.preis + " Euro</div>" +
        "<div class=\"productTD\">nur noch " + product.stueckzahl + " vorhanden" +

        "</div></div></div>"
    );
};


//Gibt alle Informationen zu den Produkten aus
// Wird grad nicht verwendet!
function printProductComplete(products) {
    products.forEach(function (product) {
        $("#topProducts").append("<div class=\"col-md-3\"><a href=\"#\" class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productTD\">" + product.name + " </div>" +
            "<div class=\"productTD\">" + product.preis + " Euro</div>" +
            "<div class=\"productTD\">nur noch " + product.stueckzahl + " vorhanden</div>" +
            "<div class=\"productTD\">Bewertung: " + product.Feedbacks.reduce(function (avg, el) {
                return avg + el.Bewertung;
            }, 0) / product.Feedbacks.size + "</div></div></div>");
    });
    clickAction();
}
