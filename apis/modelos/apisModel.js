var apisModel = {}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var apisSchema = new Schema({
  path: { type: String, required: true },
  metodo: { type: String, required: true },
  descripcion: { type: String }
});

const MyModel = mongoose.model("apis", apisSchema);

apisModel.Guardar = function (data, callback) {
  const instancia = new MyModel();
  instancia.path = data.path;
  instancia.metodo = data.metodo;
  instancia.descripcion = data.descripcion;

  instancia.save().then((doc) => {
    return callback(doc);
  }).catch((err) => {
    return callback(null, err);
  });
}

apisModel.CargarTodos = function (callback) {
  MyModel.find().then((docs) => {
    return callback(docs);
  });
}

apisModel.CargarId = function (data, callback) {
  MyModel.findById(data._id).then((doc) => {
    return callback(doc);
  });
}

apisModel.Actualizar = function (data, callback) {
  MyModel.findByIdAndUpdate(data._id, {
    path: data.path,
    metodo: data.metodo,
    descripcion: data.descripcion
  }, { new: true }).then((doc) => {
    return callback(doc);
  });
}

apisModel.Eliminar = function (data, callback) {
  MyModel.findByIdAndDelete(data._id).then((doc) => {
    return callback(doc);
  });
}

module.exports = apisModel;