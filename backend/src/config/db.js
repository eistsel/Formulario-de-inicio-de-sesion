const {Pool} = require('pg'); // node-postgres pool
const path = require('path');

// Cargar variables de entorno desde el .env relativo a este archivo (ruta absoluta)
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Debug: mostrar configuración de DB (no imprimir la contraseña en texto claro)
console.log('DB config loaded:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password_set: !!process.env.DB_PASSWORD,
});

const pool = new Pool({ // Crear una nueva instancia de Pool para manejar conexiones a la base de datos
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect', () => { // el on es un listener que escucha la conexion a la base de datos
    //cuando se conecta a la base de datos se ejecuta esta funcion
    console.log('Connected to the database'); // Log successful connection
});

pool.on('error', (err) => { // Listener para manejar errores de conexión
    //cuando hay un error en la conexion a la base de datos se ejecuta esta funcion
    console.error('Error connecting to the database', err); 
    process.exit(-1); // Terminar el proceso si hay un error de conexión
});

module.exports = { // Exportar el pool para usarlo en otros archivos
    query: (text, params) => pool.query(text, params), // voy a exportar una consulta que recibe un texto y unos parametros
    pool: () => pool, // Function to get the pool instance
};

//text: sentencia SQL (SELECT, INSERT, UPDATE, DELETE) -> SELECT * FROM users WHERE id = $1
//params: parametros de la sentencia SQL (array) -> WHERE id = $1