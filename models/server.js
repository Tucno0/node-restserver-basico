const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT ?? 3000

    this.usuariosPath = '/api/usuarios'
    this.authPath = '/api/auth'

    // Conectar a base de datos
    this.conectarDB()

    /**
     * Middlewares
     * Funciones que se ejecutan antes de llamar a un controlador o seguir con la ejecución
     * Son funciones que añaden funcionalidades a nuestro web server
     * Cada vez que se levanta el servidor, se ejecutan todos los middlewares
     */
    this.middlewares()

    // Rutas de mi aplicación
    this.routes()
  }

  async conectarDB() {
    /**
     * Conexión a la base de datos con mongoose
     * hay que poner el await porque es una función asíncrona
     * Se conecta a la base de datos de MongoDB Atlas
     */
    await dbConnection()
  }

  middlewares() {
    /**
     * CORS
     * Cross Origin Resource Sharing
     * Permite que un cliente se conecte a otro servidor para el intercambio de recursos
     */
    this.app.use(cors())

    // Lectura y parseo del body
    this.app.use(express.json())

    /**
     * Directorio público
     * Sirve para que se pueda acceder a los archivos de la carpeta public
     * desde cualquier parte de la aplicación
     * http://localhost:8080/index.html
     */
    this.app.use(express.static('public'))
  }

  routes() {
    this.app.get('/', (req, res) => {
      res.json({
        msg: 'get API'
      })
    })

    /**
     * use() es un método de express que sirve para añadir middlewares
     * cualquier petición que pase por el middleware, va a ejecutar el callback
     * que se le pasa como segundo argumento
     * tanto como si es un get, post, put, delete, etc.
     */
    this.app.use(this.authPath, require('../routes/auth.routes'))
    this.app.use(this.usuariosPath, require('../routes/usuarios.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port http://localhost:${this.port}/`)
    })
  }
}

module.exports = Server
