const UserService = require('../../services/admin/UserServices')
const JWT = require('../../utils/JWT')

const UserController = {
    // 登录验证
    login: async (req, res) => {
        var result = await UserService.login(req.body)
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
                role: result[0].role,
                password:result[0].password,
                club_id: result[0].club_id
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
                    role: result[0].role,
                    club_id: result[0].club_id
                }
            })
        }
    },
    // 用户注册查看ID是否重复
    registerCheck:async(req,res)=>{
        const result = await UserService.registerCheck(req.params)
        res.send(result)
    },
    // 用户注册
    register:async (req, res) => {
        const result = await UserService.register(req.body)
        res.send(result)
    },
    // 修改个人信息
    upload: async (req, res) => {
        const { userid, username, profile, gender } = req.body
        const avatar = req.file ? `/avatarUploads/${req.file.filename}` : ""
        const result = await UserService.updateUser({ userid, username, profile, gender: Number(gender), avatar })
        res.send(result)
    },
    // 修改用户密码
    changePassword: async (req, res) => {
        var result = await UserService.changePassword(req.body,req.header('authorization'))
        res.send(result)
    },
    // 添加用户前，查看用户ID是否已被占用
    addConfirm: async (req, res) => {
        var result = await UserService.addConfirm(req.body)
        res.send({ success: result.data.length != 0 })
    },
    // 添加用户
    userAdd: async (req, res) => {
        const { userid, username, gender, institute, major, classid, profile, role } = req.body
        const avatar = req.file ? `/avatarUploads/${req.file.filename}` : ""
        var result = await UserService.userAdd({ userid, username, gender, institute, major, classid, profile, role, avatar })
        res.send(result)
    },
    // 获取全部用户，且分页查询
    userlistGet: async (req, res) => {
        const result = await UserService.userlistGet({ page: req.params.page, size: req.params.size })
        res.send(result)
    },
    // 获取用户信息
    getUser: async (req, res) => {
        const result = await UserService.getUser(req.body)
        res.send(result)
    },
    // 删除用户
    userDelete: async (req, res) => {
        const result = await UserService.userDelete(req.query)
        res.send(result)
    },
    // 编辑更新用户信息（修改用户列表中的用户）
    userUpdate: async (req, res) => {
        const result = await UserService.userUpdate(req.body)
        res.send(result)
    },
    // 筛选用户，条件搜索
    userFilter: async (req, res) => {
        const result = await UserService.userFilter(req.query)
        res.send(result)
    },
    // 用户批量删除
    userMultipleDelete: async (req, res) => {
        const result = await UserService.userMultipleDelete(req.query)
        res.send(result)
    },
    // 查看某个用户加入的社团
    getUserClubs: async (req, res) => {
        const result = await UserService.getUserClubs(req.params.userid)
        res.send(result)
    },
}

module.exports = UserController