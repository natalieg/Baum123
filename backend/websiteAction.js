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
            DB.ready(allSales);
            showProductOverviewOnly();
            // Keypress "strg+y"
        } else if (event.ctrlKey && ( String.fromCharCode(event.which) === 'y' || String.fromCharCode(event.which) === 'Y')) {
            showMainPageOnly();
        }
    });

    $('.searchbar').keyup(function () {
       // if(event.ctrlKey || event.altKey || event.shiftKey || String.fromCharCode(event.which) == 27 || String.fromCharCode(event.which) == 13)
        //{console.log("fuu")};
        showProductOverviewOnly();
        searchBarAction();
    });
    $('.sortBox').change(function () {
        showProductOverviewOnly();
        searchBarAction();
    });
    $('.kategorie').click(function () {
        $(this).toggleClass("active");
    });
};

// Zeigt die LandingPage Ansicht der Hauptseite
var showProductOverviewOnly = function(){
    hideMainPage();
    hideSingleProduct();
    $('.moreBestseller').html("").show();
};

var showMainPageOnly = function(){
    $('.bestsellerRow').show();
    $('.bestsellerText').show();
    $('.more').show();
    hideProductOverview();
    hideSingleProduct();
};

var hideMainPage = function(){
    $('.bestsellerRow').hide();
    $('.bestsellerText').hide();
    $('.more').hide();
};

var hideProductOverview = function(){
    $(".moreBestseller").html("").hide();
};

var hideSingleProduct = function(){
    $('.singleView').html("").hide();
};

var showSingleProduct = function(){
    $('.singleView').html("").show();
};

var clickAction = function () {
    $(".productLink").click(function () {
        console.log(this.id);
        hideMainPage();
        hideProductOverview();
        showSingleProduct();
        var pid = this.id;
        var urlString = "?p=" + pid;
        var popString = "Page of " + pid;
        window.history.pushState({info: popString}, null, urlString);
        DB.ready(loadSingleProduct(pid));
    });
};

window.onpopstate = function (event)
{
var url = window.location.href;
    if(url.match(/^.*\?p=.*/))
    {
        $('.bestsellerRow').hide();
        $('.bestsellerText').hide();
        $('.more').hide();
        $('.singleView').html("").show();
        var pid = url.substring(url.indexOf('=')+1,url.length);
        console.log("pid " + pid);
        DB.ready(loadSingleProduct(pid));
    }
    else if (url.match(/^.*\?s=.*/))
    {
        $('.bestsellerRow').hide();
        $('.bestsellerText').hide();
        $('.more').hide();
        $('.moreBestseller').html("").show();
        document.getElementById("searchbar").value = url.substring(url.indexOf('=')+1,url.length);
        searchBarAction();
    }
    else
    {
        $('.bestsellerRow').show();
        $('.bestsellerText').show();
        $('.more').show();
        $(".moreBestseller").html("").hide();
        $('.singleView').html("").hide();
    }
};

$(document).ready(main);