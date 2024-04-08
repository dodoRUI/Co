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

    // 数据展示
    getClubsData: async () => {
        const clubsData = await promisePool.query(`select * from tb_clubs`)
        const maleMembers = await promisePool.query(`SELECT DISTINCT u.userid,u.institute FROM tb_clubmembers cm JOIN tb_users u ON cm.userid = u.userid WHERE u.gender = 1`)
        const femaleMembers = await promisePool.query(`SELECT DISTINCT u.userid,u.institute FROM tb_clubmembers cm JOIN tb_users u ON cm.userid = u.userid WHERE u.gender = 0`)
        const actvtData = await promisePool.query(`select * from tb_activities`)
        return {
            clubsData: clubsData[0],
            maleMembers: maleMembers[0],
            femaleMembers: femaleMembers[0],
            actvtData: actvtData[0]
        }
    },
    // 获取社团成员数据
    clubsMembersGet: async () => {
        const result = await promisePool.query(`SELECT c.club_id,c.club_name,c.club_avatar,club_birth,SUM(CASE WHEN u.gender = 1 THEN 1 ELSE 0 END) AS male,SUM(CASE WHEN u.gender = 0 THEN 1 ELSE 0 END) AS female FROM tb_clubs c INNER JOIN tb_clubmembers cm ON c.club_id = cm.club_id INNER JOIN tb_users u ON cm.userid = u.userid GROUP BY c.club_id, c.club_name`)
        dateTime.dateFormat(result[0], 'club_birth')
        return result[0]
    },
    // 获取社团活动数据
    clubsActvtsGet: async () => {
        const result = await promisePool.query(`SELECT c.club_id,c.club_name, c.club_avatar,COUNT(a.activity_id) AS actvtcount FROM tb_clubs c LEFT JOIN tb_activities a ON c.club_id = a.club_id GROUP BY c.club_id, c.club_name`)
        return result[0]
    },
    // 获取社团点赞数据
    clubStarsGet: async () => {
        const result = await promisePool.query(`SELECT c.club_id, c.club_name,c.club_avatar, COUNT(u.vote) AS vote_count FROM tb_clubs c LEFT JOIN tb_users u ON c.club_id = u.vote GROUP BY c.club_id, c.club_name`)
        return result[0]
    },

    // 获取社团详细信息
    clubInfoGet: async (id) => {
        const info = await promisePool.query(`SELECT c.*,u.userid,u.username FROM tb_clubs c LEFT JOIN 
        tb_users u ON c.club_minister = u.userid WHERE c.club_id=?`, [id])
        const members = await promisePool.query(`SELECT u.userid,u.username,u.gender,u.institute,u.major,u.classid,u.avatar,cm.join_time FROM tb_clubmembers cm 
        LEFT JOIN tb_users u ON cm.userid = u.userid WHERE cm.club_id=?`, [id])
        dateTime.dateFormat(info[0], "club_birth")
        dateTime.dateFormat(members[0], "join_time")
        return {
            info: info[0][0],
            members: members[0]
        }
    },
    // 移除社员
    memberDelete: async ({ clubid, userid }) => {
        const result = await promisePool.query(`DELETE FROM tb_clubmembers WHERE club_id=? and userid=?`, [clubid, userid])
        await promisePool.query(`UPDATE tb_clubs SET members=members-1 WHERE club_id=?`, [clubid])
        return result[0]
    },
    // 更换社长
    ministerChange: async ({ clubid, oldMin, newMin }) => {
        try {
            // 开始事务
            await promisePool.query('START TRANSACTION');
            // 更新 tb_clubs 表中的社团社长为新社长的 id
            await promisePool.query('UPDATE tb_clubs SET club_minister=? WHERE club_id=?', [newMin, clubid]);
            // 更新 tb_users 表中新社长的角色为 1
            await promisePool.query('UPDATE tb_users SET role=1 WHERE userid=?', [newMin]);
            // 更新 tb_clubmembers 表中新社长的角色为 1
            await promisePool.query('UPDATE tb_clubmembers SET user_role=1 WHERE userid=?', [newMin]);
            // 更新 tb_users 表中旧社长的角色为 0
            await promisePool.query('UPDATE tb_users SET role=0 WHERE userid=?', [oldMin]);
            // 更新 tb_clubmembers 表中旧社长的角色为 0
            await promisePool.query('UPDATE tb_clubmembers SET user_role=0 WHERE userid=?', [oldMin]);
            // 提交事务
            await promisePool.query('COMMIT');
            // 返回成功信息或其他结果
            return { success: true, message: '操作成功' };
        } catch (error) {
            // 如果出现错误，回滚事务
            await promisePool.query('ROLLBACK');
            // 返回错误信息
            return { success: false, message: '操作失败', error };
        }
    },
    // 修改社团信息
    clubUpdate: async ({ club_name, club_avatar, club_profile, club_id }) => {
        try {
            await promisePool.query(`UPDATE tb_clubs SET club_name=?,club_avatar=?,club_profile=? WHERE club_id=?`, [club_name, club_avatar, club_profile, club_id])
            return { success: true, message: '操作成功' };
        } catch (error) {
            return { success: false, message: '操作失败', error }
        }
    },


    // 获取申请信息
    clubApplyGet: async ({ role, club_id }) => {
        const where = role == 1 ? `where apply_club=${club_id}` : ''
        try {
            const result = await promisePool.query(`SELECT A.*, U.username,C.club_name FROM tb_applications A JOIN tb_users U ON A.apply_user = U.userid JOIN 
        tb_clubs C ON A.apply_club = C.club_id ${where} ORDER BY A.apply_time DESC`)
            dateTime.dateFormat(result[0], 'apply_time')
            return { success: true, data:result[0] };
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    }
}

module.exports = ClubService