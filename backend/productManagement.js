//Connect
DB.connect("http://baum123.baqend.com");

//Let's create a Product item
var newProduct = function() {
    var myProduct = new DB.Product();
    myProduct.name = "My Todo1";
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


// -------------------------------------------------------------------------------------------------------


var addProduct = function( name, beschreibung, preis, liste)
{
    var myProduct = new DB.Product(
        {
            name: name,
            beschreibung: beschreibung,
            preis: preis,
            liste: liste
        }
    );

    myProduct.insert()
        .then(function()
        {console.log("Success!");},
        function()
        {console.log("Why??");});
};


/* Funktion, welche alle Einträge einer Datenbank löscht.
*  (Aus verständlichen Gründen nicht getestet.)
*/

var clearDataBase = function()
{
    DB.Product.find().resultList(function(result)
    {
        result.forEach(function(result2)
        {
            result2.delete();
        })
    })

};


/* Funktion, welche für eine gegebene Datenbank alle Einträge entfernt,
 * die in einer spezifizierten Kategorie einen bestimmten Wert aufweisen.
 *
 * @param category : Die Kategorie, in der auf bestimmte Werte geachtet werden soll.
 * (Achtung: Als Regex eingeben => "^...")
 * @param value : Der Wert, anhand der zu löschende Eintrag erkannt wird.
 *
 */
var findAndDestroy = function(category, value)
{
    DB.Product.find().matches(category,value).resultList(function(result)
    {
        result.forEach(function(result2)
        {
            result2.delete().then(function()
            {
                console.log("Wech isses!");
            },function()
            {
                console.log("Nich wech isses!");
            })
        })
    })
};

var findAndDestroyList = function(category, value)
{
    var arrayLength = value.length;


       for(i = 0; i < arrayLength; ++i)
       {
           console.log("Dings" + value[i]);
           DB.ready(function(){findAndDestroy(category, value[i]);});
       }

};



/* Funktion, welche für eine gegebene Datenbank Einträge, die anhand eines Wertes in einer Kategorie
*  identifiziert wurden, Werte einer Kategorie mit einem übergebenen Wert überschreibt.
*
*  @param idCat : Die Kategorie, in der sich der Wert befindet, anhand der/die zu ändernde(n) Einträge identifiziert
*                 werden können.
*  @param idVal : Wert, anhand dessen der/die zu ändernde(n) Einträge identifiziert werden können
*  @param cat   : Kategorie, in der sich der zu ändernde Wert/ die zu ändernden Werte befinden.
*  @param newValue: Der aktuelle Wer, der dem Eintrag/ den Einträgen hinzugefügt werden soll.
*/

var findAndAdjust = function(idCat, idVal, cat, newVal)
{
    DB.Product.find().matches(idCat, idVal).resultList(function(result)
    {
        result.forEach(function(result2)
        {
            result2.cat = newVal;
            result2.update();
        })
    })
};



//hier werden die Methoden ausgeführt, wenn die Datenbank bereit ist
DB.ready(newProduct);
DB.ready(productFindAndPrint);



// DB.ready(function(){findAndDestroyOld( 'name', "^May Todo111")});
// findAndDestroyConstructor("Product","name","My Todo111");
// DB.ready(findAndDestroy);
findAndDestroyList("name", ["^Unkraut","^My Todo111"]);

//DB.ready(function(){addProduct("Bisaflor", "Schlägt Nutzer gerne mit Ranken", 12, "Nicht zu verkaufen")});





//Boilerplate code below

// Gibt ein neu eingefügtes Produkt auf der Oberfläche aus
function printItem(product) {
    $("#hello").append(JSON.stringify(product.toJSON(true), null, "  "));
}

//Gibt die Produkte auf der Oberfläche aus
function printItems(msg, products) {
    $("#hello2 h4").html(msg);
    products.forEach(function (product) {
        $("#hello2 table").append(
            "<tr><td class=" + "productTD" + ">" + (product).name + " </td> " +
             "<td class=" + "productTD" + "> Preis: " +
             "<input min='0' type=" + "number" + " id=" + "" + (product).id +"a"+"" + " value=" + "" + (product).preis + "" + "></input></td>" +

             "<td class=" + "productTD" + "> Stueckzahl: </td>" +
             "<td class=" + "productTD" + ">" + (product).stueckzahl + " </td> " +
             "<td><input min='0' type=" + "number" + " id=" + "" + (product).id +"b"+"" + "></input></td>" +
            "</tr>");
    });
}

