const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")
const fs = require('fs')
const path = require('path')
const BCRYPT = require('../../utils/BCRYPT')
const JWT = require("../../utils/JWT")

const UserService = {
    login: async ({ userid, password, stage }) => {
        try {
            const tip = stage ? 'and (role=9 or role=1 or role=5)' : ''
            const user = await promisePool.query(`select * from tb_users where userid=? ${tip}`, [userid])
            // 密码验证
            if (user[0][0]&&BCRYPT.compare(password, user[0][0].password)) {
                if (user[0][0].role === 1 || user[0][0].role === 5) {
                    console.log(111111111111)
                    const clubid = await promisePool.query(`select club_id from tb_clubmembers where userid=?`, [userid])
                    user[0][0].club_id = clubid[0][0].club_id
                }
                return user[0]
            }else{
                return []
            }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 用户注册查看ID是否重复
    registerCheck: async ({ userid }) => {
        try {
            const user = await promisePool.query(`select userid from tb_users where userid=?`, [userid])
            return { repeat: user[0].length !== 0 }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 用户注册
    register: async (user) => {
        try {
            const { userid, password, classid } = user
            const pwd = BCRYPT.encrypt(password)
            const institute = user.instituteMajor[0]
            const major = user.instituteMajor[1]
            await promisePool.query(`insert into tb_users(userid,username,password,classid,institute,major,role) values(?,?,?,?,?,?,?)`, [userid, 'Nobody', pwd, classid, institute, major, 0])
            return { success: true, message: '注册成功！' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 修改个人信息
    updateUser: async ({ userid, username, profile, gender, avatar }) => {
        try {
            if (avatar) {
                await promisePool.query(`update tb_users set username=?,profile=?,gender=?,avatar=? where userid=?`, [username, profile, gender, avatar, userid])
            } else {
                await promisePool.query(`update tb_users set username=?,profile=?,gender=? where userid=?`, [username, profile, gender, userid])
            }
            return { success: true, message: '修改成功！',data:{userid:userid, username:username, profile:profile, gender:gender, avatar:avatar} }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 修改个人密码
    changePassword: async ({ userid, oldPass, newPass },authorization) => {
        try {
            const PASSWORD = JWT.verify(authorization.split(' ')[1]).password
            if (BCRYPT.compare(oldPass, PASSWORD)) {
                const NEWpass = BCRYPT.encrypt(newPass)
                await promisePool.query(`update tb_users set password=? where userid=?`, [NEWpass, userid])
                return { success: true, message: '密码修改成功!' }
            }else{
                return { success: false, message: '原密码错误！' }
            }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 添加用户验证用户ID是否被占用
    addConfirm: async ({ userid }) => {
        try {
            var result = await promisePool.query(`select userid from tb_users where userid=?`, [userid])
            return { success: true, data: result[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 添加用户
    userAdd: async ({ userid, username, gender, institute, major, classid, profile, role, avatar }) => {
        const password = BCRYPT.encrypt('swust'+userid)
        try {
            await promisePool.query(`insert into tb_users(userid,username,password,gender,institute,major,classid,profile,role,avatar) values(?,?,?,?,?,?,?,?,?,?)`, [userid, username, password, gender, institute, major, classid, profile, role, avatar])
            return { success: true, message: '添加成功！' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 获取用户列表，分页查询
    userlistGet: async ({ page, size }) => {
        try {
            var result = await promisePool.query(`select userid,username,gender,profile,avatar,institute,major,classid,role from tb_users limit ${size} offset ${(page - 1) * size}`)
            var count = await promisePool.query(`select count(*) as total from tb_users`)

            return { success: true, data: result[0], total: count[0][0].total }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 获取用户信息
    getUser: async ({ userid }) => {
        try {
            const result = await promisePool.query(`select * from tb_users where userid=?`, [userid])
            return { success: true, data: result[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }

    },
    // 删除用户
    userDelete: async ({ userid, avatar }) => {
        try {
            if (avatar) {
                const avatarPath = path.join(__dirname, '../..', 'public', avatar)
                deleteFile(avatarPath)
            }
            await promisePool.query(`delete from tb_users where userid=?`, [userid])
            return { success: true, message: '操作成功' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 修改用户信息
    userUpdate: async ({ userid, username, gender, institute, major, classid, profile, role, password }) => {
        try {
            await promisePool.query(`update tb_users set username=?,gender=?,institute=?,major=?,classid=?,profile=?,role=?,password=? where userid=?`, [username, gender, institute, major, classid, profile, role, password, userid])
            return { success: true, message: '操作成功' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 筛选用户，条件查询
    userFilter: async ({ obj, page, size }) => {
        try {
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

            return { success: true, data: result[0], total: count[0][0].total }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 批量删除用户
    userMultipleDelete: async ({ users }) => {
        try {
            var ids = users.map(item => item.userid)
            ids = ids.join(',')
            await promisePool.query(`delete from tb_users where userid in (${ids})`)

            return { success: true, message: '操作成功' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },

    // 查询用户参加的社团
    getUserClubs: async (userid) => {
        try {
            const res = await promisePool.query(`SELECT cm.club_id,c.club_name,cm.join_time,cm.user_role FROM tb_clubmembers cm JOIN tb_clubs c ON cm.club_id = c.club_id WHERE cm.userid=?`, [userid])
            dateTime.dateFormat(res[0], 'join_time')

            return { success: true, data: res[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    }
}

// 删除文件
function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return;
        }
        console.log('File deleted successfully');
    })
}


module.exports = UserService