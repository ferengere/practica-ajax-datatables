//main.js
/*jslint browser: true*/
/*global $, jQuery, alert*/
'use strict';

var formatClinicas = function (data) {
    //poner nombres de clínicas en lista
    var lista = data.split(',');
    var $ul = $('<ul>');
    
    lista.forEach(function (item) {
        var $li = $('<li>').text(item);
        $li.appendTo($ul);
    });
    return $ul.html();
}


$(document).ready(
    function () {
        console.log('DOCUMENT.READY');

        $('#miTabla').DataTable({
            'processing': true,
            'serverside': true,
            'ajax': 'php/cargar_vdoctores.php',
            'columns': [
                /*{'data': 'id_doctor'},*/
                {
                    'data': 'nombre_doctor'
                },
                {
                    'data': 'num_colegiado'
                },
                {
                    'data': 'clinicas',
                    'render': function (data) {
                        return formatClinicas(data);
                    }
                },
                {
                    'data': 'id_doctor',
                    'render': function (data) {
                        return '<a class="btn btn-primary editarbtn" href=http://localhost/php/editar.php?id_clinica=' + data + '>Editar</a>';
                    }
                }
            ]
        });
    }
);



/*$('div').on('click', function () {
    console.log('li pulsado')
});*/