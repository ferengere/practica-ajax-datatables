//main.js
'use strict';

var formatList = function(data) {
    //poner nombres de clínicas en forma de lista
    var lista = data.split(',');
    var $ul = $('<ul>');

    lista.forEach(function(item) {
        var $li = $('<li>').text(item);
        $li.appendTo($ul);
    });
    return $ul.html();
};

var formatSelect = function(cliDoc, cliAll) {
    //crear el select con todas las clinicas, seleccionando las del doctor
    var selected = cliDoc.split(',');
    var size = cliAll.recordsTotal;

    //usar el select del formulario para añadirle los elementos
    var $sel = $('#clinicas');
    $sel.attr('size', size);

    var cli = cliAll.data;

    //crear opciones del select
    cli.forEach(function(item) {
        //console.log(item.nombre);
        var $op = $('<option />').text(item.nombre);
        var existe = $.inArray(item.nombre, selected);
        //console.log(existe);
        if (existe !== -1) {
            $op.attr('selected', 'selected');
        }
        $op.appendTo($sel);
    });
};

var getClinicas = function() {
    return $.ajax({
        url: 'php/cargar_clinicas.php'
    });
};

var borrarDoctor = function(id) {
    return $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'php/borrar_doctor.php',
        data: {
            id: id
        }
    });
};


var validarFormulario = function() {




};


$(document).ready(
    function() {
        console.log('DOCUMENT.READY');

        var tablaDoctores = $('#tablaDoctores').DataTable({
            'processing': true,
            'serverSide': true,
            'ajax': 'php/cargar_vdoctores.php',
            'language': {
                'sProcessing': 'Procesando...',
                'sLengthMenu': 'Mostrar _MENU_ registros',
                'sZeroRecords': 'No se encontraron resultados',
                'sEmptyTable': 'Ningún dato disponible en esta tabla',
                'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
                'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
                'sInfoPostFix': '',
                'sSearch': 'Buscar:',
                'sUrl': '',
                'sInfoThousands': ',',
                'sLoadingRecords': 'Cargando...',
                'oPaginate': {
                    'sFirst': 'Primero',
                    'sLast': 'Último',
                    'sNext': 'Siguiente',
                    'sPrevious': 'Anterior'
                },
                'oAria': {
                    'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                    'sSortDescending': ': Activar para ordenar la columna de manera descendente'
                }
            },

            'columns': [
                /*{'data': 'id_doctor'},*/
                {
                    'data': 'nombre_doctor',
                    'render': function(data) {
                        return '<a>' + data + '</a>';
                    }
                }, {
                    'data': 'num_colegiado'
                }, {
                    'data': 'clinicas',
                    'render': function(data) {
                        return formatList(data);
                    }
                }, {
                    'data': 'id_doctor',
                    'render': function(data) {
                        return '<button class="btn btn-primary btnEditar" >Editar</a>';
                    }
                }, {
                    'data': 'id_doctor',
                    'render': function(data) {
                        return '<button id="' + data + '" class="btn btn-warning btnBorrar" >Borrar</a>';
                    }
                }
            ]
        });

        $('#formDoctor').validate({
            rules: {
                nombre: {
                    required: true,
                    lettersonly: true
                },
                numero: {
                    digits: function() {
                        if ($('#formDoctor #numero').val() !== '') {
                            return true;
                        }
                    }
                },
                clinicas: {
                    /*required: function() {
                        if ($('#formDoctor #clinicas') !== '') {
                            return true;
                        }
                    }*/
                }
            },
            messages: {
                nombre: {
                    required: 'Debe escribir el nombre',
                    lettersonly: 'Debe escribir sólo letras'
                },
                numero: {
                    digits: 'Debe escribir sólo números'
                },
                clinicas: {
                    required: 'Debe seleccionar al menos una clínica'
                }
            },
            submitHandler: function() {

            }
        });




        //evento pulsar boton editar
        $('#tablaDoctores').on('click', '.btnEditar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            console.log('Boton Editar pulsado');

            var nRow = $(this).parents('tr')[0];
            var aData = tablaDoctores.row(nRow).data();
            //console.log(aData);
            $('#nombre').val(aData.nombre_doctor);
            $('#numero').val(aData.num_colegiado);

            var promise = getClinicas();
            promise.success(function(data) {
                formatSelect(aData.clinicas, JSON.parse(data));
            });

            $('#modalDoctor').modal('show');
            validarFormulario();
        });

        $('#tablaDoctores').on('click', 'a', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            console.log('Link Doctor pulsado');

            var nRow = $(this).parents('tr')[0];
            var aData = tablaDoctores.row(nRow).data();
            //console.log(aData);
            $('#nombre').val(aData.nombre_doctor);
            $('#numero').val(aData.num_colegiado);

            var promise = getClinicas();
            promise.success(function(data) {
                formatSelect(aData.clinicas, JSON.parse(data));
            });

            $('#modalDoctor').modal('show');
        });

        //evento pulsar boton borrar
        $('#tablaDoctores').on('click', '.btnBorrar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            console.log('Boton Borrar pulsado');

            var id = $(evt.target).attr('id');
            console.log(id);


            $('#modalBorrar').prop('idDoctor', id);
            $('#modalBorrar div.modal-body').html('<p>Desea borrar el doctor ' + id + ' ?</p>');
            $('#modalBorrar').modal('show');
        });

        $('#modalDoctor').on('click', '#btnConfirmarEditar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            console.log('Boton Confirmar Editar pulsado');

            //validar formulario
            //validarFormulario();
            //$('#formDoctor').sub;


            //$('#modalDoctor').modal('hide');

        });

        $('#modalBorrar').on('click', '#btnConfirmarBorrar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            var id = $('#modalBorrar').prop('idDoctor');
            console.log('Boton Confirmar Borrar pulsado ' + id);

            ///BORRAR DOCTOR
            var mensaje;
            var promise = borrarDoctor(id);
            promise.success(function(data) {
                var res = data[0];
                console.log(data);

                $.bootstrapGrowl(res.mensaje, {
                    type: 'info',
                    offset: {
                        from: 'bottom',
                        amount: 20
                    }
                });
            });

            $('#modalBorrar').modal('hide');

        });

        //




    }); //ready





/*$('div').on('click', function () {
    console.log('li pulsado')
});*/
