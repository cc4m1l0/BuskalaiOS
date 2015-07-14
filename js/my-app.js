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


    $$('.registro-buskala').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        mainView.router.loadPage('login.html');
    });

    $$('.registrarse-app').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        mainView.router.loadPage('registrobuskala.html');
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
        var anionacimiento = document.getElementById("anionacimiento").value;
        if(anionacimiento == parseInt(anionacimiento))
        {
            var fechaactual = new Date();
            var anioactual = fechaactual.getFullYear();
            edadusuario = anioactual - anionacimiento;
            if (edadusuario < 18)
            {
                myApp.alert('Debes ser mayor de edad para ingresar a Buskala. Ej (1991)', 'Menor de edad'); 
                return;
            }
            if (edadusuario > 90)
            {
                myApp.alert('¿Seguro tienes esta edad?. Te falta poco para alcanzar a Matusalem, por favor intenta con otra fecha.', 'Conflicto de edad'); 
                return;
            }

        }
        else
        {
            myApp.alert('Por favor ingresa un año de nacimiento correcto e intenta nuevamente. Ej (1991)', 'Edad incorrecta'); 
            return;
        }

        myApp.showPreloader('Registrando tu perfil...');
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        var datastring = "tipo=nuevousuario&idusuario=" + idusuario + "&nombre=" + nombreusuario + "&correo=" + emailusuario + "&fecha_registro=" + fechaactual + "&ubicacion=Medellin&latitud=&longitud=&sexo=" + generousuario + "&edad=" + edadusuario + "&imagen=" + imagenusuario;
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
                myApp.hidePreloader();
                mainView.router.loadPage('preferencias.html');
            },
            error: function (objeto, quepaso, otroobj) {
                myApp.hidePreloader();
                alert("Pasó lo siguiente: " + quepaso);
            }
        });
    });
});

myApp.onPageInit('login', function (page) {

    var nombreusuario = "";
    var lcvusuario = "";

    $$('.link-back-button').on('click', function () {
        mainView.router.back();
    });

    $$('.loginb-app').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }

        emailusuario = document.getElementById("emailusuario").value;
        if(emailusuario == ""){
            myApp.alert('Por favor ingresa tu correo electrónico .', 'Faltan datos'); 
            return;
        }
        lcvusuario = document.getElementById("lcvusuario").value;
        if(lcvusuario == ""){
            myApp.alert('Por favor ingresa una clave.', 'Faltan datos'); 
            return;
        }

        myApp.showPreloader('Validando tus datos...');
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        var datastring = "tipo=validarusuariob&correo=" + emailusuario + "&lcv=" + lcvusuario;
        
        //envio el query para guardar el nuevo usuario en la BD
        $.ajax({
            type: "GET",
            url: "http://buskala.azurewebsites.net/querys/ListarBD.php?"+datastring,
            success: function (result) {        
                if (result == 'noencontrado')
                {
                    myApp.hidePreloader();
                    myApp.alert('Los datos ingresados no coinciden con nuestros registros, por favor verifica que sean correctos.', 'Datos incorrectos'); 
                    return;
                }
                else
                {
                    var res = result.split('::');
                    window.localStorage.setItem('id_usuario', res[0]);
                    window.localStorage.setItem('nombre_usuario', res[1]);
                    window.localStorage.setItem('imagen_usuario', "");
                    myApp.hidePreloader();
                    mainView.router.loadPage('preferencias.html');
                }
            },
            error: function (objeto, quepaso, otroobj) {
                myApp.hidePreloader();
                alert("Pasó lo siguiente: " + quepaso);
            }
        });
    });

    $$('.olvideclave-app').on('click', function () {
        mainView.router.loadPage('recuperarclave.html');
    });

});

myApp.onPageInit('recuperarclave', function (page) {

    var nombreusuario = "";
    var lcvusuario = "";

    $$('.link-back-button').on('click', function () {
        mainView.router.back();
    });

    $$('.recuperarclv-app').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }

        emailusuario = document.getElementById("emailusuario").value;
        if(emailusuario == ""){
            myApp.alert('Por favor ingresa tu correo electrónico .', 'Faltan datos'); 
            return;
        }

        myApp.showPreloader('Validando tus datos...');
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        var datastring = "tipo=recuperarclave&correo=" + emailusuario;
        
        //envio el query para guardar el nuevo usuario en la BD
        $.ajax({
            type: "GET",
            url: "http://buskala.azurewebsites.net/querys/ListarBD.php?"+datastring,
            success: function (result) {        
                if (result == 'noexiste')
                {
                    myApp.hidePreloader();
                    myApp.alert('El correo ingresado no coincide con nuestros registros, por favor verifica que sea correcto.', 'Dato incorrecto'); 
                    return;
                }
                else
                {
                    myApp.alert('Hemos enviado los datos de tu cuenta al correo proporcinado. Gracias.', 'Correo enviado'); 
                    myApp.hidePreloader();
                    mainView.router.back();
                }
            },
            error: function (objeto, quepaso, otroobj) {
                myApp.hidePreloader();
                alert("Pasó lo siguiente: " + quepaso);
            }
        });
    });

});

