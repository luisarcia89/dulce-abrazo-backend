var apirolesModel = {}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var apirolesSchema = new Schema({
  path: { type: String, required: true },
  metodo: { type: String, required: true },
  nombrerol: { type: String, required: true },
  permiso: { type: String, required: true }
});

const MyModel = mongoose.model("apiroles", apirolesSchema);

apirolesModel.Guardar = function (data, callback) {
  const instancia = new MyModel();
  instancia.path = data.path;
  instancia.metodo = data.metodo;
  instancia.nombrerol = data.nombrerol;
  instancia.permiso = data.permiso;

  instancia.save().then((doc) => {
    return callback(doc);
  }).catch((err) => {
    return callback(null, err);
  });
}

apirolesModel.CargarTodos = function (callback) {
  MyModel.find().then((docs) => {
    return callback(docs);
  });
}

apirolesModel.CargarId = function (data, callback) {
  MyModel.findById(data._id).then((doc) => {
    return callback(doc);
  });
}

apirolesModel.Actualizar = function (data, callback) {
  MyModel.findByIdAndUpdate(data._id, {
    path: data.path,
    metodo: data.metodo,
    nombrerol: data.nombrerol,
    permiso: data.permiso
  }, { new: true }).then((doc) => {
    return callback(doc);
  });
}

apirolesModel.Eliminar = function (data, callback) {
  MyModel.findByIdAndDelete(data._id).then((doc) => {
    return callback(doc);
  });
}

apirolesModel.VerificarPermiso = function (data, callback) {
  MyModel.findOne({
    path: data.path,
    metodo: data.metodo,
    nombrerol: data.nombrerol
  }).then((doc) => {
    return callback(doc);
  });
}

module.exports = apirolesModel;