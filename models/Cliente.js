const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true },
  telefono: { type: String },
  direccion: { type: String }
});

module.exports = mongoose.model('Cliente', clienteSchema, 'clientes');