/**
 * Validar si el rol y correo existen en la base de datos
 */
const Role = require('../models/role')
const { Usuario, Categoria, Producto } = require('../models')

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
   * si existe el correo, devolverá un objeto usuario del correo
   * si no existe el correo, devolverá null
   * Esta funcion busca en la base de datos de MongoDB
   */
  const existeEmail = await Usuario.findOne({ correo })
  console.log(existeEmail)

  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado`)
  }
}

const existeUsuarioPorId = async (id) => {
  /**
   * !Verificar si el id existe en la base de datos
   * El id ya no se pasa como objeto
   * findById(id) busca en la base de datos de MongoDB por id
   */
  const existeUsuario = await Usuario.findById(id)

  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe en la base de datos`)
  }
}

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id)

  if (!existeCategoria) {
    throw new Error(`El id ${id} no existe en la base de datos`)
  }
}

const existeProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id)

  if (!existeProducto) {
    throw new Error(`El id ${id} no existe en la base de datos`)
  }
}

/**
 * Validar colecciones permitidas
 * @param {string} coleccion Nombre de la colección que se quiere validar
 * @param {string[]} colecciones Arreglo con las colecciones permitidas
 * @returns {boolean} Retorna true si la colección está permitida
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
  const incluida = colecciones.includes(coleccion)

  if (!incluida) {
    throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`)
  }

  return true
}

module.exports = {
  esRolValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas
}
