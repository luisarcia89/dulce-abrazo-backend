const usuariosController = require("./usuariosController.js")
const mongoose = require("mongoose")
const Usuarios = mongoose.model("usuarios")

describe("POST: /usuarios/Guardar", () => {
    let request;
    let response;

    beforeAll((done) => {
        // conectarse a la base de datos de prueba
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            // borro lo que haya quedado sucio de otra ejecución
            Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        // borro lo que dejé sucio y cierro la conexión
        Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
            mongoose.connection.close().then(() => {
                done()
            })
        })
    })

    beforeEach(() => {
        // procesos antes de cada uno
        request = { body: {}, params: {}, session: {} }
        response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
    })

    test("debe fallar si no llega el nombre", (done) => {
        request.body.nombre = ""
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo nombre es obligatorio" })
        done()
    })

    test("debe fallar si no llega el email", (done) => {
        request.body.nombre = "John"
        request.body.email = ""
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo email es obligatorio" })
        done()
    })

    test("debe fallar si no llega el password", (done) => {
        request.body.nombre = "John"
        request.body.email = "john1@gmail.com"
        request.body.password = ""
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo password es obligatorio" })
        done()
    })

    test("debe Guardar el usuario Correctamente", async () => {
        request.body.nombre = "John"
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Usuario guardado con éxito")
                resolve()
            })
        })
    })

    test("debe fallar cuando el mismo email existe", async () => {
        request.body.nombre = "John"
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(400)
                expect(data.mensaje).toBe("Ya existe un usuario con ese email")
                resolve()
            })
        })
    })
})

describe("Get: /usuarios/CargarTodos", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
            mongoose.connection.close().then(() => {
                done()
            })
        })
    })

    beforeEach(() => {
        request = { body: {}, params: {}, session: {} }
        response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
    })

    test("debe Guardar el usuario Correctamente", async () => {
        request.body.nombre = "John"
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Usuario guardado con éxito")
                resolve()
            })
        })
    })

    test("debe verificar si existen datos", async () => {
        usuariosController.CargarTodos(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(200)
                expect(data.length).toBeGreaterThan(0)
                resolve()
            })
        })
    })
})

describe("Get: /usuarios/CargarId", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
            mongoose.connection.close().then(() => {
                done()
            })
        })
    })

    beforeEach(() => {
        request = { body: {}, params: {}, session: {} }
        response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
    })

    test("debe Guardar el usuario Correctamente", async () => {
        request.body.nombre = "John"
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Usuario guardado con éxito")
                resolve()
            })
        })
    })

    test("debe recibir un Id y puedo confirmar que existe", async () => {
        await Usuarios.find({ email: "john1@gmail.com" }).then(async (doc) => {

            var idreal = doc[0]._id

            request.params._id = idreal

            usuariosController.CargarId(request, response)

            await new Promise((resolve) => {
                response.json.mockImplementation((data) => {
                    expect(response.status).toHaveBeenCalledWith(200)
                    expect(data.nombre).toEqual("John")
                    resolve()
                })
            })
        })
    })
})

describe("Put: /usuarios/Actualizar", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
            mongoose.connection.close().then(() => {
                done()
            })
        })
    })

    beforeEach(() => {
        request = { body: {}, params: {}, session: {} }
        response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
    })

    test("debe Guardar el usuario Correctamente", async () => {
        request.body.nombre = "John"
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Usuario guardado con éxito")
                resolve()
            })
        })
    })

    test("debe fallar si el _id no llega", (done) => {
        request.body._id = ""
        request.body.nombre = "Juan1"
        request.body.nombrerol = "Cliente"

        usuariosController.Actualizar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo _id es obligatorio" })
        done()
    })

    test("debe fallar si el nombre no llega", (done) => {
        request.body._id = "6ad024f7e88957fd97443e2e"
        request.body.nombre = ""
        request.body.nombrerol = "Cliente"

        usuariosController.Actualizar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo nombre es obligatorio" })
        done()
    })

    test("debe fallar si el nombrerol no llega", (done) => {
        request.body._id = "6ad024f7e88957fd97443e2e"
        request.body.nombre = "Juan1"
        request.body.nombrerol = ""

        usuariosController.Actualizar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo nombrerol es obligatorio" })
        done()
    })

    test("debe fallar si el id no existe", async () => {
        request.body._id = "6ad024f7e88957fd97443e2e"
        request.body.nombre = "Juan1"
        request.body.nombrerol = "Cliente"

        usuariosController.Actualizar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(404)
                expect(data.mensaje).toBe("El _id no existe en la BD")
                resolve()
            })
        })
    })

    test("debe Actualizar el usuario Correctamente", async () => {
        request.body.nombre = "Juan1"
        request.body.nombrerol = "Cliente"
        request.body.estado = false

        await Usuarios.find({ email: "john1@gmail.com" }).then((doc) => {
            request.body._id = doc[0]._id
            usuariosController.Actualizar(request, response)
        })

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(200)
                expect(data.mensaje).toBe("Usuario actualizado con éxito")
                resolve()
            })
        })

        // confirmo en la BD que los cambios quedaron guardados
        await Usuarios.find({ email: "john1@gmail.com" }).then((doc) => {
            expect(doc[0].nombre).toEqual("Juan1")
            expect(doc[0].estado).toEqual(false)
        })
    })
})

