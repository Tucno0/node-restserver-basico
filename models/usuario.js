// {
//   nombre: 'jhampier',
//   correo: 'sfsefseg@sgsg.com',
//   password: '123456',
//   img: 'asdasd',
//   rol: 'asdasd',
//   estado: false,
//   google: true,
// }

/**
 * importamos Schema y model de mongoose para crear el modelo de datos de la colección de usuarios
 * en la base de datos de MongoDB
 */
const { Schema, model } = require('mongoose')

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  correo: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String
  },
  rol: {
    type: String,
    required: true
    // enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

/**
 * Método para eliminar el campo password de la respuesta del servidor
 * cuando se crea un nuevo usuario
 * Sobreescribimos el método toJSON de la clase Schema
 */
UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject()
  usuario.uid = _id
  return usuario
}

/**
 * exportamos el modelo de datos de la colección de usuarios en la base de datos de MongoDB
 * con el nombre de Usuario y el esquema de datos UsuarioSchema
 * MongoDB pluraliza el nombre de la colección, por lo que la colección se llamará Usuarios
 */
module.exports = model('Usuario', UsuarioSchema)
