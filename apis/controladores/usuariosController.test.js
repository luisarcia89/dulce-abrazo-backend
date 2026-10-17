const mongoose = require("mongoose")
const usuariosController = require("./usuariosController.js")

// Tu modelo no exporta MyModel, así que se lo pedimos a Mongoose por su nombre
const Usuarios = mongoose.model("usuarios")

// Ejecuta un método del controlador y espera a que responda con response.json(...)
function ejecutar(metodo, body = {}, params = {}) {
    return new Promise((resolve) => {
        const request = { body: body, params: params, session: {} }
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn((data) => resolve({ request, response, data }))
        }
        usuariosController[metodo](request, response)
    })
}

// Datos del usuario de prueba
const USUARIO = {
    nombre: "Usuario Jest",
    email: "usuario.jest@test.com",
    password: "Jest12345*",
    nombrerol: "Cliente"
}

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test")
    // Por si quedó basura de una ejecución anterior
    await Usuarios.deleteMany({ email: USUARIO.email })
})

afterAll(async () => {
    await Usuarios.deleteMany({ email: USUARIO.email })
    await mongoose.connection.close()
})

describe("POST: /usuarios/Guardar", () => {

    test("debe fallar si no llega el nombre", async () => {
        const { response, data } = await ejecutar("Guardar", { ...USUARIO, nombre: "" })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(data.mensaje).toBe("El campo nombre es obligatorio")
    })

    test("debe fallar si no llega el email", async () => {
        const { response, data } = await ejecutar("Guardar", { ...USUARIO, email: "" })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(data.mensaje).toBe("El campo email es obligatorio")
    })

    test("debe fallar si no llega el password", async () => {
        const { response, data } = await ejecutar("Guardar", { ...USUARIO, password: "" })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(data.mensaje).toBe("El campo password es obligatorio")
    })

    test("debe guardar el usuario correctamente", async () => {
        const { response, data } = await ejecutar("Guardar", { ...USUARIO })
        expect(response.status).toHaveBeenCalledWith(201)
        expect(data.mensaje).toBe("Usuario guardado con éxito")

        // Confirmamos en la BD que de verdad quedó guardado
        const enBD = await Usuarios.findOne({ email: USUARIO.email })
        expect(enBD).not.toBeNull()
    })

    test("debe fallar cuando el email ya existe", async () => {
        const { response, data } = await ejecutar("Guardar", { ...USUARIO })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(data.mensaje).toBe("Ya existe un usuario con ese email")
    })
})

describe("POST: /usuarios/Login", () => {

    // Ayudante: el doble de Cloudflare responde lo que le digamos
    function simularCaptcha(esValido) {
        global.fetch = jest.fn().mockResolvedValue({
            json: async () => ({ success: esValido })
        })
    }

    beforeEach(() => {
        // Por defecto, el captcha es válido en cada test
        simularCaptcha(true)
    })

    test("debe fallar si no llega el captcha", async () => {
        const { response, data } = await ejecutar("Login", {
            email: USUARIO.email, password: USUARIO.password
        })
        expect(response.status).toHaveBeenCalledWith(400)
        expect(data.mensaje).toBe("Falta completar el captcha")
    })

    test("debe fallar si el captcha es inválido", async () => {
        simularCaptcha(false)
        const { response, data } = await ejecutar("Login", {
            email: USUARIO.email, password: USUARIO.password, turnstileToken: "token-falso"
        })
        expect(response.status).toHaveBeenCalledWith(403)
        expect(data.mensaje).toBe("Captcha inválido, intenta de nuevo")
    })

    test("debe fallar si el email no existe", async () => {
        const { response, data } = await ejecutar("Login", {
            email: "noexiste@test.com", password: USUARIO.password, turnstileToken: "token-prueba"
        })
        expect(response.status).toHaveBeenCalledWith(404)
        expect(data.mensaje).toBe("No existe un usuario con ese email")
    })

    test("debe fallar con una contraseña incorrecta", async () => {
        const { response, data } = await ejecutar("Login", {
            email: USUARIO.email, password: "ClaveMala123*", turnstileToken: "token-prueba"
        })
        expect(response.status).toHaveBeenCalledWith(401)
        expect(data.mensaje).toBe("Contraseña incorrecta")
    })

    test("debe fallar si la cuenta no está activada", async () => {
        // Desactivamos la cuenta directamente en la BD
        await Usuarios.updateOne({ email: USUARIO.email }, { activo: false })

        const { response, data } = await ejecutar("Login", {
            email: USUARIO.email, password: USUARIO.password, turnstileToken: "token-prueba"
        })
        expect(response.status).toHaveBeenCalledWith(403)
        expect(data.mensaje).toBe("Debes activar tu cuenta antes de iniciar sesión")

        // La dejamos activa otra vez para el siguiente test
        await Usuarios.updateOne({ email: USUARIO.email }, { activo: true })
    })

    test("debe iniciar sesión con los datos correctos", async () => {
        const { request, response, data } = await ejecutar("Login", {
            email: USUARIO.email, password: USUARIO.password, turnstileToken: "token-prueba"
        })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.mensaje).toBe("Login exitoso")

        // Confirmamos que se llamó a "Cloudflare" (nuestro doble)
        expect(global.fetch).toHaveBeenCalled()
        // Y que la sesión quedó con el usuario
        expect(request.session.email).toBe(USUARIO.email)
    })
})

