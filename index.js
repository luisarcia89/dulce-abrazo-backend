const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var productos = [];

app.post('/productos/Guardar', (req, res) => {
  var nuevoProducto = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    categoria: req.body.categoria,
    cantidadStock: req.body.cantidadStock,
  };

  productos.push(nuevoProducto);
  res.status(201).json({ mensaje: "Producto guardado con éxito", producto: nuevoProducto });
});

app.get('/productos/ListarTodos', (req, res) => {
  res.status(200).json(productos);
});

app.listen(3001, () => {
  console.log('Servidor Dulce Abrazo corriendo en el puerto 3001');
});