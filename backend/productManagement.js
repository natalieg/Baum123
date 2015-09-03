//Connect
DB.connect("http://baum123.baqend.com");

//Let's create a Product item
var newProduct = function () {
    var myProduct = new DB.Product();
    myProduct.name = "My Todo";
    myProduct.beschreibung = "Testbeschreibung";
    myProduct.preis = 24;
    myProduct.liste = "Baum";
    printItem(myProduct);
};

// Lädt alle Produkte aus der Datenbank und druckt diese
var productFindAndPrint = function () {
    DB.Product.find()
        .ascending("name")
        .resultList(function (result) {
            result.forEach(function (product) {
                console.log(product.name);
            });
            printItems("Produkte", result)
        });
};

// Lädt alle Produkte aus der Datenbank
var productFind = function () {
    return DB.Product.find()
        .ascending("name")
        .resultList();
};

// Lädt ein Produkt aus der Datenbank und updated bei Bedarf
function loadProductAndUpdate() {
    DB.Product.find()
        .ascending("name")
        .resultList(function (result) {
            productUpdate(result)
        });
}

// Produkte werden
function productUpdate(products) {
    products.forEach(function (product) {
        var preis = document.getElementById(product.id+"a").value;
        var stueckzahl = parseInt(document.getElementById(product.id+"b").value);
        if (preis != null && preis != product.preis) {
            product.preis = preis;
        }
        if (stueckzahl!=null && stueckzahl<0 || stueckzahl>0) {
            product.stueckzahl = product.stueckzahl + stueckzahl;
            stueckzahl = "";
        }
        product.update();
    });
    location.reload();
}

//hier werden die Methoden ausgeführt, wenn die Datenbank bereit ist
DB.ready(newProduct);
DB.ready(productFindAndPrint);


//Boilerplate code below -----------------------------------------------------------------------------------------------

// Gibt ein neu eingefügtes Produkt auf der Oberfläche aus
function printItem(product) {
    $("#hello").append(JSON.stringify(product.toJSON(true), null, "  "));
};

//Gibt die Produkte auf der Oberfläche aus
function printItems(msg, products) {
    $("#hello2 h4").html(msg);
    products.forEach(function (product) {
        $("#hello2 table").append(
            "<tr><td class=" + "productTD" + ">" + (product).name + " </td> " +
             "<td class=" + "productTD" + "> Preis: " +
             "<input type=" + "number" + " id=" + "" + (product).id +"a"+"" + " value=" + "" + (product).preis + "" + "></input></td>" +

             "<td class=" + "productTD" + "> Stueckzahl: </td>" +
             "<td class=" + "productTD" + ">" + (product).stueckzahl + " </td> " +
             "<td><input type=" + "number" + " id=" + "" + (product).id +"b"+"" + "></input></td>" +
            "</tr>");
    });
}

