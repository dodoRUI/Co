var express = require('express');
var noticeRouter = express.Router();
const NoticeController = require('../../controllers/admin/NoticeController')


// Home页获取所有系统公告
noticeRouter.get("/adminapi/notices/noticelist",NoticeController.noticeListGet)
// 公告页分页查询获取公告
noticeRouter.get("/adminapi/notices/noticelist/page/:page",NoticeController.noticePageGet)
// 筛选
noticeRouter.get("/adminapi/notices/noticelist/search",NoticeController.noticeSearch)
// 新增通知
noticeRouter.post("/adminapi/notices/addnotice",NoticeController.noticeAdd)
// 修改通知
noticeRouter.put("/adminapi/notices/updatenotice",NoticeController.noticeUpdate)
// 删除通知
noticeRouter.delete("/adminapi/notices/deletenotice/:id",NoticeController.noticeDelete)
// 批量删除通知
noticeRouter.delete("/adminapi/notices/deletenotices",NoticeController.noticeMultipleDelete)

module.exports = noticeRouter