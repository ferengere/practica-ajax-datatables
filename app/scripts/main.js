//main.js
'use strict';

var control = {
    _tablaDoctores: null,
    _validarDoctor: null,
    _modalDoctor: null,
    _formDoctor: null,
    _modalBorrar: $('#modalBorrar'),
    _modalConfirmar: $('#modalConfirmar'),
    _idDoctor: null,
    _editarDoctor: false, //false nuevo, true editar
    _msgConfirmar: {
        nuevo: 'Se creará un nuevo doctor',
        editar: 'Se modificarán los datos del doctor',
        borrar: 'Se borrarán los datos del doctor'
    },
    _init: function() {
        this._modalDoctor = $('#modalDoctor');
        this._formDoctor = $('#formDoctor');
    },
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
            var nRow = $elem.parents('tr')[0];
            var aData = this._tablaDoctores.row(nRow).data();
            this._idDoctor = aData.idDoctor;
            clinicasDoctor = aData.clinicas.split(',');
            $('#nombre').val(aData.nombreDoctor);
            $('#numero').val(aData.numColegiado);
            console.log('Editar doctor: ' + control._idDoctor);
        } else {
            this._idDoctor = null;
            $('#nombre').val('');
            $('#numero').val('');
            console.log('Añadir doctor');
        }

        //var promise = control.getClinicas(); //****PONER THIS
        var promise = this.getClinicas();
        promise.success(function(data) {
            self.formatSelect(clinicasDoctor, JSON.parse(data));
        });
        //$('#modalDoctor').modal('show');//lo muestra el botón

    },
    formatSelect: function(cliDoc, cliAll) {
        //crear el select con todas las clinicas, seleccionando las del doctor
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
    },
    borrarDoctor: function(id) {
        return $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'php/borrar_doctor.php',
            data: {
                id: id
            }
        });
    },
    registroDoctor: function(data) {
        //inserta o edita los datos de un doctor
        return $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'php/registro_doctor.php',
            data: {
                editar: data.editar,
                id: data.id,
                nombre: data.nombre,
                numero: data.numero,
                clinicas: data.clinicas
            }
        });
    },
    formValido: function() {
        var datosDoctor = {
            editar: this._editarDoctor,
            id: this._idDoctor,
            nombre: this._formDoctor.find('#nombre').val(),
            numero: this._formDoctor.find('#numero').val(),
            clinicas: this._formDoctor.find('#selClinicas').val()
        };
    },
    mensajeGrowl: function(mensaje, tipo) {
        $.bootstrapGrowl(mensaje, {
            type: tipo,
            offset: {
                from: 'bottom',
                amount: 20
            }
        });
    },
    confirmarOperacion: function() {

    }
};


$(document).ready(
    function() {
        console.log('DOCUMENT.READY');
        control._init();

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
                'data': 'nombreDoctor',
                'render': function(data) {
                    return '<a class="btnEditar" data-target="#modalDoctor" data-toggle="modal" data-backdrop="static">' + data + '</a>';
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
                    return '<button class="btn btn-primary btnEditar" data-target="#modalDoctor" data-toggle="modal" data-backdrop="static">Editar</button>';
                }
            }, {
                'data': 'idDoctor',
                'render': function(data) {
                    return '<button  class="btn btn-warning btnBorrar" >Borrar</button>';
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

        jQuery.validator.addMethod('sololetras', function(value, element) {
            return this.optional(element) || /^[a-z áéíóúñç]+$/i.test(value);
        });

        control._validarDoctor = $('#formDoctor').validate({
            rules: {
                nombre: {
                    required: true,
                    sololetras: true,
                    minlength: 2
                },
                numero: {
                    digits: function() {
                        if ($('#numero').val() !== '') {
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
                    required: 'Debe escribir el nombre',
                    sololetras: 'Debe escribir sólo letras',
                    minlength: 'La longitud mínima debe ser {0} caracteres'

                },
                numero: {
                    digits: 'Debe escribir sólo números'
                },
                'selClinicas[]': {
                    required: 'Debe seleccionar al menos una clínica'
                }
            },
            submitHandler: function(form) {
                console.log('FORMDOCTOR validado');


            }

        });


        //evento pulsar boton nuevo
        $('.btnNuevo').on('click', function(e) {
            var evt = e || window.event;
            //evt.preventDefault();
            console.log('Boton Crear pulsado');
            control._editarDoctor = false;
            //control.mensajeGrowl('Nuevo doctor', 'info');
            control.initForm($(this));
        });


        //evento pulsar boton editar
        $('#tablaDoctores').on('click', '.btnEditar', function(e) {
            var evt = e || window.event;
            //evt.preventDefault();
            console.log('Boton Editar pulsado');
            control._editarDoctor = true;
            //control.mensajeGrowl('Editar doctor', 'info');
            control.initForm($(this));
        });


        //evento pulsar boton borrar
        $('#tablaDoctores').on('click', '.btnBorrar', function(e) {
            var evt = e || window.event;
            //evt.preventDefault();
            console.log('Boton Borrar pulsado');
            control.borrarDoctor($(this));

            /*var id = $(evt.target).attr('id');
            console.log(id);


            $('#modalBorrar').prop('idDoctor', id);
            $('#modalBorrar div.modal-body').html('<p>Desea borrar el doctor ' + id + ' ?</p>');
            $('#modalBorrar').modal('show');*/
        });



        /*$('#modalDoctor').on('click', '#btnConfirmarEditar', function(e) {
            var evt = e || window.event;
            //evt.preventDefault();
            console.log('Boton Confirmar Editar pulsado');

            if (control._validarDoctor.valid()) {
                console.log('VALIDO');
                control.formValido();
                console.log('FIN VALIDO');
            }



        });*/

        $('#modalBorrar').on('click', '#btnConfirmarBorrar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            var id = $('#modalBorrar').prop('idDoctor');
            console.log('Boton Confirmar Borrar pulsado ' + id);

            ///BORRAR DOCTOR
            var mensaje;
            var promise = control.borrarDoctor(id);
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
