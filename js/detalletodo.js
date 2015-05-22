
function Establecimiento(id,nombre, direccion, tipo, imagen, estadosugerido) 
{ 
    this.idEstablecimiento = id; 
    this.nombreEstablecimiento = nombre; 
    this.direccionEstablecimiento = direccion; 
    this.tipoEstablecimiento = tipo; 
    this.imagenEstablecimiento = imagen; 
    this.estadosugeridoEstablecimiento = estadosugerido;
}

function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function removejscssfile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

function DetalleViewModel(id) {
   
    myApp.showPreloader('Cargando datos del establecimiento...');
    var self = this;
    var idcliente = id;
    var listaestablecimientos = "";
    var latitud = "";
    var longitud = "";
    var id, nombre, direccion, tipo, urlcarpeta, imagen, imagenl, descripcion, web, rango, cover, horario, latitudcliente, longitudcliente, idvideocliente;

    var onSuccess = function(position) {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        //alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);

    //envio el query para obtener datos del establecimiento
    $.ajax({
        type: "GET",
        url: "http://buskala.azurewebsites.net/querys/ListarBD.php?tipo=cargarcliente&id=" + idcliente,
        dataType: "xml",
        success: function (result) {
            $(result).find("cliente").each(function () {
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://buskala.azurewebsites.net/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                imagenl = urlcarpeta + "imagenL.png";
                descripcion = $(this).find("descripcion_cliente").text();
                web = $(this).find("web_cliente").text();
                rango = $(this).find("rango_cliente").text();
                cover = $(this).find("cover_cliente").text();
                horario = $(this).find("horario_cliente").text();
                latitudcliente = $(this).find("latitud_cliente").text();
                longitudcliente = $(this).find("longitud_cliente").text();
                idvideocliente = $(this).find("videoyoutube_cliente").text();
            });
            document.getElementById('nombre_cliente').innerHTML = nombre;
            document.getElementById('imagen_cliente').src = imagenl;
            document.getElementById('imagen_clienteS').src = imagen;
            document.getElementById('direccion_cliente').innerHTML = direccion;
            document.getElementById('tipo_cliente').innerHTML = tipo;
            document.getElementById('descripcion_cliente').innerHTML = descripcion;
            document.getElementById('precios_cliente').innerHTML = "Precios: " + rango;
            document.getElementById('cover_cliente').innerHTML = "Cover: " + cover;
            document.getElementById('horario_cliente').innerHTML = "Horario: " + horario;
            document.getElementById('web_cliente').value = web;
            document.getElementById('latitud_cliente').value = latitudcliente;
            document.getElementById('longitud_cliente').value = longitudcliente;
            document.getElementById('latitud_usuario').value = latitud;
            document.getElementById('longitud_usuario').value = longitud;
            myApp.hidePreloader();
            var video = document.getElementById('video_cliente');
            if(idvideocliente != "sinvideo")
            {
                self.cargarVideo();
            }
            else
            {
                video.setAttribute("hidden", true);
            }
            //$("#input-id").rating({'value': '2'});
        },
        error: function (objeto, quepaso, otroobj) {
            myApp.hidePreloader();
            //alert("Pasó lo siguiente: " + quepaso);
        }
    });

    //cargar video si existe
    self.cargarVideo = function () 
    {
        var video = document.getElementById('video_cliente');
        //envio el query para obtener la url del video de youtube
        $.ajax({
            type: "GET",
            url: "http://buskala.azurewebsites.net/admin/funciones/obtener_videoyoutube_url.php?idvideo=" + idvideocliente,
            dataType: "text",
            success: function (result) {
                if(result != "error")
                {
                    //alert(result);
                    var source = document.createElement('source');
                    source.setAttribute('src', result);
                    video.appendChild(source);
                    video.play();
                }
                else
                {
                    video.setAttribute("hidden", true);
                }
            },
            error: function (objeto, quepaso, otroobj) {
                video.setAttribute("hidden", true);
                //alert("Pasó lo siguiente: " + quepaso);
            }
        });
    }

    //envio el query para obtener datos de la calificacion del establecimiento
    $.ajax({
        type: "GET",
        url: "http://buskala.azurewebsites.net/querys/ListarBD.php?tipo=cargarcalificacion&id=" + idcliente,
        dataType: "text",
        success: function (result) {
            var r = result;
            document.getElementById('calificacion_cliente').innerHTML = "<input id='input-calificacion-detalle' type='number' class='rating' min=0 max=5 step=0.5 value='"+r+"'  readonly=true data-show-clear='false' data-show-caption='false' data-size='xs'>";
            $("#input-calificacion-detalle").rating();
        },
        error: function (objeto, quepaso, otroobj) {
            //alert("Pasó lo siguiente: " + quepaso);
        }
    });

    //envio el query para obtener datos en tiempo real del establecimiento
    var now = new Date();
    var fechaactual = now.format("d/m/Y H:i");
    $.ajax({
        type: "GET",
        url: "http://buskala.azurewebsites.net/querys/ListarBD.php?tipo=cargartiemporealcliente&id=" + idcliente + "&fecha_actual=" + fechaactual,
        dataType: "text",
        success: function (result) {
            //obtengo el resultado y lo divido para obtener los datos
            var res = result.split(',');
            var numerohombres = res[0];
            var numeromujeres = res[1];
            var totalpersonas = res[2];
            var totaledades = res[3];
            var totalpersonasconedad = res[4];
            //inicio var de resultados finales
            var porcentajehombres = 0;
            var porcentajemujeres = 0;
            var promedioedad = 0;
            //realizo los calculos para obtener porcentaje y promedio
            if(totalpersonas != 0)
            {
                porcentajehombres = (numerohombres*100)/totalpersonas;
                porcentajemujeres = (numeromujeres*100)/totalpersonas;
                if(totalpersonasconedad != 0)
                {
                    promedioedad = totaledades/totalpersonasconedad;
                }
            }
            //llevo valores al usuario
            document.getElementById('promedio_hombres').innerHTML = porcentajehombres + "%";
            document.getElementById('promedio_mujeres').innerHTML = porcentajemujeres + "%";
            document.getElementById('promedio_edad').innerHTML = promedioedad;


        },
        error: function (objeto, quepaso, otroobj) {
            //alert("Pasó lo siguiente: " + quepaso);
        }
    });
}

//Funcion que devuelve la disntacia entre dos lat y lng (en mts)
function calcDistancia(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  var f = d * 1000;
  return f;
}
// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}