document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    //alert("navigator.geolocation works well");
}

// Initialize your app
var myApp = new Framework7({
  //init: false //Disable App's automatica initialization
}); 

// Export selectors engine
var $$ = Dom7;

/* Initialize views */
var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true,
  swipeBackPage: false
})

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('registro', function (page) {
    mainView.hideNavbar();
    mainView.params.swipeBackPage = false;
    mainView.params.preloadPreviousPage = false;
    $$('.registro-fb').on('click', function () {
        if (!window.cordova) {
            var appId = prompt("Enter FB Application ID", "");
            facebookConnectPlugin.browserInit(appId);
        }
        facebookConnectPlugin.login(["public_profile"],
		function (response) //success
		{
		    //alert(JSON.stringify(response))
		    mainView.router.loadPage('perfil.html');
		},
		function (response) { alert("Has cancelado tu registro.") });
    });
});

myApp.onPageInit('perfil', function (page) {

    var idusuario = "";
    var cumpleusuario = "";
    var nombreusuario = "";
    var emailusuario = "";
    var generousuario = "";
    var edadusuario = "";
    var imagenusuario = "";

    facebookConnectPlugin.getLoginStatus(
	function (response) //success
	{
	    if (response.status === 'connected') {
	        facebookConnectPlugin.api("me/?fields=id,birthday,name,email,gender", ["user_birthday"],
            function (response) //success
            {
                idusuario = response.id;
                cumpleusuario = response.birthday;
                nombreusuario = response.name;
                emailusuario = response.email;
                generousuario = response.gender;
                imagenusuario = "https://graph.facebook.com/" + idusuario + "/picture?width=200";

                document.getElementById("imgusuario").style.background = "url(" + "https://graph.facebook.com/" + idusuario + "/picture?width=200" + ") fixed center no-repeat";
                document.getElementById("nombreusuario").innerHTML = "<p>" + nombreusuario + "</p>";
            },
            function (response) { alert(JSON.stringify(response)) });
	    }
	    else {
	        
	    }
	},
	function (response)
	{ alert("Tenemos problemas para ingresar con Facebook") });

    $$('.ingreso-app').on('click', function () {
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        var datastring = "tipo=nuevousuario&idusuario=" + idusuario + "&nombre=" + nombreusuario + "&correo=" + emailusuario + "&fecha_registro=" + fechaactual + "&ubicacion=Medellin&latitud=&longitud=&sexo=" + generousuario + "&edad=0&imagen=" + imagenusuario;
        var parametros = {
            "tipo": "nuevousuario",
            "idusuario": idusuario,
            "nombre": nombreusuario,
            "correo": emailusuario,
            "fecha_registro": fechaactual,
            "ubicacion": "Medellin",
            "latitud": "",
            "longitud": "",
            "sexo": generousuario,
            "edad": "0",
            "imagen": imagenusuario
        };
        //envio el query para guardar el nuevo usuario en la BD
        $.ajax({
            type: "GET",
            url: "http://54.186.255.219/buskala/querys/InsertarBD.php?"+datastring,
            success: function (result) {        
                window.localStorage.setItem('id_usuario', idusuario);
                window.localStorage.setItem('nombre_usuario', nombreusuario);
                window.localStorage.setItem('imagen_usuario', imagenusuario);
                mainView.router.loadPage('preferencias.html');
            },
            error: function (objeto, quepaso, otroobj) {
                alert("Pasó lo siguiente: " + quepaso);
            }
        });
    });
});

myApp.onPageInit('preferencias', function (page) {
    var prefViewModel = new PreferenciaViewModel();
    ko.applyBindings(prefViewModel);
    $$('.listapreferencias').on('click', function () {
        var preferenciausuario = jQuery(this).attr("id");
        window.localStorage.setItem('preferencia_usuario', preferenciausuario);
        mainView.router.loadPage('main.html');
    });
});

myApp.onPageInit('main', function (page) {

    var mainViewModel = new MainViewModel();
    ko.applyBindings(mainViewModel);

    $$('.logout-fb').on('click', function () {
        facebookConnectPlugin.logout(
		function (response) //success
		{
		    //alert(JSON.stringify(response))
            window.localStorage.removeItem('id_usuario');
            window.localStorage.removeItem('preferencia_usuario');
		    window.location.href = 'index.html';
		},
		function (response) { alert(JSON.stringify(response)) });
    });
});