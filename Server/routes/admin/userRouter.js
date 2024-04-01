var express = require('express');
var userRouter = express.Router();
const UserControllers = require('../../controllers/admin/UserControllers')
// 图片上传
const multer = require('multer')
const upload = multer({ dest: 'public/avatarUploads/' })    // 用户头像文件夹
const clubUpload = multer({ dest: 'public/clubAvatarUploads/' })    // 社团头像文件夹

/* GET home page. */
userRouter.post("/adminapi/users/login",UserControllers.login)
userRouter.post("/adminapi/users/upload",upload.single('file'),UserControllers.upload)
userRouter.post("/adminapi/users/changepassword",UserControllers.changePassword)
userRouter.post("/adminapi/users/addconfirm",UserControllers.addConfirm)
userRouter.post("/adminapi/users/adduser",upload.single('file'),UserControllers.userAdd)

// 用户管理
userRouter.get("/adminapi/users/userlist/:page/:size",UserControllers.userlistGet)
userRouter.get("/adminapi/users/userlist",UserControllers.userFilter)
userRouter.post("/adminapi/users/userlist",UserControllers.getUser)
userRouter.delete("/adminapi/users/userlist/:userid",UserControllers.userDelete)
userRouter.delete("/adminapi/users/userlist",UserControllers.userMultipleDelete)
userRouter.put("/adminapi/users/userlist/:userid",UserControllers.userUpdate)

// 系统公告
userRouter.get("/adminapi/notices/noticelist",UserControllers.noticeListGet)
userRouter.get("/adminapi/notices/noticelist/page/:page",UserControllers.noticePageGet)
userRouter.get("/adminapi/notices/noticelist/search",UserControllers.noticeSearch)
userRouter.post("/adminapi/notices/addnotice",UserControllers.noticeAdd)
userRouter.delete("/adminapi/notices/deletenotice/:id",UserControllers.noticeDelete)
userRouter.delete("/adminapi/notices/deletenotices",UserControllers.noticeMultipleDelete)

// 社团管理
userRouter.get("/adminapi/clubs/clublist",UserControllers.clubListGet)
userRouter.get("/adminapi/clubs/clublist/search",UserControllers.clubSearch)
userRouter.get("/adminapi/clubs/addclub/:userid",UserControllers.checkMinister)
userRouter.post("/adminapi/clubs/addclub",clubUpload.single('file'),UserControllers.clubAdd)
userRouter.delete("/adminapi/clubs/deleteclub",UserControllers.clubDelete)

// 查看用户的社团
userRouter.get("/adminapi/clubmembers/user/:userid",UserControllers.getUserClubs)


module.exports = userRouter;