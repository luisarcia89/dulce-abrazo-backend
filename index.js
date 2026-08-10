const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Cliente = require('./models/Cliente');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/ClientesDulceAbrazo')
  .then(() => console.log('Conectado a MongoDB - ClientesDulceAbrazo'))
  .catch((err) => console.error('Error al conectar a MongoDB', err));

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



app.post('/clientes/Guardar', async (req, res) => {
  try {
    const nuevoCliente = new Cliente({
      nombre: req.body.nombre,
      cedula: req.body.cedula,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
    });

    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json({ mensaje: "Cliente guardado con éxito", cliente: clienteGuardado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar el cliente", error: error.message });
  }
});

app.get('/clientes/ListarTodos', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar los clientes", error: error.message });
  }
});

app.put('/clientes/Actualizar/:id', async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        cedula: req.body.cedula,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
      },
      { new: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({ mensaje: "No existe un cliente con ese id" });
    }

    res.status(200).json({ mensaje: "Cliente actualizado con éxito", cliente: clienteActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el cliente", error: error.message });
  }
});

app.delete('/clientes/Eliminar/:id', async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);

    if (!clienteEliminado) {
      return res.status(404).json({ mensaje: "No existe un cliente con ese id" });
    }

    res.status(200).json({ mensaje: "Cliente eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el cliente", error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Servidor Dulce Abrazo corriendo en el puerto 3001');
});