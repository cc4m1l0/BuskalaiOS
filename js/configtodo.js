function ConfigViewModel()
{
	//ponemos la imagen del usuario y su nombre
	var imagen = localStorage.getItem("imagen_usuario");
	imagen = imagen.replace("width=200", "width=150");
	document.getElementById("imgusuario").style.background = "url(" + imagen + ") fixed center no-repeat";
    document.getElementById("nombreusuario").innerHTML = "<p>" + localStorage.getItem("nombre_usuario") + "</p>";
    //cargamos los puntos del usuario
    if (localStorage.getItem("puntos_usuario") !== null )
    {
        document.getElementById('totalpuntos').innerHTML = localStorage.getItem("puntos_usuario");
    }
    //obtenemos el id del usuario
    var idusuario = localStorage.getItem('id_usuario');
    //envio el query para obtener los puntos del usuario
    $.ajax({
        type: "GET",
        url: "http://buskala.azurewebsites.net/querys/ListarBD.php?tipo=totalpuntosusuario&idusuario=" + idusuario,
        dataType: "text",
        success: function (result) {
        	var resultado = result;
            document.getElementById('totalpuntos').innerHTML = resultado;
            localStorage.setItem('puntos_usuario', resultado);
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
    });
    //cargamos las prefernecias para dar la opcion al usuario de cambiarla
	var tList = '';
	var ids = ["crossover", "electronica", "rock", "tropical", "urban"];
	var imgs = ["img/crossover.png","img/electronica.png","img/rock.png","img/tropical.png","img/urban.png"];
	for(var i=0; i<ids.length; i++)
	{
		tList += "<li style='width: 100%; height: fit-content;'><a href='#' id='"+ids[i]+"' class='listapreferenciasc item-link item-content'><div class='item-inner' style='width: 100%; height: fit-content;'><img src='"+imgs[i]+"' alt='logo' style='max-width: 100%; max-height: 100%; height: auto;' ></div></a></li>";
	}

	$("#lpreferencias").append(tList);
}