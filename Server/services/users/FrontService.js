const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")
const fs = require('fs')
const path = require('path')

const FrontService = {
    clubNewsGet: async (page) => {
        try {
            const res = await promisePool.query(`SELECT cn.*,c.club_name,c.club_avatar,c.members,u.avatar AS minister_avatar,u.username AS minister_name FROM tb_clubnews AS cn JOIN tb_clubs AS c ON cn.club_id = c.club_id JOIN tb_users AS u ON c.club_minister = u.userid ORDER BY edit_time DESC limit 5 offset ${(page - 1) * 5}`)
            const count = await promisePool.query(`SELECT count(*) AS count FROM tb_clubnews`)
            dateTime.dateTimeFormat(res[0], 'edit_time')
            return { success: true, data: res[0], total: count[0][0].count }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！' }
        }
    },
    clubNewsSearch: async (page, keyword) => {
        try {
            const res = await promisePool.query(`SELECT cn.*,c.club_name,c.club_avatar,c.members,u.avatar AS minister_avatar,u.username AS minister_name FROM tb_clubnews AS cn JOIN tb_clubs AS c ON cn.club_id = c.club_id JOIN tb_users AS u ON c.club_minister = u.userid WHERE (news_title LIKE '%${keyword}%' OR news_content LIKE '%${keyword}%' OR club_name LIKE '%${keyword}%') ORDER BY edit_time DESC limit 5 offset ${(page - 1) * 5}`)
            const count = await promisePool.query(`SELECT count(*) AS count FROM tb_clubnews AS cn JOIN tb_clubs AS c ON cn.club_id = c.club_id WHERE (news_title LIKE '%${keyword}%' OR news_content LIKE '%${keyword}%' OR club_name LIKE '%${keyword}%')`)
            dateTime.dateTimeFormat(res[0], 'edit_time')
            return { success: true, data: res[0], total: count[0][0].count }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！' }
        }
    },
    userInfoGet: async ({ id }) => {
        try {
            const userinfo = await promisePool.query(`SELECT * from tb_users where userid=?`, [id])
            const clubs = await promisePool.query(`SELECT c.*,cm.* FROM tb_clubs AS c JOIN tb_clubmembers AS cm ON c.club_id = cm.club_id WHERE cm.userid=?`, [id])
            dateTime.dateFormat(clubs[0], 'join_time')
            dateTime.dateFormat(clubs[0], 'club_birth')
            return { success: true, data: { userinfo: userinfo[0][0], clubs: clubs[0] } }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！' }
        }
    },
    userUpdate: async (body, file) => {
        try {
            const { userid, username, profile, avatar } = body
            const newAvatar = file ? '/avatarUploads/' + file.filename : avatar
            if (newAvatar !== avatar) {
                const avatarPath = path.join(__dirname, '../..', 'public', avatar)
                deleteFile(avatarPath)
            }
            await promisePool.query(`update tb_users set username=?,profile=?,avatar=? where userid=?`, [username, profile, newAvatar, userid])
            return { success: true, message: '修改成功' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！' }
        }
    },
    userPasswordUpdate: async ({ oldpass, newpass, userid }) => {
        try {
            const PASSWORD = await promisePool.query(`select password from tb_users where userid=?`, [userid])
            if (PASSWORD[0][0].password === oldpass) {
                await promisePool.query(`update tb_users set password=? where userid=?`, [newpass, userid])
                return { success: true, message: '密码修改成功!' }
            } else {
                return { success: false, message: '原密码错误！' }
            }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！' }
        }
    },

    // 获取活动信息
    activitiesGet: async (page) => {
        try {
            const res = await promisePool.query(`SELECT a.*,c.club_name,c.club_avatar FROM tb_activities AS a JOIN tb_clubs AS c ON a.club_id = c.club_id ORDER BY activity_start`)
            activitiesFormat(res[0])
            return { success: true, data: res[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！' }
        }
    },
    userClubGet: async (id) => {
        try {
            const res = await promisePool.query(`select club_id from tb_clubmembers where userid=?`, [id])
            return { success: true, data: res[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！' }
        }
    },
    // 活动评分
    activitiesRate: async ({ userid, rate, id }) => {
        console.log(userid, rate, id)
        const str = `/${userid},${rate}`
        await promisePool.query(`UPDATE tb_activities SET expectation = IF(expectation IS NULL, '${str}', CONCAT(expectation, '${str}')) WHERE activity_id=?`, [id])
        return { success: true, message: '评分成功' }
    },

    // 下载文件
    downloadFile: async (filepath) => {
        const filePath = path.join(__dirname, '../..', 'public', filepath);
        const data = fs.readFileSync(filePath)
        return data
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

function activitiesFormat(arr) {
    for (let i in arr) {        // 计算平均分
        let score = 0
        let users = {}          // 存储用户名和分数           // 每一个活动
        if (arr[i].expectation) {   // 活动的期待值不为空
            const userArr = arr[i].expectation.split('/')   // 将期待值字符串分割成数组  ['userid,rate','userid,rate','userid,rate']
            userArr.splice(0, 1)
            for (let j in userArr) {
                let user = userArr[j].split(',')        // ['userid','rate']
                users[user[0]] = Number(user[1])
                score += Number(user[1])
            }
            score = (score / Object.keys(users).length).toFixed(1)
        }
        arr[i].expectation = { score, users }
        if (arr[i].activity_file) {
            const fileArr = arr[i].activity_file.split(' ')
            arr[i].activity_file = { filename: fileArr[0], filepath: fileArr[1] }
        }
    }
    dateTime.dateTimeFormat(arr, 'activity_start')
    dateTime.dateTimeFormat(arr, 'activity_end')
    return arr
}

module.exports = FrontService