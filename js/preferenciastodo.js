function PreferenciaViewModel() 
{
    // Editable data
    var tList = '';
    var ids = ["crossover", "electronica", "rock", "tropical", "urban"];
    var imgs = ["img/crossover.png","img/electronica.png","img/rock.png","img/tropical.png","img/urban.png"];
    for(var i=0; i<ids.length; i++)
    {
        tList += "<li style='width: 100%; height: fit-content;'><a href='#' id='"+ids[i]+"' class='listapreferencias item-link item-content'><div class='item-inner' style='width: 100%; height: fit-content;'><img src='"+imgs[i]+"' alt='logo' style='max-width: 100%; max-height: 100%; height: auto;' ></div></a></li>";
    }

    $("#listacpref").append(tList);
}