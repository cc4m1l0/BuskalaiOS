
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

    // Editable data
    self.itemstodos = ko.observableArray([]);
    self.items = ko.observableArray([]);
    //cargamos datos locales
    /*var lista = '<li>
                        <a href="#" data-bind="attr: { id: idEstablecimiento }" class="item-link item-content">
                            <div class="item-media"><img data-bind="attr: { src: imagenEstablecimiento }" alt="logo" width="80"></div>
                            <div class="item-inner">
                              <div class="item-title-row">
                                <div class="item-title" data-bind="text: nombreEstablecimiento">todo</div>
                              </div>
                              <div class="item-text" data-bind="text: direccionEstablecimiento">...</div>
                              <div class="item-subtitle" data-bind="text: tipoEstablecimiento">...</div>
                            </div>
                          </a>
                    </li>';
    $("#lista_sugeridos").append(lista);*/
    self.cargarLocal = function () 
    {
        var jsonItems = window.localStorage.getItem("todositems");
        if (!jsonItems) {
            return;
        }
        self.itemstodos.removeAll();
        var jsData = JSON.parse(jsonItems);
        jsData.forEach((function (jsItem) {
            var item = new Establecimiento(jsItem.idEstablecimiento, jsItem.nombreEstablecimiento,jsItem.direccionEstablecimiento,jsItem.tipoEstablecimiento,jsItem.imagenEstablecimiento, self);
            self.itemstodos.push(item);
        }).bind(self));

        var jsonItems = window.localStorage.getItem("sugeridositems");
        if (!jsonItems) {
            return;
        }
        self.items.removeAll();
        var jsData = JSON.parse(jsonItems);
        jsData.forEach((function (jsItem) {
            var item = new Establecimiento(jsItem.idEstablecimiento, jsItem.nombreEstablecimiento,jsItem.direccionEstablecimiento,jsItem.tipoEstablecimiento,jsItem.imagenEstablecimiento, self);
            self.items.push(item);
        }).bind(self));

        return;
    }
    self.cargarLocal();
    //obtenemos la preferencia del usuario
    var preferenciausuario = window.localStorage.getItem('preferencia_usuario');
    //envio el query para obtener datos de los establecimientos
    $.ajax({
        type: "GET",
        url: "http://54.186.255.219/buskala/querys/ListarBD.php?tipo=sugeridousuario&preferencia=" + preferenciausuario,
        dataType: "xml",
        success: function (result) {
            //llenarTodos(result);
            self.itemstodos.removeAll();
            $(result).find("cliente").each(function () {
                var id, nombre, direccion, tipo, urlcarpeta, imagen;
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                var est = new Establecimiento(id, nombre, direccion, tipo, imagen, self);
                listaestablecimientos += id + ",";
                self.itemstodos.push(est);
            });
            self.guardarLocal();
            self.cargarSugeridos();
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
    });

    self.guardarLocal = function () 
    {
	    var jsData = ko.toJS(self.itemstodos);
	    var data = [];

	    jsData.forEach((function (item) {
		    var itemData = {
                idEstablecimiento: item.idEstablecimiento, 
                nombreEstablecimiento: item.nombreEstablecimiento,
                direccionEstablecimiento: item.direccionEstablecimiento,
                tipoEstablecimiento: item.tipoEstablecimiento, 
                imagenEstablecimiento: item.imagenEstablecimiento
		    };
		    data.push(itemData);
	    }).bind(self));
	    window.localStorage.setItem("todositems", JSON.stringify(data));
	   //alert("guardado");
    }

    self.cargarSugeridos = function()
    {
        var now = new Date();
        var fechaactual = now.format("d/m/Y H:i");
        listaestablecimientos = listaestablecimientos.slice(0, - 1);
        $.ajax({
        type: "GET",
        url: "http://54.186.255.219/buskala/querys/ListarBD.php?tipo=mejoresestablecimientos&latitudusuario=" + latitud + "&longitudusuario=" + longitud + "&fecha_actual=" + fechaactual + "&listaestablecimientos=" + listaestablecimientos,
        dataType: "text",
        success: function (result) {
            //llenarTodos(result);
            self.items.removeAll();
            $(result).find("cliente").each(function () {
                var id, nombre, direccion, tipo, urlcarpeta, imagen;
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                var est = new Establecimiento(id, nombre, direccion, tipo, imagen, self);
                listaestablecimientos += id + ",";
                self.items.push(est);
            });
            self.guardarLocalsugeridos();
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
        });
    }
    self.guardarLocalsugeridos = function () 
    {
        var jsData = ko.toJS(self.items);
        var data = [];

        jsData.forEach((function (item) {
            var itemData = {
                idEstablecimiento: item.idEstablecimiento, 
                nombreEstablecimiento: item.nombreEstablecimiento,
                direccionEstablecimiento: item.direccionEstablecimiento,
                tipoEstablecimiento: item.tipoEstablecimiento, 
                imagenEstablecimiento: item.imagenEstablecimiento
            };
            data.push(itemData);
        }).bind(self));
        window.localStorage.setItem("sugeridositems", JSON.stringify(data));
       //alert("guardado");
    }
}
