/**
 * Created by peukert on 02.09.15.
 */
//Connect
DB.connect("http://baum123.baqend.com");

// zeigt die topSaleNumber meist gekauften Produkte an
var productSelectBestSales = function () {
    DB.Product.find()
        .descending("Verkauf_Gesamt").limit(4)
        .resultList(function (result) {
            result.forEach(function (product) {
                // console.log(product.name);
            });
            printItems("", result)
        });
};

//hier werden die Methoden ausgef�hrt, wenn die Datenbank bereit ist
DB.ready(productSelectBestSales);

//Gibt die Produkte auf der Oberfl�che aus
function printItems(msg, products) {
    products.forEach(function (product) {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $("#topProducts").append("<div class=\"col-md-3\"><a href=\"#\" class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"col-md-3\"><div class=\"productName\">" + name + " </div></div>" +
            "</div></div>");
    });
}

//Gibt alle Informationen zu den Produkten aus
// Wird grad nicht verwendet!
function printProductComplete(msg, products) {
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