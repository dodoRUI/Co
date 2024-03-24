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
userRouter.get("/adminapi/users/userlist/:page",UserControllers.userlistGet)
userRouter.get("/adminapi/users/userlist",UserControllers.userFilter)
userRouter.post("/adminapi/users/userlist",UserControllers.getUser)
userRouter.delete("/adminapi/users/userlist/:userid",UserControllers.userDelete)
userRouter.delete("/adminapi/users/userlist",UserControllers.userMultipleDelete)
userRouter.put("/adminapi/users/userlist/:userid",UserControllers.userUpdate)


module.exports = userRouter;