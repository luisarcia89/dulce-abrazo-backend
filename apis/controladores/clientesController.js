var clientesController = {}
var clientesModel = require("../modelos/clientesModel.js");
const mongoose = require("mongoose");

clientesController.Guardar = function (request, response) {

  if (!request.body.nombre) {
    return response.status(400).json({ mensaje: "El campo nombre es obligatorio" });
  }
  if (!request.body.cedula) {
    return response.status(400).json({ mensaje: "El campo cedula es obligatorio" });
  }

  clientesModel.Guardar(request.body, function (doc, err) {
    if (err) {
      return response.status(500).json({ mensaje: "Error al guardar el cliente" });
    }
    response.status(201).json({ mensaje: "Cliente guardado con éxito", cliente: doc });
  });
}

clientesController.CargarTodos = function (request, response) {
  clientesModel.CargarTodos(function (docs) {
    response.status(200).json(docs);
  });
}

clientesController.CargarId = function (request, response) {
  clientesModel.CargarId({ _id: request.params._id }, function (doc) {
    response.status(200).json(doc);
  });
}

clientesController.Actualizar = function (request, response) {

  if (!request.body._id) {
    return response.status(400).json({ mensaje: "El campo _id es obligatorio" });
  }
  if (!mongoose.isValidObjectId(request.body._id)) {
    return response.status(400).json({ mensaje: "El _id no es válido" });
  }
  if (!request.body.nombre) {
    return response.status(400).json({ mensaje: "El campo nombre es obligatorio" });
  }
  if (!request.body.cedula) {
    return response.status(400).json({ mensaje: "El campo cedula es obligatorio" });
  }

  clientesModel.Actualizar(request.body, function (doc) {
    if (!doc) {
      return response.status(404).json({ mensaje: "El _id no existe en la BD" });
    }
    response.status(200).json({ mensaje: "Cliente actualizado con éxito", cliente: doc });
  });
}

clientesController.Eliminar = function (request, response) {

  if (!request.body._id) {
    return response.status(400).json({ mensaje: "El campo _id es obligatorio" });
  }
  if (!mongoose.isValidObjectId(request.body._id)) {
    return response.status(400).json({ mensaje: "El _id no es válido" });
  }

  clientesModel.Eliminar(request.body, function (doc) {
    if (!doc) {
      return response.status(404).json({ mensaje: "El _id no existe en la BD" });
    }
    response.status(200).json({ mensaje: "Cliente eliminado con éxito" });
  });
}

module.exports = clientesController;