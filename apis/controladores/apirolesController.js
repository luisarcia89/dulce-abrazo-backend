var apirolesController = {}
var apirolesModel = require("../modelos/apirolesModel.js");

apirolesController.Guardar = function (request, response) {
  apirolesModel.Guardar(request.body, function (doc, err) {
    if (err) {
      return response.status(500).json({ mensaje: "Error al guardar el permiso", error: err.message });
    }
    response.status(201).json({ mensaje: "Permiso guardado con éxito", apirol: doc });
  });
}

apirolesController.CargarTodos = function (request, response) {
  apirolesModel.CargarTodos(function (docs) {
    response.status(200).json(docs);
  });
}

apirolesController.CargarId = function (request, response) {
  apirolesModel.CargarId({ _id: request.params._id }, function (doc) {
    response.status(200).json(doc);
  });
}

apirolesController.Actualizar = function (request, response) {
  apirolesModel.Actualizar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Permiso actualizado con éxito", apirol: doc });
  });
}

apirolesController.Eliminar = function (request, response) {
  apirolesModel.Eliminar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Permiso eliminado con éxito" });
  });
}

module.exports = apirolesController;