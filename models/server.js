const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')
const fileUpload = require('express-fileupload')

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT ?? 3000

    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      productos: '/api/productos',
      usuarios: '/api/usuarios',
      uploads: '/api/uploads'
    }

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

    /**
     * FileUpload - Carga de archivos
     * puede ser cualquier tipo de archivo
     * fileUpload es un middleware que se encarga de guardar los archivos en una carpeta
     * se pasa un objeto con las opciones que se quieren
     * useTempFiles: true: para que use archivos temporales mientras se sube el archivo al servidor
     * tempFileDir: '/tmp/': carpeta donde se guardan los archivos temporales
     * createParentPath: true: para que cree la carpeta donde se van a guardar los archivos
     */
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true
      })
    )
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
    this.app.use(this.paths.auth, require('../routes/auth.routes'))
    this.app.use(this.paths.usuarios, require('../routes/usuarios.routes'))
    this.app.use(this.paths.categorias, require('../routes/categorias.routes'))
    this.app.use(this.paths.productos, require('../routes/productos.routes'))
    this.app.use(this.paths.buscar, require('../routes/buscar.routes'))
    this.app.use(this.paths.uploads, require('../routes/uploads.routes'))
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port http://localhost:${this.port}/`)
    })
  }
}

module.exports = Server
