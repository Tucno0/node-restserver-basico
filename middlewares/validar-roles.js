const { request, response } = require('express')

const esAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: 'Se quiere verificar el rol sin validar el token primero'
    })
  }

  const { rol, nombre } = req.usuario

  if (rol !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${nombre} no es administrador - No puede hacer esto`
    })
  }

  next()
}

/**
 *
 * @param  {...any} roles array de roles que se quieren validar
 * @returns
 * El funcion que retorna es un middleware que se va a ejecutar antes de la petición en el router
 */
const tieneRole = (...roles) => {
  return (req = request, res = response, next) => {
    // si el usuario no se ha validado antes
    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se quiere verificar el rol sin validar el token primero'
      })
    }

    // si el rol del usuario no está en el array de roles que se quieren validar
    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`
      })
    }

    next()
  }
}

module.exports = {
  esAdminRole,
  tieneRole
}
