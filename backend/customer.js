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

var loadSingleProduct = function (pid) {
    DB.Product.load(pid).then(function (product) {
        console.log(JSON.stringify(product));
        printSingleProduct(product);
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


// Sucht Dinge. Vielleicht.
function searchBarAction() {
    var input = document.getElementById('searchbar').value.toLowerCase();
    console.log("Seachbar says: " + input);

    var sort = document.getElementById('sortOption').value;

    var inputPrep = "^.*" + input;
    var inputReg = new RegExp(inputPrep);

    switch(sort)
    {
        case 'preis':

            DB.Product.find()
                .matches('tags', inputReg)
                .isNotNull('bild')
                .ascending('preis')
                .resultList(function (result) {
                    printItemsSmall(result, "#moreTopProducts");
                });
            break;

        case 'Feedbacks':

            var list = [];
            var secondList = [];
            var out = [];


            //Komplett sinn - und nutzloser Nudelcode. Bitte nicht beachten.

           /* console.log("list" + list);
            DB.Product.find().matches('tags', inputReg)
                .isNotNull('bild').resultList(function(result)
                {
                    result.forEach(function(result2){

                        if (result2.Feedbacks == null)
                        {
                            out.push({id: result2.id, bewertung: 0});
                        }
                        else
                        {
                            var bew = result2.Feedbacks.reduce(function (avg, el) {
                                    return avg + el.Bewertung;
                                }, 0) / result2.Feedbacks.size;
                            console.log("bew" + bew);
                            var obj = {id: result2.id, bewertung: bew};
                            list.push(obj);
                            console.log("stuff" + list);
                        }
                    })

                    console.log("list out" + list);
                    function sortNumber(a,b) {

                        console.log("In function a =" + a);
                        console.log("in function b =" + b);
                        console.log("in function a.bew =" + a.bewertung);
                        console.log("in function b.bew =" + b.bewertung);
                        var erg = b.bewertung - a.bewertung;
                        console.log("erg = " + erg);

                        return b.bewertung - a.bewertung;
                    }
                    console.log("Out function a =" + list[1]);
                    console.log("Out function b =" + list[2]);
                    console.log("Out function a.bew =" + list[1].bewertung);
                    console.log("Out function b.bew =" + list[2].bewertung);
                    sortNumber(list[1],list[2]);

                    list.sort(sortNumber);
                    var newList = list.concat(out);
                    console.log("new list" + newList);


                    for(i = 0; i < list.length; ++i)
                    {
                        var id = list[i].id;

                        DB.Product.load(id).then(function(product)
                        {
                            secondList.push(product);
                            console.log("Hui");
                        })
                    };
                    printItemsSmall(secondList, "#moreTopProducts");
                }); */




            break;

        default:
            DB.ready(function () {
                DB.Product.find()
                    .matches('tags', inputReg)
                    .isNotNull('bild')
                    .descending(sort)
                    .resultList(function (result) {
                        printItemsSmall(result, "#moreTopProducts");
                    })
            });
    }


};


//Testweises ersetzen der Url in der History. Scheint zu funzen.
function urlChange()
{
    window.history.replaceState(null, null, "fuu.html");
}

//Gibt die Top-Sales-Produkte auf der Oberfl�che aus
function printItemsBig(products, rowID) {
    products.forEach(function (product) {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $(rowID).append("<div id=\"" + product.id + "\" class=\"testClass productRow col-md-3\">" +
            "<a class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-3\"><div class=\"productName\">" + name + " </div></div>" +
            "</div></div>");
    });
    clickAction();
};


//Gibt die Top-Sales-Produkte auf der Oberflaeche aus
function printItemsSmall(products, rowID) {
    products.forEach(function (product) {
        var name = product.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $(rowID).append("<div id=\"" + product.id + "\" class=\"testClass productRow col-md-2\">" +
            "<a><img src=\"" + product.bild + "\"></a>" +
            "<div class=\"productRow col-md-2\"><div class=\"productNameSmall\">" + name + "<br><p>"
            + " EUR " + product.preis + "</p></div>" +
            "</div></div>");
    });
    clickAction();
}

var printSingleProduct = function (product) {
    console.log("hey");
    $("#singleProduct").append(
        "<div class=\"col-md-3\"><a href=\"#\" class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
        "<div class=\"productTD\">" + product.name + " </div>" +
        "<div class=\"productTD\">" + product.preis + " Euro</div>" +
        "<div class=\"productTD\">nur noch " + product.stueckzahl + " vorhanden" +

        "</div></div></div>"
    );
};


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
    clickAction();
}
