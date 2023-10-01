const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario')

const usuariosGet = async (req = request, res = response) => {
  // const query = req.query
  // const { q, nombre = 'No name', apikey, page = 1, limit } = req.query
  const { limite = 5, desde = 0 } = req.query

  // estado: true es para que solo devuelva los usuarios que tengan el estado en true
  const query = { estado: true }

  /**
   * !Obtener los usuarios de la base de datos con mongoose
   * find() busca todos los usuarios en la base de datos
   * skip() salta los primeros n usuarios que se le indique
   * limit() limita el número de usuarios que devuelve la consulta
   */
  // const usuarios = await Usuario.find(query).skip(Number(desde)).limit(Number(limite))
  // const total = await Usuario.countDocuments(query)

  // ?Ejecutar las dos promesas al mismo tiempo
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite))
  ])

  res.json({
    total,
    usuarios
  })
}

const usuariosPost = async (req = request, res = response) => {
  // const body = req.body
  const { nombre, correo, password, rol } = req.body
  const usuario = new Usuario({ nombre, correo, password, rol })

  /**
   * !Encriptar la contraseña
   * Generar el salt para encriptar la contraseña
   * Por defecto genera 10 vueltas para encriptar la contraseña
   * hashSync es para encriptar la contraseña en una sola vía
   */
  const salt = bcryptjs.genSaltSync()
  usuario.password = bcryptjs.hashSync(password, salt)

  /**
   * !Guardar en la base de datos con mongoose
   * hay que poner el await porque es una función asíncrona y devuelve una promesa
   * Se conecta a la base de datos de MongoDB Atlas
   */
  await usuario.save()

  res.json({
    msg: 'post API - controlador',
    usuario
  })
}

const usuariosPut = async (req = request, res = response) => {
  const id = req.params.id
  const { _id, password, google, correo, ...resto } = req.body

  // Si el usuario enviá un password, hay que actualizarlo
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync()
    resto.password = bcryptjs.hashSync(password, salt)
  }

  /**
   * !Actualizar en la base de datos con mongoose
   * hay que poner el await porque es una función asíncrona y devuelve una promesa
   * Se conecta a la base de datos de MongoDB Atlas
   * findByIdAndUpdate(id, resto) busca el usuario por id y lo actualiza con los datos de resto
   * findByIdAndUpdate( <id>, <datos a actualizar>, <opciones> )
   */
  const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })

  res.json(usuario)
}

const usuariosPatch = (req = request, res = response) => {
  console.log('patch API')
  res.json({
    msg: 'patch API - controlador'
  })
}

const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params

  // const uid = req.uid

  // Borrar físicamente, no recomendado porque se pierden los datos relacionados con el usuario
  // const usuario = await Usuario.findByIdAndDelete(id)

  // Borrar cambiando el estado del usuario
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true })

  const usuarioAutenticado = req.usuario

  res.json({ usuario, usuarioAutenticado })
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete
}
