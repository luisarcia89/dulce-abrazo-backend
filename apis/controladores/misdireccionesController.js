var misdireccionesController = {}
var misdireccionesModel = require("../modelos/misdireccionesModel.js");

misdireccionesController.Guardar = function (request, response) {
  if (!request.session.usuarioId) {
    return response.status(401).json({ mensaje: "Debes iniciar sesión" });
  }

  var datos = request.body;
  datos.idusuario = request.session.usuarioId;

  misdireccionesModel.Guardar(datos, function (doc) {
    response.status(201).json({ mensaje: "Dirección guardada con éxito", direccion: doc });
  });
}

misdireccionesController.ListarTodos = function (request, response) {
  if (!request.session.usuarioId) {
    return response.status(401).json({ mensaje: "Debes iniciar sesión" });
  }

  misdireccionesModel.ListarTodos(request.session.usuarioId, function (docs) {
    response.status(200).json(docs);
  });
}

misdireccionesController.Eliminar = function (request, response) {
  if (!request.session.usuarioId) {
    return response.status(401).json({ mensaje: "Debes iniciar sesión" });
  }

  misdireccionesModel.Eliminar({ _id: request.body._id, idusuario: request.session.usuarioId }, function (doc) {
    response.status(200).json({ mensaje: "Dirección eliminada con éxito" });
  });
}

module.exports = misdireccionesController;