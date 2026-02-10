// se va a definir los endpoints de autenticacion (registro e inicio de sesion) y se va a importar el controlador de autenticacion

const express = require('express'); // Importar express que esta en el node_modules para crear el router y modularizar las rutas
const {register, login} = require('../controllers/authController'); // Importar los controladores de autenticación

const router = express.Router(); // Crear un nuevo router de express para definir las rutas de autenticación 

router.post('/register', register); // Endpoint para registrar un nuevo usuario, el metodo post se usa para enviar datos al servidor en astro se tienen que poner las mismas rutas que en el backend
router.post('/login', login); // Endpoint para iniciar sesión

module.exports = router; // Exportar el router para usarlo en otros archivos
// Importar el router de express
// const express = require('express');
// const router = express.Router();
//
// Importar el controlador de autenticación 
// const authController = require('../controllers/authController');

// un endpoint es una ruta que se define en el backend para recibir peticiones del frontend y devolver respuestas
