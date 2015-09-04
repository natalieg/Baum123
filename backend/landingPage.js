/**
 * Created by Nat on 04.09.2015.
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
            printItems(result)
        });
};



$(function () {
    // Grab the template script
    var theTemplateScript = $("#bestseller-template").html();

    // Compile the template
    var theTemplate = Handlebars.compile(theTemplateScript);

    // Define our data object



//hier werden die Methoden ausgef?hrt, wenn die Datenbank bereit ist
    DB.ready(productSelectBestSales);

    //Gibt die Produkte auf der Oberfl?che aus
    function printItems(products) {
        products.forEach(function (product) {
                var context = {
                    product: [
                        {imageSrc: "<img src=\"" + product.bild + "\"></img>"},
                        {productName: product.name}
                    ]
                };
                // Pass our data to the template
                var theCompiledHtml = theTemplate(context);

                // Add the compiled html to the page
                $(document.body).append(theCompiledHtml);
            });
    }


// Pass our data to the template
    var theCompiledHtml = theTemplate(context);

// Add the compiled html to the page
    $('.content-placeholder').html(theCompiledHtml);
})
;