describe("GET: /usuarios/CargarTodos", () => {

    test("debe traer una lista con datos", async () => {
        const { response, data } = await ejecutar("CargarTodos")
        expect(response.status).toHaveBeenCalledWith(200)
        expect(Array.isArray(data)).toBe(true)
        expect(data.length).toBeGreaterThan(0)
    })

    test("la lista debe incluir el usuario de prueba", async () => {
        const { data } = await ejecutar("CargarTodos")
        const encontrado = data.some((usuario) => usuario.email === USUARIO.email)
        expect(encontrado).toBe(true)
    })
})

describe("GET: /usuarios/CargarId", () => {

    test("debe traer el usuario por su _id", async () => {
        // Buscamos el _id real que Mongo le asignó al usuario de prueba
        const doc = await Usuarios.findOne({ email: USUARIO.email })
        const id = String(doc._id)

        const { response, data } = await ejecutar("CargarId", {}, { _id: id })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.nombre).toBe(USUARIO.nombre)
        expect(data.email).toBe(USUARIO.email)
    })

    test("debe responder null si el _id no existe", async () => {
        // Un _id con formato válido pero que no está en la BD
        const idInventado = String(new mongoose.Types.ObjectId())

        const { data } = await ejecutar("CargarId", {}, { _id: idInventado })
        expect(data).toBeNull()
    })
})

describe("PUT: /usuarios/Actualizar", () => {

    test("debe actualizar el nombre y el rol del usuario", async () => {
        const doc = await Usuarios.findOne({ email: USUARIO.email })
        const id = String(doc._id)

        const { response, data } = await ejecutar("Actualizar", {
            _id: id,
            nombre: "Usuario Jest Editado",
            estado: true,
            nombrerol: "Administrador"
        })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.mensaje).toBe("Usuario actualizado con éxito")

        // Confirmamos en la BD que los cambios quedaron guardados
        const actualizado = await Usuarios.findById(id)
        expect(actualizado.nombre).toBe("Usuario Jest Editado")
        expect(actualizado.nombrerol).toBe("Administrador")
    })

    test("no debe cambiar el email al actualizar", async () => {
        const actualizado = await Usuarios.findOne({ email: USUARIO.email })
        expect(actualizado).not.toBeNull()
    })
})

describe("DELETE: /usuarios/Eliminar", () => {

    test("debe eliminar el usuario", async () => {
        const doc = await Usuarios.findOne({ email: USUARIO.email })
        const id = String(doc._id)

        const { response, data } = await ejecutar("Eliminar", { _id: id })
        expect(response.status).toHaveBeenCalledWith(200)
        expect(data.mensaje).toBe("Usuario eliminado con éxito")

        // Confirmamos en la BD que ya no existe
        const borrado = await Usuarios.findById(id)
        expect(borrado).toBeNull()
    })

    test("el usuario ya no debe aparecer en CargarTodos", async () => {
        const { data } = await ejecutar("CargarTodos")
        const encontrado = data.some((usuario) => usuario.email === USUARIO.email)
        expect(encontrado).toBe(false)
    })
})