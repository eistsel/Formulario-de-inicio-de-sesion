//archivo principal entrada para el backend en el que se desarrollara todo el punto de entrada de la aplicacion

require('dotenv').config({path:'../.env'}); // Cargar variables de entorno desde el archivo .env
const express = require('express'); // Importar express
const cors = require('cors'); // Importar cors para manejar CORS
const authRoutes = require('./src/routes/authRoutes'); // Importar las rutas de autenticación

const app = express(); // Crear una instancia de express
const PORT = process.env.PORT || 3001; // Definir el puerto, si no está definido en el .env, usar 3000 por defecto

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || '*', // Permitir solicitudes de diferentes dominios, si no está definido en el .env, usar '*' para permitir todos los dominios
    }
)); // Usar cors para permitir solicitudes de diferentes dominios

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.urlencoded({extended: true})); // Middleware para parsear el cuerpo de las solicitudes como URL-encoded

//Rutas de la aplicacion
app.get('/', (req, res) => {
    res.send('API de autenticación en funcionamiento'); // Respuesta para la ruta raíz
});

app.use('/api/auth', authRoutes); // Usar las rutas de autenticación en el prefijo /api/auth

//middleware para manejar errores 404
app.use((err,req, res, next) => {
    console.error(err.stack); // Imprimir el error en la consola
    res.status(500).send('Error interno del servidor'); // Responder con un error 500
});

//inicializar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`); // Imprimir en consola la URL donde está escuchando el servidor
});