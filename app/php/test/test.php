
<html>
<body>
<form action="../cargar_vdoctores.php" method="post">
<label for="inputUsuario">Escribe el id del doctor</label>	
<input type="text" name="inputUsuario">
<input type="submit" value="Enviar">
</form>
<form action="../cargar_clinicas.php" method="post">
<label>Listar clínicas</label>
<input type="submit" value="Enviar">
</form>
<form action="../registro_doctor.php" method="post">
<label for="editar">Editar</label>	
<input type="checkbox" name="editar" value="true">
<br/>
<label for="id">Id</label>	
<input type="text" name="id" value="10">
<br/>
<label for="nombre">Nombre</label>	
<input type="text" name="nombre" value="pepe">
<br/>
<label for="numero">Numero</label>	
<input type="text" name="numero" value="44444">
<br/>
<select class="form-control"name="clinicas[]" multiple size="5">
<option id="1" value="1">clinica 1</option>
<option id="2" value="2" selected="selected">clinica 2</option>
<option id="3" value="3">clinica 3</option>
<option id="4" value="4" selected="selected">clinica 4</option>
<option id="5" value="5">clinica 5</option>
</select>
<input type="submit" value="Enviar">
</form>
<form action="../buscar_municipio_db.php" method="post">
<label for="cp">Escribe el cp</label>	
<input type="text" name="cp">
<input type="submit" value="Enviar">
</form>
</body>
</html>



