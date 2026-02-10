//logica de rutas para controlar la autenticacion de usuarios

const User = require('../models/users'); // Importar el modelo de usuario
const {comparePassword} = require('../utils/hash'); // Importar la función para comparar contraseñas
const {generateToken} = require('../utils/jwt');    // Importar la función para generar tokens JWT
const {validatePassword, validateEmail} = require('../utils/validations'); // Importar las funciones de validación

const register = async (req, res) => { // Controlador para registrar un nuevo usuario para cuando se va a hacer una peticion se necesita una requeest (peticion) y un response (respuesta)
    const {name, email, password} = req.body; //req.body es el cuerpo de la peticion que se envia desde el cliente (frontend) al servidor (backend) y contiene los datos que se quieren enviar al servidor, en este caso el nombre, correo electronico y contraseña del usuario

    if (!name || !email || !password) {
        return res.status(400).json({error: 'todos los campos son obligatorios'}); // Codigo 400 --> Bad request, faltan datos
    }
    if (!validateEmail(email)) {
        return res.status(400).json({error: 'formato de email invalido'}); // Codigo 400 --> Bad request, formato de correo electronico invalido
    }
    if (!validatePassword(password)) {
        return res.status(400).json({error: 'Password must be at least 8 characters long and contain at least one number and one special character'});
    }

    try{
        const newUser = await User.create({name, email, password}); // crea un nuevo usuario llamando a la funcion create del modelo de usuario, pasando el nombre, correo electronico y contraseña como parametros

        const tokenPayload = { // Payload del token que se va a generar con el id, nombre y correo electronico del usuario creado
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        };
        const token = generateToken(tokenPayload); // Generar el token JWT llamando a la funcion generateToken y pasando el payload como parametro
        // El token se genera con la libreria jsonwebtoken y contiene el id, nombre y correo electronico del usuario creado, ademas de la fecha de expiracion del token (1 hora por defecto)

        res.status(201).json({ //Codigo 201 --> se creo correctamente el recurso el json que se devuelve contiene el mensaje de exito, el token y el usuario creado (nombre y correo electronico)
            message: 'Usuario creado correctamente.',
            token,
            user:{name: newUser.name, email: newUser.email}
        });
    }
    catch(error){
        if (error.message === 'El correo electronico ya esta registrado') {
            return res.status(409).json({error: error.message}); // Codigo 409 --> Conflicto, el correo ya existe
        }
        console.error('Error creating user:', error);
        res.status(500).json({error: 'Internal server error'}); // Codigo 500 --> Error interno del servidor
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'correo electronico y contraseña son requeridos'}); // Codigo 400 --> Bad request, faltan datos
    }
    if (!validateEmail(email)) {
        return res.status(400).json({error: 'el formato de correo electronico no es valido'}); // Codigo 400 --> Bad request, formato de correo electronico invalido
    }

    try {
        const user = await User.findByEmail(email); // Busca el usuario por correo electronico llamando a la funcion findByEmail del modelo de usuario
        if (!user) { // Si no se encuentra el usuario, devuelve un error 401 (no autorizado)
            return res.status(401).json({error: 'correo electronico o contraseña incorrectos'}); // Codigo 401 --> Unauthorized, credenciales incorrectas
        }
        const isMatch = await comparePassword(password, user.password_hash); // Compara la contraseña ingresada con la contraseña encriptada almacenada en la base de datos llamando a la funcion comparePassword
        if (!isMatch) {
            return res.status(401).json({error: 'correo electronico o contraseña incorrectos'}); // Codigo 401 --> Unauthorized, credenciales incorrectas
        }
        await User.updatelastlogin(user.id); // Actualiza la fecha y hora del ultimo inicio de sesion llamando a la funcion updatelastlogin del modelo de usuario

        const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const token = generateToken(tokenPayload); // Generate JWT token

        res.status(200).json({ // Codigo 200 --> OK, inicio de sesion exitoso
            message: 'Inicio de sesion exitoso',
            token,
            user:{name: user.name, email: user.email}
        });
    }

    catch(error) {
        console.error('Error logging in user:', error);
        res.status(500).json({error: 'Internal server error'}); // Codigo 500 --> Error interno del servidor
    }
};

module.exports = {
    register,
    login,
};