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

    }

}

module.exports = UserController