var carritosModel = {}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var carritosSchema = new Schema({
  idproducto: { type: mongoose.Schema.Types.ObjectId, ref: "productos", required: true },
  idtracking: { type: String, required: true },
  idusuario: { type: mongoose.Schema.Types.ObjectId, ref: "usuarios" },
  cantidad: { type: Number, required: true, default: 1 }
});

const MyModel = mongoose.model("carritos", carritosSchema);

carritosModel.MiCarrito = function (data, callback) {
  MyModel.findOne({ idtracking: data.idtracking, idproducto: data.idproducto }).then((existente) => {

    if (existente) {
      existente.cantidad = existente.cantidad + data.cantidad;
      existente.save().then((doc) => {
        return callback(doc);
      });
    } else {
      const instancia = new MyModel();
      instancia.idproducto = data.idproducto;
      instancia.idtracking = data.idtracking;
      instancia.idusuario = data.idusuario || null;
      instancia.cantidad = data.cantidad;

      instancia.save().then((doc) => {
        return callback(doc);
      });
    }
  });
}

carritosModel.CargarTodos = function (idtracking, callback) {
  MyModel.aggregate([
    { $match: { idtracking: idtracking } },
    {
      $lookup: {
        from: "productos",
        localField: "idproducto",
        foreignField: "_id",
        as: "producto"
      }
    },
    { $unwind: "$producto" },
    {
      $project: {
        _id: 1,
        cantidad: 1,
        idproducto: 1,
        nombre: "$producto.nombre",
        precio: "$producto.precio",
        imagen: "$producto.imagen",
        cantidadStock: "$producto.cantidadStock"
      }
    }
  ]).then((docs) => {
    return callback(docs);
  });
}

carritosModel.ActualizarCantidad = function (data, callback) {
  MyModel.findByIdAndUpdate(data._id, {
    cantidad: data.cantidad
  }, { new: true }).then((doc) => {
    return callback(doc);
  });
}

carritosModel.Eliminar = function (data, callback) {
  MyModel.findByIdAndDelete(data._id).then((doc) => {
    return callback(doc);
  });
}

carritosModel.VaciarCarrito = function (idtracking, callback) {
  MyModel.deleteMany({ idtracking: idtracking }).then(() => {
    return callback(true);
  });
}

module.exports = carritosModel;