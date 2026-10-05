var productosController = {}
var productosModel = require("../modelos/productosModel.js");
var anexosModel = require("../modelos/anexosModel.js");

productosController.Guardar = function (request, response) {

  var configuracionArchivo = {
    carpeta: "/productos",
    tamano: 5 * 1024 * 1024,
    extensiones: [".png", ".jpg", ".jpeg", ".webp"],
    single: "imagen"
  };

  anexosModel.subirArchivos(request, response, configuracionArchivo, function (respuestaArchivo) {

    if (!respuestaArchivo.state) {
      return response.status(400).json({ mensaje: respuestaArchivo.mensaje });
    }

    var datos = request.body;
    datos.imagen = respuestaArchivo.ruta;

    productosModel.Guardar(datos, function (doc) {
      response.status(201).json({ mensaje: "Producto guardado con éxito", producto: doc });
    });
  });
}

productosController.SubirGaleria = function (request, response) {

  var configuracion = {
    carpeta: "/productos/galeria",
    tamano: 5 * 1024 * 1024,
    extensiones: [".png", ".jpg", ".jpeg", ".webp"],
    campo: "imagenes",
    maximo: 4
  };

  anexosModel.subirArchivosMultiples(request, response, configuracion, function (resultado) {

    if (!resultado.state) {
      return response.status(400).json({ mensaje: resultado.mensaje });
    }

    productosModel.ActualizarGaleria({
      _id: request.body._id,
      imagenes: resultado.rutas
    }, function (doc) {
      response.status(200).json({ mensaje: "Galería actualizada con éxito", imagenes: doc.imagenes });
    });
  });
}

productosController.ListarTodos = function (request, response) {
  productosModel.ListarTodos(function (docs) {
    response.status(200).json(docs);
  });
}

productosController.CargarId = function (request, response) {
  productosModel.CargarId({ _id: request.params._id }, function (doc) {
    response.status(200).json(doc);
  });
}

productosController.Actualizar = function (request, response) {

  var configuracionArchivo = {
    carpeta: "/productos",
    tamano: 5 * 1024 * 1024,
    extensiones: [".png", ".jpg", ".jpeg", ".webp"],
    single: "imagen",
    obligatorio: false
  };

  anexosModel.subirArchivos(request, response, configuracionArchivo, function (respuestaArchivo) {

    var datos = request.body;

    if (respuestaArchivo.ruta) {
      datos.imagen = respuestaArchivo.ruta;
    }

    productosModel.Actualizar(datos, function (doc) {
      response.status(200).json({ mensaje: "Producto actualizado con éxito", producto: doc });
    });
  });
}

productosController.Eliminar = function (request, response) {
  productosModel.Eliminar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Producto eliminado con éxito" });
  });
}

module.exports = productosController;