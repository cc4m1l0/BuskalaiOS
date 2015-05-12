
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

    var self = this;
    var idcliente = id;
    var listaestablecimientos = "";
    var latitud = "";
    var longitud = "";
    var id, nombre, direccion, tipo, urlcarpeta, imagen, imagenl, descripcion, web, rango, cover, horario, latitudcliente, longitudcliente;

    var onSuccess = function(position) {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
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
            });
            document.getElementById('nombre_cliente').innerHTML = nombre;
            document.getElementById('imagen_cliente').src = imagenl;
            document.getElementById('imagen_clienteS').src = imagen;
            document.getElementById('direccion_cliente').innerHTML = direccion;
            document.getElementById('tipo_cliente').innerHTML = tipo;

            
            //$("#input-id").rating({'value': '2'});
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
    });

    //envio el query para obtener datos de la calificacion del establecimiento
    $.ajax({
        type: "GET",
        url: "http://buskala.azurewebsites.net/querys/ListarBD.php?tipo=cargarcalificacion&id=" + idcliente,
        dataType: "text",
        success: function (result) {
            var r = result;
            document.getElementById('calificacion_cliente').innerHTML = "<input id='input-id' type='number' class='rating' min=0 max=5 step=0.5 value='"+r+"'  readonly=true data-show-clear='false' data-show-caption='false' data-size='xs'>";
            $("#input-id").rating();

            
            //$("#input-id").rating({'value': '2'});
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
    });
}
