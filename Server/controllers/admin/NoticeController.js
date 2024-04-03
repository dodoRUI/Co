const NoticeService = require('../../services/admin/NoticeServices')

const NoticeController = {
    // home页获取全部通知
    noticeListGet: async (req, res) => {
        const result = await NoticeService.noticeListGet()
        res.send({
            data: result,
            ActionType: "OK"
        })
    },
    // 分页查询
    noticePageGet: async (req, res) => {
        const result = await NoticeService.noticePageGet(req.params.page)
        res.send({
            data: result.data,
            total: result.total,
            ActionType: "OK"
        })
    },
    // 删除通知
    noticeDelete: async (req, res) => {
        const result = await NoticeService.noticeDelete(req.params.id)
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    },
    // 批量删除通知
    noticeMultipleDelete: async (req, res) => {
        const result = await NoticeService.noticeMultipleDelete(req.query.notices)
        res.send({
            ActionType: result.affectedRows == req.query.notices.length ? "OK" : "Error"
        })
    },
    // 筛选-条件查询通知
    noticeSearch: async (req, res) => {
        const result = await NoticeService.noticeSearch(req.query)
        res.send({
            data: result.data,
            total: result.total,
            ActionType: "OK"
        })
    },
    // 添加通知
    noticeAdd: async (req, res) => {
        const result = await NoticeService.noticeAdd(req.body)
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    }
}

module.exports = NoticeController