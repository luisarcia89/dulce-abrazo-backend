var anexosModel = {}
const multer = require("multer");
const path = require("path");
const fs = require("fs");

anexosModel.subirArchivos = function (request, response, data, callback) {

  const carpetaDestino = path.join(__dirname, "..", "..", "uploads", data.carpeta || "");

  if (!fs.existsSync(carpetaDestino)) {
    fs.mkdirSync(carpetaDestino, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, carpetaDestino);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();

      if (data.extensiones && !data.extensiones.includes(ext)) {
        return cb(new Error("Extensión no permitida"));
      }

      const nombreFinal = data.nombre
        ? data.nombre + ext
        : Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

      cb(null, nombreFinal);
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: data.tamano || (5 * 1024 * 1024) }
  }).single(data.single || "file");

  upload(request, response, function (err) {
    if (err) {
      return callback({ state: false, mensaje: err.message });
    }

    if (!request.file) {
      if (data.obligatorio) {
        return callback({ state: false, mensaje: "No se recibió ningún archivo" });
      }
      return callback({ state: true, mensaje: "Sin archivo nuevo", archivo: null, ruta: null });
    }

    return callback({
      state: true,
      mensaje: "Archivo subido con éxito",
      archivo: request.file.filename,
      ruta: (data.carpeta || "") + "/" + request.file.filename
    });
  });
}

module.exports = anexosModel;