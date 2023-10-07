const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos')
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
  mostrarImagenCloudinary
} = require('../controllers/uploads.controller')
const { coleccionesPermitidas, existeUsuarioPorId } = require('../helpers')
const { validarArchivoSubir } = require('../middlewares')

const router = Router()

// *Subir archivos
router.post('/', validarArchivoSubir, cargarArchivo)

// *Actualizar imagen
router.put(
  '/:coleccion/:id',
  [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
  ],
  // actualizarImagen
  actualizarImagenCloudinary
)

// *Mostrar imagen
router.get(
  '/:coleccion/:id',
  [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom((c) => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
  ],
  // mostrarImagen
  mostrarImagenCloudinary
)

module.exports = router
