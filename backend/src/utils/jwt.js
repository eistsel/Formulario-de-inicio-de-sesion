// Importar la librería jsonwebtoken para manejar JWT para realizar la autenticación y autorización de usuarios

const jwt = require('jsonwebtoken'); // Importar la librería jsonwebtoken para manejar JWT
require('dotenv').config({path:'../../.env'}) // Cargar variables de entorno desde el archivo .env

const JWT_SECRET = process.env.JWT_SECRET; // Clave secreta para firmar el token que sirve para encriptar y verificar el token
// Asegúrate de que la variable JWT_SECRET esté definida en tu archivo .env

const generateToken = (payload) => { //funcion para guardar el token en la base de datos
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}); // Generar un token con el payload y la clave secreta, con una expiración de 1 hora
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET); // Verificar el token con la clave secreta
    } catch (error) {
        console.error('token invalido o expirado', error.message); // Imprimir el error en la consola
        return null; // Si el token es inválido o ha expirado, devolver null
    }
}

module.exports = {
    generateToken, // Exportar la función para generar el token
    verifyToken, // Exportar la función para verificar el token
}