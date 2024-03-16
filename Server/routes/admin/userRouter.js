var express = require('express');
var userRouter = express.Router();
const UserControllers = require('../../controllers/admin/UserControllers')

/* GET home page. */
userRouter.post("/adminapi/users/login",UserControllers.login)

module.exports = userRouter;