/**
 * Created by Nat on 10.09.2015.
 */


var cartItems = [];
var totalPrice = 0;
var cartCount = $('.cartCounter').value;

/**
 * Aktualisiert die Produkt-Anzahl, wenn bei einem Produkt auf den Warenkorb geklickt wird
 * Die Anzahl im Lager wird reduziert, an die Warenkorbmethode wird übergeben, um welches Produkt es sich handelt
 * Sind keine Produkte mehr auf Lager, wird eine Infonachricht darüber erzeugt.
 * @param pid
 */
var updateProductQuantity = function (pid, amount) {
    amount = parseInt(amount);
    console.log("Anzahl der Produkte wird um 1 reduziert");
    DB.Product.load(pid).then(function (cartProduct) {
        if (cartProduct.stueckzahl >= 1) {
            cartProduct.stueckzahl = cartProduct.stueckzahl - amount;
            cartProduct.gesamtverkauf = cartProduct.gesamtverkauf + amount;
            cartProduct.update();
            $('.stueckZahl').text(cartProduct.stueckzahl);
            updateCartItem(pid, 1);
        } else {
            window.alert("Keine mehr auf Lager!");
        }
    });
};

/**
 * Die Produkte im Warenkorb werden aktualisiert
 * Dabei wird geprüft, ob ein Produkt sich bereits im Warenkorb befindet, ist dies der Fall, wird die Anzahl
 * erhöht
 * @param pid
 * @param amount
 */
var updateCartItem = function (pid, amount) {
    DB.Product.load(pid).then(function (product) {
        var productExists = false;
        cartItems.forEach(function (product) {
            if (product.p.id === pid) {
                product.a += amount;
                productExists = true;
            }
        });
        // Wenn das Produkt noch nicht im Warenkorb existiert, wird es der Liste hinzugefügt
        if (!productExists) {
            cartItems.push({p: product, a: 1});
        }
    });
    console.log("Cart Items: " + JSON.stringify(cartItems));
};

/**
 * Hier wird die eigentliche Warenkorb Seite erzeugt
 */
var buildCartPage = function () {
    cartItems.forEach(function (product) {
        var name = product.p.name;
        if (name.length > 10) {
            name = name.substring(0, 9) + "...";
        }
        $("#cartPage").append("<div class=\"row\">" +
            "<div id=\"" + product.p.id + "\" class=\"cartItem productLink col-md-2\">" +
            "<img src=\"" + product.p.bild + "\"></div>" +
            "<div class=\"col-md-2\">" + name + " </div>" +
            "<div class=\"col-md-2\">" + product.p.preis + " Euro</div>" +
            "<div class=\"col-md-2\">" +
            "<input class=\"cartAmountInput\" min='0' type=" + "number" + " id=" + "" + product.p.id + "a" + "" + " value=" + "" + product.a + "" + ">" +
            "</input>" +
            "</div></div></div>");
    });
    clickAction();
    changeCartAmountAction();
};

/**
 * Der komplette Preis von allen Produkten im Warenkorb wird berechnet
 * Diese Methode wird ausgeführt, wenn ein einzelnes Produkt über den Warenkorb Button in den Warenkorb
 * hinzugefügt wird oder eine Produktmenge im Warenkorb verändert wird
 */
var changeAndCalculateFullPrice = function () {
    console.log("Calculate Full Price");
    totalPrice = 0;
    cartItems.forEach(function (CartProduct) {
        var productPrice = CartProduct.p.preis;
        var oldAmount = CartProduct.a;
        var newAmount = $('#' + CartProduct.p.id + 'a').val();
        newAmount = parseInt(newAmount);
        var inStock = 0;
        DB.Product.load(CartProduct.p.id).then(function (product) {
            console.log("Aktualisiere Produkt in DB");
            inStock = product.stueckzahl;
            console.log("New Amount: " + newAmount + " Old Amount: " + oldAmount + " Auf Lager " + inStock);
            var inStockPlusOldAmount = (oldAmount + inStock);
            // Hier wird sichergestellt, dass nicht mehr Produkte in den Warenkorb gelegt werden, als auf Lager sind
            if (newAmount > 0) {
                if ((newAmount <= parseInt(inStockPlusOldAmount))) {
                    console.log("New Amount: " + newAmount + " Auf Lager und Old Amount: " + inStockPlusOldAmount);
                    CartProduct.a = newAmount;
                    var productFullPrice = (productPrice * newAmount);
                    totalPrice = totalPrice + productFullPrice;
                    $('.totalPrice').text(totalPrice + " Euro");
                    var diffAmount = newAmount - oldAmount;
                    // Update Product in DB
                    product.stueckzahl = product.stueckzahl - diffAmount;
                    product.gesamtverkauf = product.gesamtverkauf + diffAmount;
                    product.update();
                    console.log("Produkt erfolgreich in DB aktualisiert");
                    cartCount = parseInt(cartCount + diffAmount);
                    $('.cartCounter').text(parseInt(cartCount));
                    // Wenn die Produktanzahl zu hoch ist, gibt es Fehlermeldungen
                } else if (inStock > 0) {
                    window.alert("Nur noch " + inStock + " " + product.name + " auf Lager!");
                    CartProduct.a = oldAmount;
                    $('#' + CartProduct.p.id + 'a').val(oldAmount);
                } else {
                    window.alert(product.name + " ist leider nicht mehr auf Lager.");
                    CartProduct.a = oldAmount;
                    $('#' + CartProduct.p.id + 'a').val(oldAmount);
                }
            } else {
                window.alert("Bitte geben Sie einen gueltigen Wert ein!");
                CartProduct.a = oldAmount;
            }
        });
    });
};


/**
 * Der Gesamtpreis wird auf der Oberfläche wiedergegeben
 */
var printTotalPrice = function () {
    $("#fullPrice").append("<div class=\"row\">" +
        "<div class=\"col-md-6\"></div>" +
        "<div class=\"totalPrice col-md-2\">" + totalPrice + " Euro</div>" +
        "</div></div></div>");
};

