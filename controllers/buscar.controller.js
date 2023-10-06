const { response, request } = require('express')
const { ObjectId } = require('mongoose').Types

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = ['categorias', 'productos', 'roles', 'usuarios']

const buscarUsuarios = async (termino = '', res = response) => {
  // Validamos si el término es un ID de Mongo válido. Devuelve true si es válido
  const esMongoID = ObjectId.isValid(termino)

  if (esMongoID) {
    const usuario = await Usuario.findById(termino)
    return res.json({
      results: usuario ? [usuario] : []
    })
  }

  const regex = new RegExp(termino, 'i')

  // Contamos cuántos usuarios hay en la base de datos que cumplan con el término
  const total = await Usuario.count({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }]
  })

  // find() es un método de Mongoose que nos permite buscar en la colección
  // Devuelve un arreglo con los resultados de la búsqueda
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }]
  })

  res.json({
    total,
    results: usuarios
  })
}

const buscarCategorias = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino)

  if (esMongoID) {
    const categoria = await Categoria.findById(termino)
    return res.json({
      results: categoria ? [categoria] : []
    })
  }

  const regex = new RegExp(termino, 'i')

  const total = await Categoria.count({ nombre: regex, estado: true })

  const categorias = await Categoria.find({ nombre: regex, estado: true })

  res.json({
    total,
    results: categorias
  })
}

const buscarProductos = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino)

  if (esMongoID) {
    const producto = await Producto.findById(termino)
      .populate('categoria', 'nombre')
      .populate('usuario', 'nombre')
    return res.json({
      results: producto ? [producto] : []
    })
  }

  const regex = new RegExp(termino, 'i')

  const total = await Producto.count({ nombre: regex, estado: true })

  const productos = await Producto.find({ nombre: regex, estado: true })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre')

  res.json({
    total,
    results: productos
  })
}

const buscar = (req = request, res = response) => {
  // Recuperamos los parámetros de la URL con req.params
  const { coleccion, termino } = req.params

  // Validamos que la colección que nos pasan esté dentro de las permitidas
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
    })
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res)
      break
    case 'categorias':
      buscarCategorias(termino, res)
      break
    case 'productos':
      buscarProductos(termino, res)
      break
    default:
      res.status(500).json({
        msg: 'Se me olvidó hacer esta búsqueda'
      })
  }
}

module.exports = {
  buscar
}
