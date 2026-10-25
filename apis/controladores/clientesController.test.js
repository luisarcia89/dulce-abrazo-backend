const clientesController = require("./clientesController.js")
const mongoose = require("mongoose")
const Clientes = mongoose.model("clientes")

describe("POST: /clientes/Guardar", () => {
    let request;
    let response;

    beforeAll((done) => {
        // conectarse a la base de datos de prueba
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            // borro lo que haya quedado sucio de otra ejecución
            Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        // borro lo que dejé sucio y cierro la conexión
        Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
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
        request.body.cedula = "1000000001"
        request.body.telefono = "3001234567"
        request.body.direccion = "Calle 10 # 20-30"

        clientesController.Guardar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo nombre es obligatorio" })
        done()
    })

    test("debe fallar si no llega la cedula", (done) => {
        request.body.nombre = "Pedro"
        request.body.cedula = ""
        request.body.telefono = "3001234567"
        request.body.direccion = "Calle 10 # 20-30"

        clientesController.Guardar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo cedula es obligatorio" })
        done()
    })

    test("debe Guardar el cliente Correctamente", async () => {
        request.body.nombre = "Pedro"
        request.body.cedula = "1000000001"
        request.body.telefono = "3001234567"
        request.body.direccion = "Calle 10 # 20-30"

        clientesController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Cliente guardado con éxito")
                resolve()
            })
        })
    })
})

describe("Get: /clientes/CargarTodos", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
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

    test("debe Guardar el cliente Correctamente", async () => {
        request.body.nombre = "Pedro"
        request.body.cedula = "1000000001"
        request.body.telefono = "3001234567"
        request.body.direccion = "Calle 10 # 20-30"

        clientesController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Cliente guardado con éxito")
                resolve()
            })
        })
    })

    test("debe verificar si existen datos", async () => {
        clientesController.CargarTodos(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(200)
                expect(data.length).toBeGreaterThan(0)
                resolve()
            })
        })
    })
})

describe("Get: /clientes/CargarId", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
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

    test("debe Guardar el cliente Correctamente", async () => {
        request.body.nombre = "Pedro"
        request.body.cedula = "1000000001"
        request.body.telefono = "3001234567"
        request.body.direccion = "Calle 10 # 20-30"

        clientesController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Cliente guardado con éxito")
                resolve()
            })
        })
    })

    test("debe recibir un Id y puedo confirmar que existe", async () => {
        await Clientes.find({ cedula: "1000000001" }).then(async (doc) => {

            var idreal = doc[0]._id

            request.params._id = idreal

            clientesController.CargarId(request, response)

            await new Promise((resolve) => {
                response.json.mockImplementation((data) => {
                    expect(response.status).toHaveBeenCalledWith(200)
                    expect(data.nombre).toEqual("Pedro")
                    resolve()
                })
            })
        })
    })
})

describe("Put: /clientes/Actualizar", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
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

    test("debe Guardar el cliente Correctamente", async () => {
        request.body.nombre = "Pedro"
        request.body.cedula = "1000000001"
        request.body.telefono = "3001234567"
        request.body.direccion = "Calle 10 # 20-30"

        clientesController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Cliente guardado con éxito")
                resolve()
            })
        })
    })

    test("debe fallar si el _id no llega", (done) => {
        request.body._id = ""
        request.body.nombre = "Pedro"
        request.body.cedula = "1000000001"

        clientesController.Actualizar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo _id es obligatorio" })
        done()
    })

    test("debe fallar si el nombre no llega", (done) => {
        request.body._id = "6ad024f7e88957fd97443e2e"
        request.body.nombre = ""
        request.body.cedula = "1000000001"

        clientesController.Actualizar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo nombre es obligatorio" })
        done()
    })

    test("debe fallar si la cedula no llega", (done) => {
        request.body._id = "6ad024f7e88957fd97443e2e"
        request.body.nombre = "Pedro"
        request.body.cedula = ""

        clientesController.Actualizar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo cedula es obligatorio" })
        done()
    })

    test("debe fallar si el id no existe", async () => {
        request.body._id = "6ad024f7e88957fd97443e2e"
        request.body.nombre = "Pedro"
        request.body.cedula = "1000000001"

        clientesController.Actualizar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(404)
                expect(data.mensaje).toBe("El _id no existe en la BD")
                resolve()
            })
        })
    })

    test("debe Actualizar el cliente Correctamente", async () => {
        request.body.nombre = "Pedro Editado"
        request.body.cedula = "1000000001"
        request.body.telefono = "3109876543"
        request.body.direccion = "Carrera 5 # 15-25"

        await Clientes.find({ cedula: "1000000001" }).then((doc) => {
            request.body._id = doc[0]._id
            clientesController.Actualizar(request, response)
        })

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(200)
                expect(data.mensaje).toBe("Cliente actualizado con éxito")
                resolve()
            })
        })

        // confirmo en la BD que los cambios quedaron guardados
        await Clientes.find({ cedula: "1000000001" }).then((doc) => {
            expect(doc[0].nombre).toEqual("Pedro Editado")
            expect(doc[0].telefono).toEqual("3109876543")
        })
    })
})

describe("Delete: /clientes/Eliminar", () => {
    let request;
    let response;

    beforeAll((done) => {
        mongoose.connect("mongodb://localhost:27017/ClientesDulceAbrazo_test").then(() => {
            Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
                done()
            })
        }).catch((error) => {
            console.log(error)
        })
    })

    afterAll((done) => {
        Clientes.deleteMany({ cedula: "1000000001" }).then(() => {
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

        clientesController.Eliminar(request, response)

        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({ mensaje: "El campo _id es obligatorio" })
        done()
    })

    test("debe fallar si el id no existe", async () => {
        request.body._id = "6ad024f7e88957fd97443e2e"

        clientesController.Eliminar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(404)
                expect(data.mensaje).toBe("El _id no existe en la BD")
                resolve()
            })
        })
    })

    test("debe Guardar el cliente Correctamente", async () => {
        request.body.nombre = "Pedro"
        request.body.cedula = "1000000001"
        request.body.telefono = "3001234567"
        request.body.direccion = "Calle 10 # 20-30"

        clientesController.Guardar(request, response)

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(201)
                expect(data.mensaje).toBe("Cliente guardado con éxito")
                resolve()
            })
        })
    })

    test("debe Eliminar el cliente por el _Id", async () => {
        request.body._id = ""

        await Clientes.find({ cedula: "1000000001" }).then((doc) => {
            request.body._id = doc[0]._id
            clientesController.Eliminar(request, response)
        })

        await new Promise((resolve) => {
            response.json.mockImplementation((data) => {
                expect(response.status).toHaveBeenCalledWith(200)
                expect(data.mensaje).toBe("Cliente eliminado con éxito")
                resolve()
            })
        })

        // confirmo en la BD que ya no existe
        await Clientes.find({ cedula: "1000000001" }).then((doc) => {
            expect(doc.length).toBe(0)
        })
    })
})