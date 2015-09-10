//Connect
DB.ready().then(function() {
    return DB.User.me && DB.Role.load(10);
}).then(function(role) {
    if (!role || !role.hasUser(DB.User.me)) {
        throw Error('Not logged in');
    }
}).then(function() {

//Let's create a Product item
var newProduct = function () {
    var myProduct = new DB.Product();
    myProduct.name = document.getElementById('nameprodukt');
    myProduct.beschreibung = "Testbeschreibung";
    myProduct.preis = 24;
    myProduct.liste = "Baum";
    printItem(myProduct);
};

// L�dt alle Produkte aus der Datenbank und druckt diese
var productFindAndPrint = function () {
    console.log("Laedt die Produkte aus der DB")
    DB.Product.find()
        .ascending("name")
        .resultList(function (result) {
            result.forEach(function (product) {
                console.log(product.name);
            });
            printItems("Produkte", result)
        });
};

// L�dt alle Produkte aus der Datenbank
var productFind = function () {
    return DB.Product.find()
        .ascending("name")
        .resultList();
};



// L�dt ein Produkt aus der Datenbank und updated bei Bedarf
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
        var preis = document.getElementById(product.id + "a").value;
        var stueckzahl = parseInt(document.getElementById(product.id + "b").value);
        if (preis != null && preis != product.preis) {
            product.preis = preis;
        }
        if (stueckzahl != null && stueckzahl < 0 || stueckzahl > 0) {
            product.stueckzahl = product.stueckzahl + stueckzahl;
            stueckzahl = "";
        }
        product.update();
    });
    location.reload();
}


// -------------------------------------------------------------------------------------------------------


var addProduct = function () {
    var myProduct = new DB.Product(
        {
            name: document.getElementById('produktname').value,
            stueckzahl: document.getElementById('produktstueckzahl').value,
            preis: document.getElementById('produktpreis').value,
            beschreibung: document.getElementById('produktbeschreibung').value,
            bild: document.getElementById('produktbild').value,
            tags: document.getElementById('produkttags').value,
            liste: document.getElementById('produktliste').value

        }
    );

    myProduct.insert()
        .then(function () {
            console.log("Success!");
        },
        function () {
            console.log("Why??");
        });
};


/* Funktion, welche alle Eintr�ge einer Datenbank l�scht.
 *  (Aus verst�ndlichen Gr�nden nicht getestet.)
 */

var clearDataBase = function () {
    DB.Product.find().resultList(function (result) {
        result.forEach(function (result2) {
            result2.delete();
        })
    })

};


/* Funktion, welche f�r eine gegebene Datenbank alle Eintr�ge entfernt,
 * die in einer spezifizierten Kategorie einen bestimmten Wert aufweisen.
 *
 * @param category : Die Kategorie, in der auf bestimmte Werte geachtet werden soll.
 * (Achtung: Als Regex eingeben => "^...")
 * @param value : Der Wert, anhand der zu l�schende Eintrag erkannt wird.
 *
 */
var findAndDestroy = function (category, value) {
    DB.Product.find().matches(category, value).resultList(function (result) {
        result.forEach(function (result2) {
            result2.delete().then(function () {
                console.log("Wech isses!");
            }, function () {
                console.log("Nich wech isses!");
            })
        })
    })
};

var findAndDestroyList = function (category, value) {
    var arrayLength = value.length;


    for (i = 0; i < arrayLength; ++i) {
        console.log("Dings" + value[i]);
        DB.ready(function () {
            findAndDestroy(category, value[i]);
        });
    }

};


/* Funktion, welche f�r eine gegebene Datenbank Eintr�ge, die anhand eines Wertes in einer Kategorie
 *  identifiziert wurden, Werte einer Kategorie mit einem �bergebenen Wert �berschreibt.
 *
 *  @param idCat : Die Kategorie, in der sich der Wert befindet, anhand der/die zu �ndernde(n) Eintr�ge identifiziert
 *                 werden k�nnen.
 *  @param idVal : Wert, anhand dessen der/die zu �ndernde(n) Eintr�ge identifiziert werden k�nnen
 *  @param cat   : Kategorie, in der sich der zu �ndernde Wert/ die zu �ndernden Werte befinden.
 *  @param newValue: Der aktuelle Wer, der dem Eintrag/ den Eintr�gen hinzugef�gt werden soll.
 */

var findAndAdjust = function (idCat, idVal, cat, newVal) {
    DB.Product.find().matches(idCat, idVal).resultList(function (result) {
        result.forEach(function (result2) {
            result2.cat = newVal;
            result2.update();
        })
    })
};


//hier werden die Methoden ausgef�hrt, wenn die Datenbank bereit ist
DB.ready(newProduct);
DB.ready(productFindAndPrint);


// DB.ready(function(){findAndDestroyOld( 'name', "^May Todo111")});
// findAndDestroyConstructor("Product","name","My Todo111");
// DB.ready(findAndDestroy);
findAndDestroyList("name", ["^Unkraut", "^My Todo111"]);

//DB.ready(function(){addProduct("Bisaflor", "Schl�gt Nutzer gerne mit Ranken", 12, "Nicht zu verkaufen")});


//Boilerplate code below

// Gibt ein neu eingef�gtes Produkt auf der Oberfl�che aus
function printItem(product) {
    $("#hello").append(JSON.stringify(product.toJSON(true), null, "  "));
}

//Gibt die Produkte auf der Oberfl�che aus
function printItems(msg, products) {
    $("#hello2 h4").html(msg);
    products.forEach(function (product) {
        $("#hello2 table").append(
            "<tr><td class=" + "productTD" + ">" + (product).name + " </td> " +
            "<td class=" + "productTD" + "> Preis: " +
            "<input min='0' type=" + "number" + " id=" + "" + (product).id + "a" + "" + " value=" + "" + (product).preis + "" + "></input></td>" +

                "<td class=" + "productTD" + "> Stueckzahl: </td>" +
                "<td class=" + "productTD" + ">" + (product).stueckzahl + " </td> " +
                "<td><input min='0' type=" + "number" + " id=" + "" + (product).id +"b"+"" + "></input></td>" +
                "</tr>");
        });
    }
}).catch(function() {
    throw error('Fehler aufgetreten');
});

