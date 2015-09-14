/**
 * Created by Nat on 07.09.2015.
 */

var cartCount = 0;

/**
 * Togglet die Top-Produkte Ansicht in Hide/Show wenn "m" gedr?ckt wird
 * TODO Bei m (more) verstecken, unterproduktansicht anzeigen
 */
var main = function () {
    hideCartPage();

    DB.ready(function()
    {
        var url = window.location.href;
        console.log("reach this!");
        if(url.match(/^.*\?p=.*/))
        {
            hideMainPage();
            hideProductOverview();
            showSingleProduct();
            var pid = url.substring(url.indexOf('=')+1,url.length);
            loadSingleProduct(pid);
        }
        else if (url.match(/^.*\?s=.*f=.*/)) {
            showProductOverviewOnly();
            var paramString = url.substring(url.indexOf('s=')+1,url.length);
            var filterString = paramString.substring(paramString.indexOf('f=')+2, paramString.length);
            setFilter(new RegExp("^" + filterString));
            var searchLength = paramString.length - ( filterString.length + 3);
            var searchString = paramString.substring(1 , searchLength);
            document.getElementById("searchbar").value = searchString;

            $('.kategorie').each(function()
            {
                if(this.id == filterString)
                {
                    $(this).addClass("active");
                }
                else
                {
                    $(this).removeClass("active");
                }
            });

            searchBarAction();
        }});

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
    $('#welcome').click(function () {
        $('.kategorie').removeClass("active");
        window.history.pushState({info: "Mainpage"}, null, "index.html");
       showMainPageOnly();
    });
    // Wird auf "Show me more" gelickt, werden weitere Produkte in einem kleineren Raster angezeigt
    $('.more').click(function () {
        DB.ready(allSales);
        $('.kategorie').removeClass("active");
        window.history.pushState({info: "Mainpage"}, null, "?s=&f=");
       showProductOverviewOnly();
    });
    // Warenkorb Seite wird angezeigt wenn das Warenkorb Symbol angeklickt wird
    $('.cart').click(function(){
        hideMainPage();
        hideProductOverview();
        hideSingleProduct();

        $('.kategorie').each(function()
        {
            $(this).removeClass("active");
        });
        showCartPage();
        buildCartPage();
        printTotalPrice();
        changeAndCalculateFullPrice();
    });
};



// Zeigt die Produktuebersicht Ansicht der Hauptseite
var showProductOverviewOnly = function(){
    hideMainPage();
    hideSingleProduct();
    hideCartPage();
    $('.moreBestseller').html("").show();
};

// LandingPage wird angezeigt
var showMainPageOnly = function(){
    $('.bestsellerRow').html("").show();
    $('.bestsellerText').show();
    $('.more').show();
    hideProductOverview();
    hideSingleProduct();
    hideCartPage();
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

var showCartPage = function(){
    $('#cartTop').show();
    $('#cartPage').html("").show();
    $('#fullPrice').html("").show();
}

var hideCartPage = function(){
    $('#cartTop').hide();
    $('#cartPage').hide();
    $('#fullPrice').hide();
};

// Wenn ein Produkt angeklickt wir auf der Hauptseite oder auf der Uebersicht
// gelangt man auf eine Einzelproduktseite
var clickAction = function () {
    $(".productLink").click(function () {
        console.log(this.id);
        hideMainPage();
        hideProductOverview();
        hideCartPage();
        showSingleProduct();
        var pid = this.id;
        var urlString = "?p=" + pid;
        var popString = "Page of " + pid;
        window.history.pushState({info: popString}, null, urlString);
        DB.ready(loadSingleProduct(pid));
    });
};

// Im Warenkorb wird die Stückzahl geaendert, daraufhin muss die Datenbank aktualisiert und auch
// der Gesamtpreis neu berechnet werden
var changeCartAmountAction = function(){
    $('#fullPrice').html("").show();
    $('.cartAmountInput').change(function(){
        changeAndCalculateFullPrice();
    });
};

// Action für den Warenkorb-Button, wenn dieser geklickt wird, wird die Stückzahl im Warenkorb um
// 1 erhöht und in der Datenbank um 1 verringert
var clickCartBtn = function(){
    $('.cartButton').click(function(){
        cartCount = cartCount + 1;
        $('.cartCounter').text(cartCount);
        var pid = this.id;
        DB.ready(updateProductQuantity(pid, 1));
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
        hideProductOverview();
        showSingleProduct();
        var pid = url.substring(url.indexOf('=')+1,url.length);
        console.log("window.onpopstate - Folgende Produkt-ID wurde eingelesen: " + pid);
        DB.ready(loadSingleProduct(pid));
    }
    else if (url.match(/^.*\?s=.*f=.*/)) {
        console.log("window.onpopstate - Anfrage nach Suchergebnissen erkannt!");
        showProductOverviewOnly();
        var paramString = url.substring(url.indexOf('s=')+1,url.length);
        var filterString = paramString.substring(paramString.indexOf('f=')+2, paramString.length);
        setFilter(new RegExp("^" + filterString));
        var searchLength = paramString.length - ( filterString.length + 3);
        var searchString = paramString.substring(1 , searchLength);
        console.log("window.onpopstate - Folgender Filter wurde eingelesen: " + filterString);
        console.log("window.onpopstate - Folgender Suchbegriff wurde eingelesen: " + searchString);
        document.getElementById("searchbar").value = searchString;

        $('.kategorie').each(function()
        {
            if(this.id == filterString)
            {
                $(this).addClass("active");
            }
            else
            {
                $(this).removeClass("active");
            }
        });
        searchBarAction();
    }
    else {
        console.log("window.onpopstate - Keine Anfrage nach Spezialseiten erkannt.");
        $('.kategorie').removeClass("active");
        document.getElementById("searchbar").value = "";
        showMainPageOnly();
    }
};

$(document).ready(main);