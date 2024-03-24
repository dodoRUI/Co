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
    },
    changePassword:async ({userid,password,newpassword})=>{
        var result = await promisePool.query(`update tb_users set password=? where userid=? and password=?`,[newpassword,userid,password])
        return result[0]
    },
    addConfirm:async ({userid})=>{
        var result = await promisePool.query(`select userid from tb_users where userid=?`,[userid])
        return result[0]
    },
    userAdd:async ({userid,username,gender,institute,major,classid,profile,role,avatar})=>{
        var result = await promisePool.query(`insert into tb_users(userid,username,gender,institute,major,classid,profile,role,avatar) values(?,?,?,?,?,?,?,?,?)`,[userid,username,gender,institute,major,classid,profile,role,avatar])
        return result[0]
    },
    userlistGet:async ({page})=>{
        var result = await promisePool.query(`select userid,username,gender,profile,avatar,institute,major,classid,communities,role from tb_users limit 10 offset ${(page-1)*10}`)
        var count = await promisePool.query(`select count(*) as total from tb_users`)
        return {data:result[0],total:count[0][0].total}
    },
    getUser:async ({userid})=>{
        var result = await promisePool.query(`select * from tb_users where userid=?`,[userid])
        return result[0]
    },
    userDelete:async ({userid})=>{
        var result = await promisePool.query(`delete from tb_users where userid=?`,[userid])
        return result[0]
    },
    userUpdate:async({userid,username,gender,institute,major,classid,profile,role,password})=>{
        var result = await promisePool.query(`update tb_users set username=?,gender=?,institute=?,major=?,classid=?,profile=?,role=?,password=? where userid=?`,[username,gender,institute,major,classid,profile,role,password,userid])
        return result[0]
    },
    userFilter:async({obj,page})=>{
        var where = 'where '
        for(var i in obj){
            if(typeof obj[i] === 'string'){
                where += `${i}='${obj[i]}' and `
            }else{
                where += `${i}=${obj[i]} and `
            }
        }
        where = where.slice(0,-5)
        var result = await promisePool.query(`select * from tb_users ${where} limit 10 offset ${(page-1)*10}`)
        var count = await promisePool.query(`select count(*) as total from tb_users ${where}`)
        return {data:result[0],total:count[0][0].total}
    },
    userMultipleDelete:async({users})=>{
        var ids = []
        for(var i in users){
            ids.push(users[i].userid)
        }
        ids = ids.join(',')
        console.log(ids)
        const result = await promisePool.query(`delete from tb_users where userid in (${ids})`)
        return result[0]
    }
}

module.exports = UserServices