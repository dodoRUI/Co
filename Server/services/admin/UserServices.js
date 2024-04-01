const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")

const UserServices = {
    login: async ({ userid, password }) => {
        var user = await promisePool.query(`select * from tb_users where userid=? and password=?`, [userid, password])
        return user[0]
    },
    updateUser: async ({ userid, username, profile, gender, avatar }) => {
        if (avatar) {
            await promisePool.query(`update tb_users set username=?,profile=?,gender=?,avatar=? where userid=?`, [username, profile, gender, avatar, userid])
        } else {
            await promisePool.query(`update tb_users set username=?,profile=?,gender=? where userid=?`, [username, profile, gender, userid])
        }
    },
    changePassword: async ({ userid, password, newpassword }) => {
        var result = await promisePool.query(`update tb_users set password=? where userid=? and password=?`, [newpassword, userid, password])
        return result[0]
    },
    addConfirm: async ({ userid }) => {
        var result = await promisePool.query(`select userid from tb_users where userid=?`, [userid])
        return result[0]
    },
    userAdd: async ({ userid, username, gender, institute, major, classid, profile, role, avatar }) => {
        var result = await promisePool.query(`insert into tb_users(userid,username,gender,institute,major,classid,profile,role,avatar) values(?,?,?,?,?,?,?,?,?)`, [userid, username, gender, institute, major, classid, profile, role, avatar])
        return result[0]
    },
    userlistGet: async ({ page, size }) => {
        var result = await promisePool.query(`select userid,username,gender,profile,avatar,institute,major,classid,role from tb_users limit ${size} offset ${(page - 1) * size}`)
        var count = await promisePool.query(`select count(*) as total from tb_users`)
        return { data: result[0], total: count[0][0].total }
    },
    getUser: async ({ userid }) => {
        var result = await promisePool.query(`select * from tb_users where userid=?`, [userid])
        return result[0]
    },
    userDelete: async ({ userid }) => {
        var result = await promisePool.query(`delete from tb_users where userid=?`, [userid])
        return result[0]
    },
    userUpdate: async ({ userid, username, gender, institute, major, classid, profile, role, password }) => {
        var result = await promisePool.query(`update tb_users set username=?,gender=?,institute=?,major=?,classid=?,profile=?,role=?,password=? where userid=?`, [username, gender, institute, major, classid, profile, role, password, userid])
        return result[0]
    },
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
    userMultipleDelete: async ({ users }) => {
        var ids = []
        for (var i in users) {
            ids.push(users[i].userid)
        }
        ids = ids.join(',')
        const result = await promisePool.query(`delete from tb_users where userid in (${ids})`)
        return result[0]
    },

    // 系统公告
    noticeListGet: async () => {
        const result = await promisePool.query(`SELECT * FROM tb_notices order by notice_time DESC`)
        dateTime.dateTimeFormat(result[0], 'notice_time')
        return result[0]
    },
    noticePageGet: async (page) => {
        const result = await promisePool.query(`SELECT tb_notices.*, tb_users.username FROM tb_notices
        JOIN tb_users ON tb_notices.creator = tb_users.userid order by notice_time DESC limit 10 offset ${(page - 1) * 10}`)
        var count = await promisePool.query(`select count(*) as total from tb_notices`)
        dateTime.dateTimeFormat(result[0], 'notice_time')
        return { data: result[0], total: count[0][0].total }
    },
    noticeDelete: async (id) => {
        const result = await promisePool.query(`delete from tb_notices where notice_id=?`, [id])
        return result[0]
    },
    noticeMultipleDelete: async (notices) => {
        var ids = []
        for (var i in notices) {
            ids.push(notices[i].notice_id)
        }
        ids = ids.join(',')
        const result = await promisePool.query(`delete from tb_notices where notice_id in (${ids})`)
        return result[0]
    },
    noticeSearch: async ({ keyWord, page }) => {
        const result = await promisePool.query(`SELECT tb_notices.*, tb_users.username FROM tb_notices
        JOIN tb_users ON tb_notices.creator = tb_users.userid where notice_title like '%${keyWord}%' or notice_content like '%${keyWord}%' order by notice_time DESC limit 10 offset ${(page - 1) * 10}`)
        var count = await promisePool.query(`select count(*) as total from tb_notices where notice_title like '%${keyWord}%' or notice_content like '%${keyWord}%'`)
        dateTime.dateTimeFormat(result[0], 'notice_time')
        return { data: result[0], total: count[0][0].total }
    },
    noticeAdd: async ({ notice_title, notice_content, creator, notice_time }) => {
        const result = await promisePool.query(`insert into tb_notices(notice_title,notice_content,creator,notice_time) values(?,?,?,?)`, [notice_title, notice_content, creator, notice_time])
        return result[0]
    },

    // 社团管理
    clubListGet: async () => {
        const result = await promisePool.query(`SELECT tb_clubs.*, tb_users.username FROM tb_clubs
        JOIN tb_users ON tb_clubs.club_minister = tb_users.userid`)
        dateTime.dateFormat(result[0], 'club_birth')
        return result[0]
    },
    clubSearch: async ({ club_belong, club_name }) => {
        const result = await promisePool.query(`SELECT tb_clubs.*, tb_users.username FROM tb_clubs
        JOIN tb_users ON tb_clubs.club_minister = tb_users.userid where club_belong like '%${club_belong}%' and club_name like '%${club_name}%'`)
        dateTime.dateFormat(result[0], 'club_birth')
        return result[0]
    },
    checkMinister: async (userid) => {
        let club = await promisePool.query(`select club_name from tb_clubs where club_minister=?`, [userid])
        let user = await promisePool.query(`select username from tb_users where userid=?`, [userid])
        return { club: club[0], user: user[0] }
    },
    clubAdd: async ({ club_name, club_avatar, club_profile, club_birth, club_belong, club_minister }) => {
        const result = await promisePool.query(`insert into tb_clubs(club_name,club_avatar,club_profile,club_birth,club_belong,club_minister,members) values(?,?,?,?,?,?,?)`, [club_name, club_avatar, club_profile, club_birth, club_belong, club_minister, 1])
        await promisePool.query(`update tb_users set role=1 where userid=?`, [club_minister])
        return result[0]
    },

    // 删除社团
    clubDelete: async ({ club_id, club_minister }) => {
        const result = await promisePool.query(`delete from tb_clubs where club_id=?`, [club_id])
        await promisePool.query(`update tb_users set role=0 where userid=?`, [club_minister])
        return result[0]
    },


    // 获取用户参加的社团
    getUserClubs: async (userid) => {
        const res = await promisePool.query(`SELECT cm.club_id,c.club_name,cm.join_time,cm.user_role FROM tb_clubmembers cm JOIN tb_clubs c ON cm.club_id = c.club_id
        WHERE cm.userid=?`, [userid])
        dateTime.dateFormat(res[0],'join_time')
        return res[0]
    },
}

module.exports = UserServices