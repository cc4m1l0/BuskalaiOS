
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
    var listaestablecimientos = "";
    var latitud = "";
    var longitud = "";

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
        url: "http://54.186.255.219/buskala/querys/ListarBD.php?tipo=sugeridousuario&preferencia=" + preferenciausuario,
        dataType: "xml",
        success: function (result) {
            //llenarTodos(result);
            var tList = '';
            itemstodos.length = 0;
            $(result).find("cliente").each(function () {
                var id, nombre, direccion, tipo, urlcarpeta, imagen;
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                var est = new Establecimiento(id, nombre, direccion, tipo, imagen, "");
                listaestablecimientos += id + ",";
                tList+="<li><a href='#' id='"+id+"' class='listatodos item-link item-content'><div class='item-media'><img src='img/buskala_blank.png' alt='logo' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+imagen+"' width='80'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+nombre+"</div></div><div class='item-text'>"+direccion+"</div><div class='item-subtitle'>"+tipo+"</div></div></a></li>";
                itemstodos.push(est);
            });
            $("#lista_todos").empty().append(tList);
            self.guardarLocal();
            self.cargarSugeridos();
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
    });
}
