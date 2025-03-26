import bcrypt from 'bcrypt';
// const bcryptjs = require('bcryptjs')

const encrypt = async(password) => {
    const salt = bcrypt.genSaltSync();

    const pass = bcrypt.hashSync(password, salt)

    return pass 
}

export { encrypt }