var express = require('express');
var userRouter = express.Router();
const UserControllers = require('../../controllers/admin/UserControllers')
// 图片上传
const multer = require('multer')
const upload = multer({ dest: 'public/avatarUploads/' })

/* GET home page. */
userRouter.post("/adminapi/users/login",UserControllers.login)
userRouter.post("/adminapi/users/upload",upload.single('file'),UserControllers.upload)
userRouter.post("/adminapi/users/changepassword",UserControllers.changePassword)
userRouter.post("/adminapi/users/addconfirm",UserControllers.addConfirm)
userRouter.post("/adminapi/users/adduser",upload.single('file'),UserControllers.userAdd)

// 用户列表
userRouter.get("/adminapi/users/userlist/:page/:size",UserControllers.userlistGet)
userRouter.get("/adminapi/users/userlist",UserControllers.userFilter)
userRouter.post("/adminapi/users/userlist",UserControllers.getUser)
userRouter.delete("/adminapi/users/userlist/:userid",UserControllers.userDelete)
userRouter.delete("/adminapi/users/userlist",UserControllers.userMultipleDelete)
userRouter.put("/adminapi/users/userlist/:userid",UserControllers.userUpdate)

// 系统公告
userRouter.get("/adminapi/noticelist",UserControllers.noticeListGet)
userRouter.get("/adminapi/noticelist/page/:page",UserControllers.noticePageGet)
userRouter.get("/adminapi/noticelist/search",UserControllers.noticeSearch)
userRouter.post("/adminapi/noticelist",UserControllers.noticeAdd)
userRouter.delete("/adminapi/noticelist/:id",UserControllers.noticeDelete)
userRouter.delete("/adminapi/noticelist",UserControllers.noticeMultipleDelete)

module.exports = userRouter;