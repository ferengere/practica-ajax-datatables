<?php

/* Database connection information */
include("connData.php");

/*
 * Local functions
 */

function fatal_error($sErrorMessage = '')
{
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}

if (!$gaSql['link'] = mysql_pconnect($gaSql['host'], $gaSql['user'], $gaSql['pass'])) {
    fatal_error('Could not open connection to server');
}

if (!mysql_select_db($gaSql['db'], $gaSql['link'])) {
    fatal_error('Could not select database ');
}

mysql_query('SET names utf8');

$editar = $_POST['editar'];
if (!empty($_POST['id'])){
$id=$_POST['id'];
} else {
    $id="";
}
$nombre = $_POST['nombre'];
if (!empty($_POST['numero'])){
$numero=$_POST['numero'];
} else {
    $numero="";
}
$clinicas = $_POST['clinicas'];

/*echo "<br>";
echo "id: ".$id;
echo "<br>";
echo "numero: ".$numero;*/
//return 0;

if ($editar == 'true'){
//editar doctor
    //echo 'editar';
    $query1 = "UPDATE doctores SET nombre = upper('" . $nombre . "'), numcolegiado = '" . $numero . "'  WHERE id_doctor = '" . $id . "'";
    //echo "<br>";
    //echo $query1;
//return 0;
    $res1 = mysql_query($query1);
        // Comprobar el resultado
        if (!$res1) {
            $mensaje = 'Error en la operación';
            $estado = mysql_errno();
        } else {
            $mensaje = "Operación correcta";
            $estado  = 0;
        }

        $query2 = "DELETE FROM clinica_doctor WHERE id_doctor = ".$id;
        $res2 = mysql_query($query2);
        
        // Comprobar el resultado
        if (!$res2) {
            $mensaje = 'Error en la operación';
            $estado = mysql_errno();
        } else {
            $mensaje = "Operación correcta";
            $estado  = 0;
        }
}else{
//doctor nuevo
    $query3 = "INSERT INTO doctores (nombre, numcolegiado) values(upper('" . $nombre . "'), '" . $numero . "')";
    $res3 = mysql_query($query3);
        
        // Comprobar el resultado
        if (!$res3) {
            $mensaje = 'Error en la operación';
            $estado = mysql_errno();
        } else {
            $mensaje = "Operación correcta";
            $estado  = 0;
            $id =mysql_insert_id();
        }

}

//insertar clinicas
foreach ($clinicas as $key => $value) {
    $query4 = "INSERT INTO clinica_doctor (id_doctor, id_clinica) values( '".$id."', '".$value."' )";
    $res4 = mysql_query($query4);
            
    // Comprobar el resultado
    if (!$res4) {
        $mensaje = 'Error en la operación';
        $estado = mysql_errno();
    } else {
        $mensaje = "Operación correcta";
        $estado  = 0;
    }
}




    $resultado   = array();
    $resultado[] = array(
        'mensaje' => $mensaje,
        'estado' => $estado
    );

    //print_r($_POST);
    echo json_encode($resultado);


?>