const path = require('node:path')
const fs = require('node:fs')

const { request, response } = require('express')
const cloudinary = require('cloudinary').v2
// Configuración de nuestra cuenta de cloudinary
cloudinary.config(process.env.CLOUDINARY_URL)

const { subirArchivo } = require('../helpers')
const { Usuario, Producto } = require('../models')

const cargarArchivo = async (req = request, res = response) => {
  try {
    // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos')
    const nombre = await subirArchivo(req.files, undefined, 'imgs')

    res.json({
      msg: 'Archivo subido correctamente',
      nombre
    })
  } catch (error) {
    res.status(400).json({
      msg: error
    })
  }
}

//! Actualizar imagen en la base de datos sin usar cloudinary
const actualizarImagen = async (req = request, res = response) => {
  const { coleccion, id } = req.params

  let modelo

  // Validar que exista el id en la base de datos
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break

    case 'productos':
      modelo = await Producto.findById(id)

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvidó validar esto'
      })
  }

  // Limpiar imágenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

    // existsSync: regresa true si el path existe y recibe como parámetro el path
    if (fs.existsSync(pathImagen)) {
      // unlinkSync: borra el archivo del path que se le pasa como parámetro
      fs.unlinkSync(pathImagen)
    }
  }

  // Actualizar la imagen
  const nombre = await subirArchivo(req.files, undefined, coleccion)
  modelo.img = nombre
  // guardar en la base de datos
  await modelo.save()

  res.json({
    coleccion,
    id,
    modelo
  })
}

//! Actualizar imagen en la base de datos usando cloudinary
const actualizarImagenCloudinary = async (req = request, res = response) => {
  const { coleccion, id } = req.params

  let modelo

  // Validar que exista el id en la base de datos
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }

      break

    case 'productos':
      modelo = await Producto.findById(id)

      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvidó validar esto'
      })
  }

  // Si existe una imagen previa
  if (modelo.img) {
    // Separar el nombre de la imagen de la url
    const nombreArr = modelo.img.split('/')
    // Obtener el nombre de la imagen
    const nombre = nombreArr[nombreArr.length - 1]
    // Obtener el id de la imagen
    const [public_id] = nombre.split('.')
    // Borrar la imagen de cloudinary
    cloudinary.uploader.destroy(public_id)
  }

  // req.files.archivo es el nombre del campo que se envía en el body de la petición
  // console.log(req.files.archivo)

  // Extraer el archivo del body
  const { tempFilePath } = req.files.archivo
  // Subir el archivo a cloudinary
  const resp = await cloudinary.uploader.upload(tempFilePath)
  // Obtener el secure_url de la respuesta de cloudinary
  const { secure_url } = resp
  // Guardar el secure_url en el modelo
  modelo.img = secure_url
  // guardar en la base de datos
  await modelo.save()

  res.json({
    coleccion,
    id,
    modelo
  })
}

//! Mostrar imagen sin usar cloudinary
const mostrarImagen = async (req = request, res = response) => {
  const { coleccion, id } = req.params

  const phatImageDefault = path.join(__dirname, '../assets/no-image.jpg')

  let modelo

  // Validar que exista el id en la base de datos
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)

      if (!modelo) {
        // return res.status(400).json({
        //   msg: `No existe un usuario con el id ${id}`
        // })
        console.log('No existe un usuario con el id')
        return res.sendFile(phatImageDefault)
      }

      break

    case 'productos':
      modelo = await Producto.findById(id)

      if (!modelo) {
        // return res.status(400).json({
        //   msg: `No existe un producto con el id ${id}`
        // })
        console.log('No existe un producto con el id')
        return res.sendFile(phatImageDefault)
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvidó validar esto'
      })
  }

  // Verificar si el modelo tiene una imagen
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)

    // existsSync: regresa true si el path existe y recibe como parámetro el path
    if (fs.existsSync(pathImagen)) {
      // sendFile: envía el archivo que se le pasa como parámetro
      console.log('Imagen encontrada')
      return res.sendFile(pathImagen)
    }
  }

  // Si no hay imagen, regresar una imagen por defecto
  // res.json({
  //   msg: 'Falta placeholder'
  // })

  console.log('No hay imagen')
  res.sendFile(phatImageDefault)
}

//! Mostrar imagen usando cloudinary
const mostrarImagenCloudinary = async (req = request, res = response) => {
  const { coleccion, id } = req.params
  const phatImageDefault = path.join(__dirname, '../assets/no-image.jpg')
  let modelo

  // Validar que exista el id en la base de datos
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id)

      if (!modelo) {
        console.log(`No existe un usuario con el id ${id}`)
        return res.status(400).sendFile(phatImageDefault)
      }

      break

    case 'productos':
      modelo = await Producto.findById(id)

      if (!modelo) {
        console.log(`No existe un producto con el id ${id}`)
        return res.status(400).sendFile(phatImageDefault)
      }

      break

    default:
      return res.status(500).json({
        msg: 'Se me olvidó validar esto'
      })
  }

  // Verificar si el modelo tiene una imagen
  if (modelo.img) {
    // redirect: redirecciona a la url que se le pasa como parámetro
    console.log('Imagen encontrada')
    console.log(modelo.img)
    return res.redirect(modelo.img)
  }

  console.log('No hay imagen')
  // Si no hay imagen, regresar una imagen por defecto
  res.sendFile(phatImageDefault)
}

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
  mostrarImagenCloudinary
}
