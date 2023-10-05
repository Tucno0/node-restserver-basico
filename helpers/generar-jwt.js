const jwt = require('jsonwebtoken')

/**
 * @param {String} uid user identifier
 * @returns {Promise} Promesa que resuelve el token o rechaza con un error
 */
const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    /**
     * !Generar el JWT
     * sign() es un método de la librería jsonwebtoken para generar el token
     * recibe 4 parámetros:
     * 1. payload: la información que queremos almacenar en el token (uid)
     * 2. secretOrPrivateKey: la clave secreta con la que se va a firmar el token, este valor debe ser único y no debe compartirse con nadie más (process.env.SECRETORPRIVATEKEY)
     * 3. options: objeto con las opciones para el token (tiempo de expiración)
     * 4. callback: función que se ejecuta cuando se genera el token (err, token)
     */
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: '4h'
      },
      (err, token) => {
        if (err) {
          console.log(err)
          reject('No se pudo generar el JWT')
        } else {
          resolve(token)
        }
      }
    )
  })
}

module.exports = {
  generarJWT
}
