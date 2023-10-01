const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')

const login = async (req = request, res = response) => {
  const { correo, password } = req.body

  try {
    // !Verificar si el correo existe en la BD
    const usuario = await Usuario.findOne({ correo })

    if (!usuario) {
      // Si el usuario no existe
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo'
      })
    }

    // !Verificar si el usuario está activo en la BD
    if (!usuario.estado) {
      // Si el usuario no está activo
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - estado: false'
      })
    }
    // !Verificar la contraseña
    // Comparar la contraseña que viene en el body con la que está en la BD (usuario.password)
    const validPassword = bcryptjs.compareSync(password, usuario.password)

    if (!validPassword) {
      // Si la contraseña no es válida
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      })
    }

    // !Generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      msg: 'Hable con el administrador'
    })
  }
}

module.exports = {
  login
}
