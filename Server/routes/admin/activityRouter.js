var express = require('express');
var activityRouter = express.Router();
const ActivityController = require('../../controllers/admin/ActivityController')

const multer = require('multer')
const activityUpload = multer({ dest: 'public/activityUploads/' })  // 社团活动文件存放位置

// 获取社团名称显示在选择器上
activityRouter.get("/adminapi/activities/clubnames",ActivityController.getClubNames)
// 获取所有活动
activityRouter.get("/adminapi/activities/list",ActivityController.actvtListGet)
// 筛选活动
activityRouter.get("/adminapi/activities/filter",ActivityController.actvtFilter)
// 添加活动
activityRouter.post("/adminapi/activities/addactivity",activityUpload.fields([
    { name: 'poster', maxCount: 1 }, // 处理海报图片文件
    { name: 'file', maxCount: 1 }   // 处理相关文件数组
  ]),ActivityController.activityAdd)
// 删除活动
activityRouter.delete("/adminapi/activities/delete",ActivityController.activityDelete)
// 下载活动报名表
activityRouter.get("/adminapi/activities/download",ActivityController.downloadForm)



  module.exports = activityRouter