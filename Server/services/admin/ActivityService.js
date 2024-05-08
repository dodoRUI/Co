const mysql2 = require("mysql2")
const dbConfig = require('../dbConfig')
const promisePool = mysql2.createPool(dbConfig).promise()
const dateTime = require("../../utils/dateTime")
const fs = require('fs')
const path = require('path')
const ExcelJS = require('exceljs')

const ActivityService = {
    // 新增活动时，选择社团。该接口负责返回所有社团名称及其ID
    getClubNames: async () => {
        try {
            const res = await promisePool.query(`select club_id,club_name from tb_clubs`)
            return { success: true, data: res[0] }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 新增活动
    activityAdd: async (body, files) => {
        try {
            let { name, content, club, place } = body
            club = Number(club)
            let start = body.period.split(',')[0]
            let end = body.period.split(',')[1]

            let poster = files.poster ? `/activityUploads/${files.poster[0].filename}` : ''
            let file = files.file ? `${files.file[0].originalname} /activityUploads/${files.file[0].filename}` : ''

            await promisePool.query(`insert into tb_activities(activity_name,activity_content,club_id,activity_place,activity_start,activity_end,activity_poster,activity_file) values(?,?,?,?,?,?,?,?)`, [name, content, club, place, start, end, poster, file])
            return { success: true, message: '活动添加成功！' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 获取活动列表
    actvtListGet: async ({ page, size, club_id }) => {
        try {
            const where1 = club_id ? `where a.club_id=${club_id}` : ''
            const where2 = club_id ? `where club_id=${club_id}` : ''
            var result = await promisePool.query(`SELECT a.*, c.club_name FROM tb_activities a JOIN tb_clubs c ON a.club_id = c.club_id ${where1} ORDER BY activity_id DESC limit ${size} offset ${(page - 1) * size}`)
            var count = await promisePool.query(`select count(*) as total from tb_activities ${where2}`)
            // 格式化时间
            dateTime.dateTimeFormat(result[0], 'activity_start')
            dateTime.dateTimeFormat(result[0], 'activity_end')

            return { success: true, data: result[0], total: count[0][0].total }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 筛选活动
    actvtFilter: async ({ form, page, size, club_id }) => {
        try {
            dateTime.dateTimeFormat([form], 'activity_start')
            let where = 'where '
            form.activity_club = club_id ? club_id : form.activity_club
            where += form.activity_name ? `activity_name like '%${form.activity_name}%' and ` : ''
            where += form.activity_club ? `tb_activities.club_id=${form.activity_club} and ` : ''
            where += form.activity_start ? `activity_start<='${form.activity_start}' and ` : ''
            where = where.slice(0, -5)
            const result = await promisePool.query(`select tb_activities.*, tb_clubs.club_name FROM tb_activities JOIN tb_clubs ON tb_activities.club_id = tb_clubs.club_id ${where} order by activity_id desc limit ${size} offset ${(page - 1) * size}`)
            var count = await promisePool.query(`select count(*) as total from tb_activities ${where}`)
            dateTime.dateTimeFormat(result[0], 'activity_start')
            dateTime.dateTimeFormat(result[0], 'activity_end')

            return { success: true, data: result[0], total: count[0][0].total }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 删除活动
    activityDelete: async (actvt) => {
        if (actvt.activity_poster) {
            const posterPath = path.join(__dirname, '../..', 'public', actvt.activity_poster)
            deleteFile(posterPath)
        }
        if (actvt.activity_file) {
            const filePath = path.join(__dirname, '../..', 'public', actvt.activity_file.split(' ')[1])
            deleteFile(filePath)
        }
        try {
            promisePool.query(`delete from tb_activities where activity_id=?`, [actvt.activity_id])
            return { success: true, message: '活动删除成功！' }
        } catch (error) {
            return { success: false, message: '服务器出错，请稍后再试！', error }
        }
    },
    // 下载活动报名表
    downloadForm: async (id) => {
        const registration = await promisePool.query(`select registration from tb_activities where activity_id=?`, [id])
        const registers = registration[0][0].registration.slice(1, -1)
        const registersList = await promisePool.query(`select userid,username,institute,major,classid from tb_users where userid in (${registers})`)

        // 创建一个新的工作簿
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('报名表');
        // 添加表头
        worksheet.columns = [
            { header: '学号', key: 'userid', width: 12 },
            { header: '姓名', key: 'username', width: 10 },
            { header: '学院', key: 'institute', width: 22 },
            { header: '专业', key: 'major', width: 25 },
            { header: '班级', key: 'classid', width: 8 }
        ];

        // 将数据添加至表格中
        registersList[0].forEach(item => {
            worksheet.addRow(item)
        })

        // 将工作簿写入文件
        const filePath = path.join(__dirname,`students.xlsx`);
        await workbook.xlsx.writeFile(filePath)
        const data = fs.readFileSync(filePath)
        return data
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

module.exports = ActivityService