
function CalificarViewModel() {

    var self = this;

    document.getElementById('calificacion_musica').innerHTML = "<input id='input-musica-calificar' type='number' class='rating' min=0 max=5 step=0.5 value='1' data-show-clear='false' data-show-caption='false' data-size='sm'>";
    $("#input-musica-calificar").rating();
    document.getElementById('calificacion_servicio').innerHTML = "<input id='input-servicio-calificar' type='number' class='rating' min=0 max=5 step=0.5 value='1' data-show-clear='false' data-show-caption='false' data-size='sm'>";
    $("#input-servicio-calificar").rating();
    document.getElementById('calificacion_ambiente').innerHTML = "<input id='input-ambiente-calificar' type='number' class='rating' min=0 max=5 step=0.5 value='1' data-show-clear='false' data-show-caption='false' data-size='sm'>";
    $("#input-ambiente-calificar").rating();
    document.getElementById('calificacion_producto').innerHTML = "<input id='input-producto-calificar' type='number' class='rating' min=0 max=5 step=0.5 value='1' data-show-clear='false' data-show-caption='false' data-size='sm'>";
    $("#input-producto-calificar").rating();

}
