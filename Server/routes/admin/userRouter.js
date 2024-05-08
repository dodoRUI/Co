var express = require('express');
var userRouter = express.Router();
const UserController = require('../../controllers/admin/UserController')
// 图片上传
const multer = require('multer')
const upload = multer({ dest: 'public/avatarUploads/' })    // 用户头像文件夹

// 登录验证
userRouter.post("/adminapi/users/login",UserController.login)
// 注册时查看用户ID是否被占用
userRouter.get("/adminapi/users/login/:userid",UserController.registerCheck)
// 用户注册
userRouter.post("/adminapi/users/login/register",UserController.register)
// 修改个人信息，要上传头像
userRouter.post("/adminapi/users/upload",upload.single('file'),UserController.upload)
// 修改个人密码
userRouter.post("/adminapi/users/changepassword",UserController.changePassword)
// 新增用户验证用户ID是否被占用
userRouter.post("/adminapi/users/addconfirm",UserController.addConfirm)
// 添加用户
userRouter.post("/adminapi/users/adduser",upload.single('file'),UserController.userAdd)
// 获取用户列表，分页查询
userRouter.get("/adminapi/users/userlist/:page/:size",UserController.userlistGet)
// 筛选用户，条件查询
userRouter.get("/adminapi/users/userlist",UserController.userFilter)
// 获取某个用户信息
userRouter.post("/adminapi/users/userlist",UserController.getUser)
// 删除用户
userRouter.delete("/adminapi/users/userlist/:userid",UserController.userDelete)
// 批量删除用户
userRouter.delete("/adminapi/users/userlist",UserController.userMultipleDelete)
// 修改用户信息
userRouter.put("/adminapi/users/userlist/:userid",UserController.userUpdate)
// 查看用户的社团
userRouter.get("/adminapi/clubmembers/user/:userid",UserController.getUserClubs)

module.exports = userRouter;