describe("Delete: /usuarios/Eliminar", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
            mongoose.connection.close().then(() => {
                done()
            })
        })
    })

    beforeEach(() => {
        request = { body: {}, params: {}, session: {} }
        response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
    })

    test("debe fallar si el _id no llega", (done) => {
        request.body._id = ""

        usuariosController.Eliminar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo _id es obligatorio" })
        done()
    })

    test("debe fallar si el id no existe", async () => {
        request.body._id = "6ad024f7e88957fd97443e2e"

        usuariosController.Eliminar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(404)
                expect(data.mensaje).toBe("El _id no existe en la BD")
                resolve()
            })
        })
    })

    test("debe Guardar el usuario Correctamente", async () => {
        request.body.nombre = "John"
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Usuario guardado con éxito")
                resolve()
            })
        })
    })

    test("debe Eliminar el usuario por el _Id", async () => {
        request.body._id = ""

        await Usuarios.find({ email: "john1@gmail.com" }).then((doc) => {
            request.body._id = doc[0]._id
            usuariosController.Eliminar(request, response)
        })

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(200)
                expect(data.mensaje).toBe("Usuario eliminado con éxito")
                resolve()
            })
        })

        // confirmo en la BD que ya no existe
        await Usuarios.find({ email: "john1@gmail.com" }).then((doc) => {
            expect(doc.length).toBe(0)
        })
    })
})

describe("Post: /usuarios/Login", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Usuarios.deleteMany({ email: "john1@gmail.com" }).then(() => {
            mongoose.connection.close().then(() => {
                done()
            })
        })
    })

    beforeEach(() => {
        request = { body: {}, params: {}, session: {} }
        response = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        // simular a Cloudflare: por defecto responde que el captcha es válido
        global.fetch = jest.fn().mockResolvedValue({
            json: async () => ({ success: true })
        })
    })

    test("debe fallar si el email no llega", (done) => {
        request.body.email = ""
        request.body.password = ""
        request.body.turnstileToken = ""

        usuariosController.Login(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo email es obligatorio" })
        done()
    })

    test("debe fallar si el password no llega", (done) => {
        request.body.email = "john1@gmail.com"
        request.body.password = ""
        request.body.turnstileToken = ""

        usuariosController.Login(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo password es obligatorio" })
        done()
    })

    test("debe fallar si el token no llega", (done) => {
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.turnstileToken = ""

        usuariosController.Login(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "Falta completar el captcha" })
        done()
    })

    test("debe fallar si el turnstile es incorrecto", async () => {
        // esta vez Cloudflare responde que el captcha es inválido
        global.fetch = jest.fn().mockResolvedValue({
            json: async () => ({ success: false })
        })

        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.turnstileToken = "fjdshajfkl"

        usuariosController.Login(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(403)
                expect(data.mensaje).toBe("Captcha inválido, intenta de nuevo")
                resolve()
            })
        })
    })

    test("debe Guardar el usuario Correctamente", async () => {
        request.body.nombre = "John"
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.nombrerol = "Cliente"

        usuariosController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Usuario guardado con éxito")
                resolve()
            })
        })
    })

    test("debe fallar si el email no existe", async () => {
        request.body.email = "noexiste@gmail.com"
        request.body.password = "123456"
        request.body.turnstileToken = "token-prueba"

        usuariosController.Login(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(404)
                expect(data.mensaje).toBe("No existe un usuario con ese email")
                resolve()
            })
        })
    })

    test("debe fallar si la contraseña es incorrecta", async () => {
        request.body.email = "john1@gmail.com"
        request.body.password = "claveMala"
        request.body.turnstileToken = "token-prueba"

        usuariosController.Login(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(401)
                expect(data.mensaje).toBe("Contraseña incorrecta")
                resolve()
            })
        })
    })

    test("debe fallar si la cuenta no está activada", async () => {
        // desactivo la cuenta directamente en la BD
        await Usuarios.updateOne({ email: "john1@gmail.com" }, { activo: false })

        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.turnstileToken = "token-prueba"

        usuariosController.Login(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(403)
                expect(data.mensaje).toBe("Debes activar tu cuenta antes de iniciar sesión")
                resolve()
            })
        })

        // la dejo activa otra vez para el siguiente test
        await Usuarios.updateOne({ email: "john1@gmail.com" }, { activo: true })
    })

    test("debe iniciar sesion con credenciales correctas", async () => {
        request.body.email = "john1@gmail.com"
        request.body.password = "123456"
        request.body.turnstileToken = "token-prueba"

        usuariosController.Login(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(200)
                expect(data.mensaje).toBe("Login exitoso")
                // la sesión quedó con el usuario
                expect(request.session.email).toBe("john1@gmail.com")
                resolve()
            })
        })
    })
})