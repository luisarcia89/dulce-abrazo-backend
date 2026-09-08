var rolesModel = {}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var rolesSchema = new Schema({
  nombrerol: { type: String, required: true, unique: true }
});

const MyModel = mongoose.model("roles", rolesSchema);

rolesModel.Guardar = function (data, callback) {
  const instancia = new MyModel();
  instancia.nombrerol = data.nombrerol;

  instancia.save().then((doc) => {
    return callback(doc);
  }).catch((err) => {
    return callback(null, err);
  });
}

rolesModel.CargarTodos = function (callback) {
  MyModel.find().then((docs) => {
    return callback(docs);
  });
}

rolesModel.CargarId = function (data, callback) {
  MyModel.findById(data._id).then((doc) => {
    return callback(doc);
  });
}

rolesModel.Actualizar = function (data, callback) {
  MyModel.findByIdAndUpdate(data._id, {
    nombrerol: data.nombrerol
  }, { new: true }).then((doc) => {
    return callback(doc);
  });
}

rolesModel.Eliminar = function (data, callback) {
  MyModel.findByIdAndDelete(data._id).then((doc) => {
    return callback(doc);
  });
}

module.exports = rolesModel;