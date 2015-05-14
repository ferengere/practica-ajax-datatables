//main.js
'use strict';

$(document).ready(
    function() {
        console.log('DOCUMENT.READY');

        var control = {
            //_tablaDoctores: null,
            //_dtDoctores: null,
            _modalDoctor: null,
            _formDoctor: null,
            _modalBorrar: $('#modalBorrar'),
            _modalConfirmar: $('#modalConfirmar'),
            _idDoctor: null,
            _editarDoctor: false, //false nuevo, true editar
            _init: function() {
                //this._tablaDoctores = $('#tablaDoctores');
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
                /*console.log('elem:');
                console.log(elem);
                console.log('$(elem):');
                console.log($(elem));*/
                if (this._editarDoctor === true) {
                    //var nRow = $(elem).parents('tr')[0];

                    //console.log('nRow: ' + nRow);
                    //var aData = this._dtDoctores.row(nRow).data();
                    var tr = $elem.closest('tr');
                    var nRow = _dtDoctores.row(tr);
                    console.log('nRow: ' + nRow);
                    var aData = nRow.data();


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
                    data: data
                });
            },
            formValido: function() {
                var self = this;
                var datosDoctor = {
                    editar: this._editarDoctor,
                    id: this._idDoctor,
                    nombre: this._formDoctor.find('#nombre').val(),
                    numero: this._formDoctor.find('#numero').val(),
                    clinicas: this._formDoctor.find('#selClinicas').val()
                };
                //if (this._formDoctor.find('#numero').val()){
                //datosDoctor.numero }

                console.log(datosDoctor);
                console.log('numero: ' + datosDoctor.numero);
                //ejecutar ajax con los datos del doctor
                var promise = control.registroDoctor(datosDoctor);
                promise.success(function(data) {
                    console.log('PROMISE SUCCESS');
                    data = data[0];
                    console.log(data.estado);
                    console.log(data.mensaje);
                    switch (data.estado) {
                        case 0:
                            $.bootstrapGrowl(data.mensaje, {
                                type: 'success',
                                offset: {
                                    from: 'bottom',
                                    amount: 20
                                }
                            });
                            break;
                        default:
                            $.bootstrapGrowl(data.mensaje, {
                                type: 'error',
                                offset: {
                                    from: 'bottom',
                                    amount: 20
                                }
                            });
                    }

                    _dtDoctores = _tablaDoctores.DataTable({
                        'bRetrieve': true
                    });
                    //actualizamos datatables:
                    _dtDoctores.draw();

                });
                promise.error(function(xhr, status, error) {
                    console.log('PROMISE ERROR');
                    console.log(error);
                    $.bootstrapGrowl(error, {
                        type: 'error',
                        offset: {
                            from: 'bottom',
                            amount: 20
                        }
                    });
                });

                //refrescar tabla
                /*var $tabla = $('#tablaDoctores').dataTable({
                    'bRetrieve': true
                });
                //actualizamos datatables:
                $tabla.fnDraw();*/

                //console.log('this._tablaDoctores: ' + $(this.this._tablaDoctores));
                //esconder modal
                this._modalDoctor.modal('hide');
            },
            prepararModalBorrar: function($elem) {
                var nRow = $elem.parents('tr')[0];
                var aData = this._tablaDoctores.row(nRow).data();
                this._idDoctor = aData.idDoctor;
                /*var mensaje1 = 'El doctor será borrado';
                var mensaje2 = '¿?';
                this._modalBorrar.find('#mensaje1').text(mensaje1);
                this._modalBorrar.find('#mensaje2').text(mensaje2);*/
            },
            confirmarBorrar: function() {
                //promesa borrarDoctor(id);
                //como formvalido
            }
        };



        control._init();
        var _tablaDoctores = $('#tablaDoctores');
        var _dtDoctores = _tablaDoctores.DataTable({
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
                    return '<button class="btn btn-warning btnBorrar" data-target="#modalBorrar" data-toggle="modal" data-backdrop="static">Borrar</button>';
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

        control._formDoctor.validate({
            onsubmit: false,
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
            /*submitHandler: function(form) {
                console.log('submit');
                form.preventDefault();
                control.formValido();
            }*/
        });


        //evento pulsar boton nuevo
        $('.btnNuevo').on('click', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            //console.log('Boton Nuevo pulsado');
            control._editarDoctor = false;
            control.initForm($(this));
        });

        //evento pulsar boton editar
        $('#tablaDoctores').on('click', '.btnEditar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            //console.log('Boton Editar pulsado');
            control._editarDoctor = true;
            control.initForm($(this));
        });

        $('#modalDoctor').on('click', '#btnConfirmarEditar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            console.log('Boton Confirmar Editar pulsado');
            if (control._formDoctor.valid()) {
                control.formValido();
            }
        });


        //evento pulsar boton borrar
        /*$('#tablaDoctores').on('click', '.btnBorrar', function(e) {
            var evt = e || window.event;
            //evt.preventDefault();
            console.log('Boton Borrar pulsado');
            //no se hace nada, el modalBorrar se abre con los parámetros del botón

            //mostrar men
            //control.confirmarBorrar($(this));

            
        });*/

        $('#modalBorrar').on('show.bs.modal', function(e) {
            //preparar mensaje del modal
            var evt = e || window.event;
            //evt.preventDefault();
            console.log('Boton Borrar pulsado');
            control.prepararModalBorrar($(this));
        });

        $('#modalBorrar').on('click', '#btnConfirmarBorrar', function(e) {
            var evt = e || window.event;
            evt.preventDefault();
            console.log('Boton Confirmar Borrar pulsado');

            ///BORRAR DOCTOR
            /*var mensaje;
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
            });*/

            $('#modalBorrar').modal('hide');

        });

    }); //ready
