const { response, request } = require('express')

const usuariosGet = (req = request, res = response) => {
  // const query = req.query
  const { q, nombre = 'No name', apikey, page = 1, limit } = req.query

  res.json({
    msg: 'get API - controlador',
    q,
    nombre,
    apikey,
    page,
    limit,
  })
}

const usuariosPost = (req = request, res = response) => {
  // const body = req.body
  const { nombre, edad } = req.body

  res.json({
    msg: 'post API - controlador',
    nombre,
    edad,
  })
}

const usuariosPut = (req = request, res = response) => {
  const id = req.params.id

  res.json({
    msg: 'put API - controlador',
    id,
  })
}

const usuariosPatch = (req = request, res = response) => {
  console.log('patch API')
  res.json({
    msg: 'patch API - controlador',
  })
}

const usuariosDelete = (req = request, res = response) => {
  console.log('delete API')
  res.json({
    msg: 'delete API - controlador',
  })
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPatch,
  usuariosDelete,
}
