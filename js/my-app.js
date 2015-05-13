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
  dynamicNavbar: true
})

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('registro', function (page) {
    mainView.hideNavbar();
    mainView.params.swipeBackPage = false;
    mainView.params.preloadPreviousPage = false;
    $$('.registro-fb').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
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
		function (response) { myApp.alert('Has cancelado tu registro.', 'Sin registro') });
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

                document.getElementById("imgusuario").style.background = "url(" + "https://graph.facebook.com/" + idusuario + "/picture?width=200" + ") center no-repeat";
                document.getElementById("nombreusuario").innerHTML = "<p>" + nombreusuario + "</p>";
            },
            function (response) { alert(JSON.stringify(response)) });
	    }
	    else {
	        
	    }
	},
	function (response)
	{ myApp.alert('Tenemos problemas para ingresar con Facebook.', 'Sin registro')});

    $$('.ingreso-app').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
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
            url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
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
    
    PreferenciaViewModel();

    $$('.listapreferencias').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        var preferenciausuario = jQuery(this).attr("id");
        window.localStorage.setItem('preferencia_usuario', preferenciausuario);
        mainView.router.loadPage('main.html');
    });
});

myApp.onPageInit('main', function (page) {
    
    MainViewModel();


    $$('#lista_sugeridos').on('click', '.listasugeridos' ,function () {

        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        var idcliente = jQuery(this).attr("id");
        mainView.router.loadPage('detallecliente.html?id='+idcliente);
    });

    $$('#lista_todos').on('click', '.listatodos' ,function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        var idcliente = jQuery(this).attr("id");
        mainView.router.loadPage('detallecliente.html?id='+idcliente);
    });

    $$('.link-configuracion').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        mainView.router.loadPage('configuracion.html');
    });
});

myApp.onPageInit('detalle', function (page) {
    
    loadjscssfile("../css/font-awesome.min.css", "css") ////dynamically load and add this .css file
    loadjscssfile("http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css", "css") ////dynamically load and add this .css file
    
    var idcliente = page.query.id;
    DetalleViewModel(idcliente);

    $$('.link-back-button').on('click', function () {
        removejscssfile("../css/font-awesome.min.css", "css") ////dynamically load and add this .css file
        removejscssfile("http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css", "css") ////dynamically load and add this .css file
        
        mainView.router.back();
    });

    $$('.link-ircalificar-button').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        mainView.router.loadPage('calificar.html?id='+idcliente);
    });

    $$('.link-video-button').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        alert("hola");
    });

    $$('.link-navegar-button').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        
    });

    $$('.link-check-button').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        
    });
});

myApp.onPageBack('detalle', function (page) {

    removejscssfile("../css/font-awesome.min.css", "css") ////dynamically load and add this .css file
    removejscssfile("http://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css", "css") ////dynamically load and add this .css file
    
});

myApp.onPageInit('calificar', function (page) {
    
    var idcliente = page.query.id;
    CalificarViewModel();

    $$('.link-back-button').on('click', function () {
        mainView.router.back();
    });

    $$('.link-calificar-button').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        var calificacionmusica = document.getElementById("input-musica-calificar").value;
        var calificacionservicio = document.getElementById("input-servicio-calificar").value;
        var calificacionambiente = document.getElementById("input-ambiente-calificar").value;
        var calificacionproducto = document.getElementById("input-producto-calificar").value;
        var calificacioncomentario = document.getElementById("input-comentario-calificar").value;
        //enviamos la calificacion al servidor
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        var idusuario = window.localStorage.getItem('id_usuario');
        var datastring = "tipo=nuevacalificacion&idcliente="+idcliente+"&idusuario=" + idusuario + "&fecha_calificacion=" + fechaactual + "&calificacion1="+calificacionmusica+"&calificacion2="+calificacionservicio+"&calificacion3="+calificacionambiente+"&calificacion4=" + calificacionproducto + "&comentario=" + calificacioncomentario;
        $.ajax({
            type: "GET",
            url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
            success: function (result) {        
                
            },
            error: function (objeto, quepaso, otroobj) {
                alert("Pasó lo siguiente: " + quepaso);
            }
        });
        //enviamos los puntos del usuario al servidor
        var puntos = "7";
        if(calificacioncomentario != "")
            puntos = "12";
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        var datastring = "tipo=nuevoregistrousuario&idcliente="+idcliente+"idusuario=" + idusuario + "&fecha_registro=" + fechaactual + "&puntos="+ puntos +"&tipo_registro=3";
        $.ajax({
            type: "GET",
            url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
            success: function (result) {    
                myApp.popup('.popup-felicitaciones');
            },
            error: function (objeto, quepaso, otroobj) {
                myApp.alert('En estos momentos tu publicación no se envió, intenta en un momento', 'Ups, problemas'); 
                return;
            }
        });
    });

    $$('.cerrar-felicitacion').on('click', function () {
        myApp.closeModal('.popup-felicitaciones')
        mainView.router.back();
    });
    
    
});

myApp.onPageInit('configuracion', function (page) {
    
    ConfigViewModel();

    $$('.link-back-button').on('click', function () {
        mainView.router.back();
    });

    $$('.link-info').on('click', function () {
        mainView.router.loadPage('info.html');
    });

    $$('.listapreferenciasc').on('click', function () {
        var preferenciausuario = jQuery(this).attr("id");
        window.localStorage.setItem('preferencia_usuario', preferenciausuario);
        mainView.router.loadPage('main.html');
    });
    
});

myApp.onPageInit('info', function (page) {
    
    $$('.link-back-button').on('click', function () {
        mainView.router.back();
    });

    $$('.link-synet').on('click', function () {
        window.open("http://synet.com.co", '_system');
    });
    
    $("a[target='_blank']").click(function(e){
      e.preventDefault();
      window.open($(e.currentTarget).attr('href'), '_system', '');
    });
    
});