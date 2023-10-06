const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT, esAdminRole } = require('../middlewares')

const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria
} = require('../controllers/categorias.controller')

const { existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router()

/**
 * *{{url}}/api/categorias
 */

//! Obtener todas las categorías - público
router.get('/', obtenerCategorias)

//! Obtener una categoría por id - público
router.get(
  '/:id',
  [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), // (id) => existeCategoriaPorId(id)
    validarCampos
  ],
  obtenerCategoria
)

//! Crear categoría - privado - cualquier persona con un token válido
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
  ],
  crearCategoria
)

//! Actualizar categoría - privado - cualquier persona con un token válido
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), // (id) => existeCategoriaPorId(id)
    check('nombre', 'El nombre de la categoria es obligatorio').not().isEmpty(),
    validarCampos
  ],
  actualizarCategoria
)

//! Borrar categoría - privado - solo el admin puede borrar categorías
router.delete(
  '/:id',
  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), // (id) => existeCategoriaPorId(id)
    validarCampos
  ],
  borrarCategoria
)

module.exports = router
