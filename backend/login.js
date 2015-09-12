/**
 * Created by peukert on 09.09.15.
 */


var register = function() {
    var user = document.getElementById('username').value; //$('#username');
    var pwd =  document.getElementById('pwd').value;
    DB.User.register(user,pwd).then(function () {
        console.log(DB.User.me.username);
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
    //Hey we are logged in again
        console.log(DB.User.me.username);
        $("#logout").show();
        $(".button1").hide();
        $(".button2").hide();
    });
}

var lgt = document.getElementById('logout'); //$('#logout').click(function()...);
lgt.onclick = function() {
    DB.User.logout().then(function () {
        //We are logged out again
        console.log("Logged out: "); //null
        $("#logout").hide();
        $(".button1").show();
        $(".button2").show();
    });
}