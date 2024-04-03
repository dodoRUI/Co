var express = require('express');
var clubRouter = express.Router();
const ClubController = require('../../controllers/admin/ClubController')

const multer = require('multer')
const clubUpload = multer({ dest: 'public/clubAvatarUploads/' })    // 社团头像文件夹


// 获取所有社团信息
clubRouter.get("/adminapi/clubs/clublist",ClubController.clubListGet)
// 搜索社团
clubRouter.get("/adminapi/clubs/clublist/search",ClubController.clubSearch)
// 分配社长查看社长ID是否合法
clubRouter.get("/adminapi/clubs/addclub/:userid",ClubController.checkMinister)
// 新增社团
clubRouter.post("/adminapi/clubs/addclub",clubUpload.single('file'),ClubController.clubAdd)
// 删除社团
clubRouter.delete("/adminapi/clubs/deleteclub",ClubController.clubDelete)

module.exports = clubRouter