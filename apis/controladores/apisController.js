var apisController = {}
var apisModel = require("../modelos/apisModel.js");

apisController.Guardar = function (request, response) {
  apisModel.Guardar(request.body, function (doc, err) {
    if (err) {
      return response.status(500).json({ mensaje: "Error al guardar la api", error: err.message });
    }
    response.status(201).json({ mensaje: "Api guardada con éxito", api: doc });
  });
}

apisController.CargarTodos = function (request, response) {
  apisModel.CargarTodos(function (docs) {
    response.status(200).json(docs);
  });
}

apisController.CargarId = function (request, response) {
  apisModel.CargarId({ _id: request.params._id }, function (doc) {
    response.status(200).json(doc);
  });
}

apisController.Actualizar = function (request, response) {
  apisModel.Actualizar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Api actualizada con éxito", api: doc });
  });
}

apisController.Eliminar = function (request, response) {
  apisModel.Eliminar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Api eliminada con éxito" });
  });
}

module.exports = apisController;