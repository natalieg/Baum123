/**
 * Created by peukert on 09.09.15.
 */

    //Connect
DB.connect("http://baum123.baqend.com");

var register = function() {
    var user = document.getElementById('username').value; //$('#username');
    var pwd =  document.getElementById('pwd').value;
    DB.User.register(user,pwd).then(function () {
        console.log(DB.User.me.username); //'john.doe@example.com'
    });
}

var login = function() {
    var usr = document.getElementById('usr').value;//$('#usr');
    var passwd = document.getElementById('passwd').value;//$('#passwd');
    DB.User.login(usr, passwd).then(function() {
    //Hey we are logged in again
        console.log(DB.User.me.username); //'john.doe@example.com'
    });
}

var lgt = document.getElementById('logout'); //$('#logout').click(function()...);
lgt.onclick = function() {
    DB.User.logout().then(function () {
        //We are logged out again
        console.log(DB.User.me); //null
    });
}
