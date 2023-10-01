const { validationResult } = require('express-validator')

/**
 * !Validar los campos de las peticiones
 * es un middleware de express para validar los datos que se reciben en las peticiones
 * Se puede especificar que campo del body se quiere validar
 */
const validarCampos = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next()
}

module.exports = {
  validarCampos
}
