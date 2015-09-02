/**
 * Created by Nat on 01.09.2015.
 */

//Connect
DB.connect("http://baum123.baqend.com");


// die 5 meist verkauften Produkte anzeigen
var productFind = function () {
    DB.Product.find()
        .ascending("name")
        .resultList(function (result) {
            result.forEach(function (product) {
                console.log(product.name);
            });
            printItems("Produkte", result)
        });
};

//hier werden die Methoden ausgef�hrt, wenn die Datenbank bereit ist
DB.ready(productFind);


//Boilerplate code below

//Gibt die Produkte auf der Oberfl�che aus
function printItems(msg, products) {
    $("#hello2 h4").html(msg);
    products.forEach(function (product) {
        $("#hello2 table").append("<tr><td class=" + "productTD" + ">" + (product).name + " </td>" +
            "<td class=" + "productTD" + "> Preis: " +
            "<input type=" + "text" + " value=" + "" + (product).preis + "" + "></input></td>" + "</tr>");
    });
}



