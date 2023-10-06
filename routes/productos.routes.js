const { Router } = require('express')
const { check, query } = require('express-validator')

const {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto
} = require('../controllers/productos.controllers')

const { validarJWT, validarCampos, esAdminRole, tieneRole } = require('../middlewares')
const { existeProductoPorId } = require('../helpers/db-validators')

const router = Router()

/**
 * *{{url}}/api/productos
 */

//! Obtener todos los productos - público
router.get(
  '/',
  [
    query('limite', 'El límite debe ser un número').optional().isNumeric(),
    query('desde', 'Desde debe ser un número').optional().isNumeric(),
    validarCampos
  ],
  obtenerProductos
)

//! Obtener un Producto por id - público
router.get(
  '/:id',
  [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
  ],
  obtenerProducto
)

//! Crear Producto - privado - cualquier persona con un token válido
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // El precio es opcional, pero si manda algo, debe ser un número
    check('precio', 'El precio debe ser un número').optional().isNumeric(),
    check('categoria', 'La categoría es obligatoria').not().isEmpty(),
    // la descripción es opcional, pero si manda algo, debe ser un string
    check('descripcion', 'La descripción debe ser un string').optional().isString(),
    validarCampos
  ],
  crearProducto
)

//! Actualizar Producto - privado - cualquier persona con un token válido
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    // El precio es opcional, pero si manda algo, debe ser un número
    check('precio', 'El precio debe ser un número').optional().isNumeric(),
    check('categoria').optional(),
    // la descripción es opcional, pero si manda algo, debe ser un string
    check('descripcion', 'La descripción debe ser un string').optional().isString(),
    validarCampos
  ],
  actualizarProducto
)

//! Borrar Producto - privado - solo el admin puede borrar productos
router.delete(
  '/:id',
  [
    validarJWT,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
  ],
  borrarProducto
)

module.exports = router
