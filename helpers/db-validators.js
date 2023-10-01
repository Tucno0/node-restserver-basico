/**
 * Validar si el rol y correo existen en la base de datos
 */
const Usuario = require('../models/usuario')
const Role = require('../models/role')

const esRolValido = async (rol = '') => {
  // Buscar el rol en la base de datos de MongoDB
  const existeRol = await Role.findOne({ rol })

  if (!existeRol) {
    // Si no existe el rol, lanzar un error
    throw new Error(`El rol ${rol} no está registrado en la base de datos`)
  }
}

const emailExiste = async (correo = '') => {
  /**
   * !Verificar si el correo existe
   * findOne es un método de mongoose para buscar en la base de datos
   * el primer parámetro es el filtro de búsqueda
   * el segundo parámetro es un string con los campos que queremos que devuelva
   * en este caso queremos que devuelva el correo
   * si existe el correo, devolverá un objeto con el correo
   * si no existe el correo, devolverá null
   * Esta funcion busca en la base de datos de MongoDB
   */
  const existeEmail = await Usuario.findOne({ correo })

  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado`)
  }
}

const existeUsuarioPorId = async (id) => {
  /**
   * !Verificar si el id existe en la base de datos
   * El id ya no se pasa como objeto
   */
  const existeUsuario = await Usuario.findById(id)

  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe en la base de datos`)
  }
}

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioPorId
}
