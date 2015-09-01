/**
 * Created by Nat on 01.09.2015.
 */

DB.connect("http://baum123.baqend.com");


DB.Product.load('bce7aaa6-7ee5-4153-a683-88874bc66083').then(function(product) {
    console.log(product.name);
});