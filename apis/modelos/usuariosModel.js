var usuariosModel = {}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

var usuariosSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  estado: { type: Boolean, default: true },
  nombrerol: { type: String, default: "Cliente" },
  activo: { type: Boolean, default: false },
  codigo: { type: String }
});

const MyModel = mongoose.model("usuarios", usuariosSchema);

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

usuariosModel.Registrar = function (data, callback) {
  const instancia = new MyModel();
  instancia.nombre = data.nombre;
  instancia.email = data.email;
  instancia.password = bcrypt.hashSync(data.password, 10);
  instancia.estado = true;
  instancia.nombrerol = data.nombrerol || "Cliente";
  instancia.activo = false;
  instancia.codigo = generarCodigo();

  instancia.save().then((doc) => {
    return callback(doc);
  }).catch((err) => {
    return callback(null, err);
  });
}

usuariosModel.Guardar = function (data, callback) {
  const instancia = new MyModel();
  instancia.nombre = data.nombre;
  instancia.email = data.email;
  instancia.password = bcrypt.hashSync(data.password, 10);
  instancia.estado = true;
  instancia.nombrerol = data.nombrerol || "Cliente";
  instancia.activo = true;
  instancia.codigo = "";

  instancia.save().then((doc) => {
    return callback(doc);
  }).catch((err) => {
    return callback(null, err);
  });
}

usuariosModel.BuscarPorEmail = function (data, callback) {
  MyModel.findOne({ email: data.email }).then((doc) => {
    return callback(doc);
  });
}

usuariosModel.BuscarPorId = function (data, callback) {
  MyModel.findById(data._id).then((doc) => {
    return callback(doc);
  });
}

usuariosModel.CargarTodos = function (callback) {
  MyModel.find().then((docs) => {
    return callback(docs);
  });
}

usuariosModel.CargarId = function (data, callback) {
  MyModel.findById(data._id).then((doc) => {
    return callback(doc);
  });
}

usuariosModel.Actualizar = function (data, callback) {
  MyModel.findByIdAndUpdate(data._id, {
    nombre: data.nombre,
    estado: data.estado,
    nombrerol: data.nombrerol
  }, { new: true }).then((doc) => {
    return callback(doc);
  });
}

usuariosModel.Eliminar = function (data, callback) {
  MyModel.findByIdAndDelete(data._id).then((doc) => {
    return callback(doc);
  });
}

usuariosModel.Activar = function (data, callback) {
  MyModel.findOneAndUpdate(
    { email: data.email, codigo: data.codigo },
    { activo: true, codigo: "" },
    { new: true }
  ).then((doc) => {
    return callback(doc);
  });
}

usuariosModel.GenerarCodigoRecuperacion = function (data, callback) {
  const nuevoCodigo = generarCodigo();
  MyModel.findOneAndUpdate(
    { email: data.email },
    { codigo: nuevoCodigo },
    { new: true }
  ).then((doc) => {
    return callback(doc);
  });
}

usuariosModel.RecuperarPassword = function (data, callback) {
  MyModel.findOneAndUpdate(
    { email: data.email, codigo: data.codigo },
    { password: bcrypt.hashSync(data.password, 10), codigo: "" },
    { new: true }
  ).then((doc) => {
    return callback(doc);
  });
}

usuariosModel.CambiarPassword = function (data, callback) {
  MyModel.findById(data._id).then((usuario) => {
    if (!usuario) {
      return callback(null, "Usuario no encontrado");
    }

    const passwordCorrecta = bcrypt.compareSync(data.passwordActual, usuario.password);
    if (!passwordCorrecta) {
      return callback(null, "La contraseña actual es incorrecta");
    }

    usuario.password = bcrypt.hashSync(data.passwordNueva, 10);
    usuario.save().then((doc) => {
      return callback(doc);
    });
  });
}

module.exports = usuariosModel;