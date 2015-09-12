/**
 * Created by peukert on 11.09.15.
 */

$(document).ready(function() {
    $("#logout").hide();
    $(".button1").click(function(e) {
        $("body").append('<div class="overlay"></div>');
        $(".popup1").show();
        $(".anmelden1").click(function(e){
            $(".popup1, .overlay").hide();
        });

        $(".close").click(function(e) {
            $(".popup1, .overlay").hide();
        });
    });
    $(".button2").click(function(e) {
        $("body").append('<div class="overlay"></div>');
        $(".popup2").show();
        $(".anmelden2").click(function(e){
            $(".popup2, .overlay").hide();
        });

        $(".close").click(function(e) {
            $(".popup2, .overlay").hide();
        });
    });
});