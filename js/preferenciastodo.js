
function Preferencia(id,imagen, parent) 
{ 
    this.idPreferencia = ko.observable(id); 
    this.imagenPreferencia = ko.observable(imagen); 
    this.parent = parent;
}

function PreferenciaViewModel() {
    // Editable data
    this.items = ko.observableArray([
        new Preferencia("crossover", "img/crossover.png",this),
        new Preferencia("electronica", "img/electronica.png",this),
        new Preferencia("rock", "img/rock.png",this),
        new Preferencia("tropical", "img/tropical.png",this),
        new Preferencia("urban", "img/urban.png",this)
    ]);
}