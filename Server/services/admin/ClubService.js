const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")
const fs = require('fs')
const path = require('path')

const ClubService = {
    // 获取所有社团信息
    clubListGet: async () => {
        try {
            const result = await promisePool.query(`SELECT c.*,u1.username AS minister,u2.username AS leader FROM tb_clubs c JOIN 
            tb_users u1 ON c.club_minister = u1.userid LEFT JOIN tb_users u2 ON c.club_leader = u2.userid`)
            dateTime.dateFormat(result[0], 'club_birth')
            return { success: true, data: result[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 条件查询社团
    clubSearch: async ({ club_belong, club_name }) => {
        try {
            const result = await promisePool.query(`SELECT tb_clubs.*, tb_users.username FROM tb_clubs
        JOIN tb_users ON tb_clubs.club_minister = tb_users.userid where club_belong like '%${club_belong}%' and club_name like '%${club_name}%'`)
            dateTime.dateFormat(result[0], 'club_birth')

            return { success: true, data: result[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 新增社团分配社长时查看该用户是否已经是社长或者是否存在
    checkMinister: async (userid) => {
        try {
            let club = await promisePool.query(`select club_name from tb_clubs where club_minister=?`, [userid])
            let user = await promisePool.query(`select username from tb_users where userid=?`, [userid])

            return { success: true, data: { club: club[0], user: user[0] } }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 新增社团分配指导老师时查看该用户是否已经是指导老师或者是否存在
    checkLeader: async (userid) => {
        try {
            let club = await promisePool.query(`select club_name from tb_clubs where club_leader=?`, [userid])
            let user = await promisePool.query(`select username from tb_users where userid=?`, [userid])

            return { success: true, data: { club: club[0], user: user[0] } }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 新增社团
    clubAdd: async ({ club_name, club_avatar, club_profile, club_birth, club_belong,club_leader, club_minister, club_type }) => {
        try {
            await promisePool.query('START TRANSACTION')
            await promisePool.query(`insert into tb_clubs(club_name,club_avatar,club_profile,club_birth,club_belong,club_leader,club_minister,members,club_type) values(?,?,?,?,?,?,?,?,?)`, [club_name, club_avatar, club_profile, club_birth, club_belong, club_leader, club_minister, 1, club_type])
            const clubid = await promisePool.query(`select club_id from tb_clubs where club_minister=?`,[club_minister])
            await promisePool.query(`insert into tb_clubmembers (club_id,userid,join_time,user_role) values(?,?,?,?)`, [clubid[0][0].club_id,club_minister,new Date(),1])
            await promisePool.query(`insert into tb_clubmembers (club_id,userid,join_time,user_role) values(?,?,?,?)`, [clubid[0][0].club_id,club_leader,new Date(),5])
            await promisePool.query(`update tb_users set role=1 where userid=?`, [club_minister])
            await promisePool.query('COMMIT')

            return { success: true, message: '添加成功' }
        } catch (error) {
            await promisePool.query('ROLLBACK');
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 删除社团
    clubDelete: async ({ club_id, club_minister, club_avatar }) => {
        try {
            if (club_avatar) {
                const avatarPath = path.join(__dirname, '../..', 'public', club_avatar)
                deleteFile(avatarPath)
            }
            await promisePool.query('START TRANSACTION')
            await promisePool.query(`delete from tb_clubs where club_id=?`, [club_id])
            await promisePool.query(`delete from tb_clubmembers where club_id=?`, [club_id])
            await promisePool.query(`update tb_users set role=0 where userid=?`, [club_minister])
            await promisePool.query('COMMIT')
            return { success: true, message: '删除成功' }
        } catch (error) {
            await promisePool.query('ROLLBACK');
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },

    // 数据展示
    getClubsData: async () => {
        try {
            const clubsData = await promisePool.query(`select * from tb_clubs`)
            const maleMembers = await promisePool.query(`SELECT DISTINCT u.userid,u.institute FROM tb_clubmembers cm JOIN tb_users u ON cm.userid = u.userid WHERE u.gender = 1`)
            const femaleMembers = await promisePool.query(`SELECT DISTINCT u.userid,u.institute FROM tb_clubmembers cm JOIN tb_users u ON cm.userid = u.userid WHERE u.gender = 0`)
            const actvtData = await promisePool.query(`select * from tb_activities`)

            return {
                success: true, data: {
                    clubsData: clubsData[0],
                    maleMembers: maleMembers[0],
                    femaleMembers: femaleMembers[0],
                    actvtData: actvtData[0]
                }
            }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 获取社团成员数据
    clubsMembersGet: async () => {
        try {
            const result = await promisePool.query(`SELECT c.club_id,c.club_name,c.club_avatar,club_birth,SUM(CASE WHEN u.gender = 1 THEN 1 ELSE 0 END) AS male,SUM(CASE WHEN u.gender = 0 THEN 1 ELSE 0 END) AS female FROM tb_clubs c INNER JOIN tb_clubmembers cm ON c.club_id = cm.club_id INNER JOIN tb_users u ON cm.userid = u.userid GROUP BY c.club_id, c.club_name`)
            dateTime.dateFormat(result[0], 'club_birth')

            return { success: true, data: result[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 获取社团活动数据
    clubsActvtsGet: async () => {
        try {
            const result = await promisePool.query(`SELECT c.club_id,c.club_name, c.club_avatar,COUNT(a.activity_id) AS actvtcount FROM tb_clubs c LEFT JOIN tb_activities a ON c.club_id = a.club_id GROUP BY c.club_id, c.club_name`)

            return { success: true, data: result[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 获取社团点赞数据
    clubStarsGet: async () => {
        try {
            const result = await promisePool.query(`SELECT club_id, club_name,club_avatar, club_star FROM tb_clubs`)
            // console.log(result[0])
            return { success: true, data: result[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },

    // 获取社团详细信息
    clubInfoGet: async (id) => {
        try {
            const info = await promisePool.query(`SELECT * FROM tb_clubs WHERE club_id=?`, [id])
            const members = await promisePool.query(`SELECT u.userid,u.username,u.gender,u.avatar,cm.join_time,cm.user_role FROM tb_clubmembers cm LEFT JOIN tb_users u ON cm.userid = u.userid WHERE cm.club_id=? and user_role=?`, [id, 0])
            const minister = await promisePool.query(`SELECT u.userid,u.username,u.gender,u.avatar,cm.join_time,cm.user_role FROM tb_clubmembers cm LEFT JOIN tb_users u ON cm.userid = u.userid WHERE cm.club_id=? and user_role=?`, [id, 1])
            const leader = await promisePool.query(`SELECT u.userid,u.username,u.gender,u.avatar,u.institute,cm.join_time,cm.user_role FROM tb_clubmembers cm LEFT JOIN tb_users u ON cm.userid = u.userid WHERE cm.club_id=? and user_role=?`, [id, 5])
            members[0].unshift(minister[0][0])
            if (leader[0].length) {
                leader[0][0].club = info[0][0].club_name
                members[0].unshift(leader[0][0])
            }
            dateTime.dateFormat(info[0], "club_birth")
            dateTime.dateFormat(members[0], "join_time")

            return { success: true, data: { info: info[0][0], members: members[0] } }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 移除社员
    memberDelete: async ({ clubid, userid }) => {
        try {
            await promisePool.query('START TRANSACTION')
            await promisePool.query(`DELETE FROM tb_clubmembers WHERE club_id=? and userid=?`, [clubid, userid])
            await promisePool.query(`UPDATE tb_clubs SET members=members-1 WHERE club_id=?`, [clubid])
            await promisePool.query('COMMIT')

            return { success: true, message: '操作成功' }
        } catch (error) {
            await promisePool.query('ROLLBACK');
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 更换社长
    ministerChange: async ({ clubid, oldMin, newMin }) => {
        const minister = await promisePool.query(`SELECT club_name FROM tb_clubs WHERE club_minister=?`, [newMin])
        if (minister[0].length !== 0) {
            return { success: false, message: `该成员为 ${minister[0][0]}社长，无法再担任其他社长！` }
        }
        try {
            await promisePool.query('START TRANSACTION');
            await promisePool.query('UPDATE tb_clubs SET club_minister=? WHERE club_id=?', [newMin, clubid]);
            await promisePool.query('UPDATE tb_users SET role=1 WHERE userid=?', [newMin]);
            await promisePool.query('UPDATE tb_clubmembers SET user_role=1 WHERE userid=? and club_id=?', [newMin, clubid]);
            await promisePool.query('UPDATE tb_users SET role=0 WHERE userid=?', [oldMin]);
            await promisePool.query('UPDATE tb_clubmembers SET user_role=0 WHERE userid=? and club_id=?', [oldMin, clubid]);
            await promisePool.query('COMMIT');
            return { success: true, message: '操作成功' };
        } catch (error) {
            await promisePool.query('ROLLBACK');
            return { success: false, message: '操作失败', error };
        }
    },
    // 查询指导老师
    leaderSearch: async (id) => {
        const res = await promisePool.query(`SELECT userid,username,institute,avatar,gender FROM tb_users WHERE userid=?`, [id])
        const club = await promisePool.query(`SELECT c.club_name FROM tb_clubs c LEFT JOIN tb_clubmembers cm ON c.club_id = cm.club_id WHERE cm.userid=?`, [id])
        if(club[0][0]){
            res[0][0].club = club[0][0].club_name
        }
        return { data: res[0][0] }
    },
    // 更换指导老师
    leaderChange: async ({ newLeader,clubid }) => {
        try {
            let oldLeader = await promisePool.query(`select club_leader from tb_clubs where club_id=?`, [clubid])
            oldLeader = oldLeader[0][0]?.club_leader
            await promisePool.query('START TRANSACTION')
            if(oldLeader){
                await promisePool.query(`delete from tb_clubmembers where club_id=? and user_role=5`, [clubid])
            }
            await promisePool.query(`insert into tb_clubmembers (club_id,userid,join_time,user_role) values(?,?,?,?)`, [clubid,newLeader,new Date(),5])
            await promisePool.query(`update tb_clubs set club_leader=? where club_id=?`, [newLeader,clubid])
            await promisePool.query('COMMIT')
            return { success: true, message: '操作成功' }
        } catch (error) {
            await promisePool.query('ROLLBACK');
            return { success: false, message: '操作失败', error }
        }
    },
    // 修改社团信息
    clubUpdate: async ({ club_name, club_avatar, club_profile, club_id, club_background }) => {
        try {
            await promisePool.query(`UPDATE tb_clubs SET club_name=?,club_avatar=?,club_profile=?,club_background=? WHERE club_id=?`, [club_name, club_avatar, club_profile, club_background, club_id])
            return { success: true, message: '操作成功' };
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },

    // 获取申请信息
    clubApplyGet: async ({ role, club_id }) => {
        try {
            const where = role==9 ? '' : `where apply_club=${club_id}`
            const result = await promisePool.query(`SELECT A.*, U.username,C.club_name FROM tb_applications A JOIN tb_users U ON A.apply_user = U.userid JOIN 
        tb_clubs C ON A.apply_club = C.club_id ${where} ORDER BY A.apply_time DESC`)
            dateTime.dateFormat(result[0], 'apply_time')
            return { success: true, data: result[0] };
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 同意申请
    clubApplyAccept: async ({ apply_club, apply_user, join_time }) => {
        try {
            await promisePool.query('START TRANSACTION');
            await promisePool.query(`INSERT INTO tb_clubmembers(club_id,userid,join_time,user_role) VALUES(?,?,?,?)`, [apply_club, apply_user, join_time, 0])
            await promisePool.query(`UPDATE tb_clubs SET members=members+1 WHERE club_id=?`, [apply_club])
            await promisePool.query(`DELETE FROM tb_applications WHERE apply_club=? and apply_user=?`, [apply_club, apply_user])
            await promisePool.query('COMMIT')
            return { success: true, message: '操作成功' };
        } catch (error) {
            await promisePool.query('ROLLBACK');
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 拒绝申请
    clubApplyRefuse: async ({ apply_club, apply_user }) => {
        try {
            await promisePool.query(`DELETE FROM tb_applications WHERE apply_club=? and apply_user=?`, [apply_club, apply_user])
            return { success: true, message: '操作成功' };
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 首页显示待处理申请数量
    applyNumGet: async ({ role, club_id }) => {
        try {
            const where = role==1||role==5 ? `where apply_club=${club_id}` : ''
            const result = await promisePool.query(`SELECT COUNT(*) AS num FROM tb_applications ${where}`)
            return { success: true, data: result[0][0] };
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },


    // 社团资讯
    // 添加新闻
    clubNewsAdd: async ({ title, content, time, club }) => {
        try {
            await promisePool.query(`INSERT INTO tb_clubnews(club_id,news_title,news_content,edit_time) VALUES(?,?,?,?)`, [club, title, content, time])
            return { success: true, message: '添加成功' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 获取社团资讯
    clubNewsGet: async ({ clubid, page, size }) => {
        try {
            const where = clubid ? `where cn.club_id=${clubid}` : ''
            const where2 = clubid ? `where club_id=${clubid}` : ''
            const result = await promisePool.query(`select cn.*,c.club_name from tb_clubnews cn join tb_clubs c on cn.club_id=c.club_id ${where} order by edit_time desc limit ${size} offset ${(page - 1) * size}`)
            dateTime.dateTimeFormat(result[0], 'edit_time')
            const count = await promisePool.query(`select count(*) as total from tb_clubnews ${where2}`)

            return { success: true, data: { list: result[0], total: count[0][0].total } }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 筛选新闻
    clubNewsFilter: async ({ club, keyword, page, size }) => {
        try {
            let where = `where`
            let where2 = `where`
            where += club ? ` cn.club_id=${club} and` : ''
            where2 += club ? ` club_id=${club} and` : ''
            where += keyword ? ` (cn.news_title like '%${keyword}%' or cn.news_content like '%${keyword}%') and` : ''
            where2 += keyword ? ` (news_title like '%${keyword}%' or news_content like '%${keyword}%') and` : ''
            where = where.slice(0, -4)
            where2 = where2.slice(0, -4)
            console.log(where)
            console.log(where2)
            const result = await promisePool.query(`select cn.*,c.club_name from tb_clubnews cn join tb_clubs c on cn.club_id=c.club_id ${where} order by edit_time desc limit ${size} offset ${(page - 1) * size}`)
            dateTime.dateTimeFormat(result[0], 'edit_time')
            const count = await promisePool.query(`select count(*) as total from tb_clubnews ${where2}`)

            return { success: true, data: { list: result[0], total: count[0][0].total } }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 修改新闻
    clubNewsUpdate: async ({ news_id, news_title, news_content, time }) => {
        try {
            await promisePool.query(`update tb_clubnews set news_title=?,news_content=?,edit_time=? where news_id=?`, [news_title, news_content, time, news_id])
            return { success: true, message: '修改成功' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 删除新闻
    clubNewsDelete: async (id) => {
        try {
            await promisePool.query(`delete from tb_clubnews where news_id=?`, [id])
            return { success: true, message: '删除成功' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 批量删除
    clubNewsMultipleDelete: async ({ newslist }) => {
        try {
            let ids = newslist.map(item => item.news_id)
            ids = ids.join(',')
            await promisePool.query(`delete from tb_clubnews where news_id in (${ids})`)
            return { success: true, message: '删除成功' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
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

module.exports = ClubService