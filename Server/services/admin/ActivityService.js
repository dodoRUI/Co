const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")

const ActivityService = {
    // 新增活动时，选择社团。该接口负责返回所有社团名称及其ID
    getClubNames: async () => {
        const res = await promisePool.query(`select club_id,club_name from tb_clubs`)
        return res[0]
    },
}

module.exports = ActivityService