const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()

const UserServices = {
    login:async ({userid,password})=>{
        var user = await promisePool.query(`select * from tb_users where userid=? and password=?`, [userid, password])
        return user[0]
    }
}

module.exports = UserServices