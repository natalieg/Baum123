/**
 * Created by peukert on 09.09.15.
 */


$(document).ready(function() {

    DB.ready()
    .then(function () {
        if (!DB.User.me) {
            $("#logout").hide();
            $(".button1").show();
            $(".button2").show();
        }
        else
        {
            $("#logout").show();
            $(".button1").hide();
            $(".button2").hide();
        }
        });

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

var register = function() {
    var user = document.getElementById('username').value; //$('#username');
    var pwd =  document.getElementById('pwd').value;
    DB.User.register(user,pwd).then(function () {
        //User als Rolle Kaeufer eintragen
        DB.Role.load(11).then(function(role){
            console.log("Rollen: " + role);
            role.addUser(DB.User.me);
            role._metadata.writeAccess();
            role.save();
            $("#logout").show();
            $(".button1").hide();
            $(".button2").hide();
        });
    });
}

var login = function() {
    var usr = document.getElementById('usr').value;//$('#usr');
    var passwd = document.getElementById('passwd').value;//$('#passwd');
    DB.User.login(usr, passwd).then(function() {
        $("#logout").show();
        $(".button1").hide();
        $(".button2").hide();

        //wenn Admin, dann Admin-Seite
        DB.ready().then(function() {
            return DB.User.me && DB.Role.load(10);
        }).then(function(role) {
            if (role || role.hasUser(DB.User.me))
            {
                window.location=("http://localhost:63342/baum123/frontend/produktaenderung.html");
            }
        });
    });

}

$('#logout').click(function()
{
    DB.User.logout().then(function ()
    {
        $("#logout").hide();
        $(".button1").show();
        $(".button2").show();
    });
});