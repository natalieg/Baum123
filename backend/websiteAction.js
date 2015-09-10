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
        console.log("searchbar.keyup - Keyrelease registriert!");
        showProductOverviewOnly();
        searchBarAction();
    });
    $('.sortBox').change(function () {
        console.log("sortBox.change - Änderung an der Combobox registriert!");
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
    console.log("window.onpopstate - Postate-Event registriert!");
    var url = window.location.href;
    console.log("window.onpopstate - Folgende URL wurde eingelesen: " + url);

    if(url.match(/^.*\?p=.*/))
    {
        console.log("window.onpopstate - Anfrage nach Produktansicht erkannt!");
        $('.bestsellerRow').hide();
        $('.bestsellerText').hide();
        $('.more').hide();
        $('.singleView').html("").show();
        var pid = url.substring(url.indexOf('=')+1,url.length);
        console.log("window.onpopstate - Folgende Produkt-ID wurde eingelesen: " + pid);
        DB.ready(loadSingleProduct(pid));
    }
    else if (url.match(/^.*\?s=.*/))
    {
        console.log("window.onpopstate - Anfrage nach Suchergebnissen erkannt!");
        $('.bestsellerRow').hide();
        $('.bestsellerText').hide();
        $('.more').hide();
        $('.moreBestseller').html("").show();
        var search = url.substring(url.indexOf('=')+1,url.length);
        console.log("window.onpopstate - Folgender Suchbegriff wurde eingelesen: " + search);
        document.getElementById("searchbar").value = search;
        searchBarAction();
    }
    else
    {
        console.log("window.onpopstate - Keine Anfrage nach Spezialseiten erkannt.");
        $('.bestsellerRow').show();
        $('.bestsellerText').show();
        $('.more').show();
        $(".moreBestseller").html("").hide();
        $('.singleView').html("").hide();
    }
};

$(document).ready(main);