const ActivityService = require('../../services/admin/ActivityService')

const ActivityController = {
    // 返回所有俱乐部ID及其名称，给前端做选择器的Option
    getClubNames: async (req, res) => {
        const result = await ActivityService.getClubNames()
        res.send(result)
    },
    // 新增活动
    activityAdd: async (req, res) => {
        // 处理文件原始名，转换成UTF-8格式
        if (req.files['file']) {
            const originalFilename = Buffer.from(req.files['file'][0].originalname, 'binary').toString('utf-8');
            req.files['file'][0].originalname = originalFilename
        }
        const result = await ActivityService.activityAdd(req.body, req.files)
        res.send(result)
    },
    // 获取所有活动
    actvtListGet: async (req, res) => {
        const result = await ActivityService.actvtListGet(req.query)
        res.send(result)
    },
    // 筛选活动
    actvtFilter:async(req,res)=>{
        const result = await ActivityService.actvtFilter(req.query)
        res.send(result)
    },
    // 删除活动
    activityDelete:async(req,res)=>{
        const result = await ActivityService.activityDelete(req.query.actvt)
        res.send(result)
    }
}

module.exports = ActivityController