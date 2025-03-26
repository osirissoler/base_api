import bcrypt from 'bcrypt';
// const bcryptjs = require('bcryptjs')

bcrypt

const crypto = require('crypto');
const generateCode = async (long) => {
    const caracteresPermitidos = 'AEIOU0123456789BCDFGHIJKLMN';
    const longitud = long;
    let code = '';

    const arrayAleatorio = crypto.randomBytes(longitud);

    for (let i = 0; i < longitud; i++) {
        const indice = arrayAleatorio[i] % caracteresPermitidos.length;
        code += caracteresPermitidos.charAt(indice);
    }

    return code
}

const generateReference = async (long) => {
    const caracteresPermitidos = '0123456789';
    const longitud = long;
    let code = '';

    const arrayAleatorio = crypto.randomBytes(longitud);

    for (let i = 0; i < longitud; i++) {
        const indice = arrayAleatorio[i] % caracteresPermitidos.length;
        code += caracteresPermitidos.charAt(indice);
    }

    return code
}

export { generateCode, generateReference}