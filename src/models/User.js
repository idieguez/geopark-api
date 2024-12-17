class User {

    constructor(id, name, email, password) {
        this.id = id;           // ID único del usuario
        this.name = name;       // Nombre del usuario
        this.email = email;     // Correo electrónico
        this.password = password; // Contraseña (cifrada idealmente)
    }

    // Método para mostrar información básica del usuario
    getProfile() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }

    // Método estático para validar el formato del email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}




module.exports = User;
