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
if (!empty($_POST['id'])){
$id=$_POST['id'];
} else {
    $id="";
}



$query1 = "DELETE FROM clinica_doctor WHERE id_doctor = ".$id;
    $res1 = mysql_query($query1);
        // Comprobar el resultado
    if (!$res1) {
        $mensaje = 'Error en la operación';
        $estado = mysql_errno();
    } else {
        $mensaje = "Operación correcta";
        $estado  = 0;
    }

$query2 = "DELETE FROM doctores WHERE id_doctor = ".$id;
    $res2 = mysql_query($query2);
        
    // Comprobar el resultado
    if (!$res2) {
        $mensaje = 'Error en la operación';
        $estado = mysql_errno();
    } else {
        $mensaje = "Operación correcta";
        $estado  = 0;
    }


$resultado = array();
$resultado[] = array(
    'mensaje' => $mensaje,
    'estado' => $estado
);
echo json_encode($resultado);
?>
