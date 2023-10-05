const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token')

  if (!token) {
    // 401: Unauthorized
    return res.status(401).json({
      msg: 'No hay token en la petición'
    })
  }

  try {
    // Retorna el payload del token si es válido
    // verify() verifica si el token es válido
    // verify(<token>, <secretOrPrivateKey>)
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

    // Leer el usuario que corresponde al uid
    // este es el usuario autenticado que elimina a otro usuario
    const usuario = await Usuario.findById(uid)

    // Verificar si el usuario existe en la base de datos
    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe en la BD'
      })
    }

    // Verificar si el estado del usuario es true (estado: true)
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe en la BD esta con estado: false'
      })
    }

    // Agregar el usuario autenticado a la request para que esté disponible en los controladores
    req.usuario = usuario

    // console.log(payload)

    next()
  } catch (error) {
    console.log({ error })
    res.status(401).json({
      msg: 'Token no válido'
    })
  }
}

module.exports = {
  validarJWT
}
