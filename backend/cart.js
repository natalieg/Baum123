/**
 * Created by Nat on 10.09.2015.
 */


var cartItems = [];
var totalPrice = 0;

var updateProductAnzahl = function (pid) {
    console.log("Anzahl der Produkte wird um 1 reduziert");
    DB.Product.load(pid).then(function (product) {
        if (product.stueckzahl >= 1) {
            product.stueckzahl = product.stueckzahl - 1;
            product.gesamtverkauf = product.gesamtverkauf + 1;
            product.update();
            $('.stueckZahl').text(product.stueckzahl);
            updateCartItem(pid);
        } else {
            window.alert("Keine mehr auf Lager!");
        }
    });
};

var updateCartItem = function (pid) {
    DB.Product.load(pid).then(function (product) {
        var productExists = false;
        cartItems.forEach(function (product) {
            if (product.p.id === pid) {
                product.a = product.a + 1;
                productExists = true;
            }
        });
        if (!productExists) {
            cartItems.push({p: product, a: 1});
        }
    });
    console.log("Cart Items: " + JSON.stringify(cartItems));
};

var buildCartPage = function () {
    cartItems.forEach(function (product) {
        var name = product.p.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $("#cartPage").append("<div class=\"row\">" +
            "<div id=\"" + product.p.id + "\" class=\"cartItem productLink col-md-2\"><img src=\"" + product.p.bild + "\"></div>" +
            "<div class=\"col-md-2\">" + name + " </div>" +
            "<div class=\"col-md-2\">" + product.p.preis + " Euro</div>" +
            "<div class=\"col-md-2\">" + product.a + " </div>" +
            "</div></div></div>");
    });
    clickAction();
};

var calculateFullPrice = function (){
    totalPrice = 0;
    cartItems.forEach(function (product) {
        var productPrice = product.p.preis;
        var amount = product.a;
        var productFullPrice = (productPrice * amount);
        totalPrice = totalPrice + productFullPrice;
        console.log(totalPrice);
    });
};

var printTotalPrice = function () {
    $("#fullPrice").append("<div class=\"row\">" +
        "<div class=\"col-md-6\"></div>" +
        "<div class=\"totalPrice col-md-2\">" + totalPrice + " Euro</div>" +
        "</div></div></div>");
};

