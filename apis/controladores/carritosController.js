var carritosController = {}
var carritosModel = require("../modelos/carritosModel.js");

carritosController.MiCarrito = function (request, response) {
  var data = {
    idproducto: request.body.idproducto,
    idtracking: request.body.idtracking,
    idusuario: request.session.usuarioId || null,
    cantidad: request.body.cantidad || 1
  };

  if (!data.idtracking) {
    return response.status(400).json({ mensaje: "Falta el idtracking" });
  }

  carritosModel.MiCarrito(data, function (doc) {
    response.status(200).json({ mensaje: "Producto agregado al carrito", carrito: doc });
  });
}

carritosController.CargarTodos = function (request, response) {
  var idtracking = request.params.idtracking;

  carritosModel.CargarTodos(idtracking, function (docs) {
    response.status(200).json(docs);
  });
}

carritosController.ActualizarCantidad = function (request, response) {
  carritosModel.ActualizarCantidad(request.body, function (doc) {
    response.status(200).json({ mensaje: "Cantidad actualizada", carrito: doc });
  });
}

carritosController.Eliminar = function (request, response) {
  carritosModel.Eliminar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Producto eliminado del carrito" });
  });
}

module.exports = carritosController;