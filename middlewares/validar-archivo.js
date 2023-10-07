/**
 * Función que valida si se envió un archivo en la petición y si es válido
 * @param {Request} req Datos que nos envía el cliente en la petición
 * @param {Response} res Datos que le enviamos al cliente como respuesta
 * @param {next} next Función que se ejecuta si pasa las validaciones
 * @returns {Response} Retorna un error 400 si no se envió un archivo
 */
const validarArchivoSubir = (req, res, next) => {
  /**
   * *Verificar si se envió un archivo
   * !req.files: si no hay archivos en la petición
   * Object.keys(req.files).length === 0: si el objeto files está vacío
   * !req.files.archivo: si no hay un archivo con el nombre archivo
   * En cualquiera de los casos, se retorna un error 400
   */
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({
      msg: 'No hay archivos que subir - validarArchivoSubir'
    })
  }

  next()
}

module.exports = {
  validarArchivoSubir
}
