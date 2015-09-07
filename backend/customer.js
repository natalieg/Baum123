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

var topSales = function () {
    productSelectBestSales(4, "#topProducts", 1);
}

var allSales = function () {
    productSelectBestSales(100, "#moreTopProducts");
}

//hier werden die Methoden ausgef�hrt, wenn die Datenbank bereit ist
DB.ready(topSales);

//Gibt die Top-Sales-Produkte auf der Oberfl�che aus
function printItemsBig(products, rowID) {
    products.forEach(function (product) {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $(rowID).append("<div id=\"" + product.id + "\" class=\"productRow col-md-3\">" +
            "<a href=\"#\" class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-3\"><div class=\"productName\">" + name + " </div></div>" +
            "</div></div>");
    });
};

// Sucht Dinge. Vielleicht.
function searchBarAction() {
    var input = document.getElementById('searchbar').value;
    console.log("Seachbar says: " + input);

    var inputPrep = "^.*" + input;
    var inputReg = new RegExp(inputPrep);

    DB.ready(function () {
        DB.Product.find()
            .matches('name', inputReg)
            .isNotNull('bild')
            .descending("Verkauf_Gesamt")
            .resultList(function (result) {
                printItemsSmall(result, "#moreTopProducts");
            })
    });
};

//Gibt die Top-Sales-Produkte auf der Oberfl�che aus
function printItemsSmall(products, rowID) {
    products.forEach(function (product) {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $(rowID).append("<div id=\"" + product.id + "\" class=\"productRow col-md-2\">" +
            "<a href=\"#\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-2\"><div class=\"productNameSmall\">" + name + " </div></div>" +
            "</div></div>");
    });
}


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
}