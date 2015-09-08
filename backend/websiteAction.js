/**
 * Created by Nat on 07.09.2015.
 */


/**
 * Togglet die Top-Produkte Ansicht in Hide/Show wenn "m" gedr?ckt wird
 * TODO Bei m (more) verstecken, unterproduktansicht anzeigen
 */
var main = function () {
    $(document).on('keydown', function (event) {
        $('.kategorie').click(function () {
            $(this).toggleClass("active");
        });
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
    $(document).ready(function () {
        if (window.location.href.match(/^.*\?.*/)) {
            // Seitenumbau!
        }
    })
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
    $('.kategorie').click(function () {
        $(this).toggleClass("active");
    });
};


var clickAction = function () {
    $(".testClass").click(function () {
        console.log(this.id);
        $('.bestsellerRow').hide();
        $('.bestsellerText').hide();
        $('.more').hide();
        $('.singleView').html("").show();
        var pid = this.id;
        DB.ready(loadSingleProduct(pid));
    });
};


$(document).ready(main);