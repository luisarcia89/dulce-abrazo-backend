const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const { sololoqueado } = require('./middleware/sololoqueado.js');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'dulceAbrazoSecreto',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));


mongoose.connect('mongodb://localhost:27017/ClientesDulceAbrazo')
  .then(() => console.log('Conectado a MongoDB - ClientesDulceAbrazo'))
  .catch((err) => console.error('Error al conectar a MongoDB', err));

app.use('/uploads', express.static('uploads'));

var productosController = require('./apis/controladores/productosController.js');

app.post('/productos/Guardar', sololoqueado, productosController.Guardar);
app.get('/productos/ListarTodos', productosController.ListarTodos);
app.get('/productos/CargarId/:_id', sololoqueado, productosController.CargarId);
app.put('/productos/Actualizar', sololoqueado, productosController.Actualizar);
app.delete('/productos/Eliminar', sololoqueado, productosController.Eliminar);


var clientesController = require('./apis/controladores/clientesController.js');

app.post('/clientes/Guardar', sololoqueado, clientesController.Guardar);
app.get('/clientes/ListarTodos', sololoqueado, clientesController.CargarTodos);
app.get('/clientes/CargarId/:_id', sololoqueado, clientesController.CargarId);
app.put('/clientes/Actualizar', sololoqueado, clientesController.Actualizar);
app.delete('/clientes/Eliminar', sololoqueado, clientesController.Eliminar);


var usuariosController = require('./apis/controladores/usuariosController.js');

app.post('/usuarios/Registrar', usuariosController.Registrar);
app.post('/usuarios/Login', usuariosController.Login);
app.post('/usuarios/Logout', usuariosController.Logout);
app.get('/usuarios/Estado', usuariosController.Estado);
app.post('/usuarios/Activar', usuariosController.Activar);
app.post('/usuarios/SolicitarCodigoRecuperacion', usuariosController.SolicitarCodigoRecuperacion);
app.post('/usuarios/RecuperarPassword', usuariosController.RecuperarPassword);
app.get('/usuarios/MisDatos', usuariosController.MisDatos);
app.post('/usuarios/CambiarPassword', usuariosController.CambiarPassword);

app.post('/usuarios/Guardar', sololoqueado, usuariosController.Guardar);
app.get('/usuarios/CargarTodos', sololoqueado, usuariosController.CargarTodos);
app.get('/usuarios/CargarId/:_id', sololoqueado, usuariosController.CargarId);
app.put('/usuarios/Actualizar', sololoqueado, usuariosController.Actualizar);
app.delete('/usuarios/Eliminar', sololoqueado, usuariosController.Eliminar);
app.post('/usuarios/SubirAvatar', usuariosController.SubirAvatar);
app.put('/usuarios/ActualizarMisDatos', usuariosController.ActualizarMisDatos);

var rolesController = require('./apis/controladores/rolesController.js');

app.post('/roles/Guardar', sololoqueado, rolesController.Guardar);
app.get('/roles/CargarTodos', sololoqueado, rolesController.CargarTodos);
app.get('/roles/CargarId/:_id', sololoqueado, rolesController.CargarId);
app.put('/roles/Actualizar', sololoqueado, rolesController.Actualizar);
app.delete('/roles/Eliminar', sololoqueado, rolesController.Eliminar);


var apisController = require('./apis/controladores/apisController.js');

app.post('/apis/Guardar', sololoqueado, apisController.Guardar);
app.get('/apis/CargarTodos', sololoqueado, apisController.CargarTodos);
app.get('/apis/CargarId/:_id', sololoqueado, apisController.CargarId);
app.put('/apis/Actualizar', sololoqueado, apisController.Actualizar);
app.delete('/apis/Eliminar', sololoqueado, apisController.Eliminar);


var apirolesController = require('./apis/controladores/apirolesController.js');

app.post('/apiroles/Guardar', sololoqueado, apirolesController.Guardar);
app.get('/apiroles/CargarTodos', sololoqueado, apirolesController.CargarTodos);
app.get('/apiroles/CargarId/:_id', sololoqueado, apirolesController.CargarId);
app.put('/apiroles/Actualizar', sololoqueado, apirolesController.Actualizar);
app.delete('/apiroles/Eliminar', sololoqueado, apirolesController.Eliminar);

[
  { "path": "/usuarios/Guardar", "metodo": "post", "nombrerol": "Administrador", "permiso": "Si" },
  { "path": "/usuarios/CargarTodos", "metodo": "get", "nombrerol": "Administrador", "permiso": "Si" },
  { "path": "/usuarios/CargarId/:_id", "metodo": "get", "nombrerol": "Administrador", "permiso": "Si" },
  { "path": "/usuarios/Actualizar", "metodo": "put", "nombrerol": "Administrador", "permiso": "Si" },
  { "path": "/usuarios/Eliminar", "metodo": "delete", "nombrerol": "Administrador", "permiso": "Si" }
]

app.listen(3001, () => {
  console.log('Servidor Dulce Abrazo corriendo en el puerto 3001');
});