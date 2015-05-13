<?php
print_r($_POST);

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
$id=$_POST['id'];
$nombre = $_POST['nombre'];
$numero=$_POST['numero'];
$clinicas=$_POST['clinicas'];

if ($editar == 'true'){
//editar doctor
    //echo 'editar';
    $query = "UPDATE doctores SET nombre = upper('" . $nombre . "'), numcolegiado = '" . $numero . "'  WHERE id_doctor = '" . $id . "' ";
    $res = mysql_query($query);
        
        // Comprobar el resultado
        if (!res) {
            echo 'error';
            $mensaje = 'Error en la operación';
            $estado = mysql_errno();
        } else {

            $mensaje = "Operación correcta";
            $estado  = 0;
        }

        $query = "DELETE FROM clinica_doctor WHERE id_doctor = ".$id;
        echo $query;
        $res = mysql_query($query);
        
        // Comprobar el resultado
        if (!res) {
            echo 'error';
            $mensaje = 'Error en la operación';
            $estado = mysql_errno();
        } else {

            $mensaje = "Operación correcta";
            $estado  = 0;
        }
}else{
//doctor nuevo
    $query = "INSERT INTO doctores (nombre, numcolegiado) values(upper('" . $nombre . "'), '" . $numero . "')";
    $res = mysql_query($query);
        
        // Comprobar el resultado
        if (!res) {
            echo 'error';
            $mensaje = 'Error en la operación';
            $estado = mysql_errno();
        } else {

            $mensaje = "Operación correcta";
            $estado  = 0;
            $id =mysql_insert_id();
            echo 'ID: '.$id;
        }

}

//insertar clinicas
foreach ($clinicas as $key => $value) {
            $query = "INSERT INTO clinica_doctor (id_doctor, id_clinica) values( '".$id."', '".$value."' ) ";
            echo $query;
            $res = mysql_query($query);
            if (!res) {
                echo 'error';
                $mensaje = 'Error en la operación';
                $estado = mysql_errno();
            } else {

            $mensaje = "Operación correcta";
            $estado  = 0;
            }
}







//echo json_encode($_POST);

    $resultado   = array();
    $resultado[] = array(
        'mensaje' => $mensaje,
        'estado' => $estado
    );
    echo json_encode($resultado);


?>
