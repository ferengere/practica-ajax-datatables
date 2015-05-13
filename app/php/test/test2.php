
<html>
<body>
<form action="http://javieriranzo.infenlaces.com/2014_2015/DAW_DAWEC/practicaWebApp/dist/php/mto_doctor.php" method="post">
<label>Listar doctores</label>	
<input type="hidden" name="accion" value="cargarTabla">
<input type="submit" value="Enviar">
</form>
<form action="cargar_clinicas.php" method="post">
<label>Listar clínicas</label>
<input type="submit" value="Enviar">
</form>
<form action="validar_iban_db.php" method="post">
<label for="inputIban">Escribe el iban</label>	
<input type="text" name="inputIban">
<input type="submit" value="Enviar">
</form>
<form action="buscar_municipio_db.php" method="get">
<label for="cp">Escribe el cp</label>	
<input type="text" name="cp">
<input type="submit" value="Enviar">
</form>
</body>
</html>



