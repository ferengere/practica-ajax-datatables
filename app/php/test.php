
<html>
<body>
<form action="cargar_doctores.php" method="post">
<label for="inputUsuario">Escribe el id del doctor</label>	
<input type="text" name="inputUsuario">
<input type="submit" value="Enviar">
</form>
<form action="validar_nif_db.php" method="post">
<label for="inputCifNif">Escribe el cif/nif</label>	
<input type="text" name="inputCifNif">
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



