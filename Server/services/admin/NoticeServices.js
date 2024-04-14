const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")

const NoticeService = {
    noticeListGet: async () => {
        try {
            const result = await promisePool.query(`SELECT * FROM tb_notices order by notice_time DESC`)
            dateTime.dateTimeFormat(result[0], 'notice_time')

            return { success: true, data: result[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    noticePageGet: async (page) => {
        try {
            const result = await promisePool.query(`SELECT tb_notices.*, tb_users.username FROM tb_notices
        JOIN tb_users ON tb_notices.creator = tb_users.userid order by notice_time DESC limit 10 offset ${(page - 1) * 10}`)
            var count = await promisePool.query(`select count(*) as total from tb_notices`)
            dateTime.dateTimeFormat(result[0], 'notice_time')

            return { success: true, data: result[0], total: count[0][0].total }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    noticeDelete: async (id) => {
        try {
            await promisePool.query(`delete from tb_notices where notice_id=?`, [id])
            return { success: true, message: '删除成功！' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    noticeMultipleDelete: async (notices) => {
        try {
            let ids = notices.map(item => item.notice_id)
            ids = ids.join(',')
            await promisePool.query(`delete from tb_notices where notice_id in (${ids})`)
            return { success: true, message: '删除成功！' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    noticeSearch: async ({ keyWord, page }) => {
        try {
            const result = await promisePool.query(`SELECT tb_notices.*, tb_users.username FROM tb_notices JOIN tb_users ON tb_notices.creator = tb_users.userid where notice_title like '%${keyWord}%' or notice_content like '%${keyWord}%' order by notice_time DESC limit 10 offset ${(page - 1) * 10}`)
            var count = await promisePool.query(`select count(*) as total from tb_notices where notice_title like '%${keyWord}%' or notice_content like '%${keyWord}%'`)
            dateTime.dateTimeFormat(result[0], 'notice_time')
            return { success: true, data: result[0], total: count[0][0].total }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    noticeAdd: async ({ notice_title, notice_content, creator, notice_time }) => {
        try {
            await promisePool.query(`insert into tb_notices(notice_title,notice_content,creator,notice_time) values(?,?,?,?)`, [notice_title, notice_content, creator, notice_time])
            return { success: true, message: '公告添加成功！' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 修改通知
    noticeUpdate: async ({ notice_id, notice_title, notice_content, creator, notice_time }) => {
        try {
            await promisePool.query(`update tb_notices set notice_title=?,notice_content=?,creator=?,notice_time=? where notice_id=?`, [notice_title, notice_content, creator, notice_time, notice_id])
            return { success: true, message: '修改成功！' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
}
module.exports = NoticeService