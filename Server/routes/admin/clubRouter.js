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

// 数据展示
// 获取所有社团相关数据
clubRouter.get("/adminapi/clubs/statistics",ClubController.getClubsData)
// 获取所有社团成员相关数据
clubRouter.get("/adminapi/clubs/statistics/members",ClubController.clubsMembersGet)
// 获取所有社团活动数据
clubRouter.get("/adminapi/clubs/statistics/actvts",ClubController.clubsActvtsGet)
// 获取所有社团点赞数据
clubRouter.get("/adminapi/clubs/statistics/stars",ClubController.clubStarsGet)

// 社团详细信息
clubRouter.get("/adminapi/clubs/clubinfo/:club_id",ClubController.clubInfoGet)
// 移除社团中的社员
clubRouter.delete("/adminapi/clubs/deletemember/:clubid/:userid",ClubController.memberDelete)
// 修改社团社长
clubRouter.put("/adminapi/clubs/changeminister",ClubController.ministerChange)
// 修改社团信息
clubRouter.post("/adminapi/clubs/clubinfo/update",clubUpload.single('file'),ClubController.clubUpdate)


// 申请审批
// 获取所有申请
clubRouter.get("/adminapi/clubs/applications",ClubController.clubApplyGet)
// 同意申请
clubRouter.post("/adminapi/clubs/applications/accept",ClubController.clubApplyAccept)
// 拒绝申请
clubRouter.post("/adminapi/clubs/applications/refuse",ClubController.clubApplyRefuse)
// 首页获取待处理申请数量
clubRouter.get("/adminapi/clubs/applications/applynum",ClubController.applyNumGet)


// 社团资讯新闻
// 添加新闻
clubRouter.post("/adminapi/clubs/clubnews/add",ClubController.clubNewsAdd)
// 获取社团新闻
clubRouter.get("/adminapi/clubs/clubnews/get",ClubController.clubNewsGet)
// 筛选新闻
clubRouter.get("/adminapi/clubs/clubnews/filter",ClubController.clubNewsFilter)
// 修改新闻
clubRouter.put("/adminapi/clubs/clubnews/update",ClubController.clubNewsUpdate)
// 删除新闻
clubRouter.delete("/adminapi/clubs/clubnews/delete/:id",ClubController.clubNewsDelete)
// 批量删除
clubRouter.delete("/adminapi/clubs/clubnews/delete",ClubController.clubNewsMultipleDelete)
module.exports = clubRouter