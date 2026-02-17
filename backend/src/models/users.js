// aqui nos traeremos la configuracion de la base de datos y la funcion para encriptar la contraseña
const db = require('../config/db'); // Importar la configuración de la base de datos
const {hashPassword} = require('../utils/hash'); // Importar la función para hashear la contraseña

const User = {
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1'; // $1 es un placeholder seguro -> evita inyecciones SQL
        try{
            const {rows} = await db.query(query, [email]); // ejecutar la consulta con el email como parametro
            return rows[0]; // Return the first user found
        }
        catch(error){
            console.error('Error finding user by email:', error);
            throw new Error('Database error');
        }
    },

    async findById(id){
        const query = 'SELECT id, name, email, created_at, last_login_at FROM users WHERE id = $1'; // selecciona los campos que necesitas donde id coincide con el id del usuario
        // $1 es un placeholder seguro -> evita inyecciones SQL
        try{
            const {rows} = await db.query(query, [id]);
            return rows[0]; // Return the first user found
        }
        catch(error){
            console.error('Error finding user by ID:', error);
            throw new Error('Database error');
        }
    },

    async create({name, email, password}) { // Destructuring para obtener los valores de name, email y password del objeto que se pasa como parametro
        const hashedPassword = await hashPassword(password); // Hashear la contraseña antes de guardarla en la base de datos llamando a la funcion hashPassword
        const query = `
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3) 
            RETURNING id, name, email, created_at
        `;
        const values = [name, email, hashedPassword]; // Use parameterized queries to prevent SQL injection

        try{
            // Debug: información no sensible sobre el usuario a crear
            console.log('Creating user:', { name, email, hashedPasswordSet: !!hashedPassword });
            const {rows} = await db.query(query, values);
            return rows[0]; // Return the created user
        }
        catch(error){
            console.error('Error creating user:', error.stack || error);
            if(error && error.code === '23505') { // el codigo lo brinda postgres para indicar que hay un conflicto de clave unica
                // 23505 es el codigo de error para violacion de clave unica
                throw new Error('El correo electronico ya esta registrado'); // Handle unique constraint violation (spanish message expected by controller)
            }
            throw error; // Propagar el error original para ver el detalle en los logs
        }
    },

    async updatelastlogin(id) {
        const query = 'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1'; // Actualiza el campo last_login_at con la fecha y hora actual
        // $1 es un placeholder seguro -> evita inyecciones SQL
        try{
            await db.query(query, [id]);
        }
        catch(error){
            console.error('Error updating last login:', error);
        }
    },
};

module.exports = User; // Exportar el objeto User para usarlo en otros archivos