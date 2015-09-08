/**
 * Created by Nat on 07.09.2015.
 */


/**
 * Togglet die Top-Produkte Ansicht in Hide/Show wenn "m" gedr�ckt wird
 * TODO Bei m (more) verstecken, unterproduktansicht anzeigen
 */
var main = function () {
    $(document).on('keydown', function (event) {
        // Keypress "strg+m"
        if ((event.ctrlKey && ( String.fromCharCode(event.which) === 'm' || String.fromCharCode(event.which) === 'M'))) {
            $('.bestsellerRow').hide();
            $('.bestsellerText').hide();
            $('.more').hide();
            $('.moreBestseller').html("").show();
            DB.ready(allSales);
            // Keypress "strg+y"
        } else if (event.ctrlKey && ( String.fromCharCode(event.which) === 'y' || String.fromCharCode(event.which) === 'Y')) {
            $('.bestsellerRow').show();
            $('.bestsellerText').show();
            $('.more').show();
            $(".moreBestseller").html("").hide();
        }
    });
    $('.searchbar').keyup(function () {
        $('.bestsellerRow').hide();
        $('.bestsellerText').hide();
        $('.more').hide();
        $('.moreBestseller').html("").show();
        searchBarAction();
    });
    $('.sortBox').change(function () {
        $('.bestsellerRow').hide();
        $('.bestsellerText').hide();
        $('.more').hide();
        $('.moreBestseller').html("").show();
        searchBarAction();
    });

};

var clickAction = function(){
    $(".testClass").click(function () {
        console.log(this.id);
        $('.bestsellerRow').hide();
        $('.bestsellerText').hide();
        $('.more').hide();
        var pid = this.id;
        DB.Product.load(pid).then(function (product){
            console.log(JSON.stringify(product));
                    $("#singleProduct").append("<div class=\"col-md-3\"><a href=\"#\" class=\"img-shadow\"><img src=\"" + product.bild + "\"></a>" +
                        "<div class=\"singleView\">" + product.name + " </div>" +
                        "<div class=\"singleView\">" + product.preis + " Euro</div>" +
                        "<div class=\"singleView\">nur noch " + productd.stueckzahl + " vorhanden</div>" +
                        "<div class=\"singleView\">Bewertung: " + product.Feedbacks.reduce(function (avg, el) {
                            return avg + el.Bewertung;
                        }, 0) / product.Feedbacks.size + "</div></div></div>");
                });
            });
};


$(document).ready(main);