<?php

/* Database connection information */
include("connData.php" );


/*
 * Local functions
 */

function fatal_error($sErrorMessage = '') {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}

/*
 * MySQL connection
 */
if (!$gaSql['link'] = mysql_pconnect($gaSql['host'], $gaSql['user'], $gaSql['pass'])) {
    fatal_error('Could not open connection to server');
}

if (!mysql_select_db($gaSql['db'], $gaSql['link'])) {
    fatal_error('Could not select database ');
}

mysql_query('SET names utf8');
//$_REQUEST['id_clinica'] = 1;
if (isset($_REQUEST['id'])) {
    // param was set in the query string
    if (empty($_REQUEST['id'])) {
        return "El parámetro id viene vacio!";
    }
    $id = $_REQUEST['id'];
}

/*
 * SQL queries
 * Get data to display
 */
$query = "delete from doctores where id_doctor=" . $id;
$query_res = mysql_query($query);

// Comprobar el resultado
if (!$query_res) {
    if (mysql_errno() == 1451) {
        $mensaje = "Imposible borrar el doctor, tiene clínicas definidas.";
        $estado = mysql_errno();
    } else {
        $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
        $estado = mysql_errno();
    }
} else {
    $mensaje = "Actualización correcta";
    $estado = 0;
}
$resultado = array();
$resultado[] = array(
    'mensaje' => $mensaje,
    'estado' => $estado
);
echo json_encode($resultado);
?>
