//Connect
DB.connect("http://baum123.baqend.com");



//Let's create a Product item
function onReady() {
    var myProduct = new DB.Product();
    myProduct.name = "My Todo";
    myProduct.beschreibung = "Testbeschreibung";
    myProduct.preis = 24;
    printItem(myProduct);
}

function load(){
    DB.Product.find()
        .resultList(myCallback);
printItem2(products)

}

//Wait for connection
DB.ready(onReady);
DB.ready(load);



//Boilerplate code below
function printItem(product) {
    $("#hello").append(JSON.stringify(product.toJSON(true), null, "  "));
}
function printItem2(products) {
    $("#hello2")
    products.forEach(function(product){
        $("#hello ul").append("<li>" + product.name + " [id:" + product.id + "]</li>");
    });
}

