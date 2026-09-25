var usuariosController = {}
var usuariosModel = require("../modelos/usuariosModel.js");
var mailer = require("../../utils/mailer.js");
const bcrypt = require("bcrypt");

usuariosController.Registrar = function (request, response) {
  usuariosModel.BuscarPorEmail({ email: request.body.email }, function (usuarioExistente) {

    if (usuarioExistente) {
      return response.status(400).json({ mensaje: "Ya existe un usuario con ese email" });
    }

    usuariosModel.Registrar(request.body, function (doc, err) {
      if (err) {
        return response.status(500).json({ mensaje: "Error al registrar el usuario", error: err.message });
      }

      mailer.enviarCorreo(
        doc.email,
        "Activa tu cuenta - Dulce Abrazo",
        "Tu código de activación es: " + doc.codigo
      );

      response.status(201).json({ mensaje: "Usuario registrado con éxito. Revisa tu correo para activar la cuenta" });
    });
  });
}

usuariosController.Guardar = function (request, response) {
  usuariosModel.BuscarPorEmail({ email: request.body.email }, function (usuarioExistente) {

    if (usuarioExistente) {
      return response.status(400).json({ mensaje: "Ya existe un usuario con ese email" });
    }

    usuariosModel.Guardar(request.body, function (doc, err) {
      if (err) {
        return response.status(500).json({ mensaje: "Error al guardar el usuario", error: err.message });
      }
      response.status(201).json({ mensaje: "Usuario guardado con éxito", usuario: doc });
    });
  });
}

usuariosController.Login = function (request, response) {
  usuariosModel.BuscarPorEmail({ email: request.body.email }, function (usuario) {

    if (!usuario) {
      return response.status(404).json({ mensaje: "No existe un usuario con ese email" });
    }

    if (!usuario.estado) {
      return response.status(403).json({ mensaje: "El usuario está inactivo" });
    }

    if (!usuario.activo) {
      return response.status(403).json({ mensaje: "Debes activar tu cuenta antes de iniciar sesión" });
    }

    const passwordCorrecta = bcrypt.compareSync(request.body.password, usuario.password);

    if (!passwordCorrecta) {
      return response.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    request.session.usuarioId = usuario._id;
    request.session.nombre = usuario.nombre;
    request.session.email = usuario.email;
    request.session.nombrerol = usuario.nombrerol;

    response.status(200).json({
      mensaje: "Login exitoso",
      usuario: { nombre: usuario.nombre, email: usuario.email, nombrerol: usuario.nombrerol }
    });
  });
}

usuariosController.Logout = function (request, response) {
  request.session.destroy();
  response.status(200).json({ mensaje: "Sesión cerrada correctamente" });
}

usuariosController.Estado = function (request, response) {
  if (request.session.usuarioId) {
    response.status(200).json({
      logueado: true,
      nombre: request.session.nombre,
      email: request.session.email,
      nombrerol: request.session.nombrerol
    });
  } else {
    response.status(200).json({ logueado: false });
  }
}

usuariosController.CargarTodos = function (request, response) {
  usuariosModel.CargarTodos(function (docs) {
    response.status(200).json(docs);
  });
}

usuariosController.CargarId = function (request, response) {
  usuariosModel.CargarId({ _id: request.params._id }, function (doc) {
    response.status(200).json(doc);
  });
}

usuariosController.Actualizar = function (request, response) {
  usuariosModel.Actualizar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Usuario actualizado con éxito", usuario: doc });
  });
}

usuariosController.Eliminar = function (request, response) {
  usuariosModel.Eliminar(request.body, function (doc) {
    response.status(200).json({ mensaje: "Usuario eliminado con éxito" });
  });
}

usuariosController.Activar = function (request, response) {
  usuariosModel.Activar(request.body, function (doc) {
    if (!doc) {
      return response.status(400).json({ mensaje: "Código incorrecto o email inválido" });
    }
    response.status(200).json({ mensaje: "Cuenta activada con éxito" });
  });
}

usuariosController.SolicitarCodigoRecuperacion = function (request, response) {
  usuariosModel.BuscarPorEmail({ email: request.body.email }, function (usuario) {

    if (!usuario) {
      return response.status(404).json({ mensaje: "No existe un usuario con ese email" });
    }

    usuariosModel.GenerarCodigoRecuperacion({ email: request.body.email }, function (doc) {

      mailer.enviarCorreo(
        doc.email,
        "Recuperación de contraseña - Dulce Abrazo",
        "Tu código de recuperación es: " + doc.codigo
      );

      response.status(200).json({ mensaje: "Código de recuperación enviado a tu correo" });
    });
  });
}

usuariosController.RecuperarPassword = function (request, response) {
  usuariosModel.RecuperarPassword(request.body, function (doc) {
    if (!doc) {
      return response.status(400).json({ mensaje: "Código incorrecto o email inválido" });
    }
    response.status(200).json({ mensaje: "Contraseña actualizada con éxito" });
  });
}

usuariosController.MisDatos = function (request, response) {
  if (!request.session.usuarioId) {
    return response.status(401).json({ mensaje: "Debes iniciar sesión" });
  }

  response.status(200).json({
    nombre: request.session.nombre,
    email: request.session.email,
    nombrerol: request.session.nombrerol
  });
}

usuariosController.CambiarPassword = function (request, response) {
  if (!request.session.usuarioId) {
    return response.status(401).json({ mensaje: "Debes iniciar sesión" });
  }

  var data = {
    _id: request.session.usuarioId,
    passwordActual: request.body.passwordActual,
    passwordNueva: request.body.passwordNueva
  };

  usuariosModel.CambiarPassword(data, function (doc, err) {
    if (err) {
      return response.status(400).json({ mensaje: err });
    }
    response.status(200).json({ mensaje: "Contraseña actualizada con éxito" });
  });
}

module.exports = usuariosController;