var misdireccionesModel = {}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var misdireccionesSchema = new Schema({
  idusuario: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios", required: true },
  departamento: { type: String, required: true },
  municipio: { type: String, required: true },
  codigopostal: { type: String },
  direccion: { type: String, required: true },
  alias: { type: String, required: true }
});

const MyModel = mongoose.model("misdirecciones", misdireccionesSchema);

misdireccionesModel.Guardar = function (data, callback) {
  const instancia = new MyModel();
  instancia.idusuario = data.idusuario;
  instancia.departamento = data.departamento;
  instancia.municipio = data.municipio;
  instancia.codigopostal = data.codigopostal;
  instancia.direccion = data.direccion;
  instancia.alias = data.alias;

  instancia.save().then((doc) => {
    return callback(doc);
  });
}

misdireccionesModel.ListarTodos = function (idusuario, callback) {
  MyModel.find({ idusuario: idusuario }).then((docs) => {
    return callback(docs);
  });
}

misdireccionesModel.Eliminar = function (data, callback) {
  MyModel.findOneAndDelete({ _id: data._id, idusuario: data.idusuario }).then((doc) => {
    return callback(doc);
  });
}

module.exports = misdireccionesModel;