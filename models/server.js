const express = require('express')
const cors = require('cors')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT ?? 3000
    this.usuariosPath = '/api/usuarios'

    /**
     * Middlewares
     * Son funciones que añaden funcionalidades a nuestro web server
     * Cada vez que se levanta el servidor, se ejecutan todos los middlewares
     */
    this.middlewares()

    // Rutas de mi aplicación
    this.routes()
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
    this.app.use(this.usuariosPath, require('../routes/usuarios.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port http://localhost:${this.port}/`)
    })
  }
}

module.exports = Server
