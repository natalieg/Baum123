/**
 * Created by Nat on 07.09.2015.
 */

var cartCount = 0;

/**
 * Togglet die Top-Produkte Ansicht in Hide/Show wenn "m" gedr?ckt wird
 * TODO Bei m (more) verstecken, unterproduktansicht anzeigen
 */
var cartItems = [];
var totalPrice = 0;
/**
function stopRKey(evt) {
    var evt = (evt) ? evt : ((event) ? event : null);
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if ((evt.keyCode == 13) && (node.type=="text"))  {return false;}
}

document.onkeypress = stopRKey;
**/

var main = function () {
   hideCartPage();

    DB.ready(function()
    {
        var url = window.location.href;
        if(url.match(/^.*\?p=.*/))
        {
            showSingleProductOnly();
            var pid = url.substring(url.indexOf('=')+1,url.length);
            loadSingleProduct(pid);
        }
        else if (url.match(/^.*\?s=.*f=.*/)) {
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
            startSearch();
        }
        else if (url.match(/^.*\?cart.*/))
        {
            visualizeCartPage();
        }
        else {
            $('.kategorie').removeClass("active");
            document.getElementById("searchbar").value = "";
            showMainPageOnly();
        }
    });


    $('.searchbar').on('keyup', function (event) {
        if(!(event.ctrlKey || event.altKey || event.shiftKey || String.fromCharCode(event.which) == 27 || String.fromCharCode(event.which) == 13))
        {
            startSearch();
        }
    });

    $('.sortBox').change(function () {
        startSearch();
    });

    $('.kategorie').click(function () {
        var filter;
        if($(this).hasClass('active'))
        {
            $(this).removeClass("active");
            filter = new RegExp("^.*");
        }
        else
        {
            $('.kategorie').removeClass("active");
            $(this).addClass("active");
            filter = new RegExp("^"+this.id);
        }
        setFilter(filter);
        startSearch();
    });

    $('#welcome').click(function () {
        $('.kategorie').removeClass("active");
        document.getElementById("searchbar").value = "";
        window.history.pushState({info: "Mainpage"}, null, "index.html");
       showMainPageOnly();
    });

    // Wird auf "Show me more" gelickt, werden weitere Produkte in einem kleineren Raster angezeigt
    $('.more').click(function () {
        $('.kategorie').removeClass("active");
        window.history.pushState({info: "Mainpage"}, null, "?s=&f=");
        startSearch();
    });

    // Warenkorb Seite wird angezeigt wenn das Warenkorb Symbol angeklickt wird
    $('.cart').click(function(){
        visualizeCartPage();
        window.history.pushState({info: "Cart"}, null, "?cart");
    });
};



// Zeigt die Produktuebersicht Ansicht der Hauptseite
var showProductOverviewOnly = function(){
    hideMainPage();
    hideSingleProduct();
    hideCartPage();
    $('.moreBestseller').html("").show();
};

var hideProductOverview = function(){
    $(".moreBestseller").html("").hide();
};

// LandingPage wird angezeigt
var showMainPageOnly = function(){
    $('.bestsellerRow').html("").show();
    $('.bestsellerText').show();
    $('.more').show();
    hideProductOverview();
    hideSingleProduct();
    hideCartPage();
    DB.ready(topSales());
};

var hideMainPage = function(){
    $('.bestsellerRow').html("").hide();
    $('.bestsellerText').hide();
    $('.more').hide();
};

function showSingleProductOnly()
{
    hideMainPage();
    hideProductOverview();
    hideCartPage();
    $('.singleView').html("").show();
}

var hideSingleProduct = function(){
    $('.singleView').html("").hide();
};

var showCartPage = function(){
    $('#cartTop').show();
    $('#cartPage').html("").show();
    $('#fullPrice').html("").show();
};

var hideCartPage = function(){
    $('#cartTop').hide();
    $('#cartPage').hide();
    $('#fullPrice').hide();
};

// Wenn ein Produkt angeklickt wir auf der Hauptseite oder auf der Uebersicht
// gelangt man auf eine Einzelproduktseite
var clickAction = function () {
    $(".productLink").click(function () {
        showSingleProductOnly();
        var pid = this.id;
        var urlString = "?p=" + pid;
        var popString = "Page of " + pid;
        window.history.pushState({info: popString}, null, urlString);
        DB.ready(loadSingleProduct(pid));
    });
};

// Im Warenkorb wird die St�ckzahl geaendert, daraufhin muss die Datenbank aktualisiert und auch
// der Gesamtpreis neu berechnet werden
var changeCartAmountAction = function(){
    $('#fullPrice').html("").show();
    $('.cartAmountInput').change(function(){
        changeAndCalculateFullPrice();
    });
};

// Action f�r den Warenkorb-Button, wenn dieser geklickt wird, wird die St�ckzahl im Warenkorb um
// 1 erh�ht und in der Datenbank um 1 verringert
var clickCartBtn = function(){
    $('.cartButton').click(function(){
        var pid = this.id;
        DB.ready(updateProductQuantity(pid, 1));
    })
};



window.onpopstate = function (event)
{
    var url = window.location.href;

    if(url.match(/^.*\?p=.*/))
    {
        showSingleProductOnly();
        var pid = url.substring(url.indexOf('=')+1,url.length);
        DB.ready(loadSingleProduct(pid));
    }
    else if (url.match(/^.*\?cart.*/))
    {
        visualizeCartPage();
    }
    else if (url.match(/^.*\?s=.*f=.*/)) {
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
        startSearch();
    }
    else {
        $('.kategorie').removeClass("active");
        document.getElementById("searchbar").value = "";
        showMainPageOnly();
    }
};

//Wrappermethoden------------------------------------------------------------------------------------

function startSearch()
{
    showProductOverviewOnly();
    searchBarAction();
}

function visualizeCartPage()
{
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
}



$(document).ready(main);