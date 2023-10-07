const path = require('node:path')
const { v4: uuidv4 } = require('uuid')

/**
 * Sube un archivo a la carpeta uploads
 * @param {File} files El file que se envía en el request
 * @param {String[]} extensionesValidas Extensiones permitidas para subir archivos
 * @param {String} carpeta Nombre de la carpeta donde se guardarán los archivos
 * @returns {Promise} Retorna una promesa con el resultado de la subida del archivo
 */
const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
  return new Promise((resolve, reject) => {
    // Se recibe el archivo y se guarda en una variable llamada archivo
    const { archivo } = files
    const nombreCortado = archivo.name.split('.')
    const extension = nombreCortado[nombreCortado.length - 1]

    // Validar extensión
    if (!extensionesValidas.includes(extension)) {
      // return res.status(400).json({
      //   msg: `La extensión ${extension} no esta permitida, las permitidas son ${extensionesValidas}`
      // })
      return reject(
        `La extensión ${extension} no esta permitida, las permitidas son ${extensionesValidas}`
      )
    }

    // Generar el nombre del archivo
    const nombreTemp = uuidv4() + '.' + extension

    /**
     * path es un módulo de Node.js que permite trabajar con rutas de archivos
     * join: une las rutas que se le pasen como argumento
     * __dirname: es una variable global de Node.js que contiene la ruta del directorio actual
     * ../uploads: es el nombre del directorio donde se guardarán los archivos
     * carpeta: es el nombre de la carpeta que se recibe como argumento
     * nombreTemp: es el nombre del archivo que se generó
     */
    const uploadPath = path.join(__dirname, '../uploads', carpeta, nombreTemp)

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(uploadPath, (err) => {
      if (err) return reject(err)

      // resolve(uploadPath)
      resolve(nombreTemp)
    })
  })
}

module.exports = {
  subirArchivo
}
