
function Establecimiento(id,nombre, direccion, tipo, imagen, estadosugerido) 
{ 
    this.idEstablecimiento = id; 
    this.nombreEstablecimiento = nombre; 
    this.direccionEstablecimiento = direccion; 
    this.tipoEstablecimiento = tipo; 
    this.imagenEstablecimiento = imagen; 
    this.estadosugeridoEstablecimiento = estadosugerido;
}

function DetalleViewModel(id) {

    var self = this;
    var idcliente = id;
    var listaestablecimientos = "";
    var latitud = "";
    var longitud = "";
    var id, nombre, direccion, tipo, urlcarpeta, imagen, imagenl, descripcion, web, rango, cover, horario;

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

    //envio el query para obtener datos de los establecimientos
    $.ajax({
        type: "GET",
        url: "http://54.186.255.219/buskala/querys/ListarBD.php?tipo=cargarcliente&id=" + idcliente,
        dataType: "xml",
        success: function (result) {
            $(result).find("cliente").each(function () {
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                imagenl = urlcarpeta + "imagenL.png";
                descripcion = $(this).find("descripcion_cliente").text();
                web = $(this).find("web_cliente").text();
                rango = $(this).find("rango_cliente").text();
                cover = $(this).find("cover_cliente").text();
                horario = $(this).find("horario_cliente").text();
            });
            document.getElementById('nombre_cliente').innerHTML = nombre;
            document.getElementById('imagen_cliente').src = imagenl;
            document.getElementById('imagen_clienteS').src = imagen;
            document.getElementById('direccion_cliente').innerHTML = direccion;
            document.getElementById('tipo_cliente').innerHTML = tipo;
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
    });
}
