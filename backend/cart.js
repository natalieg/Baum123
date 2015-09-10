/**
 * Created by Nat on 10.09.2015.
 */


var cartItems = [];


var updateProductAnzahl = function (pid) {
    console.log("Anzahl der Produkte wird um 1 reduziert");
    DB.Product.load(pid).then(function (product) {
        product.stueckzahl = product.stueckzahl - 1;
        product.update();
        $('.stueckZahl').text(product.stueckzahl);
    });
};

var updateCartItem = function (pid) {
    DB.Product.load(pid).then(function (product) {
    var productExists = false;
     cartItems.forEach(function(product){
            if(product.p.id === pid) {
                product.a = product.a +1;
                productExists = true;
            }
         });
        if (!productExists) {
            cartItems.push({p:product, a:1});
        }
    });
    console.log("Cart Items: " + JSON.stringify(cartItems));
};