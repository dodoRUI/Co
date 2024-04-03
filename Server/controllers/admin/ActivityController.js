const ActivityService = require('../../services/admin/ActivityService')

const ActivityController = {
    // 返回所有俱乐部ID及其名称，给前端做选择器的Option
    getClubNames: async (req, res) => {
        const result = await ActivityService.getClubNames()
        res.send({
            data: result
        })
    },
    // 新增活动
    activityAdd: async (req, res) => {
        // console.log(req.body)
        console.log(req.files)
    }
}

module.exports = ActivityController