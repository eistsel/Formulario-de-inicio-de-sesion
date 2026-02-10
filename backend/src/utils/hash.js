const bcrypt = require('bcrypt');
const saltRounds = 10; // numero de rondas de encriptacion (hash) mientras mas alto sea el numero, mas seguro es el hash pero mas lento es el proceso de encriptacion

const hashPassword = async (plainPassword) => { //contraseña plana (no encriptada) --> contraseña que el usuario ingresa
    try {
        const hash = await bcrypt.hash(plainPassword, saltRounds); // encriptar password 
        return hash; // devolver hash (contraseña encriptada)
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        throw new Error('Error hashing password'); // lanzar error si falla la encriptacion
    }
};

const comparePassword = async (plainPassword, hashedpassword) => {
    try{
        const isMatch = await bcrypt.compare(plainPassword, hashedpassword); // comparar contraseña plana con contraseña encriptada
        return isMatch; // devolver true si coinciden, false si no
    } catch(error){
        console.error('Error comparing password:', error);
        return false; // devolver false si hay un error
    }
};

module.exports = {
    hashPassword,
    comparePassword,
};