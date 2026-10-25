// 1. Traemos Mongoose y el controlador que vamos a probar
const mongoose = require("mongoose")
const rolesController = require("./rolesController.js")

// 2. Le pedimos a Mongoose el modelo por su nombre
const Roles = mongoose.model("roles")

// 3. El mesero falso: lleva el pedido al controlador y espera su respuesta
function ejecutar(metodo, body = {}, params = {}) {
    return new Promise((resolve) => {
        const request = { body: body, params: params, session: {} }
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn((data) => resolve({ request, response, data }))
        }
        rolesController[metodo](request, response)
    })
}

// 4. Datos del rol de prueba
const ROL = {
    nombrerol: "Rol Jest"
}

// 5. Preparación y limpieza
beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test")
    await Roles.init()
    await Roles.deleteMany({ nombrerol: /Jest/ })
})

afterAll(async () => {
    await Roles.deleteMany({ nombrerol: /Jest/ })
    await mongoose.connection.close()
})

describe("POST: /roles/Guardar", () => {

    test("debe fallar si no llega el nombrerol", async () => {
        const { response, data } = await ejecutar("Guardar", { nombrerol: "" })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(data.mensaje).toBe("El campo nombrerol es obligatorio")
    })

    test("debe guardar el rol correctamente", async () => {
        const { response, data } = await ejecutar("Guardar", { ...ROL })
        expect(response.status).toHaveBeenCalledWith(201)
        expect(data.mensaje).toBe("Rol guardado con éxito")
        expect(data.rol.nombrerol).toBe(ROL.nombrerol)

        // Confirmamos en la BD que de verdad quedó guardado
        const enBD = await Roles.findOne({ nombrerol: ROL.nombrerol })
        expect(enBD).not.toBeNull()
    })

    test("debe fallar si el rol ya existe", async () => {
        const { response, data } = await ejecutar("Guardar", { ...ROL })
        expect(response.status).toHaveBeenCalledWith(500)
        expect(data.mensaje).toBe("Error al guardar el rol")
    })
})

describe("GET: /roles/CargarTodos", () => {

    test("debe traer una lista con datos", async () => {
        const { response, data } = await ejecutar("CargarTodos")
        expect(response.status).toHaveBeenCalledWith(200)
        expect(Array.isArray(data)).toBe(true)
        expect(data.length).toBeGreaterThan(0)
    })

    test("la lista debe incluir el rol de prueba", async () => {
        const { data } = await ejecutar("CargarTodos")
        const encontrado = data.some((rol) => rol.nombrerol === ROL.nombrerol)
        expect(encontrado).toBe(true)
    })
})

describe("GET: /roles/CargarId", () => {

    test("debe traer el rol por su _id", async () => {
        // Buscamos el _id real que Mongo le asignó al rol de prueba
        const doc = await Roles.findOne({ nombrerol: ROL.nombrerol })
        const id = String(doc._id)

        const { response, data } = await ejecutar("CargarId", {}, { _id: id })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.nombrerol).toBe(ROL.nombrerol)
    })

    test("debe responder null si el _id no existe", async () => {
        // Un _id con formato válido pero que no está en la BD
        const idInventado = String(new mongoose.Types.ObjectId())

        const { data } = await ejecutar("CargarId", {}, { _id: idInventado })
        expect(data).toBeNull()
    })
})

// Nombre que tendrá el rol después de actualizarlo
const NOMBRE_EDITADO = "Rol Jest Editado"

describe("PUT: /roles/Actualizar", () => {

    test("debe actualizar el nombrerol", async () => {
        const doc = await Roles.findOne({ nombrerol: ROL.nombrerol })
        const id = String(doc._id)

        const { response, data } = await ejecutar("Actualizar", {
            _id: id,
            nombrerol: NOMBRE_EDITADO
        })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.mensaje).toBe("Rol actualizado con éxito")
        // Gracias a returnDocument: 'after', la respuesta trae la versión nueva
        expect(data.rol.nombrerol).toBe(NOMBRE_EDITADO)

        // Confirmamos en la BD que el cambio quedó guardado
        const actualizado = await Roles.findById(id)
        expect(actualizado.nombrerol).toBe(NOMBRE_EDITADO)
    })

    test("ya no debe existir el rol con el nombre anterior", async () => {
        const viejo = await Roles.findOne({ nombrerol: ROL.nombrerol })
        expect(viejo).toBeNull()
    })
})

describe("DELETE: /roles/Eliminar", () => {

    test("debe eliminar el rol", async () => {
        // Ojo: ahora lo buscamos por el nombre NUEVO
        const doc = await Roles.findOne({ nombrerol: NOMBRE_EDITADO })
        const id = String(doc._id)

        const { response, data } = await ejecutar("Eliminar", { _id: id })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.mensaje).toBe("Rol eliminado con éxito")

        // Confirmamos en la BD que ya no existe
        const borrado = await Roles.findById(id)
        expect(borrado).toBeNull()
    })

    test("el rol ya no debe aparecer en CargarTodos", async () => {
        const { data } = await ejecutar("CargarTodos")
        const encontrado = data.some((rol) => rol.nombrerol === NOMBRE_EDITADO)
        expect(encontrado).toBe(false)
    })
})