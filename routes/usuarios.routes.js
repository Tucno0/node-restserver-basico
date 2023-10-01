/**
 * Router
 * se encarga de manejar las rutas de la aplicación
 * es un middleware de express
 */
const { Router } = require('express')

/**
 * express-validator
 * es un middleware de express para validar los datos que se reciben en las peticiones
 * Se puede especificar que campo del body se quiere validar
 */
const { check } = require('express-validator')

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch
} = require('../controllers/usuarios.controller')
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators')

// ?middlewares
// const { validarCampos } = require('../middlewares/validar-campos')
// const { validarJWT } = require('../middlewares/validar-jwt')
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles')
const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares')

const router = Router()

// *OBTENER: router.get( <ruta>, <controlador> )
router.get('/', usuariosGet)

// *ACTUALIZAR: router.put( <ruta>, <middlewares>, <controlador>)
router.put(
  '/:id',
  [
    // check tambien puede validar los parámetros de la ruta, en este caso el :id
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId), // (id) => existeUsuarioPorId(id)
    check('rol').custom(esRolValido),
    validarCampos
  ],
  usuariosPut
)

// *CREAR: router.post( <ruta>, <middlewares>, <controlador>)
router.post(
  '/',
  [
    // middlewares de express-validator para validar los datos que se reciben en las peticiones
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste), // (correo) => emailExiste(correo)
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido), // (rol) => esRolValido(rol)
    validarCampos
  ],
  usuariosPost
)

// *ELIMINAR: router.delete( <ruta>, <middlewares>, <controlador>)
router.delete(
  '/:id',
  [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId), // (id) => existeUsuarioPorId(id)
    validarCampos
  ],
  usuariosDelete
)

router.patch('/', usuariosPatch)

module.exports = router
