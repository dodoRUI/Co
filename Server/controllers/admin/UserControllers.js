const UserServices = require('../../services/admin/UserServices')
const JWT = require('../../utils/JWT')

const UserController = {
    login: async (req, res) => {
        // 调用service，连接数据库
        var result = await UserServices.login(req.body)
        if (result.length === 0) {
            res.send({
                ok: 0,
                error: "用户不存在或密码错误"
            })
        } else {
            // 生成token
            const token = JWT.generate({
                userid: result[0].userid,
                username: result[0].username,
                role: result[0].role
            }, '1h')
            res.header("authorization", token)
            res.send({
                ok: 1,
                data: {
                    userid: result[0].userid,
                    username: result[0].username,
                    profile: result[0].profile,
                    gender: Number(result[0].gender),
                    avatar: result[0].avatar,
                    role: result[0].role
                }
            })
        }
    },

    upload: async (req, res) => {
        const { userid, username, profile, gender } = req.body
        const avatar = req.file ? `/avatarUploads/${req.file.filename}` : ""
        await UserServices.updateUser({ userid, username, profile, gender: Number(gender), avatar })
        if (avatar) {
            res.send({
                "ActionType": "OK",
                data: {
                    username,
                    profile,
                    gender: Number(gender),
                    avatar
                }
            })
        } else {
            res.send({
                "ActionType": "OK",
                data: {
                    username,
                    profile,
                    gender: Number(gender),
                }
            })
        }

    },
    changePassword: async (req, res) => {
        var result = await UserServices.changepassword(req.body)
        if (result.affectedRows === 0) {
            res.send({
                ActionType: "Error"
            })
        } else {
            res.send({
                ActionType: "OK"
            })
        }
    },
    addConfirm: async (req, res) => {
        var result = await UserServices.addConfirm(req.body)
        if (result.length === 0) {
            res.send({
                ActionType: "OK"
            })
        } else {
            res.send({
                ActionType: "NO"
            })
        }
    },
    userAdd: async (req, res) => {
        const { userid, username, gender, institute, major, classid, profile, role } = req.body
        const avatar = req.file ? `/avatarUploads/${req.file.filename}` : ""
        var result = await UserServices.userAdd({ userid, username, gender, institute, major, classid, profile, role, avatar })
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    },
    userlistGet: async (req, res) => {
        const result = await UserServices.userlistGet({ page: req.params.page, size: req.params.size })
        res.send({
            data: result.data,
            total: result.total,
            ActionType: "OK"
        })
    },
    getUser: async (req, res) => {
        const result = await UserServices.getUser(req.body)
        res.send({
            data: result
        })
    },
    userDelete: async (req, res) => {
        const result = await UserServices.userDelete({ userid: req.params.userid })
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    },
    userUpdate: async (req, res) => {
        const result = await UserServices.userUpdate(req.body)
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    },
    userFilter: async (req, res) => {
        const result = await UserServices.userFilter(req.query)
        if (result.total > 0) {
            res.send({
                data: result.data,
                total: result.total,
                ActionType: "OK"
            })
        } else {
            res.send({ ActionType: "NO" })
        }
    },
    userMultipleDelete: async (req, res) => {
        const result = await UserServices.userMultipleDelete(req.query)
        res.send({
            ActionType: result.affectedRows == req.query.users.length ? "OK" : "Error"
        })
    },

    // 系统公告
    noticeListGet: async (req, res) => {
        const result = await UserServices.noticeListGet()
        res.send({
            data: result,
            ActionType: "OK"
        })
    },
    noticePageGet: async (req, res) => {
        const result = await UserServices.noticePageGet(req.params.page)
        res.send({
            data: result.data,
            total: result.total,
            ActionType: "OK"
        })
    },
    noticeDelete: async (req, res) => {
        const result = await UserServices.noticeDelete(req.params.id)
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    },
    noticeMultipleDelete: async (req, res) => {
        const result = await UserServices.noticeMultipleDelete(req.query.notices)
        res.send({
            ActionType: result.affectedRows == req.query.notices.length ? "OK" : "Error"
        })
    },
    noticeSearch: async (req, res) => {
        const result = await UserServices.noticeSearch(req.query)
        res.send({
            data: result.data,
            total: result.total,
            ActionType: "OK"
        })
    },
    noticeAdd:async (req,res)=>{
        const result = await UserServices.noticeAdd(req.body)
        res.send({
            ActionType: result.affectedRows == 1 ? "OK" : "Error"
        })
    }
}

module.exports = UserController