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


var productFind = function(){
    DB.Product.find().resultList(function(result) {
        result.forEach(function(product) {
            console.log(product.name);
        });
        printItems("Produkte",result)
    });
};

// Ich bin ein Testkommentar!!

//hier werden die Methoden ausgeführt, wenn die Datenbank bereit ist
DB.ready(newProduct);
DB.ready(productFind);


//Boilerplate code below

//Funktion für
function printItem(product) {
    $("#hello").append(JSON.stringify(product.toJSON(true), null, "  "));
};

function printItems(msg, products) {
    $("#hello2 h4").html(msg);
    products.forEach(function (product) {
        $("#hello2 ul").append("<li>" + (product).name  + "</li>");
    });
}


