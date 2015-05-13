//main.js
'use strict';

var control = {
    _tablaDoctores: null,
    _validarDoctor: null,
    _formDoctor: $('#formDoctor'),
    _modalDoctor: $('#modalDoctor'),
    _modalBorrar: $('#modalBorrar'),
    _idDoctor: null,
    _editarDoctor: false, //false nuevo, true editar
    formatList: function(data) {
        //poner nombres de clínicas en forma de lista en el campo de la tabla
        var lista = data.split(',');
        var $ul = $('<ul>');

        lista.forEach(function(item) {
            var $li = $('<li>').text(item);
            $li.appendTo($ul);
        });
        return $ul.html();
    },
    initForm: function($elem) {
        var self = this;
        //inicializar y mostrar foumulario
        var clinicasDoctor = null;
        if (this._editarDoctor === true) {
            this._idDoctor = $elem.attr('id');
            console.log('Editar doctor: ' + control._idDoctor);
            var nRow = $elem.parents('tr')[0];
            var aData = this._tablaDoctores.row(nRow).data();
            //console.log(aData);
            clinicasDoctor = aData.clinicas.split(',');
            $('#nombre').val(aData.nombreDoctor);
            $('#numero').val(aData.numColegiado);


        } else {
            this._idDoctor = null;
            $('#nombre').val('');
            $('#numero').val('');
            console.log('Añadir doctor');
        }

        var promise = control.getClinicas(); //****PONER THIS
        promise.success(function(data) {
            self.formatSelect(clinicasDoctor, JSON.parse(data));
        });

        $('#modalDoctor').modal('show');
    },
    formatSelect: function(cliDoc, cliAll) {
        //crear el select con todas las clinicas, seleccionando las del doctor

        //var selected = cliDoc.split(',');
        var size = cliAll.recordsTotal;

        //usar el select del formulario para añadirle los elementos
        var $sel = $('#selClinicas');
        $sel.find('option').remove();
        $sel.attr('size', size);

        var cli = cliAll.data;

        //crear opciones del select
        cli.forEach(function(item) {
            //console.log(item.nombre);
            var $op = $('<option>').text(item.nombre);
            $op.attr('id', item.idClinica);
            $op.attr('value', item.idClinica);
            if (cliDoc) {
                var existe = $.inArray(item.nombre, cliDoc);
                //console.log(existe);
                if (existe !== -1) {
                    $op.attr('selected', 'selected');
                }
            }
            $op.appendTo($sel);
        });
        //var clinicas = $('#selClinicas').html();
        //console.log(clinicas);
    },
    getClinicas: function() {
        return $.ajax({
            url: 'php/cargar_clinicas.php'
        });
    }
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

        control._tablaDoctores = $('#tablaDoctores').DataTable({
            'processing': true,
            'serverSide': true,
            'stateSave': true,
            'ajax': 'php/cargar_vdoctores.php',
            /*'async': false,*/
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

            'columns': [{
                'data': {
                    id: 'idDoctor',
                    nombre: 'nombreDoctor'
                },
                'render': function(data) {
                    return '<a id="' + data.idDoctor + '" class="btnEditar">' + data.nombreDoctor + '</a>';
                }
            }, {
                'data': 'numColegiado'
            }, {
                'data': 'clinicas',
                'render': function(data) {
                    return control.formatList(data);
                }
            }, {
                'data': 'idDoctor',
                'render': function(data) {
                    return '<button id="' + data + '" class="btn btn-primary btnEditar" >Editar</button>';
                }
            }, {
                'data': 'idDoctor',
                'render': function(data) {
                    return '<button id="' + data + '" class="btn btn-warning btnBorrar" >Borrar</button>';
                }
            }],
            'columnDefs': [{
                'targets': [3],
                'searchable': false,
                'orderable': false
            }, {
                'targets': [4],
                'searchable': false,
                'orderable': false
            }]
        });

        control._validarDoctor = $('#formDoctor').validate({
            rules: {
                nombre: {
                    required: true
                        /*,
                                            lettersonly: true*/
                },
                numero: {
                    digits: function() {
                        if ($('#formDoctor #numero').val() !== '') {
                            return true;
                        }
                    }
                },
                'selClinicas[]': {
                    required: function() {
                        if ($('#selClinicas option:selected').length === 0) {
                            return true;
                        }
                    }
                }
            },
            messages: {
                nombre: {
                    required: 'Debe escribir el nombre'
                        /*,
                                            lettersonly: 'Debe escribir sólo letras'*/
                },
                numero: {
                    digits: 'Debe escribir sólo números'
                },
                clinicas: {
                    required: 'Debe seleccionar al menos una clínica'
                }
            }
            /*,
                        submitHandler: function() {

                        }*/
        });

        //evento pulsar boton nuevo
        $('.btnNuevo').on('click', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            console.log('Boton Crear Doctor pulsado');
            control._editarDoctor = false;
            control.initForm($(this));
        });


        //evento pulsar boton editar
        $('#tablaDoctores').on('click', '.btnEditar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            console.log('Boton Editar pulsado');
            control._editarDoctor = true;
            control.initForm($(this));
        });

        /*$('#tablaDoctores').on('click', 'a', function(e) {
            
        });*/

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
