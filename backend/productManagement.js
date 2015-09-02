//Connect
DB.connect("http://baum123.baqend.com");

//Let's create a Product item
var newProduct = function() {
    var myProduct = new DB.Product();
    myProduct.name = "My Todo";
    myProduct.beschreibung = "Testbeschreibung";
    myProduct.preis = 24;
    myProduct.liste = "Baum";
    printItem(myProduct);
};

// Lädt alle Produkte aus der Datenbank
var productFind = function(){
    DB.Product.find()
        .ascending("name")
        .resultList(function(result) {
        result.forEach(function(product) {
            console.log(product.name);
        });
        printItems("Produkte",result)
    });
};

//hier werden die Methoden ausgeführt, wenn die Datenbank bereit ist
DB.ready(newProduct);
DB.ready(productFind);


//Boilerplate code below

//Funktion für
function printItem(product) {
    $("#hello").append(JSON.stringify(product.toJSON(true), null, "  "));
};

//Gibt die Produkte auf der Oberfläche aus
function printItems(msg, products) {
    $("#hello2 h4").html(msg);
    products.forEach(function (product) {
        $("#hello2 table").append("<tr><td class=" + "productTD" + ">" + (product).name + " </td> " +
            "<td class=" + "productTD" + "> Preis: " +
            "<input type=" + "text" + " id=" + "" + (product).id +  "" + " value=" + "" + (product).preis + "" + "></input></td>" + "</tr>");
    });
}


