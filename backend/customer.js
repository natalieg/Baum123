/**
 * Created by peukert on 02.09.15.
 */
//Connect
DB.connect("http://baum123.baqend.com");

// zeigt die topSaleNumber meist gekauften Produkte an
var productSelectBestSales = function(){
    DB.Product.find()
        .descending("Verkauf_Gesamt").limit(5)
        .resultList(function(result) {
            result.forEach(function(product) {
               // console.log(product.name);
            });
            printItems("Produkt:", result)
        });
};

//hier werden die Methoden ausgef�hrt, wenn die Datenbank bereit ist
DB.ready(productSelectBestSales);

//Gibt die Produkte auf der Oberfl�che aus
function printItems(msg, products) {
    $("#hello2 h4").html(msg);
    products.forEach(function (product) {
        $("#hello2 table").append("<tr><td class=" + "productTD" + ">" + (product).name + " </td>" +
            "<td class=" + "productTD" + ">" +
            (product).preis + "" + "></td>" + "</tr>");
    });
}