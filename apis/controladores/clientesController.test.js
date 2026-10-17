const mongoose = require("mongoose")
const clientesController = require("./clientesController.js")

// Igual que con usuarios: le pedimos el modelo a Mongoose por su nombre
const Clientes = mongoose.model("clientes")

// El mismo "mesero falso", pero ahora llevando pedidos a clientesController
function ejecutar(metodo, body = {}, params = {}) {
    return new Promise((resolve) => {
        const request = { body: body, params: params, session: {} }
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn((data) => resolve({ request, response, data }))
        }
        clientesController[metodo](request, response)
    })
}

// Datos del cliente de prueba
const CLIENTE = {
    nombre: "Cliente Jest",
    cedula: "1000000001",
    telefono: "3001234567",
    direccion: "Calle 10 # 20-30"
}

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test")
    // Por si quedó basura de una ejecución anterior
    await Clientes.deleteMany({ cedula: CLIENTE.cedula })
})

afterAll(async () => {
    await Clientes.deleteMany({ cedula: CLIENTE.cedula })
    await mongoose.connection.close()
})

describe("POST: /clientes/Guardar", () => {

    test("debe fallar si no llega el nombre", async () => {
        const { response, data } = await ejecutar("Guardar", { ...CLIENTE, nombre: "" })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(data.mensaje).toBe("El campo nombre es obligatorio")
    })

    test("debe fallar si no llega la cédula", async () => {
        const { response, data } = await ejecutar("Guardar", { ...CLIENTE, cedula: "" })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(data.mensaje).toBe("El campo cedula es obligatorio")
    })

    test("debe guardar el cliente correctamente", async () => {
        const { response, data } = await ejecutar("Guardar", { ...CLIENTE })
        expect(response.status).toHaveBeenCalledWith(201)
        expect(data.mensaje).toBe("Cliente guardado con éxito")
        expect(data.cliente.nombre).toBe(CLIENTE.nombre)

        // Confirmamos en la BD que de verdad quedó guardado
        const enBD = await Clientes.findOne({ cedula: CLIENTE.cedula })
        expect(enBD).not.toBeNull()
    })
})

describe("GET: /clientes/CargarTodos", () => {

    test("debe traer una lista con datos", async () => {
        const { response, data } = await ejecutar("CargarTodos")
        expect(response.status).toHaveBeenCalledWith(200)
        expect(Array.isArray(data)).toBe(true)
        expect(data.length).toBeGreaterThan(0)
    })

    test("la lista debe incluir el cliente de prueba", async () => {
        const { data } = await ejecutar("CargarTodos")
        const encontrado = data.some((cliente) => cliente.cedula === CLIENTE.cedula)
        expect(encontrado).toBe(true)
    })
})

describe("GET: /clientes/CargarId", () => {

    test("debe traer el cliente por su _id", async () => {
        // Buscamos el _id real que Mongo le asignó al cliente de prueba
        const doc = await Clientes.findOne({ cedula: CLIENTE.cedula })
        const id = String(doc._id)

        const { response, data } = await ejecutar("CargarId", {}, { _id: id })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.nombre).toBe(CLIENTE.nombre)
        expect(data.cedula).toBe(CLIENTE.cedula)
    })

    test("debe responder null si el _id no existe", async () => {
        // Un _id con formato válido pero que no está en la BD
        const idInventado = String(new mongoose.Types.ObjectId())

        const { data } = await ejecutar("CargarId", {}, { _id: idInventado })
        expect(data).toBeNull()
    })
})

describe("PUT: /clientes/Actualizar", () => {

    test("debe actualizar el nombre y el teléfono del cliente", async () => {
        const doc = await Clientes.findOne({ cedula: CLIENTE.cedula })
        const id = String(doc._id)

        const { response, data } = await ejecutar("Actualizar", {
            ...CLIENTE,
            _id: id,
            nombre: "Cliente Jest Editado",
            telefono: "3109876543"
        })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.mensaje).toBe("Cliente actualizado con éxito")

        // Confirmamos en la BD que los cambios quedaron guardados
        const actualizado = await Clientes.findById(id)
        expect(actualizado.nombre).toBe("Cliente Jest Editado")
        expect(actualizado.telefono).toBe("3109876543")
    })

    test("la respuesta debe traer el cliente ya actualizado", async () => {
        const doc = await Clientes.findOne({ cedula: CLIENTE.cedula })

        const { data } = await ejecutar("Actualizar", {
            ...CLIENTE,
            _id: String(doc._id),
            direccion: "Carrera 5 # 15-25"
        })
        // Gracias a returnDocument: 'after', llega la versión nueva
        expect(data.cliente.direccion).toBe("Carrera 5 # 15-25")
    })
})

describe("DELETE: /clientes/Eliminar", () => {

    test("debe eliminar el cliente", async () => {
        const doc = await Clientes.findOne({ cedula: CLIENTE.cedula })
        const id = String(doc._id)

        const { response, data } = await ejecutar("Eliminar", { _id: id })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.mensaje).toBe("Cliente eliminado con éxito")

        // Confirmamos en la BD que ya no existe
        const borrado = await Clientes.findById(id)
        expect(borrado).toBeNull()
    })

    test("el cliente ya no debe aparecer en CargarTodos", async () => {
        const { data } = await ejecutar("CargarTodos")
        const encontrado = data.some((cliente) => cliente.cedula === CLIENTE.cedula)
        expect(encontrado).toBe(false)
    })
})