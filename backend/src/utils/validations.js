//expresiones regulares --> regex

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/; // 8 caracteres, al menos una mayuscula, una minuscula, un numero y un caracter especial
const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
        return false; // contraseña no valida
    }
    return true; // contraseña valida
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex para validar email
    if (!emailRegex.test(email)) {
        return false; // email no valido
    }
    return true; // email valido
};

module.exports = {
    validatePassword,
    validateEmail,
};