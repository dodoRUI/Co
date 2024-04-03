var express = require('express');
var activityRouter = express.Router();
const ActivityController = require('../../controllers/admin/ActivityController')

const multer = require('multer')
const activityUpload = multer({ dest: 'public/activityUploads/' })  // 社团活动文件存放位置

activityRouter.get("/adminapi/activities/clubnames",ActivityController.getClubNames)
activityRouter.post("/adminapi/activities/addactivity",activityUpload.fields([
    { name: 'posterFile', maxCount: 1 }, // 处理海报图片文件
    { name: 'relFiles', maxCount: 10 }   // 处理相关文件数组
  ]),ActivityController.activityAdd)

  module.exports = activityRouter