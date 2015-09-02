//Connect
DB.connect("http://baum123.baqend.com");


//Let's create a Product item
function newProduct() {
    var myProduct = new DB.Product();
    myProduct.name = "My Todo";
    myProduct.beschreibung = "Testbeschreibung";
    myProduct.preis = 24;
    printItem(myProduct);
}

// TODO Funktioniert noch nicht richtig!
/**
 * Findet die Produkte
 * @returns {*}
 */
var loadProducts = function () {
    return DB.Product.find()
        .resultList();
}

// TODO nicht sicher ob die Daten bisher richtig geladen werden und ob die Syntax so stimmt
// Lädt die Daten
function loadData() {
    return
    loadProducts(); //query
    (function(products) {
        printItem2("Produkte", products);
    });
}

//hier werden die Methoden ausgeführt, wenn die Datenbank bereit ist
DB.ready(newProduct);
DB.ready(loadData);


//Boilerplate code below

//Funktion für
function printItem(product) {
    $("#hello").append(JSON.stringify(product.toJSON(true), null, "  "));
}

// TODO Funktionier noch nicht!
function printItem2(msg, products) {
    $("#hello2 h4").html(msg);
    products.forEach(function (product) {
        $("#hello2 ul").append("<li>" + product.name + " [id:" + product.id + "]</li>");
    });
}