myApp.onPageInit('registrobuskala', function (page) {

    var idusuario = "";
    var cumpleusuario = "";
    var nombreusuario = "";
    var emailusuario = "";
    var generousuario = "";
    var edadusuario = "";
    var lcvusuario = "";
    var lcvusuariore = "";

    var date = new Date();
    var components = [date.getYear(),date.getMonth(),date.getDate(),date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];

    $$('.link-back-button').on('click', function () {
        mainView.router.back();
    });

    $$('.registrob-app').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }

        idusuario = components.join("");
        nombreusuario = document.getElementById("nombrecomleto").value;
        if(nombreusuario == ""){
            myApp.alert('Por favor ingresa tu nombre completo.', 'Faltan datos'); 
            return;
        }
        emailusuario = document.getElementById("emailusuario").value;
        if(emailusuario == ""){
            myApp.alert('Por favor ingresa tu correo electrónico .', 'Faltan datos'); 
            return;
        }
        lcvusuario = document.getElementById("lcvusuario").value;
        if(lcvusuario == ""){
            myApp.alert('Por favor ingresa una clave.', 'Faltan datos'); 
            return;
        }
        lcvusuariore = document.getElementById("lcvusuariore").value;
        if(lcvusuariore == ""){
            myApp.alert('Por favor vuelve a ingresar la clave.', 'Faltan datos'); 
            return;
        }
        if(lcvusuario != lcvusuariore){
            myApp.alert('Las claves ingresadas no coinciden.', 'Datos incorrectos'); 
            return;
        }
        generousuario = document.getElementById("generousuario").value;

        var anionacimiento = document.getElementById("anionacimiento").value;
        if(anionacimiento == parseInt(anionacimiento))
        {
            var fechaactual = new Date();
            var anioactual = fechaactual.getFullYear();
            edadusuario = anioactual - anionacimiento;
            if (edadusuario < 18)
            {
                myApp.alert('Debes ser mayor de edad para ingresar a Buskala. Ej (1991)', 'Menor de edad'); 
                return;
            }
            if (edadusuario > 90)
            {
                myApp.alert('¿Seguro tienes esta edad?. Te falta poco para alcanzar a Matusalem, por favor intenta con otra fecha.', 'Conflicto de edad'); 
                return;
            }

        }
        else
        {
            myApp.alert('Por favor ingresa un año de nacimiento correcto e intenta nuevamente. Ej (1991)', 'Edad incorrecta'); 
            return;
        }

        myApp.showPreloader('Registrando tu perfil...');
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        var datastring = "tipo=nuevousuariolocal&idusuario=" + idusuario + "&nombre=" + nombreusuario + "&correo=" + emailusuario + "&fecha_registro=" + fechaactual + "&ubicacion=Medellin&latitud=&longitud=&sexo=" + generousuario + "&edad=" + edadusuario + "&lcv=" + lcvusuario;
        
        //envio el query para guardar el nuevo usuario en la BD
        $.ajax({
            type: "GET",
            url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
            success: function (result) {        
                window.localStorage.setItem('id_usuario', idusuario);
                window.localStorage.setItem('nombre_usuario', nombreusuario);
                window.localStorage.setItem('imagen_usuario', "");
                myApp.hidePreloader();
                mainView.router.loadPage('preferencias.html');
            },
            error: function (objeto, quepaso, otroobj) {
                myApp.hidePreloader();
                alert("Pasó lo siguiente: " + quepaso);
            }
        });
    });

    $$('.olvideclave-app').on('click', function () {
        mainView.router.loadPage('recuperarclave.html');
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
    //apppush.registerForPush();

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

    $$('.link-qr').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            myApp.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', 'Sin internet'); 
            return;
        }
        mainView.router.loadPage('checkqr.html');
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
            navigator.notification.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', null ,'Sin internet','OK'); 
            return;
        }
        mainView.router.loadPage('calificar.html?id='+idcliente);
    });

    $$('.link-video-button').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            navigator.notification.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', null ,'Sin internet','OK'); 
            return;
        }
        var latu= document.getElementById("latitud_usuario").value;
        var lngu= document.getElementById("longitud_usuario").value;
        var latc= document.getElementById("latitud_cliente").value;
        var lngc= document.getElementById("longitud_cliente").value;
        if(latu == "0" || lngu == "0" )
        {
            navigator.notification.alert('En estos momentos no se obtuvo tu ubicación.', null ,'Problemas con tu ubicación','OK'); 
            return;
        }
        var distancia = calcDistancia(latu,lngu,latc,lngc);
        if(distancia <= 100)
        {
            myApp.showPreloader('Subiendo tu video...');
            // capture callback
            var captureSuccess = function(mediaFiles) {    
                uploadFile(mediaFiles[0]);
            };

            // capture error callback
            var captureError = function(error) {    
                myApp.hidePreloader();
                navigator.notification.alert('No ha sido posible acceder a grabar tu video', null, 'Error');
            };

            // start video capture
            navigator.device.capture.captureVideo(captureSuccess, captureError, {duration:7});
        }
        else
        {
            navigator.notification.alert('Es necesario estar dentro del establecimiento para realizar esta acción.', null ,'Fuera del establecimiento','OK'); 
            return;
        }

    });

    // Upload files to server
    function uploadFile(mediaFile) {
        var puntos = "15";
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;
        ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
              loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
            } else {
              loadingStatus.increment();
            }
        };
        ft.upload(path,
            "http://buskala.azurewebsites.net/admin/funciones/subir_video.php?idcliente="+idcliente,
            function(result) {
                //enviamos los puntos del usuario a la BD y registramos el Check in
                var puntos = "15";
                var now = new Date();
                var fechaactual = now.format("d/m/Y H:i");
                var idusuario = window.localStorage.getItem('id_usuario');
                var datastring = "tipo=nuevoregistrousuario&idcliente="+idcliente+"&idusuario=" + idusuario + "&fecha_registro=" + fechaactual + "&puntos="+ puntos +"&tipo_registro=4";
                $.ajax({
                    type: "GET",
                    url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
                    success: function (result) {        
                        myApp.hidePreloader();
                        document.getElementById("puntos_premiacionvideo_detalle").innerHTML = puntos;
                        myApp.popup('.popup-felicitacionesvideo-detalle');
                    },
                    error: function (objeto, quepaso, otroobj) {     
                        myApp.hidePreloader();
                        navigator.notification.alert('En estos momentos tu publicación no se envió, intenta en un momento.', null ,'Ups, problemas','OK'); 
                        return;
                    }
                });
                //navigator.notification.alert('Upload success: ' + result.responseCode + ' ' + result.bytesSent + ' bytes sent', null, 'Video Subido');
            },
            function(error) {
                myApp.hidePreloader();
                navigator.notification.alert('Error al subir tu video ' + path + ': ' + error.code, null, 'Ups, Error');
            },
            { fileName: name });
    }

    $$('.link-navegar-button').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            navigator.notification.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', null ,'Sin internet','OK'); 
            return;
        }
        var lat= document.getElementById("latitud_cliente").value;
        var lng= document.getElementById("longitud_cliente").value;
        window.location.href = "maps://maps.apple.com/?q="+lat+","+lng;
    });

    $$('.link-check-button').on('click', function () {
        if(navigator.network.connection.type == Connection.NONE){
            navigator.notification.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', null ,'Sin internet','OK'); 
            return;
        }
        var latu= document.getElementById("latitud_usuario").value;
        var lngu= document.getElementById("longitud_usuario").value;
        var latc= document.getElementById("latitud_cliente").value;
        var lngc= document.getElementById("longitud_cliente").value;
        if(latu == "0" || lngu == "0" )
        {
            navigator.notification.alert('En estos momentos no se obtuvo tu ubicación.', null ,'Problemas con tu ubicación','OK'); 
            return;
        }
        //alert(latu+","+lngu+","+latc+","+lngc)
        var distancia = calcDistancia(latu,lngu,latc,lngc);
        if(distancia <= 100)
        {
            //enviamos los puntos del usuario a la BD y registramos el Check in
            var puntos = "10";
            var now = new Date();
            var fechaactual = now.format("d/m/Y H:i");
            var idusuario = window.localStorage.getItem('id_usuario');
            var datastring = "tipo=nuevoregistrocliente&idcliente="+idcliente+"&idusuario=" + idusuario + "&fecha_registro=" + fechaactual + "&puntos="+ puntos +"&tipo_registro=1";
            $.ajax({
                type: "GET",
                url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
                success: function (result) {    
                    document.getElementById("puntos_premiacion_detalle").innerHTML = puntos;
                    myApp.popup('.popup-felicitaciones-detalle');
                },
                error: function (objeto, quepaso, otroobj) {
                    navigator.notification.alert('En estos momentos tu publicación no se envió, intenta en un momento.', null ,'Ups, problemas','OK'); 
                    return;
                }
            });
        }
        else
        {
            navigator.notification.alert('Es necesario estar dentro del establecimiento para realizar esta acción.', null ,'Fuera del establecimiento','OK'); 
            return;
        }
    });

    $$('.compartir-felicitacion-detalle').on('click', function () {
        myApp.closeModal('.popup-felicitaciones-detalle')
        //compartirmos el check in en facebook
        var puntos = "20";
        var idusuario = window.localStorage.getItem('id_usuario');
        var nombreestablecimiento = document.getElementById('nombre_cliente').innerHTML;
        var tipocliente = document.getElementById('tipo_cliente').innerHTML;
        var direccioncliente = document.getElementById('direccion_cliente').innerHTML;
        var linkcliente = document.getElementById('web_cliente').value;
        var imagencliente = document.getElementById('imagen_clienteS').src;
        var descripcioncliente = document.getElementById('descripcion_cliente').innerHTML;
        facebookConnectPlugin.showDialog( 
        {
            method: "feed",
            picture:imagencliente,
            name:'Estoy en ' + nombreestablecimiento + '. '+ tipocliente,
            link: linkcliente,    
            caption: 'Aqui nos vemos, ' + direccioncliente,
            description: descripcioncliente
        }, 
        function (response) 
        {  
            var respuesta = response.post_id;
            if(typeof respuesta != 'undefined')
            {

                var now = new Date();
                var fechaactual = now.format("d/m/Y H:i");
                var datastring = "tipo=nuevoregistrousuario&idcliente="+idcliente+"&idusuario=" + idusuario + "&fecha_registro=" + fechaactual + "&puntos="+ puntos +"&tipo_registro=6";
                $.ajax({
                    type: "GET",
                    url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
                    success: function (result) {    
                        document.getElementById("puntos_premiacionx2_detalle").innerHTML = puntos; 
                        myApp.popup('.popup-felicitacionesx2-detalle'); 
                    },
                    error: function (objeto, quepaso, otroobj) {
                        navigator.notification.alert('En estos momentos tu publicación no se envió, intenta en un momento.', null ,'Ups, problemas','OK'); 
                        return;
                    }
                });
            }
            else
            {
                navigator.notification.alert('No se pudo realizar la publicación en Facebook.', null ,'Problemas al publicar','OK');
            }
            
        },
        function (response) { navigator.notification.alert('No se pudo realizar la publicación en Facebook.', null ,'Problemas al publicar','OK') });
    });

    $$('.compartir-felicitacionvideo-detalle').on('click', function () {
        myApp.closeModal('.popup-felicitacionesvideo-detalle')
        //compartirmos el check in en facebook
        var puntos = "30";
        var idusuario = window.localStorage.getItem('id_usuario');
        var nombreestablecimiento = document.getElementById('nombre_cliente').innerHTML;
        var tipocliente = document.getElementById('tipo_cliente').innerHTML;
        var direccioncliente = document.getElementById('direccion_cliente').innerHTML;
        var linkcliente = document.getElementById('web_cliente').value;
        var imagencliente = document.getElementById('imagen_clienteS').src;
        var descripcioncliente = document.getElementById('descripcion_cliente').innerHTML;
        var datastring = "idcliente="+idcliente;
        $.ajax({
            type: "GET",
            url: "http://buskala.azurewebsites.net/admin/funciones/subir_youtube.php?"+datastring,
            dataType: "text",
            success: function (result) {    
                var idvideo = result;
                facebookConnectPlugin.showDialog( 
                {
                    method: "feed",
                    picture:imagencliente,
                    name:'Mira el video que subí desde ' + nombreestablecimiento + '. '+ tipocliente,
                    link: 'https://www.youtube.com/watch?v=' + idvideo,    
                    caption: 'Aqui nos vemos, ' + direccioncliente,
                    description: descripcioncliente
                }, 
                function (response) 
                {  
                    var respuesta = response.post_id;
                    if(typeof respuesta != 'undefined')
                    {

                        var now = new Date();
                        var fechaactual = now.format("d/m/Y H:i");
                        var datastring = "tipo=nuevoregistrousuario&idcliente="+idcliente+"&idusuario=" + idusuario + "&fecha_registro=" + fechaactual + "&puntos="+ puntos +"&tipo_registro=7";
                        $.ajax({
                            type: "GET",
                            url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
                            success: function (result) {    
                                document.getElementById("puntos_premiacionx2_detalle").innerHTML = puntos; 
                                myApp.popup('.popup-felicitacionesx2-detalle'); 
                            },
                            error: function (objeto, quepaso, otroobj) {
                                navigator.notification.alert('En estos momentos tu publicación no se envió, intenta en un momento.', null ,'Ups, problemas','OK'); 
                                return;
                            }
                        });
                    }
                    else
                    {
                        navigator.notification.alert('No se pudo realizar la publicación en Facebook.', null ,'Problemas al publicar','OK');
                    }
                    
                },
                function (response) { navigator.notification.alert('No se pudo realizar la publicación en Facebook.', null ,'Problemas al publicar','OK') });
            },
            error: function (objeto, quepaso, otroobj) {
                navigator.notification.alert('En estos momentos tu video no se envió, intenta en un momento.', null ,'Ups, problemas','OK'); 
                return;
            }
        });
    });

    $$('.cerrar-felicitacionx2-detalle').on('click', function () {
        myApp.closeModal('.popup-felicitacionesx2-detalle')
    });

    $$('.cerrar-felicitacion-detalle').on('click', function () {
        myApp.closeModal('.popup-felicitaciones-detalle')
    });

    $$('.cerrar-felicitacionvideo-detalle').on('click', function () {
        myApp.closeModal('.popup-felicitacionesvideo-detalle')
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
            navigator.notification.alert('Es necesaria una conexión a internet para realizar esta función. Por favor conéctate e intenta nuevamente.', null ,'Sin internet','OK'); 
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
                //alert("Pasó lo siguiente: " + quepaso);
            }
        });
        //enviamos los puntos del usuario al servidor
        var puntos = "7";
        if(calificacioncomentario != "")
        {
            puntos = "12";
        } 
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        var datastring = "tipo=nuevoregistrousuario&idcliente="+idcliente+"&idusuario=" + idusuario + "&fecha_registro=" + fechaactual + "&puntos="+ puntos +"&tipo_registro=3";
        $.ajax({
            type: "GET",
            url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
            success: function (result) {    
                document.getElementById("puntos_premiacion_calificacion").innerHTML = puntos;
                myApp.popup('.popup-felicitaciones');
            },
            error: function (objeto, quepaso, otroobj) {
                navigator.notification.alert('En estos momentos tu publicación no se envió, intenta en un momento.', null ,'Ups, problemas','OK'); 
                return;
            }
        });
    });

    $$('.cerrar-felicitacion').on('click', function () {
        myApp.closeModal('.popup-felicitaciones')
        mainView.router.back();
    });
    
    
});

