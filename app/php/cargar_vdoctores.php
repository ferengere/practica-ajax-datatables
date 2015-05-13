<?php

//Cargar datos de conexión en array $sql_details
require_once('connData.php');

 
// DB table to use
$table = 'view_doctores';
 
// Table's primary key
$primaryKey = 'id_doctor';
 
// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database, while the `dt`
// parameter represents the DataTables column identifier. In this case simple
// indexes
$columns = array(
    array( 'db' => 'id_doctor', 'dt' => 'idDoctor' ),
    array( 'db' => 'nombre', 'dt' => 'nombreDoctor' ),
    array( 'db' => 'numcolegiado',  'dt' => 'numColegiado' ),
    array( 'db' => 'clinicas', 'dt' => 'clinicas' )
);
 
 
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * If you just want to use the basic configuration for DataTables with PHP
 * server-side, there is no need to edit below this line.
 */
 
require( 'ssp.class.php' );
 
echo json_encode(
    SSP::simple( $_GET, $gaSql, $table, $primaryKey, $columns )
);
