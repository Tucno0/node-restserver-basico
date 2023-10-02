const { response, request, json } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

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

const googleSignin = async (req = request, res = response) => {
  const { id_token } = req.body

  try {
    const { correo, nombre, img } = await googleVerify(id_token)

    // !Verificar si el correo existe en la BD
    let usuario = await Usuario.findOne({ correo })

    if (!usuario) {
      // Si el usuario no existe, hay que crearlo
      const data = {
        nombre,
        correo,
        rol: 'USER_ROLE',
        password: ':P',
        img,
        google: true
      }

      usuario = new Usuario(data) // Se crea una nueva instancia de Usuario
      await usuario.save() // Se guarda en la BD
    }

    // !Si el usuario en BD está en false
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado'
      })
    }

    // !Generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
      usuario,
      token
    })
  } catch (error) {
    res.status(400).json({
      msg: 'Token de Google no es válido'
    })
  }
}

module.exports = {
  login,
  googleSignin
}