myApp.onPageInit('checkqr', function (page) {
    
    $$('.link-back-button').on('click', function () {
        mainView.router.back();
    });

    cordova.plugins.barcodeScanner.scan(
      function (result) {
        if (result.text != "")
        {
            //enviamos los puntos del usuario a la BD y registramos el Check in
            var puntos = "12";
            var now = new Date();
            var fechaactual = now.format("d/m/Y H:i");
            var idusuario = window.localStorage.getItem('id_usuario');
            var datastring = "tipo=nuevoregistrocliente&idcliente="+result.text+"&idusuario=" + idusuario + "&fecha_registro=" + fechaactual + "&puntos="+ puntos +"&tipo_registro=2";
            $.ajax({
                type: "GET",
                url: "http://buskala.azurewebsites.net/querys/InsertarBD.php?"+datastring,
                success: function (result) {    
                    document.getElementById("puntos_premiacion_checkqr").innerHTML = puntos;
                    myApp.popup('.popup-felicitaciones-checkqr');
                },
                error: function (objeto, quepaso, otroobj) {
                    navigator.notification.alert('El código QR no coincide con nuestros establecimientos.', alertDismissed ,'Ups, problemas','OK'); 
                }
            });
        }
        else
        {
            mainView.router.back();
        }
      }, 
      function (error) {
        navigator.notification.alert('No hemos podido acceder a tu cámara para realizar la lectura del código QR', alertDismissed ,'Ups, problemas al escanear','OK'); 
        
      }
   );

    // alert dialog dismissed
    function alertDismissed() {
        mainView.router.back();
    }

    $$('.cerrar-felicitaciones-checkqr').on('click', function () {
        myApp.closeModal('.popup-felicitaciones-checkqr')
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