const { response, request } = require('express')

const { Categoria } = require('../models')

// !obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query

  const query = { estado: true }

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    /**
     * *populate() es un método de mongoose que permite traer información de otras colecciones
     * populate('nombre_coleccion', 'campos_a_mostrar')
     * El primer argumento es el nombre de la colección a la que se quiere hacer referencia
     * El segundo argumento es un arreglo de los campos que se quieren mostrar
     */
    Categoria.find(query)
      .populate('usuario', ['nombre', 'correo'])
      .skip(Number(desde))
      .limit(Number(limite))
  ])

  res.json({
    total,
    categorias
  })
}

// !obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {
  const id = req.params.id

  const categoria = await Categoria.findById(id).populate('usuario', ['nombre', 'correo'])

  res.json(categoria)
}

// !crearCategoria - nombre - estado: true
const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase()

  const categoriaDB = await Categoria.findOne({ nombre })

  // Si no existe la categoría en la base de datos se crea
  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoría ${categoriaDB.nombre}, ya existe`
    })
  }

  // Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id
  }

  console.log(data)

  // Crear la categoría en la base de datos
  const categoria = new Categoria(data)
  // Guardar en la base de datos
  await categoria.save()

  // 201 es el código de estado para crear un recurso
  res.status(201).json(categoria)
}

// !actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params
  const nombre = req.body.nombre.toUpperCase()

  const categoriaExistePorNombre = await Categoria.findOne({ nombre })
  console.log(categoriaExistePorNombre)

  if (categoriaExistePorNombre) {
    return res.status(400).json({
      msg: `La categoría ${nombre} ya existe`
    })
  }

  const categoriaExistePorId = await Categoria.findById(id)

  if (categoriaExistePorId) {
    if (!categoriaExistePorId.estado) {
      return res.status(400).json({
        msg: `No se puede actualizar la categoría ${nombre} porque está en estado: false`
      })
    }
  }

  const data = {
    nombre,
    usuario: req.usuario._id // El usuario que está haciendo la petición (usuario autenticado que actualiza la categoría)
  }

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true })

  res.json({
    msg: 'Categoria actualizada correctamente',
    categoria
  })
}

// !borrarCategoria - estado: false
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params

  const categoriaEliminada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
  const usuarioAutenticadoQueElimina = req.usuario

  res.json({
    msg: 'Categoria borrada correctamente',
    categoriaEliminada,
    usuarioAutenticadoQueElimina
  })
}

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria
}
