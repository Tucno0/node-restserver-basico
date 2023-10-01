const jwt = require('jsonwebtoken')

/**
 * @param {String} uid user identifier
 * @returns
 */
const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid }

    // Generar el JWT
    // sing( payload, secretOrPrivateKey, [options, callback] )
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
