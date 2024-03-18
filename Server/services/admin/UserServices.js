const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()

const UserServices = {
    login: async ({ userid, password }) => {
        var user = await promisePool.query(`select * from tb_users where userid=? and password=?`, [userid, password])
        return user[0]
    },
    updateUser: async ({ userid, username, profile, gender, avatar }) => {
        if (avatar) {
            await promisePool.query(`update tb_users set username=?,profile=?,gender=?,avatar=? where userid=?`, [username, profile, gender, avatar, userid])
        }else{
            await promisePool.query(`update tb_users set username=?,profile=?,gender=? where userid=?`, [username, profile, gender, userid])
        }

    }
}

module.exports = UserServices