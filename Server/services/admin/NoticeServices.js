const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")

const NoticeService = {
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
}
module.exports = NoticeService