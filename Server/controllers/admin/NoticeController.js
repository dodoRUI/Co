const NoticeService = require('../../services/admin/NoticeServices')

const NoticeController = {
    // home页获取全部通知
    noticeListGet: async (req, res) => {
        const result = await NoticeService.noticeListGet()
        res.send(result)
    },
    // 分页查询
    noticePageGet: async (req, res) => {
        const result = await NoticeService.noticePageGet(req.params.page)
        res.send(result)
    },
    // 删除通知
    noticeDelete: async (req, res) => {
        const result = await NoticeService.noticeDelete(req.params.id)
        res.send(result)
    },
    // 批量删除通知
    noticeMultipleDelete: async (req, res) => {
        const result = await NoticeService.noticeMultipleDelete(req.query.notices)
        res.send(result)
    },
    // 筛选-条件查询通知
    noticeSearch: async (req, res) => {
        const result = await NoticeService.noticeSearch(req.query)
        res.send(result)
    },
    // 添加通知
    noticeAdd: async (req, res) => {
        const result = await NoticeService.noticeAdd(req.body)
        res.send(result)
    },
    // 修改通知
    noticeUpdate:async (req,res)=>{
        const result = await NoticeService.noticeUpdate(req.body)
        res.send(result)
    }
}

module.exports = NoticeController