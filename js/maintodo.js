
function Establecimiento(id,nombre, direccion, tipo, imagen, parent) 
{ 
    this.idEstablecimiento = ko.observable(id); 
    this.nombreEstablecimiento = ko.observable(nombre); 
    this.direccionEstablecimiento = ko.observable(direccion); 
    this.tipoEstablecimiento = ko.observable(tipo); 
    this.imagenEstablecimiento = ko.observable(imagen); 
    this.parent = parent;
}

function MainViewModel() {
    var self = this;
    // Editable data
    self.items = ko.observableArray([]);

    //obtenemos la preferencia del usuario
    var preferenciausuario = window.localStorage.getItem('preferencia_usuario');
    //envio el query para obtener datos de los establecimientos
    $.ajax({
        type: "GET",
        url: "http://54.186.255.219/buskala/querys/ListarBD.php?tipo=sugeridousuario&preferencia=" + preferenciausuario,
        dataType: "xml",
        success: function (result) {
            //llenarTodos(result);
            $(result).find("cliente").each(function () {
                var id, nombre, direccion, tipo, urlcarpeta, imagen;
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                var est = new Establecimiento(id, nombre, direccion, tipo, imagen, self);
                self.items.push(est);
            });
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
    });
}

function llenarTodos(data) 
{
    $(data).find("cliente").each(function () {
        var id, nombre, urlcarpeta, imagen;
        id = $(this).find("id_cliente").text();
        nombre = $(this).find("nombre_cliente").text();
        urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
        imagen = urlcarpeta + "imagenS.png";
        var est = new Establecimiento(id, nombre, imagen, this);
        this.items.push(est);
    });
}