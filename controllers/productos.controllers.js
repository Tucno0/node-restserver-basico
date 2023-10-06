const { response, request } = require('express')
const { Producto, Categoria } = require('../models')

// !obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query
  const query = { estado: true }

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate('usuario', ['nombre', 'correo'])
      .populate('categoria', 'nombre')
  ])

  res.json({
    total,
    productos
  })
}

// !obtenerProducto - populate {}
const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params

  const producto = await Producto.findById(id)
    .populate('usuario', ['nombre', 'correo'])
    .populate('categoria', 'nombre')

  res.json({
    producto
  })
}

// !crearProducto- nombre - estado: true
const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, categoria, ...body } = req.body

  // Verificar si la categoría existe
  const categoriaDB = await Categoria.findOne({ nombre: categoria.toUpperCase() })

  if (!categoriaDB) {
    return res.status(400).json({
      msg: `La categoría ${categoria} no existe`
    })
  }

  // Verificar si el producto existe
  const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() })

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe`
    })
  }

  // Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    categoria: categoriaDB._id,
    usuario: req.usuario._id
  }
  const producto = new Producto(data)

  // Guardar DB
  await producto.save()

  // Regresar el producto creado
  res.status(201).json({
    msg: 'Producto creado correctamente',
    producto
  })
}

// !actualizarProducto
const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params
  const { estado, usuario, ...resto } = req.body

  // Verificar si se envió el nombre
  if (resto.nombre) {
    resto.nombre = resto.nombre.toUpperCase()
  }

  // Verificar si se envió la categoría
  if (resto.categoria) {
    // Verificar que la categoría exista en la DB
    const categoriaDB = await Categoria.findOne({ nombre: resto.categoria.toUpperCase() })

    if (!categoriaDB) {
      return res.status(400).json({
        msg: `La categoría ${resto.categoria} no existe`
      })
    }

    resto.categoria = categoriaDB._id
  }

  // Generar la data a actualizar
  const data = {
    ...resto,
    usuario: req.usuario._id
  }

  // Actualizar DB
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true })

  // Regresar el producto actualizado
  res.json({
    msg: 'Producto actualizado correctamente',
    producto
  })
}

// !borrarProducto - estado: false
const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params

  const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
  const usuarioAutenticado = req.usuario

  res.json({
    msg: 'Producto borrado correctamente',
    productoBorrado,
    usuarioAutenticado
  })
}

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto
}
