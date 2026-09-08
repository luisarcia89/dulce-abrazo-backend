var apirolesModel = require("../apis/modelos/apirolesModel.js");

module.exports = {
  sololoqueado: function (request, response, next) {

    if (!request.session.usuarioId) {
      return response.status(401).json({ mensaje: "Debes iniciar sesión para realizar esta acción" });
    }

    apirolesModel.VerificarPermiso({
      path: request.route.path,
      metodo: request.method.toLowerCase(),
      nombrerol: request.session.nombrerol
    }, function (permiso) {

      if (permiso && permiso.permiso === "Si") {
        next();
      } else {
        response.status(403).json({ mensaje: "Tu rol no tiene permiso para usar esta función" });
      }

    });

  }
}