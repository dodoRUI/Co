var express = require('express');
var userRouter = express.Router();
const UserControllers = require('../../controllers/admin/UserControllers')
// 图片上传
const multer = require('multer')
const upload = multer({ dest: 'public/avatarUploads/' })

/* GET home page. */
userRouter.post("/adminapi/users/login",UserControllers.login)
userRouter.post("/adminapi/users/upload",upload.single('file'),UserControllers.upload)

module.exports = userRouter;