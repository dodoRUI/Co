const bcrypt = require('bcryptjs')

const BCRYPT = {
    // 密码加密
    encrypt(password) {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        return hashPassword;
    },

    // 密码验证
    compare(password, hashPassword) {
        return bcrypt.compareSync(password, hashPassword);
    }
}

module.exports = BCRYPT;