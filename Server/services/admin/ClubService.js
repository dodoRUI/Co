const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")

const ClubService = {
    // 获取所有社团信息
    clubListGet: async () => {
        const result = await promisePool.query(`SELECT tb_clubs.*, tb_users.username FROM tb_clubs
        JOIN tb_users ON tb_clubs.club_minister = tb_users.userid`)
        dateTime.dateFormat(result[0], 'club_birth')
        return result[0]
    },
    // 条件查询社团
    clubSearch: async ({ club_belong, club_name }) => {
        const result = await promisePool.query(`SELECT tb_clubs.*, tb_users.username FROM tb_clubs
        JOIN tb_users ON tb_clubs.club_minister = tb_users.userid where club_belong like '%${club_belong}%' and club_name like '%${club_name}%'`)
        dateTime.dateFormat(result[0], 'club_birth')
        return result[0]
    },
    // 再新增社团分配社长时查看该用户是否已经是社长或者是否存在
    checkMinister: async (userid) => {
        let club = await promisePool.query(`select club_name from tb_clubs where club_minister=?`, [userid])
        let user = await promisePool.query(`select username from tb_users where userid=?`, [userid])
        return { club: club[0], user: user[0] }
    },
    // 新增社团
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
}

module.exports = ClubService