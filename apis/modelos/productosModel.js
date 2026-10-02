var productosModel = {}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var productosSchema = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  categoria: { type: String },
  cantidadStock: { type: Number, default: 0 },
  imagen: { type: String }
});

const MyModel = mongoose.model("productos", productosSchema);

productosModel.Guardar = function (data, callback) {
  const instancia = new MyModel();
  instancia.nombre = data.nombre;
  instancia.descripcion = data.descripcion;
  instancia.precio = data.precio;
  instancia.categoria = data.categoria;
  instancia.cantidadStock = data.cantidadStock;
  instancia.imagen = data.imagen;

  instancia.save().then((doc) => {
    return callback(doc);
  });
}

productosModel.ListarTodos = function (callback) {
  MyModel.find().then((docs) => {
    return callback(docs);
  });
}

productosModel.CargarId = function (data, callback) {
  MyModel.findById(data._id).then((doc) => {
    return callback(doc);
  });
}

productosModel.Actualizar = function (data, callback) {
  MyModel.findByIdAndUpdate(data._id, {
    nombre: data.nombre,
    descripcion: data.descripcion,
    precio: data.precio,
    categoria: data.categoria,
    cantidadStock: data.cantidadStock,
    imagen: data.imagen
  }, { new: true }).then((doc) => {
    return callback(doc);
  });
}

productosModel.Eliminar = function (data, callback) {
  MyModel.findByIdAndDelete(data._id).then((doc) => {
    return callback(doc);
  });
}

module.exports = productosModel;