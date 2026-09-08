var rolesController = {}
var rolesModel = require("../modelos/rolesModel.js");

rolesController.Guardar = function (request, response) {
  rolesModel.Guardar(request.body, function (doc, err) {
    if (err) {
      return response.status(500).json({ mensaje: "Error al guardar el rol", error: err.message });
    }
    response.status(201).json({ mensaje: "Rol guardado con éxito", rol: doc });
  });
}

rolesController.CargarTodos = function (request, response) {
  rolesModel.CargarTodos(function (docs) {
    response.status(200).json(docs);
  });
}

rolesController.CargarId = function (request, response) {
  rolesModel.CargarId({ _id: request.params._id }, function (doc) {
    response.status(200).json(doc);
  });
}

rolesController.Actualizar = function (request, response) {
  rolesModel.Actualizar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Rol actualizado con éxito", rol: doc });
  });
}

rolesController.Eliminar = function (request, response) {
  rolesModel.Eliminar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Rol eliminado con éxito" });
  });
}

module.exports = rolesController;