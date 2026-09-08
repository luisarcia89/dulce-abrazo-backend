var clientesModel = {}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var clientesSchema = new Schema({
  nombre: { type: String, required: true },
  cedula: { type: String, required: true },
  telefono: { type: String },
  direccion: { type: String }
});

const MyModel = mongoose.model("clientes", clientesSchema);

clientesModel.Guardar = function (data, callback) {
  const instancia = new MyModel();
  instancia.nombre = data.nombre;
  instancia.cedula = data.cedula;
  instancia.telefono = data.telefono;
  instancia.direccion = data.direccion;

  instancia.save().then((doc) => {
    return callback(doc);
  });
}

clientesModel.CargarTodos = function (callback) {
  MyModel.find().then((docs) => {
    return callback(docs);
  });
}

clientesModel.CargarId = function (data, callback) {
  MyModel.findById(data._id).then((doc) => {
    return callback(doc);
  });
}

clientesModel.Actualizar = function (data, callback) {
  MyModel.findByIdAndUpdate(data._id, {
    nombre: data.nombre,
    cedula: data.cedula,
    telefono: data.telefono,
    direccion: data.direccion
  }, { new: true }).then((doc) => {
    return callback(doc);
  });
}

clientesModel.Eliminar = function (data, callback) {
  MyModel.findByIdAndDelete(data._id).then((doc) => {
    return callback(doc);
  });
}

module.exports = clientesModel;