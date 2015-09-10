/**
 * Created by Nat on 07.09.2015.
 */

var cartCount = 0;

/**
 * Togglet die Top-Produkte Ansicht in Hide/Show wenn "m" gedr?ckt wird
 * TODO Bei m (more) verstecken, unterproduktansicht anzeigen
 */
var main = function () {
    $(document).on('keydown', function (event) {
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
        var filter;
        if($(this).hasClass('active'))
        {
            $(this).removeClass("active");
            console.log("active");
            filter = new RegExp("^.*");
        }
        else
        {
            $('.kategorie').removeClass("active");
            $(this).addClass("active");
            console.log("not active");
            filter = new RegExp("^"+this.id);
        }
        showProductOverviewOnly();
        setFilter(filter);
        searchBarAction();
    });

    $('.baum123').click(function () {
       showMainPageOnly();
    });

    $('.more').click(function () {
        DB.ready(allSales);
       showProductOverviewOnly();
    });
};



// Zeigt die LandingPage Ansicht der Hauptseite
var showProductOverviewOnly = function(){
    hideMainPage();
    hideSingleProduct();
    $('.moreBestseller').html("").show();
};

var showMainPageOnly = function(){
    $('.bestsellerRow').html("").show();
    $('.bestsellerText').show();
    $('.more').show();
    hideProductOverview();
    hideSingleProduct();
    topSales();
};

var hideMainPage = function(){
    $('.bestsellerRow').html("").hide();
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

var clickCartBtn = function(){
    $('.cartButton').click(function(){
        cartCount = cartCount + 1;
        $('.cartCounter').text(cartCount);
        var pid = this.id;
        DB.ready(updateProductAnzahl(pid));
    })
};



window.onpopstate = function (event)
{
    console.log("window.onpopstate - Postate-Event registriert!");
    var url = window.location.href;
    console.log("window.onpopstate - Folgende URL wurde eingelesen: " + url);

    if(url.match(/^.*\?p=.*/))
    {
        console.log("window.onpopstate - Anfrage nach Produktansicht erkannt!");
        hideMainPage();
        showSingleProduct();
        var pid = url.substring(url.indexOf('=')+1,url.length);
        console.log("window.onpopstate - Folgende Produkt-ID wurde eingelesen: " + pid);
        DB.ready(loadSingleProduct(pid));
    }
    else if (url.match(/^.*\?s=.*/)) {
        console.log("window.onpopstate - Anfrage nach Suchergebnissen erkannt!");
        showProductOverviewOnly();
        var search = url.substring(url.indexOf('=')+1,url.length);
        console.log("window.onpopstate - Folgender Suchbegriff wurde eingelesen: " + search);
        document.getElementById("searchbar").value = search;
        searchBarAction();
    }
    else {
        console.log("window.onpopstate - Keine Anfrage nach Spezialseiten erkannt.");
        showMainPageOnly();
    }
};

$(document).ready(main);