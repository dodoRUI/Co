const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")

const UserService = {
    // 登录验证
    login: async ({ userid, password }) => {
        var user = await promisePool.query(`select * from tb_users where userid=? and password=?`, [userid, password])
        return user[0]
    },
    // 修改个人信息
    updateUser: async ({ userid, username, profile, gender, avatar }) => {
        if (avatar) {
            await promisePool.query(`update tb_users set username=?,profile=?,gender=?,avatar=? where userid=?`, [username, profile, gender, avatar, userid])
        } else {
            await promisePool.query(`update tb_users set username=?,profile=?,gender=? where userid=?`, [username, profile, gender, userid])
        }
    },
    // 修改个人密码
    changePassword: async ({ userid, password, newpassword }) => {
        var result = await promisePool.query(`update tb_users set password=? where userid=? and password=?`, [newpassword, userid, password])
        return result[0]
    },
    // 添加用户验证用户ID是否被占用
    addConfirm: async ({ userid }) => {
        var result = await promisePool.query(`select userid from tb_users where userid=?`, [userid])
        return result[0]
    },
    // 添加用户
    userAdd: async ({ userid, username, gender, institute, major, classid, profile, role, avatar }) => {
        var result = await promisePool.query(`insert into tb_users(userid,username,gender,institute,major,classid,profile,role,avatar) values(?,?,?,?,?,?,?,?,?)`, [userid, username, gender, institute, major, classid, profile, role, avatar])
        return result[0]
    },
    // 获取用户列表，分页查询
    userlistGet: async ({ page, size }) => {
        var result = await promisePool.query(`select userid,username,gender,profile,avatar,institute,major,classid,role from tb_users limit ${size} offset ${(page - 1) * size}`)
        var count = await promisePool.query(`select count(*) as total from tb_users`)
        return { data: result[0], total: count[0][0].total }
    },
    // 获取用户信息
    getUser: async ({ userid }) => {
        var result = await promisePool.query(`select * from tb_users where userid=?`, [userid])
        return result[0]
    },
    // 删除用户
    userDelete: async ({ userid }) => {
        var result = await promisePool.query(`delete from tb_users where userid=?`, [userid])
        return result[0]
    },
    // 修改用户信息
    userUpdate: async ({ userid, username, gender, institute, major, classid, profile, role, password }) => {
        var result = await promisePool.query(`update tb_users set username=?,gender=?,institute=?,major=?,classid=?,profile=?,role=?,password=? where userid=?`, [username, gender, institute, major, classid, profile, role, password, userid])
        return result[0]
    },
    // 筛选用户，条件查询
    userFilter: async ({ obj, page, size }) => {
        var where = 'where '
        for (var i in obj) {
            if (typeof obj[i] === 'string') {
                where += `${i}='${obj[i]}' and `
            } else {
                where += `${i}=${obj[i]} and `
            }
        }
        where = where.slice(0, -5)
        var result = await promisePool.query(`select * from tb_users ${where} limit ${size} offset ${(page - 1) * size}`)
        var count = await promisePool.query(`select count(*) as total from tb_users ${where}`)
        return { data: result[0], total: count[0][0].total }
    },
    // 批量删除用户
    userMultipleDelete: async ({ users }) => {
        var ids = []
        for (var i in users) {
            ids.push(users[i].userid)
        }
        ids = ids.join(',')
        const result = await promisePool.query(`delete from tb_users where userid in (${ids})`)
        return result[0]
    },

    // 查询用户参加的社团
    getUserClubs: async (userid) => {
        const res = await promisePool.query(`SELECT cm.club_id,c.club_name,cm.join_time,cm.user_role FROM tb_clubmembers cm JOIN tb_clubs c ON cm.club_id = c.club_id
        WHERE cm.userid=?`, [userid])
        dateTime.dateFormat(res[0],'join_time')
        return res[0]
    }
}

module.exports = UserService