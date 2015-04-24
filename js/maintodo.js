
function Establecimiento(id,nombre, direccion, tipo, imagen, estadosugerido) 
{ 
    this.idEstablecimiento = id; 
    this.nombreEstablecimiento = nombre; 
    this.direccionEstablecimiento = direccion; 
    this.tipoEstablecimiento = tipo; 
    this.imagenEstablecimiento = imagen; 
    this.estadosugeridoEstablecimiento = estadosugerido;
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
    var itemstodos = [{}];
    var items = [{}];
    //cargamos datos locales
    self.cargarLocal = function () 
    {
        var jsonItems = window.localStorage.getItem("todositems");
        if (!jsonItems) {
            return;
        }
        var tList = '';
        itemstodos.length = 0;
        var jsData = JSON.parse(jsonItems);
        jsData.forEach((function (jsItem) {
            var item = new Establecimiento(jsItem.idEstablecimiento, jsItem.nombreEstablecimiento,jsItem.direccionEstablecimiento,jsItem.tipoEstablecimiento,jsItem.imagenEstablecimiento, jsItem.estadosugeridoEstablecimiento);
            itemstodos.push(item);
            tList+="<li><a href='#' id='"+jsItem.idEstablecimiento+"' class='item-link item-content'><div class='item-media'><img src='img/buskala_blank.png' alt='logo' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+jsItem.imagenEstablecimiento+"' width='80'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+jsItem.nombreEstablecimiento+"</div></div><div class='item-text'>"+jsItem.direccionEstablecimiento+"</div><div class='item-subtitle'>"+jsItem.tipoEstablecimiento+"</div></div></a></li>";

        }).bind(self));
        $("#lista_todos").empty().append(tList);

        var jsonItems = window.localStorage.getItem("sugeridositems");
        if (!jsonItems) {
            return;
        }

        var tList = '';
        items.length = 0;
        var jsData = JSON.parse(jsonItems);
        jsData.forEach((function (jsItem) {
            var item = new Establecimiento(jsItem.idEstablecimiento, jsItem.nombreEstablecimiento,jsItem.direccionEstablecimiento,jsItem.tipoEstablecimiento,jsItem.imagenEstablecimiento, jsItem.estadosugeridoEstablecimiento);
            items.push(item);
            tList+="<li><a href='#' id='"+jsItem.idEstablecimiento+"' class='item-link item-content'><div class='item-media'><img src='img/buskala_blank.png' alt='logo' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+jsItem.imagenEstablecimiento+"' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+jsItem.estadosugeridoEstablecimiento+"'  width='81'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+jsItem.nombreEstablecimiento+"</div></div><div class='item-text'>"+jsItem.direccionEstablecimiento+"</div><div class='item-subtitle'>"+jsItem.tipoEstablecimiento+"</div></div></a></li>";
        }).bind(self));
        $("#lista_sugeridos").empty().append(tList);

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
                tList+="<li><a href='#' id='"+id+"' class='item-link item-content'><div class='item-media'><img src='img/buskala_blank.png' alt='logo' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+imagen+"' width='80'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+nombre+"</div></div><div class='item-text'>"+direccion+"</div><div class='item-subtitle'>"+tipo+"</div></div></a></li>";
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

    self.guardarLocal = function () 
    {
	    var jsData = ko.toJS(itemstodos);
	    var data = [];

	    jsData.forEach((function (item) {
		    var itemData = {
                idEstablecimiento: item.idEstablecimiento, 
                nombreEstablecimiento: item.nombreEstablecimiento,
                direccionEstablecimiento: item.direccionEstablecimiento,
                tipoEstablecimiento: item.tipoEstablecimiento, 
                imagenEstablecimiento: item.imagenEstablecimiento,
                estadosugeridoEstablecimiento: item.estadosugeridoEstablecimiento
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
            //obtengo el resultado y lo divido para obtener los mejores establecimientos
            var res = result.split('@@@');
            var establecimientotop = res[0];
            var establecimientocerca = res[1];
            var establecimientocheckin = res[2];
            var establecimientootros = res[3];
            var tList = '';
            items.length = 0;
            //obtengo establecimiento top
            $(establecimientotop).find("cliente").each(function () {
                var id, nombre, direccion, tipo, urlcarpeta, imagen;
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                var est = new Establecimiento(id, nombre, direccion, tipo, imagen, "img/puesto1.png");
                items.push(est);
                tList+="<li><a href='#' id='"+id+"' class='item-link item-content'><div class='item-media'><img src='img/buskala_blank.png' alt='logo' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+imagen+"' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='img/puesto1.png'  width='81'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+nombre+"</div></div><div class='item-text'>"+direccion+"</div><div class='item-subtitle'>"+tipo+"</div></div></a></li>";
            });
            //obtengo establecimiento cerca
            $(establecimientocerca).find("cliente").each(function () {
                var id, nombre, direccion, tipo, urlcarpeta, imagen;
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                var est = new Establecimiento(id, nombre, direccion, tipo, imagen, "img/puesto2.png");
                items.push(est);
                tList+="<li><a href='#' id='"+id+"' class='item-link item-content'><div class='item-media'><img src='img/buskala_blank.png' alt='logo' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+imagen+"' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='img/puesto2.png'  width='81'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+nombre+"</div></div><div class='item-text'>"+direccion+"</div><div class='item-subtitle'>"+tipo+"</div></div></a></li>";
            });
            //obtengo establecimiento check in
            $(establecimientocheckin).find("cliente").each(function () {
                var id, nombre, direccion, tipo, urlcarpeta, imagen;
                id = $(this).find("id_cliente").text();
                nombre = $(this).find("nombre_cliente").text();
                direccion = $(this).find("direccion_cliente").text();
                tipo = $(this).find("tipo_cliente").text();
                urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                imagen = urlcarpeta + "imagenS.png";
                var est = new Establecimiento(id, nombre, direccion, tipo, imagen, "img/puesto3.png");
                //items.push(est);
                /*tList+="<li><a href='#' id='"+id+"' class='item-link item-content'><div class='item-media'><img src='img/buskala_blank.png' alt='logo' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+imagen+"' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='img/puesto3.png'  width='81'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+nombre+"</div></div><div class='item-text'>"+direccion+"</div><div class='item-subtitle'>"+tipo+"</div></div></a></li>";*/
            });
            //obtengo otros establecimientos
            var contador = 0;
            $(establecimientootros).find("cliente").each(function () {
                if(contador != 3)
                {
                    var id, nombre, direccion, tipo, urlcarpeta, imagen;
                    id = $(this).find("id_cliente").text();
                    nombre = $(this).find("nombre_cliente").text();
                    direccion = $(this).find("direccion_cliente").text();
                    tipo = $(this).find("tipo_cliente").text();
                    urlcarpeta = "http://54.186.255.219/buskala/admin/" + $(this).find("urlcarpeta_cliente").text();
                    imagen = urlcarpeta + "imagenS.png";
                    var est = new Establecimiento(id, nombre, direccion, tipo, imagen, "");
                    items.push(est);
                    contador ++;
                    tList+="<li><a href='#' id='"+id+"' class='item-link item-content'><div class='item-media'><img src='img/buskala_blank.png' alt='logo' width='80'></div><div class='item-media' style='margin-left:-80px'><img src='"+imagen+"' width='80'></div><div class='item-media' style='margin-left:-80px'><img src=''  width='81'></div><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+nombre+"</div></div><div class='item-text'>"+direccion+"</div><div class='item-subtitle'>"+tipo+"</div></div></a></li>";
                }
            });
            $("#lista_sugeridos").empty().append(tList);
            self.guardarLocalsugeridos();
        },
        error: function (objeto, quepaso, otroobj) {
            alert("Pasó lo siguiente: " + quepaso);
        }
        });
    }
    self.guardarLocalsugeridos = function () 
    {
        var jsData = ko.toJS(items);
        var data = [];

        jsData.forEach((function (item) {
            var itemData = {
                idEstablecimiento: item.idEstablecimiento, 
                nombreEstablecimiento: item.nombreEstablecimiento,
                direccionEstablecimiento: item.direccionEstablecimiento,
                tipoEstablecimiento: item.tipoEstablecimiento, 
                imagenEstablecimiento: item.imagenEstablecimiento,
                estadosugeridoEstablecimiento : item.estadosugeridoEstablecimiento
            };
            data.push(itemData);
        }).bind(self));
        window.localStorage.setItem("sugeridositems", JSON.stringify(data));
       //alert("guardado");
    }
}
